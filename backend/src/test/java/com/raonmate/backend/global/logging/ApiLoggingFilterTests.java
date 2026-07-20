package com.raonmate.backend.global.logging;

import static org.assertj.core.api.Assertions.assertThat;

import jakarta.servlet.FilterChain;
import java.nio.charset.StandardCharsets;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.test.util.ReflectionTestUtils;
import tools.jackson.databind.ObjectMapper;

class ApiLoggingFilterTests {

    @Test
    void preservesResponseBodyAfterLogging() throws Exception {
        ApiLoggingFilter filter = filter();
        MockHttpServletRequest request = new MockHttpServletRequest("POST", "/api/workshops");
        request.setContentType("application/json");
        request.setContent("{\"name\":\"워크숍\"}".getBytes(StandardCharsets.UTF_8));
        MockHttpServletResponse response = new MockHttpServletResponse();
        FilterChain chain = (servletRequest, servletResponse) -> {
            servletResponse.setContentType("application/json");
            servletResponse.getWriter().write("{\"id\":\"workshop-1\"}");
        };

        filter.doFilter(request, response, chain);

        assertThat(response.getContentAsString()).isEqualTo("{\"id\":\"workshop-1\"}");
        assertThat(response.getStatus()).isEqualTo(200);
    }

    @Test
    void skipsNonApiRequests() throws Exception {
        ApiLoggingFilter filter = filter();
        MockHttpServletRequest request = new MockHttpServletRequest("GET", "/actuator/health");
        MockHttpServletResponse response = new MockHttpServletResponse();
        FilterChain chain = (servletRequest, servletResponse) ->
                servletResponse.getWriter().write("healthy");

        filter.doFilter(request, response, chain);

        assertThat(response.getContentAsString()).isEqualTo("healthy");
    }

    private ApiLoggingFilter filter() {
        ApiLoggingFilter filter = new ApiLoggingFilter(new ObjectMapper());
        ReflectionTestUtils.setField(filter, "maxBodyLength", 10_000);
        return filter;
    }
}
