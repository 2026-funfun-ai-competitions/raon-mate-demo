package com.raonmate.backend.schedule.application;

import com.raonmate.backend.global.error.ResourceNotFoundException;
import com.raonmate.backend.global.error.ExternalAiServiceException;
import com.raonmate.backend.schedule.api.*;
import com.raonmate.backend.schedule.domain.*;
import com.raonmate.backend.workshop.domain.*;
import com.raonmate.backend.venue.api.VenueRecommendationResponse;
import com.raonmate.backend.venue.domain.VenueRecommendationSnapshotRepository;

import java.time.*;
import java.util.*;

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tools.jackson.core.JacksonException;
import tools.jackson.databind.ObjectMapper;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ScheduleService {
    private static final Logger log = LoggerFactory.getLogger(ScheduleService.class);
    private static final Set<String> ALLOWED_TYPES = Set.of(
            "MOVE", "MEAL", "BREAK", "SESSION", "ACTIVITY", "CHECK_IN", "CHECK_OUT");
    private final WorkshopRepository workshops;
    private final SchedulePlanRepository plans;
    private final ScheduleGenerator generator;
    private final VenueRecommendationSnapshotRepository venueSnapshots;
    private final ObjectMapper objectMapper;

    public ScheduleResponse get(UUID id) {
        return ScheduleResponse.from(plans.findByWorkshopId(id)
                .orElseThrow(() -> new ResourceNotFoundException("생성된 일정이 없습니다.")));
    }

    @Transactional
    public ScheduleResponse generate(UUID id) {
        Workshop w = workshops.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("워크숍을 찾을 수 없습니다."));
        SchedulePlan p = plans.findByWorkshopId(id)
                .orElseGet(() -> new SchedulePlan(w));
        LocalDate d = w.getPreferredStartDate() == null ? LocalDate.now().plusDays(30) : w.getPreferredStartDate();
        LocalDate end = scheduleEndDate(w, d);
        List<ScheduleRequest.Item> generated;
        try {
            generated = generator.generate(new ScheduleGenerationContext(
                    w.getTitle(), w.getPreferredRegion(), w.getExpectedParticipants(), w.getWorkshopType(),
                    d, end, w.getPurposeKeywords(), w.getRequiredConditions(), selectedVenues(w)));
            validateGenerated(generated, d, end);
        } catch (ExternalAiServiceException | IllegalArgumentException exception) {
            log.warn("AI 일정 생성에 실패하여 기본 일정을 사용합니다. workshopId={} reason={}",
                    id, exception.getMessage());
            generated = fallback(w, d);
        }
        p.replace(toDomainItems(generated));
        return ScheduleResponse.from(plans.save(p));
    }

    private LocalDate scheduleEndDate(Workshop workshop, LocalDate start) {
        if (workshop.getWorkshopType() != WorkshopType.OVERNIGHT) return start;
        LocalDate requestedEnd = workshop.getPreferredEndDate();
        return requestedEnd == null || requestedEnd.isBefore(start.plusDays(1)) ? start.plusDays(1) : requestedEnd;
    }

    private List<ScheduleRequest.Item> fallback(Workshop w, LocalDate d) {
        List<ScheduleRequest.Item> a = new ArrayList<>();
        a.add(new ScheduleRequest.Item(d, LocalTime.of(10, 0), LocalTime.of(11, 30), "MOVE", "집결 및 이동",
                w.getDepartureLocation() + " 출발"));
        a.add(new ScheduleRequest.Item(d, LocalTime.of(11, 30), LocalTime.of(12, 30), "MEAL", "점심 식사",
                "워크숍 시작 전 점심"));
        a.add(new ScheduleRequest.Item(d, LocalTime.of(13, 0), LocalTime.of(14, 30), "SESSION",
                "오프닝 및 아이스브레이킹", w.getPurposeKeywords()));
        a.add(new ScheduleRequest.Item(d, LocalTime.of(14, 30), LocalTime.of(17, 30), "ACTIVITY",
                "팀빌딩 프로그램", w.getRequiredConditions()));
        if (w.getWorkshopType() == WorkshopType.OVERNIGHT) {
            a.add(new ScheduleRequest.Item(d, LocalTime.of(18, 0), LocalTime.of(19, 30), "MEAL",
                    "저녁 식사", "네트워킹"));
            LocalDate d2 = d.plusDays(1);
            a.add(new ScheduleRequest.Item(d2, LocalTime.of(8, 0), LocalTime.of(9, 0), "MEAL", "조식",
                    "아침 식사"));
            a.add(new ScheduleRequest.Item(d2, LocalTime.of(9, 30), LocalTime.of(11, 0), "SESSION",
                    "워크숍 세션", "목표 및 계획 수립"));
            a.add(new ScheduleRequest.Item(d2, LocalTime.of(11, 0), LocalTime.of(12, 0), "SESSION",
                    "정리 및 마무리", "결과 공유"));
        }
        return List.copyOf(a);
    }

    private List<ScheduleGenerationContext.SelectedVenue> selectedVenues(Workshop workshop) {
        Set<String> selectedIds = new HashSet<>(workshop.getSelectedVenuePlaceIds());
        if (selectedIds.isEmpty()) return List.of();
        return venueSnapshots.findFirstByWorkshopIdOrderByCreatedAtDesc(workshop.getId())
                .map(snapshot -> {
                    try {
                        VenueRecommendationResponse response = objectMapper.readValue(
                                snapshot.getResponseJson(), VenueRecommendationResponse.class);
                        return response.recommendations().stream()
                                .filter(venue -> selectedIds.contains(venue.placeId()))
                                .map(venue -> new ScheduleGenerationContext.SelectedVenue(
                                        venue.placeId(), venue.name(), venue.address(), venue.category()))
                                .toList();
                    } catch (JacksonException exception) {
                        log.warn("선택 장소 정보를 일정 입력으로 변환하지 못했습니다. workshopId={}",
                                workshop.getId());
                        return List.<ScheduleGenerationContext.SelectedVenue>of();
                    }
                })
                .orElse(List.of());
    }

    @Transactional
    public ScheduleResponse update(UUID id, ScheduleRequest r) {
        SchedulePlan p = plans.findByWorkshopId(id)
                .orElseThrow(() -> new ResourceNotFoundException("생성된 일정이 없습니다."));
        validate(r.items());
        p.replace(r.items()
                .stream()
                .map(i -> new SchedulePlan.Item(i.date(), i.startTime(), i.endTime(), i.type(),
                        i.title(), i.description()))
                .toList());
        return ScheduleResponse.from(p);
    }

    private void validate(List<ScheduleRequest.Item> items) {
        List<ScheduleRequest.Item> sorted = items.stream()
                .sorted(Comparator.comparing(ScheduleRequest.Item::date)
                        .thenComparing(ScheduleRequest.Item::startTime))
                .toList();
        for (int i = 1; i < sorted.size(); i++) {
            var a = sorted.get(i - 1);
            var b = sorted.get(i);
         if (a.date()
                 .equals(b.date()) && a.endTime() != null && a.endTime()
                 .isAfter(b.startTime())) {
          throw new IllegalArgumentException("일정 시간이 서로 겹칩니다.");
         }
        }
    }

    private void validateGenerated(List<ScheduleRequest.Item> items, LocalDate start, LocalDate end) {
        if (items == null || items.isEmpty()) throw new IllegalArgumentException("생성된 일정이 비어 있습니다.");
        if (items.size() > 100) throw new IllegalArgumentException("일정은 최대 100개까지 생성할 수 있습니다.");
        for (ScheduleRequest.Item item : items) {
            if (item.date() == null || item.date().isBefore(start) || item.date().isAfter(end))
                throw new IllegalArgumentException("일정이 워크숍 날짜 범위를 벗어났습니다.");
            if (item.startTime() == null || item.endTime() == null || !item.endTime().isAfter(item.startTime()))
                throw new IllegalArgumentException("일정 시간이 올바르지 않습니다.");
            if (!ALLOWED_TYPES.contains(item.type()))
                throw new IllegalArgumentException("지원하지 않는 일정 유형입니다.");
            if (item.title() == null || item.title().isBlank() || item.title().length() > 150)
                throw new IllegalArgumentException("일정 제목이 올바르지 않습니다.");
            if (item.description() != null && item.description().length() > 500)
                throw new IllegalArgumentException("일정 설명이 너무 깁니다.");
        }
        validate(items);
    }

    private List<SchedulePlan.Item> toDomainItems(List<ScheduleRequest.Item> items) {
        return items.stream().map(i -> new SchedulePlan.Item(
                i.date(), i.startTime(), i.endTime(), i.type(), i.title(), i.description())).toList();
    }
}
