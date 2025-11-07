package com.ssu.DB_Project.policy.repository;

import com.ssu.DB_Project.policy.domain.Policy;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PolicyRepository extends JpaRepository<Policy, Long> {
}
