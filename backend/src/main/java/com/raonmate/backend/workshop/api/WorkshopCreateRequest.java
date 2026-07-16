package com.raonmate.backend.workshop.api;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public record WorkshopCreateRequest(
        @NotBlank @Size(max = 100) String title,
        @NotBlank @Size(max = 200) String departureLocation,
        @Min(2) @Max(500) int expectedParticipants,
        @DecimalMin(value = "0", inclusive = false) BigDecimal budgetPerPerson,
        @Future LocalDateTime responseDeadline,
        @Size(max = 1000) String requiredConditions
) {}
