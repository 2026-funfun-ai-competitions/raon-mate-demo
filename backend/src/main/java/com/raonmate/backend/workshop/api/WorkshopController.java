package com.raonmate.backend.workshop.api;

import com.raonmate.backend.workshop.application.WorkshopService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.net.URI;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/workshops")
@Tag(name = "워크숍", description = "워크숍 기본정보 관리 API")
@RequiredArgsConstructor
public class WorkshopController {
    private final WorkshopService workshopService;

    @PostMapping
    @Operation(summary = "워크숍 생성", description = "확정된 최소 정보로 워크숍 초안을 생성합니다.")
    @ApiResponse(responseCode = "201", description = "워크숍 생성 완료")
    @ApiResponse(responseCode = "400", description = "입력값 검증 실패")
    public ResponseEntity<WorkshopResponse> create(@Valid @RequestBody WorkshopCreateRequest request) {
        WorkshopResponse response = workshopService.create(request);
        return ResponseEntity.created(URI.create("/api/workshops/" + response.id())).body(response);
    }

    @GetMapping
    @Operation(summary = "워크숍 목록 조회")
    public List<WorkshopResponse> findAll() { return workshopService.findAll(); }

    @GetMapping("/{workshopId}")
    @Operation(summary = "워크숍 상세 조회")
    @ApiResponse(responseCode = "404", description = "워크숍을 찾을 수 없음")
    public WorkshopResponse get(@PathVariable UUID workshopId) { return workshopService.get(workshopId); }

    @PutMapping("/{workshopId}")
    @Operation(summary = "워크숍 기본정보 수정")
    public WorkshopResponse update(@PathVariable UUID workshopId,
                                   @Valid @RequestBody WorkshopUpdateRequest request) {
        return workshopService.update(workshopId, request);
    }
}
