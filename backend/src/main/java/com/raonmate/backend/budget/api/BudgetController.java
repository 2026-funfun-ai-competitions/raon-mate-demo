package com.raonmate.backend.budget.api;

import com.raonmate.backend.budget.application.BudgetService;
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
@RequestMapping("/api/workshops/{workshopId}/budget")
@Tag(name = "예산", description = "워크숍 예산 계획 조회·생성·수정 API")
@RequiredArgsConstructor
public class BudgetController {
    private final BudgetService service;

    @GetMapping
    @Operation(summary = "예산 계획 조회", description = "워크숍의 항목별 예산과 총액, 잔여 예산을 조회합니다.")
    @ApiResponse(responseCode = "200", description = "예산 계획 조회 완료")
    @ApiResponse(responseCode = "404", description = "예산 계획을 찾을 수 없음")
    public BudgetResponse get(@PathVariable UUID workshopId) {
        return service.get(workshopId);
    }

    @PostMapping("/initialize")
    @Operation(summary = "예산 계획 초기화", description = "워크숍 인원과 1인당 예산을 기준으로 기본 예산 항목을 생성합니다.")
    @ApiResponse(responseCode = "200", description = "예산 계획 초기화 완료")
    @ApiResponse(responseCode = "404", description = "워크숍을 찾을 수 없음")
    public BudgetResponse initialize(@PathVariable UUID workshopId) {
        return service.initialize(workshopId);
    }

    @PutMapping
    @Operation(summary = "예산 계획 수정", description = "워크숍의 예산 항목을 입력한 내용으로 변경합니다.")
    @ApiResponse(responseCode = "200", description = "예산 계획 수정 완료")
    @ApiResponse(responseCode = "400", description = "입력값 검증 실패")
    @ApiResponse(responseCode = "404", description = "예산 계획을 찾을 수 없음")
    public BudgetResponse update(@PathVariable UUID workshopId, @Valid @RequestBody BudgetRequest request) {
        return service.update(workshopId, request);
    }
}
