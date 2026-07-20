package com.raonmate.backend.survey.domain;

import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SurveyRepository extends JpaRepository<Survey, UUID> {
    boolean existsByWorkshopId(UUID workshopId);

    @EntityGraph(attributePaths = {"workshop", "questions"})
    Optional<Survey> findByWorkshopId(UUID workshopId);
}
