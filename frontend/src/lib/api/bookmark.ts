/**
 * 북마크 API 서비스
 * 
 * 백엔드 API 명세:
 * - POST /api/bookmarks - 북마크 추가
 * - DELETE /api/bookmarks/{noticeId} - 북마크 삭제
 * - GET /api/bookmarks - 북마크 목록 조회
 */

const API_BASE_URL = (import.meta as any).env.VITE_API_URL || 'http://localhost:8080/api';

interface BookmarkResponse {
  isSuccess: boolean;
  message: string;
  data?: any;
}

/**
 * 북마크 추가
 * @param username - 사용자명
 * @param noticeId - 공지사항 ID
 * @returns 북마크 추가 결과
 */
export async function addBookmark(username: string, noticeId: string): Promise<BookmarkResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/bookmarks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // 쿠키 포함 (세션 기반 인증)
      body: JSON.stringify({
        username,
        noticeId,
      }),
    });

    if (!response.ok) {
      throw new Error(`북마크 추가 실패: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('북마크 추가 오류:', error);
    throw error;
  }
}

/**
 * 북마크 삭제
 * @param username - 사용자명
 * @param noticeId - 공지사항 ID
 * @returns 북마크 삭제 결과
 */
export async function deleteBookmark(username: string, noticeId: string): Promise<BookmarkResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/bookmarks/${noticeId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // 쿠키 포함 (세션 기반 인증)
      body: JSON.stringify({
        username,
      }),
    });

    if (!response.ok) {
      throw new Error(`북마크 삭제 실패: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('북마크 삭제 오류:', error);
    throw error;
  }
}

/**
 * 북마크 목록 조회
 * @param username - 사용자명
 * @returns 사용자의 북마크 목록
 */
export async function getBookmarks(username: string): Promise<BookmarkResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/bookmarks?username=${username}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // 쿠키 포함 (세션 기반 인증)
    });

    if (!response.ok) {
      throw new Error(`북마크 조회 실패: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('북마크 조회 오류:', error);
    throw error;
  }
}

/**
 * 북마크 토글 (추가/삭제)
 * @param username - 사용자명
 * @param noticeId - 공지사항 ID
 * @param isBookmarked - 현재 북마크 상태
 * @returns 토글 결과
 */
export async function toggleBookmark(
  username: string,
  noticeId: string,
  isBookmarked: boolean
): Promise<BookmarkResponse> {
  if (isBookmarked) {
    return deleteBookmark(username, noticeId);
  } else {
    return addBookmark(username, noticeId);
  }
}
