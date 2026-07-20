package com.raonmate.backend.venue.application;

import com.raonmate.backend.global.error.ResourceNotFoundException;
import com.raonmate.backend.survey.domain.Survey;
import com.raonmate.backend.survey.domain.SurveyRepository;
import com.raonmate.backend.survey.domain.SurveySubmissionRepository;
import com.raonmate.backend.venue.api.VenueRecommendationRequest;
import com.raonmate.backend.venue.api.VenueRecommendationResponse;
import com.raonmate.backend.workshop.domain.Workshop;
import com.raonmate.backend.workshop.domain.WorkshopRepository;
import com.raonmate.backend.venue.domain.VenueRecommendationSnapshot;
import com.raonmate.backend.venue.domain.VenueRecommendationSnapshotRepository;
import com.raonmate.backend.venue.api.VenueSelectionRequest;
import tools.jackson.databind.ObjectMapper;
import tools.jackson.core.JacksonException;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class VenueRecommendationService {
    private static final int MAX_SURVEY_RESPONSES_FOR_AI = 500;
    private final WorkshopRepository workshopRepository;
    private final SurveyRepository surveyRepository;
    private final SurveySubmissionRepository submissionRepository;
    private final VenueCandidateProvider candidateProvider;
    private final VenueRecommendationGenerator recommendationGenerator;
    private final VenueRecommendationCache recommendationCache;
    private final VenueRecommendationSnapshotRepository snapshotRepository;
    private final ObjectMapper objectMapper;

    @Transactional
    public VenueRecommendationResponse recommend(UUID workshopId, VenueRecommendationRequest request) {
        Workshop workshop = workshopRepository.findById(workshopId)
                .orElseThrow(() -> new ResourceNotFoundException("워크숍을 찾을 수 없습니다."));
        Survey survey = surveyRepository.findByWorkshopId(workshopId).orElse(null);
        long totalResponses = survey == null ? 0 : submissionRepository.countBySurveyId(survey.getId());
        VenueRecommendationCache.CacheKey cacheKey = recommendationCache.key(
                workshopId, workshop.getUpdatedAt(), totalResponses, request);
        Map<String, Map<String, Long>> answersByQuestion = new LinkedHashMap<>();
        if (survey != null) submissionRepository.findAllBySurveyIdOrderBySubmittedAtAsc(
                        survey.getId(), PageRequest.of(0, MAX_SURVEY_RESPONSES_FOR_AI)).stream()
                .flatMap(submission -> submission.getAnswers().stream())
                .forEach(answer -> answer.getValues().forEach(value -> answersByQuestion
                        .computeIfAbsent(answer.getQuestion().getTitle(), ignored -> new LinkedHashMap<>())
                        .merge(value, 1L, Long::sum)));

        List<VenueRecommendationContext.SurveyResponseSummary> summaries = answersByQuestion.entrySet().stream()
                .map(entry -> new VenueRecommendationContext.SurveyResponseSummary(entry.getKey(),
                        entry.getValue().entrySet().stream()
                                .map(answer -> new VenueRecommendationContext.AnswerCount(
                                        answer.getKey(), answer.getValue()))
                                .toList()))
                .toList();

        var context = new VenueRecommendationContext(
                workshop.getTitle(), workshop.getPreferredRegion(), workshop.getExpectedParticipants(),
                workshop.getBudgetPerPerson(), workshop.getRequiredConditions(), workshop.getWorkshopType(),
                workshop.getPreferredStartDate(), workshop.getPreferredEndDate(), workshop.getPurposeKeywords(),
                totalResponses, summaries,
                request.latitude(), request.longitude(), request.resultLimit(), request.additionalRequest(), List.of());
        return recommendationCache.getOrGenerate(cacheKey, workshopId, () -> {
            VenueRecommendationResponse response = recommendationGenerator.generate(
                    context.withCandidates(candidateProvider.search(context)));
            saveSnapshot(workshop, response);
            return response;
        });
    }

    public VenueRecommendationResponse latest(UUID workshopId) {
        if (!workshopRepository.existsById(workshopId))
            throw new ResourceNotFoundException("워크숍을 찾을 수 없습니다.");
        var snapshot = snapshotRepository.findFirstByWorkshopIdOrderByCreatedAtDesc(workshopId)
                .orElseThrow(() -> new ResourceNotFoundException("저장된 장소 추천 결과가 없습니다."));
        try { return objectMapper.readValue(snapshot.getResponseJson(), VenueRecommendationResponse.class); }
        catch (JacksonException e) { throw new IllegalStateException("저장된 장소 추천 결과를 읽을 수 없습니다."); }
    }

    @Transactional
    public List<String> select(UUID workshopId, VenueSelectionRequest request) {
        Workshop workshop = workshopRepository.findById(workshopId)
                .orElseThrow(() -> new ResourceNotFoundException("워크숍을 찾을 수 없습니다."));
        var validIds = latest(workshopId).recommendations().stream().map(VenueRecommendationResponse.Venue::placeId).toList();
        if (!validIds.containsAll(request.placeIds())) throw new IllegalArgumentException("추천 결과에 없는 장소입니다.");
        workshop.selectVenues(request.placeIds().stream().distinct().toList());
        return workshop.getSelectedVenuePlaceIds();
    }

    private void saveSnapshot(Workshop workshop, VenueRecommendationResponse response) {
        try { snapshotRepository.save(new VenueRecommendationSnapshot(workshop, objectMapper.writeValueAsString(response))); }
        catch (JacksonException e) { throw new IllegalStateException("장소 추천 결과를 저장할 수 없습니다."); }
    }
}
