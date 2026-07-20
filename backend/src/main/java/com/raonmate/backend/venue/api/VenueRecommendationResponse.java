package com.raonmate.backend.venue.api;

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
            int score,
            List<String> reasons,
            List<String> cautions,
            String mapUri,
            String placeId
    ) {}

    public record MapSource(String title, String uri, String placeId) {}
}
