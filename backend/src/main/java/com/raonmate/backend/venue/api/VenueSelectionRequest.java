package com.raonmate.backend.venue.api;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import java.util.List;

public record VenueSelectionRequest(
        @NotEmpty @Size(max = 3) List<@jakarta.validation.constraints.NotBlank String> placeIds
) {}
