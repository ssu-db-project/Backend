package com.ssu.DB_Project.user.domain;

import com.ssu.DB_Project.category.domain.Category;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "User_Categories")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@IdClass(UserCategoryId.class)
public class UserCategory {
    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id") // DB의 'user_id' 컬럼과 매핑
    private User user;

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id") // DB의 'category_id' 컬럼과 매핑
    private Category category;
}
