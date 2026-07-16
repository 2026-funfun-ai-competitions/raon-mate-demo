package com.raonmate.backend.survey.domain;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "survey_questions")
public class SurveyQuestion {
    @Id
    private UUID id;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "survey_id", nullable = false)
    private Survey survey;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private QuestionType type;
    @Column(nullable = false, length = 300)
    private String title;
    @Column(nullable = false)
    private boolean required;
    @Column(nullable = false)
    private int displayOrder;
    @ElementCollection
    @CollectionTable(name = "survey_question_options", joinColumns = @JoinColumn(name = "question_id"))
    @OrderColumn(name = "option_order")
    @Column(name = "option_value", nullable = false, length = 200)
    private List<String> options = new ArrayList<>();

    protected SurveyQuestion() {}

    SurveyQuestion(Survey survey, QuestionType type, String title, boolean required,
                   int displayOrder, List<String> options) {
        this.id = UUID.randomUUID();
        this.survey = survey;
        this.type = type;
        this.title = title;
        this.required = required;
        this.displayOrder = displayOrder;
        this.options.addAll(options);
    }

    public UUID getId() { return id; }
    public QuestionType getType() { return type; }
    public String getTitle() { return title; }
    public boolean isRequired() { return required; }
    public int getDisplayOrder() { return displayOrder; }
    public List<String> getOptions() { return List.copyOf(options); }
}
