package com.raonmate.backend.schedule.api;
import jakarta.validation.Valid; import jakarta.validation.constraints.*; import java.time.*; import java.util.List;
public record ScheduleRequest(@NotEmpty @Size(max=100) List<@Valid Item> items) {
    public record Item(@NotNull LocalDate date, @NotNull LocalTime startTime, LocalTime endTime,
                       @NotBlank @Size(max=30) String type, @NotBlank @Size(max=150) String title,
                       @Size(max=500) String description) {
        public Item { if (endTime != null && !endTime.isAfter(startTime)) throw new IllegalArgumentException("일정 종료 시각은 시작 시각보다 늦어야 합니다."); }
    }
}
