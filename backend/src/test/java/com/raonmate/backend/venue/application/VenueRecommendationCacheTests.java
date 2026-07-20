package com.raonmate.backend.venue.application;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import com.raonmate.backend.global.error.RateLimitExceededException;
import com.raonmate.backend.venue.api.VenueRecommendationRequest;
import com.raonmate.backend.venue.api.VenueRecommendationResponse;
import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.Test;

class VenueRecommendationCacheTests {
    private final MutableClock clock = new MutableClock(Instant.parse("2026-07-20T00:00:00Z"));
    private final VenueRecommendationCache cache =
            new VenueRecommendationCache(Duration.ofMinutes(10), Duration.ofSeconds(10), clock);

    @Test
    void returnsCachedRecommendationUntilItExpires() {
        UUID workshopId = UUID.randomUUID();
        var key = cache.key(workshopId, 3, request());
        cache.put(key, response());

        assertTrue(cache.get(key).isPresent());
        clock.advance(Duration.ofMinutes(11));
        assertTrue(cache.get(key).isEmpty());
    }

    @Test
    void limitsConsecutiveUncachedRequestsForSameWorkshop() {
        UUID workshopId = UUID.randomUUID();

        cache.checkRateLimit(workshopId);
        assertThrows(RateLimitExceededException.class, () -> cache.checkRateLimit(workshopId));
        clock.advance(Duration.ofSeconds(11));
        cache.checkRateLimit(workshopId);
    }

    private VenueRecommendationRequest request() {
        return new VenueRecommendationRequest(37.5, 127.0, 5, null);
    }

    private VenueRecommendationResponse response() {
        return new VenueRecommendationResponse(List.of(), List.of(), "gemini-test", clock.instant());
    }

    private static class MutableClock extends Clock {
        private Instant instant;

        private MutableClock(Instant instant) {
            this.instant = instant;
        }

        void advance(Duration duration) {
            instant = instant.plus(duration);
        }

        @Override
        public ZoneId getZone() {
            return ZoneOffset.UTC;
        }

        @Override
        public Clock withZone(ZoneId zone) {
            return this;
        }

        @Override
        public Instant instant() {
            return instant;
        }
    }
}
