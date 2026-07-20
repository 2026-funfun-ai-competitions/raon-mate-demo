package com.raonmate.backend.schedule.api;
import com.raonmate.backend.schedule.domain.SchedulePlan; import java.time.*; import java.util.*;
public record ScheduleResponse(UUID id, UUID workshopId, List<Item> items, Instant updatedAt) {
 public static ScheduleResponse from(SchedulePlan p){return new ScheduleResponse(p.getId(),p.getWorkshop().getId(),p.getItems().stream().map(i->new Item(i.getDate(),i.getStartTime(),i.getEndTime(),i.getType(),i.getTitle(),i.getDescription())).toList(),p.getUpdatedAt());}
 public record Item(LocalDate date, LocalTime startTime, LocalTime endTime,String type,String title,String description){}
}
