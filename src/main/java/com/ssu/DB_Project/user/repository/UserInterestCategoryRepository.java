package com.ssu.DB_Project.user.repository;

import com.ssu.DB_Project.user.domain.UserInterestCategory;
import com.ssu.DB_Project.user.domain.UserInterestCategoryId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserInterestCategoryRepository extends JpaRepository<UserInterestCategory, UserInterestCategoryId> {

}
