/**
 * 숭실대학교 공지사항 플랫폼 - 타입 정의
 * 
 * 이 파일은 플랫폼 전체에서 사용되는 TypeScript 타입을 정의합니다.
 */

/**
 * 사용자 프로필 정보 (Supabase 'profiles' 테이블)
 */
export interface UserProfile {
  username: string;        // 사용자 아이디 (변경 불가)
  name?: string;           // 이름 (선택)
  gender: string;          // 성별: 'male' | 'female'
  hasMilitary: string;     // 군필 여부: 'yes' | 'no' | 'exempt' | 'notApplicable'
  grade: string | null;    // 학년: '1'~'4' | 'graduate' (졸업생 null)
  department: string;      // 학과
  college: string;         // 단과대학
  status: string;          // 재학 상태: 'enrolled' | 'leave' | 'graduated'
  semester: string | null; // 학기 (졸업생 null)
  location: string;        // 거주지: '시/도 시/군/구'
  interests: string[];     // 관심 분야 (최대 3개)
}

/**
 * 공지사항 정보 (Supabase 'notices' 테이블)
 */
export interface NoticeInfo {
  id: string;
  title: string;
  category: string;        // 카테고리: '학사' | '장학' | '국제교류' 등
  date: string;            // 게시일 (YYYY-MM-DD)
  deadline?: string;       // 마감일 (YYYY-MM-DD)
  description: string;
  link: string;            // 원본 공지사항 링크
  targetDepartments?: string[];
  targetGrades?: string[];
  targetGender?: string;   // 'male' | 'female' | 'all'
  views?: number;
}

/**
 * AI 챗봇 메시지
 */
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

/**
 * 공지사항 필터 옵션
 */
export interface NoticeFilters {
  searchQuery?: string;
  categories?: string[];
  deadlineWithin?: number;
  recentDays?: number;
  departments?: string[];
  grades?: string[];
  sortBy?: 'latest' | 'deadline' | 'views';
}

/**
 * 북마크 정보 (Supabase 'bookmarks' 테이블)
 */
export interface Bookmark {
  username: string;
  noticeId: string;
  createdAt: Date;
}
