package com.raonmate.backend.budget.application;

import com.raonmate.backend.budget.api.BudgetRequest;
import com.raonmate.backend.budget.api.BudgetResponse;
import com.raonmate.backend.budget.domain.BudgetPlan;
import com.raonmate.backend.budget.domain.BudgetPlanRepository;
import com.raonmate.backend.global.error.ResourceNotFoundException;
import com.raonmate.backend.workshop.domain.Workshop;
import com.raonmate.backend.workshop.domain.WorkshopRepository;
import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BudgetService {
    private final BudgetPlanRepository plans;
    private final WorkshopRepository workshops;

    public BudgetResponse get(UUID id) {
        return BudgetResponse.from(plans.findByWorkshopId(id)
                .orElseThrow(() -> new ResourceNotFoundException("예산 계획이 없습니다.")));
    }

    @Transactional
    public BudgetResponse initialize(UUID id) {
        Workshop workshop = workshops.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("워크숍을 찾을 수 없습니다."));
        BudgetPlan plan = plans.findByWorkshopId(id).orElseGet(() -> new BudgetPlan(workshop));
        if (plan.getItems().isEmpty()) {
            BigDecimal participants = BigDecimal.valueOf(workshop.getExpectedParticipants());
            plan.replace(List.of(
                    item("ACCOMMODATION", "숙박", "55000", participants, "장소 숙박 예상 비용"),
                    item("MEAL", "식사", "28000", participants, "워크숍 식사 예상 비용"),
                    item("TRANSPORTATION", "교통", "12000", participants, "단체 이동 예상 비용"),
                    item("ACTIVITY", "액티비티", "25000", participants, "팀빌딩 프로그램"),
                    item("MEETING_ROOM", "회의실 대관", "10000", participants, "세미나실 이용"),
                    item("ETC", "기타", "13200", participants, "기념품 및 운영비")));
        }
        return BudgetResponse.from(plans.save(plan));
    }

    @Transactional
    public BudgetResponse update(UUID id, BudgetRequest request) {
        BudgetPlan plan = plans.findByWorkshopId(id)
                .orElseThrow(() -> new ResourceNotFoundException("예산 계획이 없습니다."));
        plan.replace(request.items().stream()
                .map(item -> new BudgetPlan.Item(item.category(), item.name(), item.amount(), item.note()))
                .toList());
        return BudgetResponse.from(plan);
    }

    private BudgetPlan.Item item(
            String category, String name, String perPerson, BigDecimal participants, String note) {
        return new BudgetPlan.Item(category, name,
                new BigDecimal(perPerson).multiply(participants), note);
    }
}
