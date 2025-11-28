/**
 * 숭실대학교 공지사항 플랫폼 - 포맷팅 유틸리티
 * 
 * 데이터 포맷팅 관련 유틸리티 함수를 제공합니다.
 */

/**
 * 날짜를 포맷팅합니다.
 * 
 * @param dateString - 날짜 문자열 (YYYY-MM-DD 형식)
 * @param format - 포맷 형식: 'full' | 'short' | 'relative'
 * @returns 포맷팅된 날짜 문자열
 */
export function formatDate(
  dateString: string,
  format: 'full' | 'short' | 'relative' = 'full'
): string {
  const date = new Date(dateString);

  switch (format) {
    case 'full':
      return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

    case 'short':
      return date.toLocaleDateString('ko-KR', {
        year: '2-digit',
        month: '2-digit',
        day: '2-digit',
      });

    case 'relative': {
      const today = new Date();
      const diffTime = today.getTime() - date.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 0) return '오늘';
      if (diffDays === 1) return '어제';
      if (diffDays < 7) return `${diffDays}일 전`;
      if (diffDays < 30) return `${Math.floor(diffDays / 7)}주 전`;
      if (diffDays < 365) return `${Math.floor(diffDays / 30)}개월 전`;
      return `${Math.floor(diffDays / 365)}년 전`;
    }

    default:
      return dateString;
  }
}

/**
 * 마감일까지 남은 시간을 포맷팅합니다.
 * 
 * @param deadline - 마감일 (YYYY-MM-DD 형식)
 * @returns 포맷팅된 마감일 문자열
 */
export function formatDeadline(deadline: string): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const deadlineDate = new Date(deadline);
  deadlineDate.setHours(0, 0, 0, 0);

  const diffTime = deadlineDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return '마감';
  if (diffDays === 0) return 'D-Day';
  if (diffDays === 1) return 'D-1';
  return `D-${diffDays}`;
}

/**
 * 조회수를 포맷팅합니다.
 * 
 * @param views - 조회수
 * @returns 포맷팅된 조회수 문자열
 */
export function formatViews(views: number): string {
  if (views < 1000) return views.toString();
  if (views < 10000) return `${(views / 1000).toFixed(1)}K`;
  if (views < 1000000) return `${Math.floor(views / 1000)}K`;
  return `${(views / 1000000).toFixed(1)}M`;
}

/**
 * 카테고리명을 짧게 포맷팅합니다.
 * '비교과-' 접두사를 제거합니다.
 * 
 * @param category - 카테고리명
 * @returns 포맷팅된 카테고리명
 */
export function formatCategory(category: string): string {
  return category.replace('비교과-', '');
}

/**
 * 학년을 포맷팅합니다.
 * 
 * @param grade - 학년 값
 * @returns 포맷팅된 학년 문자열
 */
export function formatGrade(grade: string | null): string {
  if (!grade) return '-';
  if (grade === 'graduate') return '대학원';
  return `${grade}학년`;
}

/**
 * 학기를 포맷팅합니다.
 * 
 * @param semester - 학기 값
 * @returns 포맷팅된 학기 문자열
 */
export function formatSemester(semester: string | null): string {
  if (!semester) return '-';
  if (semester === '9+') return '9학기 이상';
  return `${semester}학기`;
}

/**
 * 재학 상태를 포맷팅합니다.
 * 
 * @param status - 재학 상태 값
 * @returns 포맷팅된 재학 상태 문자열
 */
export function formatStatus(status: string): string {
  const statusMap: Record<string, string> = {
    enrolled: '재학',
    leave: '휴학',
    graduated: '졸업',
  };
  return statusMap[status] || status;
}

/**
 * 성별을 포맷팅합니다.
 * 
 * @param gender - 성별 값
 * @returns 포맷팅된 성별 문자열
 */
export function formatGender(gender: string): string {
  const genderMap: Record<string, string> = {
    male: '남성',
    female: '여성',
  };
  return genderMap[gender] || gender;
}

/**
 * 군필 여부를 포맷팅합니다.
 * 
 * @param military - 군필 여부 값
 * @returns 포맷팅된 군필 여부 문자열
 */
export function formatMilitary(military: string): string {
  const militaryMap: Record<string, string> = {
    yes: '군필',
    no: '미필',
    exempt: '면제',
    notApplicable: '해당없음',
  };
  return militaryMap[military] || military;
}
