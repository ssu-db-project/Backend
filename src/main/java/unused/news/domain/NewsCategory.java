package unused.news.domain;

import unused.category.domain.Category;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "News_Categories")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@IdClass(NewsCategoryId.class)
public// 1번에서 만든 ID 클래스를 지정
class NewsCategory {
    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "news_id") // DB의 'news_id' 컬럼과 매핑
    private News news;

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id") // DB의 'category_id' 컬럼과 매핑
    private Category category;
}