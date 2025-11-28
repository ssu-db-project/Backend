/**
 * 숭실대학교 공지사항 플랫폼 - 공지사항 유틸리티
 * 
 * 공지사항 관련 유틸리티 함수를 제공합니다.
 */

import { NoticeInfo, UserProfile, NoticeFilters } from '../types';

/**
 * 사용자 프로필에 맞는 공지사항 필터링
 * 
 * @param notices - 전체 공지사항 목록
 * @param userProfile - 사용자 프로필
 * @returns 필터링된 공지사항 목록
 */
export function filterNoticesByProfile(
  notices: NoticeInfo[],
  userProfile: UserProfile
): NoticeInfo[] {
  return notices.filter((notice) => {
    // 관심 분야 필터링
    if (!userProfile.interests.includes(notice.category)) {
      return false;
    }

    // 대상 학과 필터링
    if (
      notice.targetDepartments &&
      notice.targetDepartments.length > 0 &&
      !notice.targetDepartments.includes(userProfile.department)
    ) {
      return false;
    }

    // 대상 학년 필터링
    if (
      notice.targetGrades &&
      notice.targetGrades.length > 0 &&
      userProfile.grade &&
      !notice.targetGrades.includes(userProfile.grade)
    ) {
      return false;
    }

    // 대상 성별 필터링
    if (
      notice.targetGender &&
      notice.targetGender !== 'all' &&
      notice.targetGender !== userProfile.gender
    ) {
      return false;
    }

    return true;
  });
}

/**
 * 공지사항 필터 조건 적용
 * 
 * @param notices - 공지사항 목록
 * @param filters - 필터 조건
 * @returns 필터링된 공지사항 목록
 */
export function applyNoticeFilters(
  notices: NoticeInfo[],
  filters: NoticeFilters
): NoticeInfo[] {
  let filtered = [...notices];

  if (filters.searchQuery) {
    const query = filters.searchQuery.toLowerCase();
    filtered = filtered.filter(
      (notice) =>
        notice.title.toLowerCase().includes(query) ||
        notice.description.toLowerCase().includes(query)
    );
  }

  if (filters.categories && filters.categories.length > 0) {
    filtered = filtered.filter((notice) =>
      filters.categories!.includes(notice.category)
    );
  }

  if (filters.deadlineWithin) {
    const today = new Date();
    filtered = filtered.filter((notice) => {
      if (!notice.deadline) return false;
      const deadline = new Date(notice.deadline);
      const diffDays = Math.ceil(
        (deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      );
      return diffDays >= 0 && diffDays <= filters.deadlineWithin!;
    });
  }

  if (filters.recentDays) {
    const today = new Date();
    filtered = filtered.filter((notice) => {
      const postDate = new Date(notice.date);
      const diffDays = Math.ceil(
        (today.getTime() - postDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      return diffDays <= filters.recentDays!;
    });
  }

  if (filters.departments && filters.departments.length > 0) {
    filtered = filtered.filter(
      (notice) =>
        !notice.targetDepartments ||
        notice.targetDepartments.length === 0 ||
        notice.targetDepartments.some((dept) =>
          filters.departments!.includes(dept)
        )
    );
  }

  if (filters.grades && filters.grades.length > 0) {
    filtered = filtered.filter(
      (notice) =>
        !notice.targetGrades ||
        notice.targetGrades.length === 0 ||
        notice.targetGrades.some((grade) => filters.grades!.includes(grade))
    );
  }

  return filtered;
}

/**
 * 공지사항 정렬
 * 
 * @param notices - 공지사항 목록
 * @param sortBy - 정렬 방식: 'latest' | 'deadline' | 'views'
 * @returns 정렬된 공지사항 목록
 */
export function sortNotices(
  notices: NoticeInfo[],
  sortBy: 'latest' | 'deadline' | 'views' = 'latest'
): NoticeInfo[] {
  const sorted = [...notices];

  switch (sortBy) {
    case 'latest':
      return sorted.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );

    case 'deadline':
      return sorted.sort((a, b) => {
        if (!a.deadline && !b.deadline) return 0;
        if (!a.deadline) return 1;
        if (!b.deadline) return -1;
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      });

    case 'views':
      return sorted.sort((a, b) => (b.views || 0) - (a.views || 0));

    default:
      return sorted;
  }
}

/**
 * 공지사항 마감일까지 남은 일수 계산
 * 
 * @param deadline - 마감일 (YYYY-MM-DD 형식)
 * @returns 남은 일수 (마감일이 없거나 지났으면 null)
 */
export function getDaysUntilDeadline(deadline?: string): number | null {
  if (!deadline) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const deadlineDate = new Date(deadline);
  deadlineDate.setHours(0, 0, 0, 0);

  const diffTime = deadlineDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays >= 0 ? diffDays : null;
}

/**
 * 공지사항 마감 임박 여부 확인
 * 
 * @param deadline - 마감일 (YYYY-MM-DD 형식)
 * @param warningDays - 마감 임박 기준 일수 (기본값: 7일)
 * @returns 마감 임박이면 true
 */
export function isDeadlineNear(
  deadline?: string,
  warningDays: number = 7
): boolean {
  const daysLeft = getDaysUntilDeadline(deadline);
  return daysLeft !== null && daysLeft <= warningDays;
}

/**
 * 공지사항 새 글 여부 확인
 * 
 * @param date - 게시일 (YYYY-MM-DD 형식)
 * @param newDays - 새 글 기준 일수 (기본값: 3일)
 * @returns 새 글이면 true
 */
export function isNewNotice(date: string, newDays: number = 3): boolean {
  const today = new Date();
  const postDate = new Date(date);
  const diffDays = Math.ceil(
    (today.getTime() - postDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  return diffDays <= newDays;
}
