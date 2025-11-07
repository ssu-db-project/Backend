package com.ssu.DB_Project.news.domain;

import com.ssu.DB_Project.policy.domain.Policy;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "News_Policy_Tags")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@IdClass(NewsPolicyTagId.class) // 1번에서 만든 ID 클래스를 지정
public class NewsPolicyTag {

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "news_id") // DB의 'news_id' 컬럼과 매핑
    private News news;

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "policy_id") // DB의 'policy_id' 컬럼과 매핑
    private Policy policy;
}