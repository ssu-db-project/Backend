package com.ssu.DB_Project.user.repository;

import com.ssu.DB_Project.user.domain.UserCategory;
import com.ssu.DB_Project.user.domain.UserCategoryId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserCategoryRepository extends JpaRepository<UserCategory, UserCategoryId> {
}
