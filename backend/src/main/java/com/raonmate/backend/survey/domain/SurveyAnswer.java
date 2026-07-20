package com.raonmate.backend.survey.domain;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "survey_answers")
public class SurveyAnswer {
    @Id
    private UUID id;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "submission_id", nullable = false)
    private SurveySubmission submission;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "question_id", nullable = false)
    private SurveyQuestion question;
    @ElementCollection
    @CollectionTable(name = "survey_answer_values", joinColumns = @JoinColumn(name = "answer_id"))
    @OrderColumn(name = "value_order")
    @Column(name = "answer_value", nullable = false, length = 500)
    private List<String> values = new ArrayList<>();

    protected SurveyAnswer() {}

    SurveyAnswer(SurveySubmission submission, SurveyQuestion question, List<String> values) {
        this.id = UUID.randomUUID();
        this.submission = submission;
        this.question = question;
        this.values.addAll(values);
    }

    public SurveyQuestion getQuestion() { return question; }
    public List<String> getValues() { return List.copyOf(values); }
}
