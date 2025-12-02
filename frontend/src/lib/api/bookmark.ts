/**
 * 북마크 API 서비스
 * 
 * 백엔드 API 명세:
 * - POST /api/bookmarks - 북마크 추가
 * - DELETE /api/bookmarks/{targetId} - 북마크 삭제
 * - GET /api/bookmarks - 북마크 목록 조회
 */

const API_BASE_URL = (import.meta as any).env.VITE_API_URL || 'http://localhost:8080/api';

/**
 * 북마크 대상 타입
 * - ANNOUNCEMENT: 공지사항
 * - PROGRAM: 비교과 프로그램
 */
export type BookmarkTargetType = 'ANNOUNCEMENT' | 'PROGRAM';

/**
 * 북마크 DTO
 */
export interface BookmarkDto {
  /** 북마크 자체의 고유 ID (PK) */
  id: number;
  /** 북마크 대상의 종류 (ANNOUNCEMENT | PROGRAM) */
  targetType: BookmarkTargetType;
  /** 실제 게시글의 고유 ID (공지사항 ID 또는 프로그램 ID) */
  targetId: string;
  /** 게시글 제목 */
  title: string;
  /** 북마크 등록 일시 (ISO 8601 형식) */
  createdAt: string;
}

/**
 * 북마크 추가 요청 DTO
 */
export interface AddBookmarkRequest {
  /** 북마크 하려는 공지사항 ID 또는 비교과 프로그램 ID */
  targetId: string;
}

/**
 * 북마크 추가
 * 
 * POST /api/bookmarks
 * 
 * @param targetId - 북마크 하려는 공지사항 ID 또는 비교과 프로그램 ID
 * @throws 400 Bad Request - 잘못된 요청
 * @throws 401 Unauthorized - 인증되지 않은 사용자
 * @throws 404 Not Found - 대상 게시글을 찾을 수 없음
 * 
 * @example
 * await addBookmark("35"); // 공지사항 ID
 * await addBookmark("prg_1764226313575"); // 프로그램 ID
 */
export async function addBookmark(targetId: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/bookmarks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // 세션 쿠키 포함
    body: JSON.stringify({ targetId } as AddBookmarkRequest),
  });

  if (response.status === 400) {
    throw new Error('잘못된 요청입니다.');
  }
  if (response.status === 401) {
    throw new Error('로그인이 필요합니다.');
  }
  if (response.status === 404) {
    throw new Error('북마크할 게시글을 찾을 수 없습니다.');
  }
  if (!response.ok) {
    throw new Error('북마크 추가에 실패했습니다.');
  }
}

/**
 * 북마크 삭제
 * 
 * DELETE /api/bookmarks/{targetId}
 * 
 * @param targetId - 삭제할 대상의 ID
 * @throws 401 Unauthorized - 인증되지 않은 사용자
 * @throws 404 Not Found - 북마크를 찾을 수 없음
 * 
 * @example
 * await deleteBookmark("101");
 */
export async function deleteBookmark(targetId: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/bookmarks/${targetId}`, {
    method: 'DELETE',
    credentials: 'include', // 세션 쿠키 포함
  });

  if (response.status === 401) {
    throw new Error('로그인이 필요합니다.');
  }
  if (response.status === 404) {
    throw new Error('북마크를 찾을 수 없습니다.');
  }
  if (!response.ok) {
    throw new Error('북마크 삭제에 실패했습니다.');
  }
}

/**
 * 북마크 목록 조회
 * 
 * GET /api/bookmarks
 * 
 * @returns 북마크 목록 (최신순)
 * @throws 401 Unauthorized - 인증되지 않은 사용자
 * 
 * @example
 * const bookmarks = await getBookmarks();
 * // [
 * //   { id: 1, targetType: "PROGRAM", targetId: "prg_1764...", title: "...", createdAt: "2025-12-01T16:17:40.793293" },
 * //   { id: 6, targetType: "ANNOUNCEMENT", targetId: "35", title: "...", createdAt: "2025-12-01T20:16:00.636065" }
 * // ]
 */
export async function getBookmarks(): Promise<BookmarkDto[]> {
  const response = await fetch(`${API_BASE_URL}/bookmarks`, {
    credentials: 'include', // 세션 쿠키 포함
  });

  if (response.status === 401) {
    throw new Error('로그인이 필요합니다.');
  }
  if (!response.ok) {
    throw new Error('북마크 목록을 불러오는데 실패했습니다.');
  }

  return response.json();
}

/**
 * 북마크 토글 (추가/삭제)
 * 
 * @param targetId - 대상 게시글 ID
 * @param isBookmarked - 현재 북마크 상태
 * 
 * @example
 * await toggleBookmark("35", false); // 북마크 추가
 * await toggleBookmark("35", true);  // 북마크 삭제
 */
export async function toggleBookmark(
  targetId: string,
  isBookmarked: boolean
): Promise<void> {
  if (isBookmarked) {
    return deleteBookmark(targetId);
  } else {
    return addBookmark(targetId);
  }
}
