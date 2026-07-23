package com.raonmate.backend.venue.infrastructure;

import com.raonmate.backend.global.error.ExternalAiServiceException;
import com.raonmate.backend.venue.application.VenueCandidate;
import com.raonmate.backend.venue.application.VenueCandidateProvider;
import com.raonmate.backend.venue.application.VenueRecommendationContext;
import com.raonmate.backend.workshop.domain.WorkshopType;
import java.net.http.HttpClient;
import java.time.Duration;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Locale;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.client.JdkClientHttpRequestFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import tools.jackson.databind.JsonNode;

@Component
public class GooglePlacesVenueCandidateProvider implements VenueCandidateProvider {
    private static final String FIELD_MASK = String.join(",",
            "places.id", "places.displayName", "places.formattedAddress", "places.primaryTypeDisplayName",
            "places.location", "places.rating", "places.userRatingCount", "places.googleMapsUri", "places.photos");
    private static final int CANDIDATE_MULTIPLIER = 3;

    private final RestClient restClient;
    private final String apiKey;

    public GooglePlacesVenueCandidateProvider(
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

    @Override
    public List<VenueCandidate> search(VenueRecommendationContext context) {
        if (apiKey == null || apiKey.isBlank()) {
            throw new ExternalAiServiceException("GOOGLE_PLACES_API_KEY가 설정되지 않았습니다.");
        }
        try {
            JsonNode response = restClient.post()
                    .uri("/v1/places:searchText")
                    .header("X-Goog-Api-Key", apiKey)
                    .header("X-Goog-FieldMask", FIELD_MASK)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(request(context))
                    .retrieve()
                    .body(JsonNode.class);
            List<VenueCandidate> candidates = filterByWorkshopType(parse(response), context);
            if (candidates.isEmpty()) {
                String message = context.workshopType() == WorkshopType.OVERNIGHT
                        ? "해당 지역에서 숙박이 확인되는 호텔·리조트·연수원 후보를 찾지 못했어요. "
                                + "지역을 넓히거나 당일형으로 변경해 주세요."
                        : "조건에 맞는 실제 장소를 Google Maps에서 찾지 못했습니다.";
                throw new IllegalArgumentException(message);
            }
            return candidates;
        } catch (ExternalAiServiceException exception) {
            throw exception;
        } catch (RestClientException exception) {
            throw new ExternalAiServiceException("Google Places 장소 검색에 실패했습니다.", exception);
        }
    }

    private Map<String, Object> request(VenueRecommendationContext context) {
        Map<String, Object> request = new LinkedHashMap<>();
        request.put("textQuery", searchQuery(context));
        request.put("languageCode", "ko");
        request.put("regionCode", "KR");
        request.put("pageSize", Math.min(20, Math.max(context.maxResults() * CANDIDATE_MULTIPLIER, 10)));
        if (context.latitude() != null && context.longitude() != null) {
            request.put("locationBias", Map.of("circle", Map.of(
                    "center", Map.of("latitude", context.latitude(), "longitude", context.longitude()),
                    "radius", 50_000)));
        }
        return request;
    }

    private String searchQuery(VenueRecommendationContext context) {
        String region = text(context.departureLocation());
        String conditions = text(context.requiredConditions());
        String venueType = context.workshopType() == WorkshopType.OVERNIGHT
                ? "숙박 가능한 호텔 리조트 연수원"
                : "기업 워크숍 장소";
        return String.join(" ", List.of(region, venueType, conditions)).trim();
    }

    private List<VenueCandidate> filterByWorkshopType(
            List<VenueCandidate> candidates, VenueRecommendationContext context) {
        if (context.workshopType() != WorkshopType.OVERNIGHT) return candidates;
        return candidates.stream().filter(this::isOvernightVenue).toList();
    }

    private boolean isOvernightVenue(VenueCandidate candidate) {
        String value = (candidate.name() + " " + candidate.category()).toLowerCase(Locale.ROOT);
        boolean excluded = containsAny(value, "뷔페", "공유 오피스", "공유오피스", "코워킹", "회의실", "음식점");
        boolean overnight = containsAny(
                value, "호텔", "리조트", "연수원", "펜션", "콘도", "숙박", "호스텔", "게스트하우스");
        return overnight && !excluded;
    }

    private boolean containsAny(String value, String... keywords) {
        for (String keyword : keywords) {
            if (value.contains(keyword)) return true;
        }
        return false;
    }

    private String text(String value) {
        return value == null ? "" : value.trim();
    }

    private List<VenueCandidate> parse(JsonNode response) {
        List<VenueCandidate> candidates = new ArrayList<>();
        if (response == null) return candidates;
        response.path("places").forEach(place -> {
            String placeId = place.path("id").asText();
            String name = place.path("displayName").path("text").asText();
            String address = place.path("formattedAddress").asText();
            if (placeId.isBlank() || name.isBlank() || address.isBlank()) return;
            candidates.add(new VenueCandidate(
                    placeId, name, address,
                    place.path("primaryTypeDisplayName").path("text").asText("기타"),
                    nullableDouble(place.path("location"), "latitude"),
                    nullableDouble(place.path("location"), "longitude"),
                    nullableDouble(place, "rating"), nullableInt(place, "userRatingCount"),
                    place.path("googleMapsUri").asText(), firstPhotoName(place), photoAttributions(place)));
        });
        return List.copyOf(candidates);
    }

    private Double nullableDouble(JsonNode node, String field) {
        return node.hasNonNull(field) ? node.path(field).asDouble() : null;
    }

    private Integer nullableInt(JsonNode node, String field) {
        return node.hasNonNull(field) ? node.path(field).asInt() : null;
    }

    private String firstPhotoName(JsonNode place) {
        JsonNode photos = place.path("photos");
        return photos.isArray() && !photos.isEmpty() ? photos.path(0).path("name").asText() : "";
    }

    private List<String> photoAttributions(JsonNode place) {
        JsonNode photos = place.path("photos");
        if (!photos.isArray() || photos.isEmpty()) return List.of();
        List<String> values = new ArrayList<>();
        photos.path(0).path("authorAttributions").forEach(attribution -> {
            String name = attribution.path("displayName").asText();
            if (!name.isBlank()) values.add(name);
        });
        return List.copyOf(values);
    }
}
