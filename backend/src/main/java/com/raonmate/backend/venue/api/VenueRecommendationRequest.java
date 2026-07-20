package com.raonmate.backend.venue.api;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;

public record VenueRecommendationRequest(
        @DecimalMin("-90.0") @DecimalMax("90.0") Double latitude,
        @DecimalMin("-180.0") @DecimalMax("180.0") Double longitude,
        @Min(1) @Max(10) Integer maxResults,
        @Size(max = 500) String additionalRequest
) {
    public VenueRecommendationRequest {
        if ((latitude == null) != (longitude == null)) {
            throw new IllegalArgumentException("위도와 경도는 함께 입력해야 합니다.");
        }
    }

    public int resultLimit() {
        return maxResults == null ? 5 : maxResults;
    }
}
