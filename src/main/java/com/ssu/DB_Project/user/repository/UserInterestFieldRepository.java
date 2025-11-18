package com.ssu.DB_Project.user.repository;

import com.ssu.DB_Project.user.domain.UserInterestField;
import com.ssu.DB_Project.user.domain.UserInterestFieldId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserInterestFieldRepository extends JpaRepository<UserInterestField, UserInterestFieldId> {

}
