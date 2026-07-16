package com.raonmate.backend.survey;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import com.raonmate.backend.global.error.ConflictException;
import com.raonmate.backend.survey.api.SurveySubmitRequest;
import com.raonmate.backend.survey.application.SurveyService;
import com.raonmate.backend.survey.domain.QuestionType;
import com.raonmate.backend.workshop.api.WorkshopCreateRequest;
import com.raonmate.backend.workshop.application.WorkshopService;
import com.raonmate.backend.workshop.domain.WorkshopStatus;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestConstructor;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest(properties = {
        "spring.datasource.url=jdbc:h2:mem:survey-flow-test;DB_CLOSE_DELAY=-1",
        "spring.jpa.hibernate.ddl-auto=create-drop"
})
@Transactional
@TestConstructor(autowireMode = TestConstructor.AutowireMode.ALL)
@RequiredArgsConstructor
class WorkshopSurveyFlowTests {
    private final WorkshopService workshopService;
    private final SurveyService surveyService;

    @Test
    void createOpenAndSubmitSurvey() {
        var workshop = workshopService.create(new WorkshopCreateRequest(
                "개발팀 워크숍", "서울 강남", 20, new BigDecimal("200000"),
                LocalDateTime.now().plusDays(7), "전원 참여 우선"));
        var generated = surveyService.generate(workshop.id());

        assertEquals(6, generated.questions().size());
        assertEquals(WorkshopStatus.SURVEY_OPEN, surveyService.open(workshop.id()).status());

        var answers = generated.questions().stream()
                .filter(question -> question.required())
                .map(question -> new SurveySubmitRequest.AnswerRequest(
                        question.id(), question.type() == QuestionType.DATE_MULTIPLE_CHOICE
                                ? List.of("2026-08-21")
                                : List.of(question.options().getFirst())))
                .toList();
        var request = new SurveySubmitRequest("employee-1", "김라온", answers);

        surveyService.submit(workshop.id(), request);
        assertEquals(1, surveyService.get(workshop.id()).responseCount());
        assertThrows(ConflictException.class, () -> surveyService.submit(workshop.id(), request));
    }
}
