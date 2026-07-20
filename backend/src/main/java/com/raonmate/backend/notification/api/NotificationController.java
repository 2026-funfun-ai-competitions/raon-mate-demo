package com.raonmate.backend.notification.api;

import com.raonmate.backend.notification.application.NotificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/workshops/{workshopId}/notifications")
@Tag(name = "알림", description = "워크숍 알림 발송 및 이력 조회 API")
@RequiredArgsConstructor
public class NotificationController {
    private final NotificationService service;

    @GetMapping
    @Operation(summary = "알림 발송 이력 조회", description = "워크숍의 알림 발송 이력을 최신순으로 조회합니다.")
    @ApiResponse(responseCode = "200", description = "알림 발송 이력 조회 완료")
    @ApiResponse(responseCode = "404", description = "워크숍을 찾을 수 없음")
    public List<NotificationResponse> list(@PathVariable UUID workshopId) {
        return service.list(workshopId);
    }

    @PostMapping("/send")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "워크숍 알림 발송", description = "선택한 채널로 워크숍 알림을 발송하고 이력을 저장합니다.")
    @ApiResponse(responseCode = "201", description = "알림 발송 완료")
    @ApiResponse(responseCode = "400", description = "입력값 검증 실패 또는 지원하지 않는 알림 채널")
    @ApiResponse(responseCode = "404", description = "워크숍을 찾을 수 없음")
    @ApiResponse(responseCode = "503", description = "외부 알림 서비스 호출 실패")
    public NotificationResponse send(
            @PathVariable UUID workshopId,
            @Valid @RequestBody NotificationSendRequest request) {
        return service.send(workshopId, request);
    }
}
