package com.ssu.DB_Project.news.repository;

import com.ssu.DB_Project.news.domain.NewsCategory;
import com.ssu.DB_Project.news.domain.NewsCategoryId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NewsCategoryRepository extends JpaRepository<NewsCategory, NewsCategoryId> {
}
