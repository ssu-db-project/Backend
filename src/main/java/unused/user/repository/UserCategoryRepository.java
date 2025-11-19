package unused.user.repository;

import unused.user.domain.UserCategory;
import unused.user.domain.UserCategoryId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserCategoryRepository extends JpaRepository<UserCategory, UserCategoryId> {
}
