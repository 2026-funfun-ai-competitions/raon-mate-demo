package com.raonmate.backend.survey.application;

import com.raonmate.backend.global.error.ConflictException;
import com.raonmate.backend.global.error.ResourceNotFoundException;
import com.raonmate.backend.survey.api.SubmissionResponse;
import com.raonmate.backend.survey.api.SurveyResponse;
import com.raonmate.backend.survey.api.SurveySubmitRequest;
import com.raonmate.backend.survey.domain.*;
import com.raonmate.backend.workshop.domain.Workshop;
import com.raonmate.backend.workshop.domain.WorkshopRepository;
import com.raonmate.backend.workshop.domain.WorkshopStatus;
import java.time.LocalDateTime;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class SurveyService {
    private final WorkshopRepository workshopRepository;
    private final SurveyRepository surveyRepository;
    private final SurveySubmissionRepository submissionRepository;
    private final SurveyQuestionGenerator questionGenerator;

    @Transactional
    public SurveyResponse generate(UUID workshopId) {
        Workshop workshop = findWorkshop(workshopId);
        if (surveyRepository.existsByWorkshopId(workshopId)) {
            throw new ConflictException("이미 생성된 설문이 있습니다.");
        }
        Survey survey = new Survey(workshop);
        questionGenerator.generate(survey);
        surveyRepository.save(survey);
        return SurveyResponse.from(survey, 0);
    }

    public SurveyResponse get(UUID workshopId) {
        Survey survey = findSurvey(workshopId);
        return SurveyResponse.from(survey, submissionRepository.countBySurveyId(survey.getId()));
    }

    @Transactional
    public SurveyResponse open(UUID workshopId) {
        Survey survey = findSurvey(workshopId);
        survey.getWorkshop().openSurvey();
        return SurveyResponse.from(survey, submissionRepository.countBySurveyId(survey.getId()));
    }

    @Transactional
    public SurveyResponse close(UUID workshopId) {
        Survey survey = findSurvey(workshopId);
        survey.getWorkshop().closeSurvey();
        return SurveyResponse.from(survey, submissionRepository.countBySurveyId(survey.getId()));
    }

    @Transactional
    public SubmissionResponse submit(UUID workshopId, SurveySubmitRequest request) {
        Survey survey = findSurvey(workshopId);
        validateSurveyOpen(survey.getWorkshop());
        if (submissionRepository.existsBySurveyIdAndParticipantKey(survey.getId(), request.participantKey())) {
            throw new ConflictException("이미 응답을 제출한 참여자입니다.");
        }

        Map<UUID, SurveyQuestion> questions = survey.getQuestions().stream()
                .collect(Collectors.toMap(SurveyQuestion::getId, Function.identity()));
        Map<UUID, SurveySubmitRequest.AnswerRequest> answers = request.answers().stream()
                .collect(Collectors.toMap(SurveySubmitRequest.AnswerRequest::questionId, Function.identity(),
                        (left, right) -> { throw new IllegalArgumentException("동일한 질문에 중복 응답할 수 없습니다."); }));

        for (UUID questionId : answers.keySet()) {
            if (!questions.containsKey(questionId)) {
                throw new IllegalArgumentException("설문에 존재하지 않는 질문이 포함되어 있습니다.");
            }
        }
        questions.values().forEach(question -> validateAnswer(question, answers.get(question.getId())));

        SurveySubmission submission = new SurveySubmission(survey, request.participantKey(), request.participantName());
        answers.forEach((questionId, answer) -> submission.addAnswer(questions.get(questionId), answer.values()));
        return SubmissionResponse.from(submissionRepository.save(submission));
    }

    private void validateAnswer(SurveyQuestion question, SurveySubmitRequest.AnswerRequest answer) {
        if (answer == null || answer.values().isEmpty()) {
            if (question.isRequired()) throw new IllegalArgumentException("필수 질문에 응답해주세요: " + question.getTitle());
            return;
        }
        if ((question.getType() == QuestionType.SINGLE_CHOICE || question.getType() == QuestionType.FREE_TEXT)
                && answer.values().size() != 1) {
            throw new IllegalArgumentException("단일 응답 질문은 하나만 입력할 수 있습니다: " + question.getTitle());
        }
        if (!question.getOptions().isEmpty() && !question.getOptions().containsAll(answer.values())) {
            throw new IllegalArgumentException("선택지에 없는 응답이 포함되어 있습니다: " + question.getTitle());
        }
    }

    private void validateSurveyOpen(Workshop workshop) {
        if (workshop.getStatus() != WorkshopStatus.SURVEY_OPEN) {
            throw new ConflictException("현재 응답을 받고 있는 설문이 아닙니다.");
        }
        if (workshop.getResponseDeadline() != null && workshop.getResponseDeadline().isBefore(LocalDateTime.now())) {
            throw new ConflictException("설문 응답 기한이 종료되었습니다.");
        }
    }

    private Workshop findWorkshop(UUID workshopId) {
        return workshopRepository.findById(workshopId)
                .orElseThrow(() -> new ResourceNotFoundException("워크숍을 찾을 수 없습니다."));
    }

    private Survey findSurvey(UUID workshopId) {
        return surveyRepository.findByWorkshopId(workshopId)
                .orElseThrow(() -> new ResourceNotFoundException("워크숍 설문을 찾을 수 없습니다."));
    }
}
