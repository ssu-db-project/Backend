package com.ssu.DB_Project.announcement.domain;

import com.ssu.DB_Project.common.BaseEntity;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import com.ssu.DB_Project.announcement.domain.AnnouncementDepartment;

@Entity
@Table(name = "announcement",
    uniqueConstraints = @UniqueConstraint(columnNames = {"source", "original_id"}))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Announcement extends BaseEntity {

    @Id
    @Column(length = 20)
    private String id;

//    @Column(length = 50, nullable = false)
//    private String source;

    @Column(name = "original_id", length = 100, nullable = false)
    private String originalId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private AnnouncementCategory category;

//    @ManyToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "department_id")
//    private AnnouncementDepartment department;
    @Column(name = "department_name", length = 100)
    private String departmentName;


    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    @Column(columnDefinition = "TEXT")
    private String summary;

    @Column(length = 512, nullable = false, unique = true)
    private String url;

    @Column(name = "posted_at")
    private LocalDateTime postedAt;

    @Column(length = 50)
    private String status;

    // 첨부파일 관계 (OneToMany)
    @OneToMany(mappedBy = "announcement", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<AnnouncementFile> files = new ArrayList<>();

    // 편의 메서드: 첨부파일 추가
    public void addFile(AnnouncementFile file) {
        this.files.add(file);
        file.setAnnouncement(this);
    }

    // 편의 메서드: 첨부파일 제거
    public void removeFile(AnnouncementFile file) {
        this.files.remove(file);
        file.setAnnouncement(null);
    }
}
