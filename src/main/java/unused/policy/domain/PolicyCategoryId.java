package unused.policy.domain;

import lombok.*;

import java.io.Serializable;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode // equals, hashCode 오버라이딩 필수
public class PolicyCategoryId implements Serializable {
    private Long policy; // Policy 엔티티의 id
    private Long category; // Category 엔티티의 id
}