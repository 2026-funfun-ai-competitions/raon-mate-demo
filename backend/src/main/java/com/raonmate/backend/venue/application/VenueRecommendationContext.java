package com.raonmate.backend.venue.application;

import java.math.BigDecimal;
import java.util.List;
import java.time.LocalDate;
import com.raonmate.backend.workshop.domain.WorkshopType;

public record VenueRecommendationContext(
        String workshopTitle,
        String departureLocation,
        int expectedParticipants,
        BigDecimal budgetPerPerson,
        String requiredConditions,
        WorkshopType workshopType,
        LocalDate preferredStartDate,
        LocalDate preferredEndDate,
        String purposeKeywords,
        long totalResponses,
        List<SurveyResponseSummary> surveyResponses,
        Double latitude,
        Double longitude,
        int maxResults,
        String additionalRequest,
        List<VenueCandidate> candidates
) {
    public VenueRecommendationContext(String workshopTitle, String departureLocation,
                                      int expectedParticipants, BigDecimal budgetPerPerson,
                                      String requiredConditions, long totalResponses,
                                      List<SurveyResponseSummary> surveyResponses,
                                      Double latitude, Double longitude, int maxResults,
                                      String additionalRequest) {
        this(workshopTitle, departureLocation, expectedParticipants, budgetPerPerson,
                requiredConditions, null, null, null, null, totalResponses, surveyResponses,
                latitude, longitude, maxResults, additionalRequest, List.of());
    }

    public VenueRecommendationContext withCandidates(List<VenueCandidate> values) {
        return new VenueRecommendationContext(
                workshopTitle, departureLocation, expectedParticipants, budgetPerPerson, requiredConditions,
                workshopType, preferredStartDate, preferredEndDate, purposeKeywords, totalResponses,
                surveyResponses, latitude, longitude, maxResults, additionalRequest, List.copyOf(values));
    }

    public record SurveyResponseSummary(String question, List<AnswerCount> answers) {}

    public record AnswerCount(String answer, long count) {}
}
