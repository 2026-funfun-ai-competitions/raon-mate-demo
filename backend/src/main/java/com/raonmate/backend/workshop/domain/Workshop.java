package com.raonmate.backend.workshop.domain;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.LocalDate;
import java.util.UUID;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "workshops")
public class Workshop {
    @Id
    private UUID id;
    @Column(nullable = false, length = 100)
    private String title;
    @Column(nullable = false, length = 200)
    private String departureLocation;
    @Column(length = 200)
    private String preferredRegion;
    @Column(nullable = false)
    private int expectedParticipants;
    @Column(precision = 15, scale = 0)
    private BigDecimal budgetPerPerson;
    private LocalDateTime responseDeadline;
    @Enumerated(EnumType.STRING)
    @Column(length = 30)
    private WorkshopType workshopType;
    private LocalDate preferredStartDate;
    private LocalDate preferredEndDate;
    @Column(length = 100)
    private String purposeKeywords;
    @ElementCollection
    @CollectionTable(name = "workshop_selected_venues", joinColumns = @JoinColumn(name = "workshop_id"))
    @OrderColumn(name = "selection_order")
    @Column(name = "place_id", nullable = false, length = 200)
    private List<String> selectedVenuePlaceIds = new ArrayList<>();
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

    public Workshop(String title, String departureLocation, String preferredRegion, int expectedParticipants,
                    BigDecimal budgetPerPerson, LocalDateTime responseDeadline, String requiredConditions,
                    WorkshopType workshopType, LocalDate preferredStartDate, LocalDate preferredEndDate,
                    String purposeKeywords) {
        this.id = UUID.randomUUID();
        this.title = title;
        this.departureLocation = departureLocation;
        this.preferredRegion = preferredRegion;
        this.expectedParticipants = expectedParticipants;
        this.budgetPerPerson = budgetPerPerson;
        this.responseDeadline = responseDeadline;
        this.requiredConditions = requiredConditions;
        this.workshopType = workshopType;
        this.preferredStartDate = preferredStartDate;
        this.preferredEndDate = preferredEndDate;
        this.purposeKeywords = purposeKeywords;
        this.status = WorkshopStatus.DRAFT;
    }

    public void update(String title, String preferredRegion, int expectedParticipants,
                       BigDecimal budgetPerPerson, WorkshopType workshopType,
                       LocalDate preferredStartDate, LocalDate preferredEndDate,
                       String purposeKeywords, String requiredConditions) {
        this.title = title;
        this.preferredRegion = preferredRegion;
        this.expectedParticipants = expectedParticipants;
        this.budgetPerPerson = budgetPerPerson;
        this.workshopType = workshopType;
        this.preferredStartDate = preferredStartDate;
        this.preferredEndDate = preferredEndDate;
        this.purposeKeywords = purposeKeywords;
        this.requiredConditions = requiredConditions;
    }

    public void selectVenues(List<String> placeIds) {
        selectedVenuePlaceIds.clear();
        selectedVenuePlaceIds.addAll(placeIds);
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
    public String getPreferredRegion() {
        return preferredRegion == null || preferredRegion.isBlank() ? departureLocation : preferredRegion;
    }
    public int getExpectedParticipants() { return expectedParticipants; }
    public BigDecimal getBudgetPerPerson() { return budgetPerPerson; }
    public LocalDateTime getResponseDeadline() { return responseDeadline; }
    public WorkshopType getWorkshopType() { return workshopType; }
    public LocalDate getPreferredStartDate() { return preferredStartDate; }
    public LocalDate getPreferredEndDate() { return preferredEndDate; }
    public String getPurposeKeywords() { return purposeKeywords; }
    public List<String> getSelectedVenuePlaceIds() { return List.copyOf(selectedVenuePlaceIds); }
    public String getRequiredConditions() { return requiredConditions; }
    public WorkshopStatus getStatus() { return status; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
}
