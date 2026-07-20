package com.raonmate.backend.venue;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import com.raonmate.backend.global.error.ExternalAiServiceException;
import com.raonmate.backend.venue.application.VenueRecommendationContext;
import com.raonmate.backend.venue.infrastructure.GooglePlacesVenueCandidateProvider;
import com.sun.net.httpserver.HttpServer;
import java.math.BigDecimal;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.List;
import java.util.concurrent.atomic.AtomicReference;
import org.junit.jupiter.api.Test;

class GooglePlacesVenueCandidateProviderTests {

    @Test
    void returnsVerifiedPlaceDetailsAndSendsLocationBias() throws Exception {
        AtomicReference<String> body = new AtomicReference<>();
        AtomicReference<String> fieldMask = new AtomicReference<>();
        HttpServer server = HttpServer.create(new InetSocketAddress(0), 0);
        server.createContext("/v1/places:searchText", exchange -> {
            body.set(new String(exchange.getRequestBody().readAllBytes(), StandardCharsets.UTF_8));
            fieldMask.set(exchange.getRequestHeaders().getFirst("X-Goog-FieldMask"));
            byte[] response = """
                    {"places":[{"id":"places/example","displayName":{"text":"숲속 연수원"},
                    "formattedAddress":"경기도 가평군","primaryTypeDisplayName":{"text":"연수원"},
                    "location":{"latitude":37.5,"longitude":127.5},"rating":4.7,
                    "userRatingCount":128,"googleMapsUri":"https://maps.google.com/example",
                    "photos":[{"name":"places/example/photos/photo-1",
                    "authorAttributions":[{"displayName":"홍길동"}]}]}]}
                    """.getBytes(StandardCharsets.UTF_8);
            exchange.getResponseHeaders().add("Content-Type", "application/json");
            exchange.sendResponseHeaders(200, response.length);
            exchange.getResponseBody().write(response);
            exchange.close();
        });
        server.start();

        try {
            var provider = new GooglePlacesVenueCandidateProvider(
                    "places-key", "http://localhost:" + server.getAddress().getPort(),
                    Duration.ofSeconds(1), Duration.ofSeconds(1));

            var candidate = provider.search(context()).getFirst();

            assertEquals("places/example", candidate.placeId());
            assertEquals("숲속 연수원", candidate.name());
            assertEquals(4.7, candidate.rating());
            assertEquals(128, candidate.reviewCount());
            assertEquals("places/example/photos/photo-1", candidate.photoName());
            assertEquals(List.of("홍길동"), candidate.photoAttributions());
            assertTrue(body.get().contains("locationBias"));
            assertTrue(body.get().contains("기업 워크숍 장소"));
            assertTrue(fieldMask.get().contains("places.id"));
        } finally {
            server.stop(0);
        }
    }

    @Test
    void failsClearlyWhenApiKeyIsMissing() {
        var provider = new GooglePlacesVenueCandidateProvider(
                "", "http://localhost", Duration.ofSeconds(1), Duration.ofSeconds(1));

        ExternalAiServiceException exception = assertThrows(
                ExternalAiServiceException.class, () -> provider.search(context()));

        assertTrue(exception.getMessage().contains("GOOGLE_PLACES_API_KEY"));
    }

    private VenueRecommendationContext context() {
        return new VenueRecommendationContext(
                "개발팀 워크숍", "서울역", 20, new BigDecimal("100000"), "주차 가능",
                0, List.of(), 37.5665, 126.9780, 5, "대중교통 우선");
    }
}
