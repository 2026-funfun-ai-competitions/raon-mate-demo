package com.raonmate.backend.schedule.application;

import com.raonmate.backend.schedule.api.ScheduleRequest;
import java.util.List;

public interface ScheduleGenerator {
    List<ScheduleRequest.Item> generate(ScheduleGenerationContext context);
}
