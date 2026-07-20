package com.raonmate.backend.venue.application;

import com.raonmate.backend.global.error.UnauthorizedException;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class VenueRecommendationAccessGuard {
    private final String accessToken;

    public VenueRecommendationAccessGuard(@Value("${app.gemini.access-token:}") String accessToken) {
        this.accessToken = accessToken;
    }

    public void verify(String providedToken) {
        if (accessToken == null || accessToken.isBlank()) return;
        if (providedToken == null || !MessageDigest.isEqual(
                accessToken.getBytes(StandardCharsets.UTF_8), providedToken.getBytes(StandardCharsets.UTF_8))) {
            throw new UnauthorizedException("장소 추천 API 인증에 실패했습니다.");
        }
    }
}
