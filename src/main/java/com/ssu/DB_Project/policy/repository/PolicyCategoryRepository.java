package com.ssu.DB_Project.policy.repository;

import com.ssu.DB_Project.policy.domain.PolicyCategory;
import com.ssu.DB_Project.policy.domain.PolicyCategoryId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PolicyCategoryRepository extends JpaRepository<PolicyCategory, PolicyCategoryId> {
}
