package com.raonmate.backend.survey.api;

import com.raonmate.backend.survey.application.SurveyService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/workshops/{workshopId}/survey")
@Tag(name = "설문", description = "워크숍 설문 생성·공개·응답 API")
@RequiredArgsConstructor
public class SurveyController {
    private final SurveyService surveyService;

    @PostMapping("/generate")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "설문 자동 생성", description = "워크숍 의견 수집에 필요한 기본 질문을 생성합니다.")
    @ApiResponse(responseCode = "201", description = "설문 생성 완료")
    @ApiResponse(responseCode = "409", description = "이미 설문이 존재함")
    public SurveyResponse generate(@PathVariable UUID workshopId) { return surveyService.generate(workshopId); }

    @GetMapping
    @Operation(summary = "설문 조회", description = "질문 목록과 현재 응답 수를 조회합니다.")
    public SurveyResponse get(@PathVariable UUID workshopId) { return surveyService.get(workshopId); }

    @PostMapping("/open")
    @Operation(summary = "설문 공개", description = "구성원이 응답할 수 있도록 설문을 공개합니다.")
    @ApiResponse(responseCode = "409", description = "공개할 수 없는 워크숍 상태")
    public SurveyResponse open(@PathVariable UUID workshopId) { return surveyService.open(workshopId); }

    @PostMapping("/close")
    @Operation(summary = "설문 종료", description = "설문 응답 접수를 종료합니다.")
    @ApiResponse(responseCode = "409", description = "종료할 수 없는 워크숍 상태")
    public SurveyResponse close(@PathVariable UUID workshopId) { return surveyService.close(workshopId); }

    @PostMapping("/responses")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "설문 응답 제출", description = "참여자의 답변을 검증하고 저장합니다.")
    @ApiResponse(responseCode = "201", description = "응답 제출 완료")
    @ApiResponse(responseCode = "400", description = "필수 질문 누락 또는 잘못된 선택지")
    @ApiResponse(responseCode = "409", description = "설문 미공개·기한 종료 또는 중복 응답")
    public SubmissionResponse submit(@PathVariable UUID workshopId,
                                     @Valid @RequestBody SurveySubmitRequest request) {
        return surveyService.submit(workshopId, request);
    }
}
