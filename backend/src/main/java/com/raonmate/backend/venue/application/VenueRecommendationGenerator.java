package com.raonmate.backend.venue.application;

import com.raonmate.backend.venue.api.VenueRecommendationResponse;

public interface VenueRecommendationGenerator {
    VenueRecommendationResponse generate(VenueRecommendationContext context);
}
