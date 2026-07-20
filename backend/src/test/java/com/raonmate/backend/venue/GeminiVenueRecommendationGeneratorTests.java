package com.raonmate.backend.venue;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import com.raonmate.backend.global.error.ExternalAiServiceException;
import com.raonmate.backend.venue.application.VenueCandidate;
import com.raonmate.backend.venue.application.VenueRecommendationContext;
import com.raonmate.backend.venue.infrastructure.GeminiVenueRecommendationGenerator;
import com.sun.net.httpserver.HttpServer;
import java.math.BigDecimal;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.List;
import java.util.concurrent.atomic.AtomicReference;
import org.junit.jupiter.api.Test;
import tools.jackson.databind.ObjectMapper;

class GeminiVenueRecommendationGeneratorTests {

    @Test
    void failsClearlyWhenApiKeyIsMissing() {
        var generator = generator("", "http://localhost");

        ExternalAiServiceException exception = assertThrows(
                ExternalAiServiceException.class, () -> generator.generate(context()));

        assertTrue(exception.getMessage().contains("GEMINI_API_KEY"));
    }

    @Test
    void evaluatesOnlyPlacesCandidatesAndUsesVerifiedDetails() throws Exception {
        AtomicReference<String> requestBody = new AtomicReference<>();
        HttpServer server = server(exchange -> {
            requestBody.set(new String(exchange.getRequestBody().readAllBytes(), StandardCharsets.UTF_8));
            respond(exchange, """
                    {"candidates":[{"content":{"parts":[{"text":"{\\\"recommendations\\\":[{\\\"rank\\\":1,\\\"placeId\\\":\\\"places/example\\\",\\\"score\\\":94,\\\"estimatedCostMinPerPerson\\\":60000,\\\"estimatedCostMaxPerPerson\\\":100000,\\\"costAssumptions\\\":[\\\"식사 포함\\\",\\\"교통비 제외\\\"],\\\"reasons\\\":[\\\"자연 선호에 부합\\\"],\\\"cautions\\\":[\\\"실제 견적 확인 필요\\\"]}]}"}]}}]}
                    """);
        });

        try {
            var response = generator("test-key", url(server)).generate(context());

            var venue = response.recommendations().getFirst();
            assertEquals("숲속 연수원", venue.name());
            assertEquals(94, venue.score());
            assertEquals(80000, venue.estimatedCostPerPerson());
            assertEquals(new BigDecimal("1600000"), venue.estimatedTotalCost());
            assertEquals(60000, venue.estimatedCostMinPerPerson());
            assertEquals(100000, venue.estimatedCostMaxPerPerson());
            assertEquals(new BigDecimal("1200000"), venue.estimatedTotalCostMin());
            assertEquals(new BigDecimal("2000000"), venue.estimatedTotalCostMax());
            assertEquals("AI_ESTIMATE", venue.costType());
            assertEquals(List.of("식사 포함", "교통비 제외"), venue.costAssumptions());
            assertEquals(4.7, venue.rating());
            assertEquals(128, venue.reviewCount());
            assertTrue(venue.imageUri().startsWith("/api/place-photos?name="));
            assertTrue(!venue.cautions().contains("Google Maps에서 최신 정보 확인 필요"));
            assertEquals("https://maps.google.com/example", venue.mapUri());
            assertEquals("places/example", venue.placeId());
            assertTrue(requestBody.get().contains("places/example"));
            assertTrue(requestBody.get().contains("자연 체험"));
            assertTrue(requestBody.get().contains("application/json"));
            assertTrue(requestBody.get().contains("8192"));
        } finally {
            server.stop(0);
        }
    }

    @Test
    void rejectsVenueThatIsNotInPlacesCandidates() throws Exception {
        HttpServer server = server(exchange -> respond(exchange, """
                {"candidates":[{"content":{"parts":[{"text":"{\\\"recommendations\\\":[{\\\"rank\\\":1,\\\"placeId\\\":\\\"places/invented\\\",\\\"score\\\":80,\\\"reasons\\\":[\\\"조건 부합\\\"],\\\"cautions\\\":[]}] }"}]}}]}
                """));

        try {
            ExternalAiServiceException exception = assertThrows(
                    ExternalAiServiceException.class,
                    () -> generator("test-key", url(server)).generate(context()));
            assertTrue(exception.getMessage().contains("올바른 장소 추천 결과"));
        } finally {
            server.stop(0);
        }
    }

    private GeminiVenueRecommendationGenerator generator(String apiKey, String baseUrl) {
        return new GeminiVenueRecommendationGenerator(
                new ObjectMapper(), apiKey, "gemini-test", baseUrl,
                Duration.ofSeconds(1), Duration.ofSeconds(1));
    }

    private HttpServer server(com.sun.net.httpserver.HttpHandler handler) throws Exception {
        HttpServer server = HttpServer.create(new InetSocketAddress(0), 0);
        server.createContext("/v1beta/models/gemini-test:generateContent", handler);
        server.start();
        return server;
    }

    private void respond(com.sun.net.httpserver.HttpExchange exchange, String json) throws java.io.IOException {
        byte[] response = json.getBytes(StandardCharsets.UTF_8);
        exchange.getResponseHeaders().add("Content-Type", "application/json");
        exchange.sendResponseHeaders(200, response.length);
        exchange.getResponseBody().write(response);
        exchange.close();
    }

    private String url(HttpServer server) {
        return "http://localhost:" + server.getAddress().getPort();
    }

    private VenueRecommendationContext context() {
        return new VenueRecommendationContext(
                "개발팀 워크숍", "서울역", 20, new BigDecimal("100000"), "주차 가능",
                3,
                List.of(new VenueRecommendationContext.SurveyResponseSummary(
                        "선호 활동", List.of(
                                new VenueRecommendationContext.AnswerCount("자연 체험", 2),
                                new VenueRecommendationContext.AnswerCount("레크리에이션", 1)))),
                37.5665, 126.9780, 5, "대중교통 우선")
                .withCandidates(List.of(new VenueCandidate(
                        "places/example", "숲속 연수원", "경기도 가평군", "연수원",
                        37.5, 127.5, 4.7, 128, "https://maps.google.com/example",
                        "places/example/photos/photo-1", List.of("홍길동"))));
    }
}
