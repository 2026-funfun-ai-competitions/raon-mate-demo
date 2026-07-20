package com.raonmate.backend.schedule.api;

import com.raonmate.backend.schedule.application.ScheduleService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/workshops/{workshopId}/schedule")
@Tag(name = "일정", description = "워크숍 일정 생성·조회·수정 API")
@RequiredArgsConstructor
public class ScheduleController {
    private final ScheduleService service;

    @GetMapping
    @Operation(summary = "워크숍 일정 조회")
    @ApiResponse(responseCode = "200", description = "일정 조회 완료")
    @ApiResponse(responseCode = "404", description = "생성된 일정을 찾을 수 없음")
    public ScheduleResponse get(@PathVariable UUID workshopId) {
        return service.get(workshopId);
    }

    @PostMapping("/generate")
    @Operation(summary = "워크숍 AI 일정 생성", description = "워크숍 조건과 선택 장소를 반영해 Gemini가 일정을 생성하며, AI 장애 시 기본 일정을 제공합니다.")
    @ApiResponse(responseCode = "200", description = "일정 생성 완료")
    @ApiResponse(responseCode = "404", description = "워크숍을 찾을 수 없음")
    public ScheduleResponse generate(@PathVariable UUID workshopId) {
        return service.generate(workshopId);
    }

    @PutMapping
    @Operation(summary = "워크숍 일정 수정", description = "일정 항목 전체를 입력한 내용으로 변경합니다.")
    @ApiResponse(responseCode = "200", description = "일정 수정 완료")
    @ApiResponse(responseCode = "400", description = "입력값 검증 실패 또는 일정 시간 중복")
    @ApiResponse(responseCode = "404", description = "생성된 일정을 찾을 수 없음")
    public ScheduleResponse update(@PathVariable UUID workshopId, @Valid @RequestBody ScheduleRequest request) {
        return service.update(workshopId, request);
    }
}
