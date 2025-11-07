package com.ssu.DB_Project.news.repository;

import com.ssu.DB_Project.news.domain.NewsPolicyTag;
import com.ssu.DB_Project.news.domain.NewsPolicyTagId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NewsPolicyTagRepository extends JpaRepository<NewsPolicyTag, NewsPolicyTagId> {
}
