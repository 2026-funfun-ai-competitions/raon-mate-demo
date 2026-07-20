package com.raonmate.backend.venue.application;

import java.math.BigDecimal;
import java.util.List;

public record VenueRecommendationContext(
        String workshopTitle,
        String departureLocation,
        int expectedParticipants,
        BigDecimal budgetPerPerson,
        String requiredConditions,
        long totalResponses,
        List<SurveyResponseSummary> surveyResponses,
        Double latitude,
        Double longitude,
        int maxResults,
        String additionalRequest
) {
    public record SurveyResponseSummary(String question, List<AnswerCount> answers) {}

    public record AnswerCount(String answer, long count) {}
}
