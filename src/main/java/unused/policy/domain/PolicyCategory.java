package unused.policy.domain;

import unused.category.domain.Category;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "Policy_Categories")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@IdClass(PolicyCategoryId.class)
public class PolicyCategory {

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "policy_id") // DB의 'policy_id' 컬럼과 매핑
    private Policy policy;

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id") // DB의 'category_id' 컬럼과 매핑
    private Category category;
}