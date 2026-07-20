package com.raonmate.backend.workshop.api;

import com.raonmate.backend.workshop.domain.WorkshopType;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.LocalDate;

public record WorkshopUpdateRequest(
        @NotBlank @Size(max = 100) String title,
        @NotBlank @Size(max = 200) String preferredRegion,
        @Min(2) @Max(500) int expectedParticipants,
        @DecimalMin(value = "0", inclusive = false) BigDecimal budgetPerPerson,
        WorkshopType workshopType,
        LocalDate preferredStartDate,
        LocalDate preferredEndDate,
        @Size(max = 100) String purposeKeywords,
        @Size(max = 1000) String requiredConditions
) {
    public WorkshopUpdateRequest {
        if (preferredStartDate != null && preferredEndDate != null
                && preferredEndDate.isBefore(preferredStartDate))
            throw new IllegalArgumentException("희망 종료일은 시작일보다 빠를 수 없습니다.");
    }
}
