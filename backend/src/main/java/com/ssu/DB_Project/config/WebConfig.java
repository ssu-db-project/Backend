package com.ssu.DB_Project.config; // 프로젝트의 실제 패키지 경로로 변경

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**") // 프로젝트의 API 경로 (UserController, AnnouncementController 등에 적용)
                // ⚠️ 로컬 프론트엔드 주소 (대부분 React/Vue/NextJS는 3000번 포트 사용)
                .allowedOrigins("http://localhost:3000", "http://127.0.0.1:3000")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH")
                .allowedHeaders("*")
                .allowCredentials(true); // 세션(로그인)을 사용하므로 필수
    }
}