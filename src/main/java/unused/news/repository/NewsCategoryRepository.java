package unused.news.repository;

import unused.news.domain.NewsCategory;
import unused.news.domain.NewsCategoryId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NewsCategoryRepository extends JpaRepository<NewsCategory, NewsCategoryId> {
}
