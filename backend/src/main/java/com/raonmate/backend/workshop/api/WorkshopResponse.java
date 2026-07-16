package com.raonmate.backend.workshop.api;

import com.raonmate.backend.workshop.domain.Workshop;
import com.raonmate.backend.workshop.domain.WorkshopStatus;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.UUID;

public record WorkshopResponse(
        UUID id, String title, String departureLocation, int expectedParticipants,
        BigDecimal budgetPerPerson, LocalDateTime responseDeadline, String requiredConditions,
        WorkshopStatus status, Instant createdAt, Instant updatedAt
) {
    public static WorkshopResponse from(Workshop workshop) {
        return new WorkshopResponse(workshop.getId(), workshop.getTitle(), workshop.getDepartureLocation(),
                workshop.getExpectedParticipants(), workshop.getBudgetPerPerson(), workshop.getResponseDeadline(),
                workshop.getRequiredConditions(), workshop.getStatus(), workshop.getCreatedAt(), workshop.getUpdatedAt());
    }
}
