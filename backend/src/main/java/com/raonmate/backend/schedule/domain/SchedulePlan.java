package com.raonmate.backend.schedule.domain;

import com.raonmate.backend.workshop.domain.Workshop;
import jakarta.persistence.*;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "schedule_plans")
public class SchedulePlan {
    @Id private UUID id;
    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "workshop_id", nullable = false, unique = true)
    private Workshop workshop;
    @ElementCollection
    @CollectionTable(name = "schedule_items", joinColumns = @JoinColumn(name = "plan_id"))
    @OrderColumn(name = "item_order")
    private List<Item> items = new ArrayList<>();
    @Column(nullable = false) private Instant updatedAt;
    protected SchedulePlan() {}
    public SchedulePlan(Workshop workshop) { this.id = UUID.randomUUID(); this.workshop = workshop; this.updatedAt = Instant.now(); }
    public void replace(List<Item> values) { items.clear(); items.addAll(values); updatedAt = Instant.now(); }
    public UUID getId() { return id; }
    public Workshop getWorkshop() { return workshop; }
    public List<Item> getItems() { return List.copyOf(items); }
    public Instant getUpdatedAt() { return updatedAt; }

    @Embeddable
    public static class Item {
        private LocalDate date;
        private LocalTime startTime;
        private LocalTime endTime;
        @Column(nullable = false, length = 30) private String type;
        @Column(nullable = false, length = 150) private String title;
        @Column(length = 500) private String description;
        protected Item() {}
        public Item(LocalDate date, LocalTime startTime, LocalTime endTime, String type, String title, String description) {
            this.date=date; this.startTime=startTime; this.endTime=endTime; this.type=type; this.title=title; this.description=description;
        }
        public LocalDate getDate(){return date;} public LocalTime getStartTime(){return startTime;}
        public LocalTime getEndTime(){return endTime;} public String getType(){return type;}
        public String getTitle(){return title;} public String getDescription(){return description;}
    }
}
