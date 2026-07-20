package com.raonmate.backend.survey.api;

import com.raonmate.backend.survey.domain.SurveySubmission;
import java.time.Instant;
import java.util.UUID;

public record SubmissionResponse(UUID id, String participantName, Instant submittedAt) {
    public static SubmissionResponse from(SurveySubmission submission) {
        return new SubmissionResponse(submission.getId(), submission.getParticipantName(), submission.getSubmittedAt());
    }
}
