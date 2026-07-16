package com.raonmate.backend.global.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI raonMateOpenApi() {
        return new OpenAPI().info(new Info()
                .title("라온 메이트 API")
                .description("구성원 의견을 수집하고 워크숍 후보안을 만드는 AI 워크숍 조율 서비스 API")
                .version("v1")
                .contact(new Contact().name("Raon Mate"))
                .license(new License().name("Demo Use Only")));
    }
}
