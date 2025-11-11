package com.ssu.DB_Project.user.domain;

import jakarta.persistence.Entity;
import lombok.*;

import java.io.Serializable;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class UserCategoryId implements Serializable {
    private String user; // User 엔티티의 id
    private Long category; // Category 엔티티의 id
}
