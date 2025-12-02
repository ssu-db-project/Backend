/**
 * 데이터 정제 API 서비스
 * 
 * 백엔드 API 명세:
 * - POST /api/announcement/crawl - 공지사항 원문 RAG 정제 및 저장
 * - POST /api/program/crawl - 비교과 프로그램 원문 RAG 정제 및 저장
 */

const API_BASE_URL = (import.meta as any).env.VITE_API_URL || 'http://localhost:8080/api';

/**
 * 공지사항 정제 요청 DTO
 */
export interface CrawlAnnouncementRequest {
  /** 원문 */
  originalText: string;
  /** URL */
  url: string;
  /** announcement_category table에 있는 항목 */
  categoryName: string;
  /** announcement_department table에 있는 부서명 */
  departmentName: string;
}

/**
 * 공지사항 카테고리 정보
 */
export interface AnnouncementCategory {
  /** 카테고리 ID */
  id: string;
  /** 카테고리 이름 (announcement_category table 항목) */
  name: string;
}

/**
 * 공지사항 부서 정보
 */
export interface AnnouncementDepartment {
  /** 부서 ID */
  id: string;
  /** 부서명 (announcement_department table 항목) */
  name: string;
}

/**
 * 공지사항 정제 응답 DTO
 */
export interface CrawlAnnouncementResponse {
  /** 공지사항이 시스템에 저장된 시각 (ISO datetime) */
  createdAt: string;
  /** 공지 고유 ID (서비스 내부 관리용) */
  id: string;
  /** 작성 부서 */
  source?: string;
  /** 원본 게시글 번호 */
  originalId?: string;
  /** 공지 카테고리 정보 */
  category: AnnouncementCategory;
  /** 부서 정보 */
  department: AnnouncementDepartment;
  /** 공지 제목 */
  title: string;
  /** 공지 원문 내용 (multiline) */
  content: string;
  /** 공지 요약 내용 */
  summary: string;
  /** 원본 공지 URL */
  url: string;
  /** 학교 사이트에 실제 게시된 날짜/시간 (ISO datetime) */
  postedAt: string;
  /** 공지 상태 */
  status: string;
  /** 첨부 파일 목록 */
  files: any[];
}

/**
 * 비교과 프로그램 정제 요청 DTO
 */
export interface CrawlProgramRequest {
  /** 원문 (multiline) */
  originalText: string;
  /** URL */
  url: string;
  /** 프로그램 카테고리 이름 */
  categoryName: string;
  /** 프로그램 운영 기관 */
  organizationName: string;
}

/**
 * 비교과 프로그램 카테고리 정보
 */
export interface ProgramCategory {
  /** 카테고리 ID */
  id: string;
  /** 카테고리 이름 */
  name: string;
}

/**
 * 비교과 프로그램 정제 응답 DTO
 */
export interface CrawlProgramResponse {
  /** 프로그램 정보가 DB에 생성된 시간 (ISO datetime) */
  createdAt: string;
  /** 프로그램 고유 ID (예: prg_123456789) */
  id: string;
  /** 프로그램 제목 */
  title: string;
  /** 프로그램 부제목 (선택) */
  subtitle?: string;
  /** 프로그램 카테고리 객체 */
  category: ProgramCategory;
  /** 프로그램 주관 기관 이름 */
  organizationName: string;
  /** 프로그램 운영 방식 또는 신청 방식 (예: 온라인, 이메일 제출 등) */
  operationMethod: string;
  /** 신청 시작 날짜/시간 (ISO datetime) */
  applyStartAt: string;
  /** 신청 종료 날짜/시간 (ISO datetime) */
  applyEndAt: string;
  /** 프로그램 시작 날짜/시간 (ISO datetime) */
  programStartAt: string;
  /** 프로그램 종료 날짜/시간 (ISO datetime) */
  programEndAt: string;
  /** 프로그램 활동 장소 */
  location: string;
  /** 대상자 (예: 학부생, 특정 학년 등) */
  targetAudience: string;
  /** 모집 정원 */
  capacity: number;
  /** 프로그램 상세 내용 */
  content: string;
  /** 원본 URL */
  originalUrl: string;
  /** 현재 신청 기간인지 여부 (서버 계산 값) */
  applyPeriod: boolean;
  /** 프로그램이 현재 진행 중인지 여부 (서버 계산 값) */
  inProgress: boolean;
}

/**
 * 공지사항 원문 RAG 정제 및 저장
 * 
 * POST /api/announcement/crawl
 * 
 * @param request - 공지사항 원문 정제 요청
 * @returns GPT 처리 결과 (정제된 공지사항 데이터)
 * @throws 400 Bad Request - 잘못된 요청
 * @throws 401 Unauthorized - 인증되지 않은 사용자
 * 
 * @example
 * const result = await crawlAnnouncement({
 *   originalText: "[2025학년도 1학기 수강신청 안내]\n\n□ 게시물 정보\n...",
 *   url: "https://ssu.ac.kr/notice/2025-00123",
 *   categoryName: "학사",
 *   departmentName: "소프트웨어학부"
 * });
 * // result.id: "2025-00123"
 * // result.title: "2025학년도 1학기 수강신청 안내"
 * // result.summary: "2025학년도 1학기 수강신청 일정 및 유의사항 안내"
 */
export async function crawlAnnouncement(
  request: CrawlAnnouncementRequest
): Promise<CrawlAnnouncementResponse> {
  const response = await fetch(`${API_BASE_URL}/announcement/crawl`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // 세션 쿠키 포함
    body: JSON.stringify(request),
  });

  if (response.status === 400) {
    throw new Error('잘못된 요청입니다.');
  }
  if (response.status === 401) {
    throw new Error('로그인이 필요합니다.');
  }
  if (!response.ok) {
    throw new Error('공지사항 정제에 실패했습니다.');
  }

  return response.json();
}

/**
 * 비교과 프로그램 원문 RAG 정제 및 저장
 * 
 * POST /api/program/crawl
 * 
 * @param request - 비교과 프로그램 원문 정제 요청
 * @returns GPT 처리 결과 (정제된 프로그램 데이터)
 * @throws 400 Bad Request - 잘못된 요청
 * @throws 401 Unauthorized - 인증되지 않은 사용자
 * 
 * @example
 * const result = await crawlProgram({
 *   originalText: "[2025학년도 1학기 소프트웨어학부 자동차 AI 연구 인턴 모집]\n...",
 *   url: "https://ssu.ac.kr/notice/2025-auto-ai-001",
 *   categoryName: "특강/워크숍",
 *   organizationName: "소프트웨어학부"
 * });
 * // result.id: "prg_1764251958175"
 * // result.title: "자동차 AI 연구 인턴십"
 * // result.capacity: 10
 * // result.applyPeriod: false
 * // result.inProgress: false
 */
export async function crawlProgram(
  request: CrawlProgramRequest
): Promise<CrawlProgramResponse> {
  const response = await fetch(`${API_BASE_URL}/program/crawl`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // 세션 쿠키 포함
    body: JSON.stringify(request),
  });

  if (response.status === 400) {
    throw new Error('잘못된 요청입니다.');
  }
  if (response.status === 401) {
    throw new Error('로그인이 필요합니다.');
  }
  if (!response.ok) {
    throw new Error('프로그램 정제에 실패했습니다.');
  }

  return response.json();
}
