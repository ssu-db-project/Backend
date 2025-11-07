package com.ssu.DB_Project.user.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "Users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id // 슈퍼키
    @Column(name = "id") //
    private String id; // 로그인 ID

    @Column(name = "name", nullable = false) // 최종 SQL의 'name' 컬럼
    private String name; // 사용자 이름

    @Column(name = "password_hash", nullable = false)
    private String password; // 로그인 비밀번호

    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    // 기본 인적 정보
    private Integer age;
    private String gender;
    private String location;
    private String job;

    // 상세 인적 정보 (맞춤형 추천용)
    @Column(name = "marital_status")
    private String maritalStatus;

    @Column(name = "income_quintile")
    private Integer incomeQuintile;

    @Column(name = "household_type")
    private String householdType;

    @Column(name = "housing_status")
    private String housingStatus;

    // 학생 전용 정보
    @Column(name = "school_level")
    private String schoolLevel;

    @Column(name = "school_location")
    private String schoolLocation;

    @Column(name = "school_system")
    private String schoolSystem;
}
