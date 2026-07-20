package com.raonmate.backend.venue.application;

import java.util.List;

public interface VenueCandidateProvider {
    List<VenueCandidate> search(VenueRecommendationContext context);
}
