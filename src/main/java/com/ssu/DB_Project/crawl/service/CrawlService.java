package com.ssu.DB_Project.crawl.service;

import com.ssu.DB_Project.policy.repository.PolicyRepository;
import io.github.bonigarcia.wdm.WebDriverManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CrawlService {
    // 정책 저장
    @Autowired
    private PolicyRepository policyRepository;


}
