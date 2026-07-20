package com.raonmate.backend.workshop.api;

import com.raonmate.backend.workshop.domain.Workshop;
import com.raonmate.backend.workshop.domain.WorkshopStatus;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.LocalDate;
import com.raonmate.backend.workshop.domain.WorkshopType;
import java.util.UUID;
import java.util.List;

public record WorkshopResponse(
        UUID id, String title, String departureLocation, int expectedParticipants,
        BigDecimal budgetPerPerson, LocalDateTime responseDeadline, String requiredConditions,
        WorkshopType workshopType, LocalDate preferredStartDate, LocalDate preferredEndDate, String purposeKeywords,
        List<String> selectedVenuePlaceIds, WorkshopStatus status, Instant createdAt, Instant updatedAt
) {
    public static WorkshopResponse from(Workshop workshop) {
        return new WorkshopResponse(workshop.getId(), workshop.getTitle(), workshop.getDepartureLocation(),
                workshop.getExpectedParticipants(), workshop.getBudgetPerPerson(), workshop.getResponseDeadline(),
                workshop.getRequiredConditions(), workshop.getWorkshopType(), workshop.getPreferredStartDate(),
                workshop.getPreferredEndDate(), workshop.getPurposeKeywords(), workshop.getSelectedVenuePlaceIds(), workshop.getStatus(),
                workshop.getCreatedAt(), workshop.getUpdatedAt());
    }
}
