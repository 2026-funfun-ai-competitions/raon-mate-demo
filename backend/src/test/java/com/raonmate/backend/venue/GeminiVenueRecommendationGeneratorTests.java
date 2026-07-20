package com.raonmate.backend.venue;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import com.raonmate.backend.global.error.ExternalAiServiceException;
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
        var generator = new GeminiVenueRecommendationGenerator(
                new ObjectMapper(), "", "gemini-test", "http://localhost",
                Duration.ofSeconds(1), Duration.ofSeconds(1));

        ExternalAiServiceException exception = assertThrows(
                ExternalAiServiceException.class, () -> generator.generate(context()));

        assertTrue(exception.getMessage().contains("GEMINI_API_KEY"));
    }

    @Test
    void sendsMapsGroundedContextAndParsesRecommendations() throws Exception {
        AtomicReference<String> requestBody = new AtomicReference<>();
        HttpServer server = HttpServer.create(new InetSocketAddress(0), 0);
        server.createContext("/v1beta/models/gemini-test:generateContent", exchange -> {
            requestBody.set(new String(exchange.getRequestBody().readAllBytes(), StandardCharsets.UTF_8));
            byte[] response = """
                    {"candidates":[{"content":{"parts":[{"text":"{\\"recommendations\\":[{\\"rank\\":1,\\"name\\":\\"숲속 연수원\\",\\"address\\":\\"경기도 가평군\\",\\"category\\":\\"연수원\\",\\"estimatedCostPerPerson\\":80000,\\"score\\":94,\\"reasons\\":[\\"예산과 자연 선호에 부합\\"],\\"cautions\\":[\\"예약 가능 여부 확인 필요\\"]}]}"}]},"groundingMetadata":{"groundingChunks":[{"maps":{"title":"숲속 연수원","uri":"https://maps.google.com/example","placeId":"places/example"}}]}}]}
                    """.getBytes(StandardCharsets.UTF_8);
            exchange.getResponseHeaders().add("Content-Type", "application/json");
            exchange.sendResponseHeaders(200, response.length);
            exchange.getResponseBody().write(response);
            exchange.close();
        });
        server.start();

        try {
            var generator = new GeminiVenueRecommendationGenerator(
                    new ObjectMapper(), "test-key", "gemini-test",
                    "http://localhost:" + server.getAddress().getPort(),
                    Duration.ofSeconds(1), Duration.ofSeconds(1));

            var response = generator.generate(context());

            assertEquals("숲속 연수원", response.recommendations().getFirst().name());
            assertEquals(94, response.recommendations().getFirst().score());
            assertEquals("https://maps.google.com/example", response.recommendations().getFirst().mapUri());
            assertEquals("places/example", response.sources().getFirst().placeId());
            assertTrue(requestBody.get().contains("googleMaps"));
            assertTrue(requestBody.get().contains("자연 체험"));
            assertTrue(requestBody.get().contains("latitude"));
        } finally {
            server.stop(0);
        }
    }

    @Test
    void rejectsRecommendationWithoutMapsGrounding() throws Exception {
        HttpServer server = HttpServer.create(new InetSocketAddress(0), 0);
        server.createContext("/v1beta/models/gemini-test:generateContent", exchange -> {
            byte[] response = """
                    {"candidates":[{"content":{"parts":[{"text":"{\\"recommendations\\":[{\\"rank\\":1,\\"name\\":\\"확인 안 된 장소\\",\\"address\\":\\"서울\\",\\"category\\":\\"연수원\\",\\"estimatedCostPerPerson\\":null,\\"score\\":80,\\"reasons\\":[\\"조건 부합\\"],\\"cautions\\":[]}] }"}]}}]}
                    """.getBytes(StandardCharsets.UTF_8);
            exchange.getResponseHeaders().add("Content-Type", "application/json");
            exchange.sendResponseHeaders(200, response.length);
            exchange.getResponseBody().write(response);
            exchange.close();
        });
        server.start();

        try {
            var generator = new GeminiVenueRecommendationGenerator(
                    new ObjectMapper(), "test-key", "gemini-test",
                    "http://localhost:" + server.getAddress().getPort(),
                    Duration.ofSeconds(1), Duration.ofSeconds(1));

            assertThrows(ExternalAiServiceException.class, () -> generator.generate(context()));
        } finally {
            server.stop(0);
        }
    }

    private VenueRecommendationContext context() {
        return new VenueRecommendationContext(
                "개발팀 워크숍", "서울역", 20, new BigDecimal("100000"), "주차 가능",
                3,
                List.of(new VenueRecommendationContext.SurveyResponseSummary(
                        "선호 활동", List.of(
                                new VenueRecommendationContext.AnswerCount("자연 체험", 2),
                                new VenueRecommendationContext.AnswerCount("레크리에이션", 1)))),
                37.5665, 126.9780, 5, "대중교통 우선");
    }
}
