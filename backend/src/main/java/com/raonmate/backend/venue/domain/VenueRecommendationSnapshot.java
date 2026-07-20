package com.raonmate.backend.venue.domain;

import com.raonmate.backend.workshop.domain.Workshop;
import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "venue_recommendation_snapshots")
public class VenueRecommendationSnapshot {
    @Id private UUID id;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "workshop_id", nullable = false)
    private Workshop workshop;
    @Lob @Column(nullable = false)
    private String responseJson;
    @Column(nullable = false)
    private Instant createdAt;
    protected VenueRecommendationSnapshot() {}
    public VenueRecommendationSnapshot(Workshop workshop, String responseJson) {
        this.id = UUID.randomUUID(); this.workshop = workshop; this.responseJson = responseJson;
        this.createdAt = Instant.now();
    }
    public String getResponseJson() { return responseJson; }
}
