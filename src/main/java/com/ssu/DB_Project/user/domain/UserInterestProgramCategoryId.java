package com.ssu.DB_Project.user.domain;

import java.io.Serializable;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class UserInterestProgramCategoryId implements Serializable {
    private String user;     // User 엔티티의 id
    private String category; // 비교과 ProgramCategory 엔티티의 id
}
