package com.raonmate.backend.schedule.domain;
import java.util.Optional; import java.util.UUID; import org.springframework.data.jpa.repository.JpaRepository;
public interface SchedulePlanRepository extends JpaRepository<SchedulePlan, UUID> { Optional<SchedulePlan> findByWorkshopId(UUID workshopId); }
