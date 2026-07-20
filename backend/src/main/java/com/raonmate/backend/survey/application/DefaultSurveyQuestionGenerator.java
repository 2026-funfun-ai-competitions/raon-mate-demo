package com.raonmate.backend.survey.application;

import com.raonmate.backend.survey.domain.QuestionType;
import com.raonmate.backend.survey.domain.Survey;
import java.util.List;
import org.springframework.stereotype.Component;

@Component
public class DefaultSurveyQuestionGenerator implements SurveyQuestionGenerator {
    @Override
    public void generate(Survey survey) {
        survey.addQuestion(QuestionType.SINGLE_CHOICE, "선호하는 워크숍 형태를 선택해주세요.", true, 1,
                List.of("당일", "1박 2일", "상관없음"));
        survey.addQuestion(QuestionType.DATE_MULTIPLE_CHOICE, "참석 가능한 날짜를 모두 입력해주세요.", true, 2,
                List.of());
        survey.addQuestion(QuestionType.SINGLE_CHOICE, "가능한 최대 이동시간은 어느 정도인가요?", true, 3,
                List.of("1시간 이내", "2시간 이내", "3시간 이내", "상관없음"));
        survey.addQuestion(QuestionType.MULTIPLE_CHOICE, "선호하는 활동을 선택해주세요.", false, 4,
                List.of("휴식·힐링", "맛집·회식", "레저·액티비티", "팀 빌딩", "문화 체험"));
        survey.addQuestion(QuestionType.SINGLE_CHOICE, "차량 운전이 가능한가요?", false, 5,
                List.of("가능", "불가능", "상황에 따라 가능"));
        survey.addQuestion(QuestionType.FREE_TEXT, "음식, 건강, 이동과 관련해 고려할 사항이 있다면 알려주세요.", false, 6,
                List.of());
    }
}
