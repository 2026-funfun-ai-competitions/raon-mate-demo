package com.raonmate.backend;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT, properties = {
        "spring.datasource.url=jdbc:h2:mem:openapi-test;DB_CLOSE_DELAY=-1",
        "spring.jpa.hibernate.ddl-auto=create-drop"
})
class OpenApiEndpointTests {
    @LocalServerPort int port;

    @Test
    void exposesOpenApiDocumentAndSwaggerUi() throws Exception {
        try (HttpClient client = HttpClient.newHttpClient()) {
            HttpResponse<String> apiDocs = client.send(
                    HttpRequest.newBuilder(URI.create("http://127.0.0.1:" + port + "/v3/api-docs")).GET().build(),
                    HttpResponse.BodyHandlers.ofString());
            assertEquals(200, apiDocs.statusCode());
            assertTrue(apiDocs.body().contains("라온 메이트 API"));
            assertTrue(apiDocs.body().contains("/api/workshops"));
            assertTrue(apiDocs.body().contains("/api/workshops/{workshopId}/budget"));
            assertTrue(apiDocs.body().contains("/api/workshops/{workshopId}/schedule"));
            assertTrue(apiDocs.body().contains("/api/workshops/{workshopId}/notifications"));
            assertTrue(apiDocs.body().contains("예산 계획 초기화"));
            assertTrue(apiDocs.body().contains("워크숍 일정 자동 생성"));
            assertTrue(apiDocs.body().contains("워크숍 알림 발송"));

            HttpResponse<Void> swaggerUi = client.send(
                    HttpRequest.newBuilder(URI.create("http://127.0.0.1:" + port + "/swagger-ui.html")).GET().build(),
                    HttpResponse.BodyHandlers.discarding());
            assertTrue(swaggerUi.statusCode() == 302 || swaggerUi.statusCode() == 200);
        }
    }
}
