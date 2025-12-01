/**
 * 공지사항/프로그램 조회 API 서비스
 * 
 * 백엔드 API 명세:
 * - GET /api/user/interest-announcements - 관심 공지사항 조회
 * - GET /api/user/interest-programs - 관심 프로그램 조회
 */

import { NoticeInfo } from '../types';

const API_BASE_URL = (import.meta as any).env.VITE_API_URL || 'http://localhost:8080/api';

interface NoticesResponse {
  isSuccess: boolean;
  message: string;
  data?: NoticeInfo[];
}

/**
 * 사용자 관심분야 공지사항 조회
 * @param category - 카테고리 필터 (선택사항)
 * @returns 공지사항 목록
 */
export async function getInterestAnnouncements(category?: string): Promise<NoticesResponse> {
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
      throw new Error(`공지사항 조회 실패: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('공지사항 조회 오류:', error);
    throw error;
  }
}

/**
 * 사용자 관심분야 프로그램 조회
 * @param category - 카테고리 필터 (선택사항)
 * @returns 프로그램 목록
 */
export async function getInterestPrograms(category?: string): Promise<NoticesResponse> {
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
      throw new Error(`프로그램 조회 실패: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('프로그램 조회 오류:', error);
    throw error;
  }
}

/**
 * 키워드 기반 정책 검색 (공지/비교과 통합 검색)
 * @param query - 검색어
 */
export async function searchPolicies(query: string): Promise<NoticesResponse> {
  try {
    const url = new URL(`${API_BASE_URL}/search`);
    url.searchParams.append('query', query);

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`검색 실패: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('정책 검색 오류:', error);
    throw error;
  }
}
