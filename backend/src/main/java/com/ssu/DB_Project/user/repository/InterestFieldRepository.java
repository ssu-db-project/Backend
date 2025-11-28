package com.ssu.DB_Project.user.repository;

import com.ssu.DB_Project.user.domain.InterestField;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InterestFieldRepository extends JpaRepository<InterestField, String> {
    List<InterestField> findByNameIn(List<String> names);
}
