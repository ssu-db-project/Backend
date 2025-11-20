package com.ssu.DB_Project.user.domain;

import com.ssu.DB_Project.announcement.domain.AnnouncementCategory;
import com.ssu.DB_Project.common.BaseEntity;
import com.ssu.DB_Project.university.domain.Department;
import com.ssu.DB_Project.user.domain.enums.EnrollmentStatus;
import com.ssu.DB_Project.user.domain.enums.Gender;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User extends BaseEntity{

    @Id
    @Column(length = 20)
    private String id;

    @Column(nullable = false)
    private String password;

    @Column(length = 100)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(length = 10)
    private Gender gender;

    @Column(name = "military_status")
    private Boolean militaryStatus;

    private Short grade;

    @Column(name = "current_semester")
    private Short currentSemester;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id")
    private Department department;

    @Enumerated(EnumType.STRING)
    @Column(name = "enrollment_status", length = 20)
    private EnrollmentStatus enrollmentStatus;

    private String residence;

    // 관심 공지 카테고리 (OneToMany - 중간 테이블 엔티티 사용)
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    @Builder.Default
    private Set<UserInterestCategory> interestCategories = new HashSet<>();

    // 관심 분야 (OneToMany - 중간 테이블 엔티티 사용)
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    @Builder.Default
    private Set<UserInterestField> interestFields = new HashSet<>();

    // 편의 메서드: 관심 카테고리 추가
    public void addInterestCategory(AnnouncementCategory category) {
        UserInterestCategory userInterestCategory = UserInterestCategory.builder()
            .user(this)
            .category(category)
            .build();
        this.interestCategories.add(userInterestCategory);
    }

    // 편의 메서드: 관심 카테고리 제거
    public void removeInterestCategory(AnnouncementCategory category) {
        this.interestCategories.removeIf(uic ->
            uic.getCategory().equals(category));
    }

    // 편의 메서드: 관심 분야 추가
    public void addInterestField(InterestField field) {
        UserInterestField userInterestField = UserInterestField.builder()
            .user(this)
            .field(field)
            .build();
        this.interestFields.add(userInterestField);
    }

    // 편의 메서드: 관심 분야 제거
    public void removeInterestField(InterestField field) {
        this.interestFields.removeIf(uif ->
            uif.getField().equals(field));
    }
}
