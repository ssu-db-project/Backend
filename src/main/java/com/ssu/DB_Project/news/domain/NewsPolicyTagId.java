package com.ssu.DB_Project.news.domain;

import lombok.*;

import java.io.Serializable;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode // equals, hashCode 오버라이딩 필수
public class NewsPolicyTagId implements Serializable {
    private Long news; // News 엔티티의 id
    private Long policy; // Policy 엔티티의 id
}
