package com.raonmate.backend.schedule.application;

import com.raonmate.backend.workshop.domain.WorkshopType;
import java.time.LocalDate;
import java.util.List;

public record ScheduleGenerationContext(
        String title,
        String region,
        int participants,
        WorkshopType workshopType,
        LocalDate startDate,
        LocalDate endDate,
        String purposeKeywords,
        String requiredConditions,
        List<SelectedVenue> selectedVenues
) {
    public record SelectedVenue(String placeId, String name, String address, String category) {}
}
