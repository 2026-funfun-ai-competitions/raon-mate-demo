package com.raonmate.backend.survey.domain;

import java.util.List;
import java.util.UUID;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SurveySubmissionRepository extends JpaRepository<SurveySubmission, UUID> {
    boolean existsBySurveyIdAndParticipantKey(UUID surveyId, String participantKey);
    long countBySurveyId(UUID surveyId);

    @EntityGraph(attributePaths = {"answers", "answers.question"})
    List<SurveySubmission> findAllBySurveyIdOrderBySubmittedAtAsc(UUID surveyId, Pageable pageable);
}
