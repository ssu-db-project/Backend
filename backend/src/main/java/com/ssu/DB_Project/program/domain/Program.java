package com.ssu.DB_Project.program.domain;

import com.ssu.DB_Project.common.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

@Entity
@Table(name = "program")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Program extends BaseEntity {

    @Id
    @Column(length = 20)
    private String id;

    @Column(nullable = false)
    private String title;

    private String subtitle;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private ProgramCategory category;

//    @ManyToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "organization_id")
//    private ProgramOrganization organization;
<<<<<<< HEAD:backend/src/main/java/com/ssu/DB_Project/program/domain/Program.java

    @Column(name = "organization_name")
    private String organizationName;
=======
    @Column(name = "organization_name", length = 100)
    private String organizationName;

>>>>>>> ccb29fab (program_organization deleted):src/main/java/com/ssu/DB_Project/program/domain/Program.java

    @Column(name = "operation_method", length = 50)
    private String operationMethod;

    @Column(name = "apply_start_at")
    private LocalDateTime applyStartAt;

    @Column(name = "apply_end_at")
    private LocalDateTime applyEndAt;

    @Column(name = "program_start_at")
    private LocalDateTime programStartAt;

    @Column(name = "program_end_at")
    private LocalDateTime programEndAt;

    private String location;

    @Column(name = "target_audience", columnDefinition = "TEXT")
    private String targetAudience;

    private Integer capacity;

    @Column(columnDefinition = "TEXT")
    private String content;

    @Column(name = "original_url", length = 512, nullable = false, unique = true)
    private String originalUrl;

    // 편의 메서드: 신청 기간 체크
    public boolean isApplyPeriod() {
        LocalDateTime now = LocalDateTime.now();
        if (applyStartAt == null || applyEndAt == null) {
            return false;
        }
        return now.isAfter(applyStartAt) && now.isBefore(applyEndAt);
    }

    // 편의 메서드: 프로그램 진행 중인지 체크
    public boolean isInProgress() {
        LocalDateTime now = LocalDateTime.now();
        if (programStartAt == null || programEndAt == null) {
            return false;
        }
        return now.isAfter(programStartAt) && now.isBefore(programEndAt);
    }
}
