package com.ssu.DB_Project.news.repository;

import com.ssu.DB_Project.news.domain.News;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NewsRepository extends JpaRepository<News, Long> {
}
