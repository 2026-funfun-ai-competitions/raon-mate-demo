package com.raonmate.backend.venue.application;

import com.raonmate.backend.global.error.ResourceNotFoundException;
import com.raonmate.backend.survey.domain.Survey;
import com.raonmate.backend.survey.domain.SurveyRepository;
import com.raonmate.backend.survey.domain.SurveySubmissionRepository;
import com.raonmate.backend.venue.api.VenueRecommendationRequest;
import com.raonmate.backend.venue.api.VenueRecommendationResponse;
import com.raonmate.backend.workshop.domain.Workshop;
import com.raonmate.backend.workshop.domain.WorkshopRepository;
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
    private final VenueRecommendationGenerator recommendationGenerator;
    private final VenueRecommendationCache recommendationCache;

    public VenueRecommendationResponse recommend(UUID workshopId, VenueRecommendationRequest request) {
        Workshop workshop = workshopRepository.findById(workshopId)
                .orElseThrow(() -> new ResourceNotFoundException("워크숍을 찾을 수 없습니다."));
        Survey survey = surveyRepository.findByWorkshopId(workshopId)
                .orElseThrow(() -> new ResourceNotFoundException("워크숍 설문을 찾을 수 없습니다."));

        long totalResponses = submissionRepository.countBySurveyId(survey.getId());
        VenueRecommendationCache.CacheKey cacheKey = recommendationCache.key(workshopId, totalResponses, request);
        var cached = recommendationCache.get(cacheKey);
        if (cached.isPresent()) return cached.get();
        recommendationCache.checkRateLimit(workshopId);

        Map<String, Map<String, Long>> answersByQuestion = new LinkedHashMap<>();
        submissionRepository.findAllBySurveyIdOrderBySubmittedAtAsc(
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
                workshop.getTitle(), workshop.getDepartureLocation(), workshop.getExpectedParticipants(),
                workshop.getBudgetPerPerson(), workshop.getRequiredConditions(), totalResponses, summaries,
                request.latitude(), request.longitude(), request.resultLimit(), request.additionalRequest());
        VenueRecommendationResponse response = recommendationGenerator.generate(context);
        recommendationCache.put(cacheKey, response);
        return response;
    }
}
