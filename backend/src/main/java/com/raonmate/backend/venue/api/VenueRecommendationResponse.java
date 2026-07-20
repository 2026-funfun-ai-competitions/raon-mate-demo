package com.raonmate.backend.venue.api;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public record VenueRecommendationResponse(
        List<Venue> recommendations,
        List<MapSource> sources,
        String model,
        Instant generatedAt
) {
    public record Venue(
            int rank,
            String name,
            String address,
            String category,
            Integer estimatedCostPerPerson,
            BigDecimal estimatedTotalCost,
            Integer estimatedCostMinPerPerson,
            Integer estimatedCostMaxPerPerson,
            BigDecimal estimatedTotalCostMin,
            BigDecimal estimatedTotalCostMax,
            String costType,
            List<String> costAssumptions,
            int score,
            List<String> tags,
            List<String> reasons,
            List<String> cautions,
            Double rating,
            Integer reviewCount,
            String imageUri,
            List<String> photoAttributions,
            String mapUri,
            String placeId
    ) {}

    public record MapSource(String title, String uri, String placeId) {}
}
