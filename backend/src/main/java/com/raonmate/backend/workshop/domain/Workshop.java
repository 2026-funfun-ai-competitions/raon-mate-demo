package com.raonmate.backend.workshop.domain;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "workshops")
public class Workshop {
    @Id
    private UUID id;
    @Column(nullable = false, length = 100)
    private String title;
    @Column(nullable = false, length = 200)
    private String departureLocation;
    @Column(nullable = false)
    private int expectedParticipants;
    @Column(precision = 15, scale = 0)
    private BigDecimal budgetPerPerson;
    private LocalDateTime responseDeadline;
    @Column(length = 1000)
    private String requiredConditions;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private WorkshopStatus status;
    @Column(nullable = false, updatable = false)
    private Instant createdAt;
    @Column(nullable = false)
    private Instant updatedAt;

    protected Workshop() {}

    public Workshop(String title, String departureLocation, int expectedParticipants,
                    BigDecimal budgetPerPerson, LocalDateTime responseDeadline, String requiredConditions) {
        this.id = UUID.randomUUID();
        this.title = title;
        this.departureLocation = departureLocation;
        this.expectedParticipants = expectedParticipants;
        this.budgetPerPerson = budgetPerPerson;
        this.responseDeadline = responseDeadline;
        this.requiredConditions = requiredConditions;
        this.status = WorkshopStatus.DRAFT;
    }

    @PrePersist
    void onCreate() { createdAt = Instant.now(); updatedAt = createdAt; }
    @PreUpdate
    void onUpdate() { updatedAt = Instant.now(); }

    public void openSurvey() {
        if (status != WorkshopStatus.DRAFT && status != WorkshopStatus.SURVEY_CLOSED) {
            throw new IllegalStateException("초안 또는 종료된 설문만 공개할 수 있습니다.");
        }
        status = WorkshopStatus.SURVEY_OPEN;
    }

    public void closeSurvey() {
        if (status != WorkshopStatus.SURVEY_OPEN) {
            throw new IllegalStateException("진행 중인 설문만 종료할 수 있습니다.");
        }
        status = WorkshopStatus.SURVEY_CLOSED;
    }

    public UUID getId() { return id; }
    public String getTitle() { return title; }
    public String getDepartureLocation() { return departureLocation; }
    public int getExpectedParticipants() { return expectedParticipants; }
    public BigDecimal getBudgetPerPerson() { return budgetPerPerson; }
    public LocalDateTime getResponseDeadline() { return responseDeadline; }
    public String getRequiredConditions() { return requiredConditions; }
    public WorkshopStatus getStatus() { return status; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
}
