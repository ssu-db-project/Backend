package com.ssu.DB_Project.category.repository;

import com.ssu.DB_Project.category.domain.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Long> {
}
