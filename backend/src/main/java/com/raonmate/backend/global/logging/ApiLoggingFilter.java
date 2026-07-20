package com.raonmate.backend.global.logging;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.util.Iterator;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.util.ContentCachingRequestWrapper;
import org.springframework.web.util.ContentCachingResponseWrapper;
import tools.jackson.core.JacksonException;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;
import tools.jackson.databind.node.ObjectNode;

@Component
@RequiredArgsConstructor
public class ApiLoggingFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(ApiLoggingFilter.class);
    private static final String MASK = "***";
    private static final Set<String> SENSITIVE_FIELDS = Set.of(
            "password", "passwd", "token", "accesstoken", "refreshtoken",
            "authorization", "apikey", "secret", "webhookurl"
    );

    private final ObjectMapper objectMapper;

    @Value("${app.api-logging.max-body-length:10000}")
    private int maxBodyLength;

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        return !request.getRequestURI().startsWith("/api/");
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {
        ContentCachingRequestWrapper cachedRequest = new ContentCachingRequestWrapper(request, maxBodyLength + 1);
        ContentCachingResponseWrapper cachedResponse = new ContentCachingResponseWrapper(response);
        long startedAt = System.nanoTime();

        try {
            filterChain.doFilter(cachedRequest, cachedResponse);
        } finally {
            long elapsedMillis = (System.nanoTime() - startedAt) / 1_000_000;
            log.info("API request method={} uri={} body={}",
                    request.getMethod(), requestUri(request), body(cachedRequest.getContentAsByteArray(), request.getContentType(), request.getCharacterEncoding()));
            log.info("API response method={} uri={} status={} durationMs={} body={}",
                    request.getMethod(), request.getRequestURI(), cachedResponse.getStatus(), elapsedMillis,
                    body(cachedResponse.getContentAsByteArray(), response.getContentType(), response.getCharacterEncoding()));
            cachedResponse.copyBodyToResponse();
        }
    }

    private String requestUri(HttpServletRequest request) {
        String query = request.getQueryString();
        return StringUtils.hasText(query) ? request.getRequestURI() + "?" + maskQuery(query) : request.getRequestURI();
    }

    private String maskQuery(String query) {
        String[] parameters = query.split("&");
        for (int i = 0; i < parameters.length; i++) {
            int separator = parameters[i].indexOf('=');
            String name = separator < 0 ? parameters[i] : parameters[i].substring(0, separator);
            if (isSensitive(name)) {
                parameters[i] = name + "=" + MASK;
            }
        }
        return String.join("&", parameters);
    }

    private String body(byte[] content, String contentType, String encoding) {
        if (content.length == 0) {
            return "-";
        }
        if (!isTextContent(contentType)) {
            return "<" + content.length + " bytes>";
        }

        Charset charset = resolveCharset(contentType, encoding);
        String value = new String(content, charset);
        if (isJson(contentType)) {
            value = maskJson(value);
        }
        return abbreviate(value);
    }

    private boolean isTextContent(String contentType) {
        if (!StringUtils.hasText(contentType)) {
            return true;
        }
        try {
            MediaType mediaType = MediaType.parseMediaType(contentType);
            return MediaType.APPLICATION_JSON.includes(mediaType)
                    || "text".equals(mediaType.getType())
                    || MediaType.APPLICATION_FORM_URLENCODED.includes(mediaType);
        } catch (IllegalArgumentException ignored) {
            return false;
        }
    }

    private boolean isJson(String contentType) {
        if (!StringUtils.hasText(contentType)) {
            return false;
        }
        try {
            MediaType mediaType = MediaType.parseMediaType(contentType);
            return MediaType.APPLICATION_JSON.includes(mediaType) || mediaType.getSubtype().endsWith("+json");
        } catch (IllegalArgumentException ignored) {
            return false;
        }
    }

    private String maskJson(String value) {
        try {
            JsonNode root = objectMapper.readTree(value);
            maskNode(root);
            return objectMapper.writeValueAsString(root);
        } catch (JacksonException ignored) {
            return value;
        }
    }

    private void maskNode(JsonNode node) {
        if (node instanceof ObjectNode objectNode) {
            Iterator<Map.Entry<String, JsonNode>> fields = objectNode.properties().iterator();
            while (fields.hasNext()) {
                Map.Entry<String, JsonNode> field = fields.next();
                if (isSensitive(field.getKey())) {
                    objectNode.put(field.getKey(), MASK);
                } else {
                    maskNode(field.getValue());
                }
            }
        } else if (node.isArray()) {
            node.forEach(this::maskNode);
        }
    }

    private boolean isSensitive(String fieldName) {
        String normalized = fieldName.toLowerCase(Locale.ROOT).replace("-", "").replace("_", "");
        return SENSITIVE_FIELDS.contains(normalized);
    }

    private Charset resolveCharset(String contentType, String encoding) {
        Charset contentTypeCharset = charsetFromContentType(contentType);
        if (contentTypeCharset != null) {
            return contentTypeCharset;
        }
        // RFC 8259 JSON payloads exchanged between systems are UTF-8. Servlet responses may
        // still report ISO-8859-1 when no charset was explicitly declared, so do not use that
        // default to decode JSON log bodies.
        if (isJson(contentType)) {
            return StandardCharsets.UTF_8;
        }
        try {
            return StringUtils.hasText(encoding) ? Charset.forName(encoding) : StandardCharsets.UTF_8;
        } catch (IllegalArgumentException ignored) {
            return StandardCharsets.UTF_8;
        }
    }

    private Charset charsetFromContentType(String contentType) {
        if (!StringUtils.hasText(contentType)) {
            return null;
        }
        try {
            return MediaType.parseMediaType(contentType).getCharset();
        } catch (IllegalArgumentException ignored) {
            return null;
        }
    }

    private String abbreviate(String value) {
        if (value.length() <= maxBodyLength) {
            return value;
        }
        return value.substring(0, maxBodyLength) + "...<truncated>";
    }
}
