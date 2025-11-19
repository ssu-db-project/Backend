package com.ssu.DB_Project.policy.controller;

import com.ssu.DB_Project.policy.domain.Policy;
import com.ssu.DB_Project.policy.dto.PolicyProcessRequest;
import com.ssu.DB_Project.policy.service.PolicyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/policy")
@RequiredArgsConstructor
public class PolicyController {

    private final PolicyService policyService;

    /**
     * 크롤러가 수집한 정책 원문을 받아 AI로 가공하고 RDB에 저장합니다.
     * (DTO 주석에 기재된 /api/process-policy 와 일치시킵니다)
     */
    @PostMapping("/process")
    public ResponseEntity<Policy> processPolicy(@RequestBody PolicyProcessRequest request) {
        // PolicyService의 processAndSave 메서드 호출
        Policy savedPolicy = policyService.processAndSave(request);
        return ResponseEntity.ok(savedPolicy);
    }
}