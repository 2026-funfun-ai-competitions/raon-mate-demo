package com.raonmate.backend.venue.application;

import java.util.List;

public record VenueCandidate(
        String placeId,
        String name,
        String address,
        String category,
        Double latitude,
        Double longitude,
        Double rating,
        Integer reviewCount,
        String mapUri,
        String photoName,
        List<String> photoAttributions
) {}
