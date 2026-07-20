package com.raonmate.backend.venue.domain;

import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VenueRecommendationSnapshotRepository extends JpaRepository<VenueRecommendationSnapshot, UUID> {
    Optional<VenueRecommendationSnapshot> findFirstByWorkshopIdOrderByCreatedAtDesc(UUID workshopId);
}
