package com.raonmate.backend.survey.domain;

import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SurveySubmissionRepository extends JpaRepository<SurveySubmission, UUID> {
    boolean existsBySurveyIdAndParticipantKey(UUID surveyId, String participantKey);
    long countBySurveyId(UUID surveyId);
}
