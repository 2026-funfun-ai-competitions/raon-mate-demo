package com.raonmate.backend.survey.domain;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "survey_submissions", uniqueConstraints =
        @UniqueConstraint(name = "uk_submission_survey_participant", columnNames = {"survey_id", "participant_key"}))
public class SurveySubmission {
    @Id
    private UUID id;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "survey_id", nullable = false)
    private Survey survey;
    @Column(name = "participant_key", nullable = false, length = 100)
    private String participantKey;
    @Column(nullable = false, length = 100)
    private String participantName;
    @OneToMany(mappedBy = "submission", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<SurveyAnswer> answers = new ArrayList<>();
    @Column(nullable = false)
    private Instant submittedAt;

    protected SurveySubmission() {}

    public SurveySubmission(Survey survey, String participantKey, String participantName) {
        this.id = UUID.randomUUID();
        this.survey = survey;
        this.participantKey = participantKey;
        this.participantName = participantName;
        this.submittedAt = Instant.now();
    }

    public void addAnswer(SurveyQuestion question, List<String> values) {
        answers.add(new SurveyAnswer(this, question, values));
    }

    public UUID getId() { return id; }
    public String getParticipantName() { return participantName; }
    public List<SurveyAnswer> getAnswers() { return List.copyOf(answers); }
    public Instant getSubmittedAt() { return submittedAt; }
}
