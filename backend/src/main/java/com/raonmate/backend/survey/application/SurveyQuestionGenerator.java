package com.raonmate.backend.survey.application;

import com.raonmate.backend.survey.domain.Survey;

public interface SurveyQuestionGenerator {
    void generate(Survey survey);
}
