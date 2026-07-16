package com.raonmate.backend.survey.domain;

import com.raonmate.backend.workshop.domain.Workshop;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "surveys")
public class Survey {
    @Id
    private UUID id;
    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "workshop_id", nullable = false, unique = true)
    private Workshop workshop;
    @OneToMany(mappedBy = "survey", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("displayOrder ASC")
    private List<SurveyQuestion> questions = new ArrayList<>();

    protected Survey() {}

    public Survey(Workshop workshop) {
        this.id = UUID.randomUUID();
        this.workshop = workshop;
    }

    public void addQuestion(QuestionType type, String title, boolean required,
                            int displayOrder, List<String> options) {
        questions.add(new SurveyQuestion(this, type, title, required, displayOrder, options));
    }

    public UUID getId() { return id; }
    public Workshop getWorkshop() { return workshop; }
    public List<SurveyQuestion> getQuestions() { return List.copyOf(questions); }
}
