package com.raonmate.backend.survey.api;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;
import java.util.UUID;

public record SurveySubmitRequest(
        @NotBlank @Size(max = 100) String participantKey,
        @NotBlank @Size(max = 100) String participantName,
        @NotEmpty List<@Valid AnswerRequest> answers
) {
    public record AnswerRequest(
            @NotNull UUID questionId,
            @NotNull List<@NotBlank @Size(max = 500) String> values
    ) {}
}
