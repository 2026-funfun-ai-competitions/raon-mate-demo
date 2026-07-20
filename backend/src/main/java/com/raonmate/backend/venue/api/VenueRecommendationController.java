package com.raonmate.backend.venue.api;

import com.raonmate.backend.venue.application.VenueRecommendationService;
import com.raonmate.backend.venue.application.VenueRecommendationAccessGuard;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/workshops/{workshopId}/venue-recommendations")
@Tag(name = "장소 추천", description = "설문 결과와 워크숍 조건을 반영한 AI 장소 추천 API")
@RequiredArgsConstructor
public class VenueRecommendationController {
    private final VenueRecommendationService recommendationService;
    private final VenueRecommendationAccessGuard accessGuard;

    @PostMapping
    @Operation(summary = "AI 워크숍 장소 추천", description = "Gemini와 Google Maps 데이터를 사용해 실제 장소와 추천 이유를 생성합니다.")
    @ApiResponse(responseCode = "200", description = "추천 생성 완료")
    @ApiResponse(responseCode = "404", description = "워크숍 또는 설문을 찾을 수 없음")
    @ApiResponse(responseCode = "503", description = "Gemini API 미설정 또는 호출 실패")
    public VenueRecommendationResponse recommend(
            @PathVariable UUID workshopId,
            @RequestHeader(value = "X-Recommendation-Key", required = false) String accessToken,
            @Valid @RequestBody VenueRecommendationRequest request) {
        accessGuard.verify(accessToken);
        return recommendationService.recommend(workshopId, request);
    }
}
