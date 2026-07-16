package com.raonmate.backend.survey.api;

import com.raonmate.backend.survey.domain.QuestionType;
import com.raonmate.backend.survey.domain.Survey;
import com.raonmate.backend.workshop.domain.WorkshopStatus;
import java.util.List;
import java.util.UUID;

public record SurveyResponse(
        UUID id,
        UUID workshopId,
        String workshopTitle,
        WorkshopStatus status,
        long responseCount,
        List<QuestionResponse> questions
) {
    public static SurveyResponse from(Survey survey, long responseCount) {
        return new SurveyResponse(survey.getId(), survey.getWorkshop().getId(),
                survey.getWorkshop().getTitle(), survey.getWorkshop().getStatus(), responseCount,
                survey.getQuestions().stream().map(QuestionResponse::from).toList());
    }

    public record QuestionResponse(
            UUID id, QuestionType type, String title, boolean required,
            int displayOrder, List<String> options
    ) {
        static QuestionResponse from(com.raonmate.backend.survey.domain.SurveyQuestion question) {
            return new QuestionResponse(question.getId(), question.getType(), question.getTitle(),
                    question.isRequired(), question.getDisplayOrder(), question.getOptions());
        }
    }
}
