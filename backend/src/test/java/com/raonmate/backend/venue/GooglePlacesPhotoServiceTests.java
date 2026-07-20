package com.raonmate.backend.venue;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import com.raonmate.backend.global.error.ResourceNotFoundException;
import com.raonmate.backend.venue.infrastructure.GooglePlacesPhotoService;
import com.sun.net.httpserver.HttpServer;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.concurrent.atomic.AtomicReference;
import org.junit.jupiter.api.Test;

class GooglePlacesPhotoServiceTests {

    @Test
    void resolvesPlacesPhotoWithoutExposingApiKeyToClient() throws Exception {
        AtomicReference<String> requestedUri = new AtomicReference<>();
        AtomicReference<String> apiKey = new AtomicReference<>();
        HttpServer server = HttpServer.create(new InetSocketAddress(0), 0);
        server.createContext("/v1/places/example/photos/photo-1/media", exchange -> {
            requestedUri.set(exchange.getRequestURI().toString());
            apiKey.set(exchange.getRequestHeaders().getFirst("X-Goog-Api-Key"));
            byte[] response = "{\"photoUri\":\"https://images.example/photo.jpg\"}"
                    .getBytes(StandardCharsets.UTF_8);
            exchange.getResponseHeaders().add("Content-Type", "application/json");
            exchange.sendResponseHeaders(200, response.length);
            exchange.getResponseBody().write(response);
            exchange.close();
        });
        server.start();

        try {
            var service = new GooglePlacesPhotoService(
                    "places-key", "http://localhost:" + server.getAddress().getPort(),
                    Duration.ofSeconds(1), Duration.ofSeconds(1));

            var uri = service.resolve("places/example/photos/photo-1");

            assertEquals("https://images.example/photo.jpg", uri.toString());
            assertEquals("places-key", apiKey.get());
            assertTrue(requestedUri.get().contains("skipHttpRedirect=true"));
            assertTrue(!uri.toString().contains("places-key"));
        } finally {
            server.stop(0);
        }
    }

    @Test
    void rejectsInvalidPhotoResourceName() {
        var service = new GooglePlacesPhotoService(
                "places-key", "http://localhost", Duration.ofSeconds(1), Duration.ofSeconds(1));

        assertThrows(ResourceNotFoundException.class, () -> service.resolve("https://attacker.example/photo"));
    }
}
