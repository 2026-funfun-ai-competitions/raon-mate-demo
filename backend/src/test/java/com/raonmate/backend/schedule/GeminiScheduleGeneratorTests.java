package com.raonmate.backend.schedule;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import com.raonmate.backend.global.error.ExternalAiServiceException;
import com.raonmate.backend.schedule.application.ScheduleGenerationContext;
import com.raonmate.backend.schedule.infrastructure.GeminiScheduleGenerator;
import com.raonmate.backend.workshop.domain.WorkshopType;
import com.sun.net.httpserver.HttpServer;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.LocalDate;
import java.util.List;
import java.util.concurrent.atomic.AtomicReference;
import org.junit.jupiter.api.Test;
import tools.jackson.databind.ObjectMapper;

class GeminiScheduleGeneratorTests {

    @Test
    void sendsWorkshopContextAndParsesSchedule() throws Exception {
        AtomicReference<String> requestBody = new AtomicReference<>();
        HttpServer server = HttpServer.create(new InetSocketAddress(0), 0);
        server.createContext("/v1beta/models/gemini-test:generateContent", exchange -> {
            requestBody.set(new String(exchange.getRequestBody().readAllBytes(), StandardCharsets.UTF_8));
            byte[] response = """
                    {"candidates":[{"content":{"parts":[{"text":"{\\\"items\\\":[{\\\"date\\\":\\\"2026-09-09\\\",\\\"startTime\\\":\\\"10:00\\\",\\\"endTime\\\":\\\"11:30\\\",\\\"type\\\":\\\"SESSION\\\",\\\"title\\\":\\\"목표 공유 세션\\\",\\\"description\\\":\\\"팀 목표를 정렬합니다.\\\"}]}"}]}}]}
                    """.getBytes(StandardCharsets.UTF_8);
            exchange.getResponseHeaders().add("Content-Type", "application/json");
            exchange.sendResponseHeaders(200, response.length);
            exchange.getResponseBody().write(response);
            exchange.close();
        });
        server.start();

        try {
            GeminiScheduleGenerator generator = generator("key", "http://localhost:" + server.getAddress().getPort());

            var item = generator.generate(context()).getFirst();

            assertEquals(LocalDate.of(2026, 9, 9), item.date());
            assertEquals("SESSION", item.type());
            assertEquals("목표 공유 세션", item.title());
            assertTrue(requestBody.get().contains("places/example"));
            assertTrue(requestBody.get().contains("목표 공유"));
        } finally {
            server.stop(0);
        }
    }

    @Test
    void failsClearlyWhenApiKeyIsMissing() {
        ExternalAiServiceException exception = assertThrows(
                ExternalAiServiceException.class, () -> generator("", "http://localhost").generate(context()));
        assertTrue(exception.getMessage().contains("GEMINI_API_KEY"));
    }

    private GeminiScheduleGenerator generator(String key, String baseUrl) {
        return new GeminiScheduleGenerator(
                new ObjectMapper(), key, "gemini-test", baseUrl,
                Duration.ofSeconds(1), Duration.ofSeconds(1));
    }

    private ScheduleGenerationContext context() {
        return new ScheduleGenerationContext(
                "기술본부 워크숍", "가평", 25, WorkshopType.OVERNIGHT,
                LocalDate.of(2026, 9, 9), LocalDate.of(2026, 9, 10),
                "목표 공유", "바비큐", List.of(new ScheduleGenerationContext.SelectedVenue(
                        "places/example", "숲속 연수원", "경기도 가평군", "연수원")));
    }
}
