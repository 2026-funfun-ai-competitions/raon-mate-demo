package com.raonmate.backend.venue.application;

import com.raonmate.backend.global.error.RateLimitExceededException;
import com.raonmate.backend.venue.api.VenueRecommendationRequest;
import com.raonmate.backend.venue.api.VenueRecommendationResponse;
import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class VenueRecommendationCache {
    private static final int MAX_CACHE_ENTRIES = 500;

    private final Map<CacheKey, CacheEntry> entries = new ConcurrentHashMap<>();
    private final Map<UUID, Instant> lastRequests = new ConcurrentHashMap<>();
    private final Duration ttl;
    private final Duration minimumInterval;
    private final Clock clock;

    @Autowired
    public VenueRecommendationCache(
            @Value("${app.gemini.cache-ttl:10m}") Duration ttl,
            @Value("${app.gemini.minimum-request-interval:10s}") Duration minimumInterval) {
        this(ttl, minimumInterval, Clock.systemUTC());
    }

    VenueRecommendationCache(Duration ttl, Duration minimumInterval, Clock clock) {
        this.ttl = ttl;
        this.minimumInterval = minimumInterval;
        this.clock = clock;
    }

    public CacheKey key(UUID workshopId, long responseCount, VenueRecommendationRequest request) {
        return new CacheKey(workshopId, responseCount, request.latitude(), request.longitude(),
                request.resultLimit(), request.additionalRequest());
    }

    public Optional<VenueRecommendationResponse> get(CacheKey key) {
        CacheEntry entry = entries.get(key);
        if (entry == null) return Optional.empty();
        if (entry.createdAt().plus(ttl).isBefore(clock.instant())) {
            entries.remove(key, entry);
            return Optional.empty();
        }
        return Optional.of(entry.response());
    }

    public synchronized void checkRateLimit(UUID workshopId) {
        Instant now = clock.instant();
        Instant lastRequest = lastRequests.get(workshopId);
        if (lastRequest != null && now.isBefore(lastRequest.plus(minimumInterval))) {
            throw new RateLimitExceededException("새 장소 추천은 잠시 후 다시 요청할 수 있습니다.");
        }
        lastRequests.put(workshopId, now);
    }

    public void put(CacheKey key, VenueRecommendationResponse response) {
        if (entries.size() >= MAX_CACHE_ENTRIES) removeExpiredEntries();
        if (entries.size() >= MAX_CACHE_ENTRIES) entries.clear();
        entries.put(key, new CacheEntry(response, clock.instant()));
    }

    private void removeExpiredEntries() {
        Instant now = clock.instant();
        entries.entrySet().removeIf(entry -> entry.getValue().createdAt().plus(ttl).isBefore(now));
        lastRequests.entrySet().removeIf(entry -> entry.getValue().plus(ttl).isBefore(now));
    }

    public record CacheKey(
            UUID workshopId, long responseCount, Double latitude, Double longitude,
            int maxResults, String additionalRequest) {}

    private record CacheEntry(VenueRecommendationResponse response, Instant createdAt) {}
}
