package unused.policy.repository;

import unused.policy.domain.PolicyCategory;
import unused.policy.domain.PolicyCategoryId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PolicyCategoryRepository extends JpaRepository<PolicyCategory, PolicyCategoryId> {
}
