package unused.news.repository;

import unused.news.domain.NewsPolicyTag;
import unused.news.domain.NewsPolicyTagId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NewsPolicyTagRepository extends JpaRepository<NewsPolicyTag, NewsPolicyTagId> {
}
