package unused.user.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "User_Details")
public class UserDetails {
    @Id // 1. PK
    @Column(name = "user_id")
    private String id; // User의 id와 동일한 값을 사용

    // 2. 1:1 관계의 주인
    @OneToOne(fetch = FetchType.LAZY)
    @MapsId // 3. id 필드를 User의 PK와 매핑
    @JoinColumn(name = "user_id")
    private User user;

    // --- 1. 기존 상세 정보 ---
    // private String job; // (Users 테이블과 중복되므로, Users.job을 쓸지 상의 필요)

    @Column(name = "marital_status")
    private String maritalStatus;

    @Column(name = "income_quintile")
    private Integer incomeQuintile;

    @Column(name = "housing_status")
    private String housingStatus;

    // --- 2. 학생 전용 정보 ---
    @Column(name = "school_level")
    private String schoolLevel;

    @Column(name = "school_location")
    private String schoolLocation;

    @Column(name = "school_system")
    private String schoolSystem;

    // --- 3. 소득/고용 형태 ---
    private Boolean isRegularWorker;

    private Boolean isIrregularWorker;

    private Boolean isPartTimer;

    private Boolean isSelfEmployed;

    private Boolean isJobSeeker;

    // --- 4. 가구 유형 ---
    @Column(name = "child_status")
    private String childStatus;

    private Boolean isGrandparentFamily;

    private Boolean isChildHeadFamily;

    private Boolean isExtendedFamily;

    private Boolean isFosterChild;

    private Boolean isAdoptedChild;

    private Boolean isInFacility;

    // --- 5. 창업/사업 ---
    private Boolean isSmallBusinessOwner;

    private Boolean isPreliminaryFounder;

    // --- 6. 기타 상황 ---
    private Boolean isInfertile;

    private Boolean isPostpartum;

    private Boolean isMovedIn;
}
