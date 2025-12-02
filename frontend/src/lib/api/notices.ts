/**
 * 공지사항/프로그램 조회 API 서비스
 * 
 * 백엔드 API 명세:
 * - GET /api/user/interest-announcements - 관심 공지사항 조회
 * - GET /api/user/interest-programs - 관심 비교과 프로그램 조회
 * - GET /api/announcement/{id} - 공지사항 단건 상세 조회
 * - POST /api/search - 공지/비교과 통합 검색
 */

const API_BASE_URL = (import.meta as any).env.VITE_API_URL || 'http://localhost:8080/api';

// 공지사항 DTO
export interface AnnouncementDto {
  id: number;
  title: string;
  content: string;
  summary: string;
  categoryName: string;
  departmentName: string;
  status: string;
  postedAt: string;
}

// 비교과 프로그램 DTO
export interface ProgramDto {
  id: string;
  title: string;
  subtitle: string;
  categoryName: string;
  organizationName: string;
  operationMethod: string;
  applyStartAt: string;
  applyEndAt: string;
  programStartAt: string;
  programEndAt: string;
  location: string;
  targetAudience: string;
  capacity: number;
  content: string;
  originalUrl: string;
}

// 첨부파일 DTO
export interface FileDto {
  id: number;
  fileUrl: string;
  fileName: string;
}

// 공지사항 상세 응답 DTO (백엔드 AnnouncementResponse)
export interface AnnouncementResponse {
  id: number;
  categoryName: string;
  departmentName: string;
  title: string;
  content: string;
  summary: string;
  url: string;
  postedAt: string;
  status: string;
  createdAt: string;
  files: FileDto[];
}

// 프로그램 상세 응답 DTO (백엔드 ProgramResponse)
export interface ProgramResponse {
  id: string;
  title: string;
  subtitle: string;
  categoryName: string;
  organizationName: string;
  operationMethod: string;
  applyStartAt: string;
  applyEndAt: string;
  programStartAt: string;
  programEndAt: string;
  location: string;
  targetAudience: string;
  capacity: number;
  content: string;
  originalUrl: string;
  createdAt: string;
}

// 검색 결과 DTO
export interface SearchResultDto {
  id: string;
  title: string;
  type: 'announcement' | 'program';
  sourceContent: string;
  similarity: number;
}

export interface ApiResponse<T> {
  message: string;
  data: T;
  success: boolean;
}

/**
 * 사용자 관심분야 공지사항 조회
 * @param category - 카테고리 필터 (선택사항)
 * @returns 공지사항 목록
 * 
 * Query Parameters:
 * - category (Optional): 특정 카테고리 필터링 (예: "장학")
 * - 미입력 시: 모든 관심 카테고리의 공지사항 반환
 * 
 * Response:
 * - id, title, content, summary
 * - categoryName, departmentName, status, postedAt
 */
export async function getInterestAnnouncements(category?: string): Promise<ApiResponse<AnnouncementDto[]>> {
  try {
    const url = new URL(`${API_BASE_URL}/user/interest-announcements`);
    if (category) {
      url.searchParams.append('category', category);
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `공지사항 조회 실패: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('공지사항 조회 오류:', error);
    throw error;
  }
}

/**
 * 사용자 관심분야 비교과 프로그램 조회
 * @param category - 카테고리 필터 (선택사항)
 * @returns 비교과 프로그램 목록
 * 
 * Query Parameters:
 * - category (Optional): 특정 카테고리 필터링 (예: "특강/워크숍")
 * - 미입력 시: 모든 관심 카테고리의 비교과 프로그램 반환
 * 
 * Response:
 * - id, title, subtitle, categoryName, organizationName
 * - operationMethod, location, targetAudience, capacity
 * - applyStartAt, applyEndAt, programStartAt, programEndAt
 * - content, originalUrl
 */
export async function getInterestPrograms(category?: string): Promise<ApiResponse<ProgramDto[]>> {
  try {
    const url = new URL(`${API_BASE_URL}/user/interest-programs`);
    if (category) {
      url.searchParams.append('category', category);
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `프로그램 조회 실패: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('프로그램 조회 오류:', error);
    throw error;
  }
}

/**
 * 공지사항 단건 상세 조회
 * 
 * GET /api/announcement/{announcementId}
 * 
 * @param id - 공지사항 고유 ID
 * @returns 공지사항 상세 정보
 * 
 * Response:
 * - ApiResponse<AnnouncementResponse> 형태로 반환
 * - id, categoryName, departmentName, title
 * - content (본문 전체), summary (AI 요약)
 * - url (원본 링크), postedAt, status, createdAt
 * - files[] (첨부파일 목록): id, fileUrl, fileName
 */
export async function getAnnouncementDetail(id: number): Promise<ApiResponse<AnnouncementResponse>> {
  try {
    const response = await fetch(`${API_BASE_URL}/announcement/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `공지사항 상세 조회 실패: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('공지사항 상세 조회 오류:', error);
    throw error;
  }
}

/**
 * 비교과 프로그램 단건 상세 조회
 * 
 * GET /api/program/{programId}
 * 
 * @param id - 프로그램 고유 ID
 * @returns 프로그램 상세 정보
 * 
 * Response:
 * - ApiResponse<ProgramResponse> 형태로 반환
 * - id, title, subtitle, categoryName, organizationName
 * - operationMethod, 신청/프로그램 기간
 * - location, targetAudience, capacity, content
 * - originalUrl, createdAt
 */
export async function getProgramDetail(id: string): Promise<ApiResponse<ProgramResponse>> {
  try {
    const response = await fetch(`${API_BASE_URL}/program/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `프로그램 상세 조회 실패: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('프로그램 상세 조회 오류:', error);
    throw error;
  }
}

/**
 * 공지/비교과 통합 검색
 * @param query - 검색 키워드
 * @returns 검색 결과 목록 (유사도 순으로 정렬)
 * 
 * Request:
 * - query (String, 필수): 검색 키워드 (예: "장학금")
 * 
 * Response: List<SearchResultDto>
 * - id: 공지/프로그램의 식별자
 * - title: 검색 결과 제목
 * - type: "announcement" 또는 "program"
 * - sourceContent: 원본 내용
 * - similarity: 검색 결과 유사도 (정렬에 사용)
 */
export async function searchAnnouncementsAndPrograms(query: string): Promise<SearchResultDto[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `검색 실패: ${response.statusText}`);
    }

    // 응답이 List 형태로 직접 반환됨
    return await response.json();
  } catch (error) {
    console.error('검색 오류:', error);
    throw error;
  }
}
