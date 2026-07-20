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
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import java.util.List;

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

    @GetMapping
    @Operation(summary = "최근 장소 추천 결과 조회")
    public VenueRecommendationResponse latest(@PathVariable UUID workshopId) {
        return recommendationService.latest(workshopId);
    }

    @PutMapping("/selection")
    @Operation(summary = "비교·선택할 장소 저장", description = "최대 3곳을 저장합니다.")
    public List<String> select(@PathVariable UUID workshopId,
                               @Valid @RequestBody VenueSelectionRequest request) {
        return recommendationService.select(workshopId, request);
    }
}
