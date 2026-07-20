package com.raonmate.backend.workshop.api;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import com.raonmate.backend.workshop.domain.WorkshopType;

public record WorkshopCreateRequest(
        @NotBlank @Size(max = 100) String title,
        @Size(max = 200) String departureLocation,
        @NotBlank @Size(max = 200) String preferredRegion,
        @Min(2) @Max(500) int expectedParticipants,
        @DecimalMin(value = "0", inclusive = false) BigDecimal budgetPerPerson,
        @Future LocalDateTime responseDeadline,
        @Size(max = 1000) String requiredConditions,
        WorkshopType workshopType,
        LocalDate preferredStartDate,
        LocalDate preferredEndDate,
        @Size(max = 100) String purposeKeywords
) {
    public WorkshopCreateRequest(String title, String departureLocation, int expectedParticipants,
                                 BigDecimal budgetPerPerson, LocalDateTime responseDeadline,
                                 String requiredConditions) {
        this(title, departureLocation, departureLocation, expectedParticipants, budgetPerPerson, responseDeadline,
                requiredConditions, null, null, null, null);
    }

    public WorkshopCreateRequest(String title, String preferredRegion, int expectedParticipants,
                                 BigDecimal budgetPerPerson, LocalDateTime responseDeadline,
                                 String requiredConditions, WorkshopType workshopType,
                                 LocalDate preferredStartDate, LocalDate preferredEndDate,
                                 String purposeKeywords) {
        this(title, preferredRegion, preferredRegion, expectedParticipants, budgetPerPerson,
                responseDeadline, requiredConditions, workshopType, preferredStartDate,
                preferredEndDate, purposeKeywords);
    }

    public WorkshopCreateRequest {
        if (preferredStartDate != null && preferredEndDate != null
                && preferredEndDate.isBefore(preferredStartDate)) {
            throw new IllegalArgumentException("희망 종료일은 시작일보다 빠를 수 없습니다.");
        }
    }
}
