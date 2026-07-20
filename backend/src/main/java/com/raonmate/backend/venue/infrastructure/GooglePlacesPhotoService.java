package com.raonmate.backend.venue.infrastructure;

import com.raonmate.backend.global.error.ResourceNotFoundException;
import java.net.URI;
import java.net.http.HttpClient;
import java.time.Duration;
import java.util.regex.Pattern;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.client.JdkClientHttpRequestFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import tools.jackson.databind.JsonNode;

@Component
public class GooglePlacesPhotoService {
    private static final Pattern PHOTO_NAME = Pattern.compile("places/[^/]+/photos/[^/]+");
    private final RestClient restClient;
    private final String apiKey;

    public GooglePlacesPhotoService(
            @Value("${app.google-places.api-key:}") String apiKey,
            @Value("${app.google-places.base-url:https://places.googleapis.com}") String baseUrl,
            @Value("${app.google-places.connect-timeout:3s}") Duration connectTimeout,
            @Value("${app.google-places.read-timeout:15s}") Duration readTimeout) {
        HttpClient httpClient = HttpClient.newBuilder().connectTimeout(connectTimeout).build();
        JdkClientHttpRequestFactory requestFactory = new JdkClientHttpRequestFactory(httpClient);
        requestFactory.setReadTimeout(readTimeout);
        this.restClient = RestClient.builder().baseUrl(baseUrl).requestFactory(requestFactory).build();
        this.apiKey = apiKey;
    }

    public URI resolve(String photoName) {
        if (apiKey == null || apiKey.isBlank() || photoName == null || !PHOTO_NAME.matcher(photoName).matches()) {
            throw new ResourceNotFoundException("장소 사진을 찾을 수 없습니다.");
        }
        try {
            JsonNode response = restClient.get()
                    .uri(builder -> builder.path("/v1/").path(photoName).path("/media")
                            .queryParam("maxWidthPx", 800)
                            .queryParam("maxHeightPx", 600)
                            .queryParam("skipHttpRedirect", true)
                            .build())
                    .header("X-Goog-Api-Key", apiKey)
                    .retrieve()
                    .body(JsonNode.class);
            String photoUri = response == null ? "" : response.path("photoUri").asText();
            if (photoUri.isBlank()) throw new ResourceNotFoundException("장소 사진을 찾을 수 없습니다.");
            return URI.create(photoUri);
        } catch (RestClientException | IllegalArgumentException exception) {
            throw new ResourceNotFoundException("장소 사진을 찾을 수 없습니다.");
        }
    }
}
