/**
 * 사용자 인증 API 서비스
 * 
 * 백엔드 API 명세:
 * - POST /api/user/register - 회원가입
 * - POST /api/user/login - 로그인
 * - POST /api/user/logout - 로그아웃
 * - GET /api/user/profile - 프로필 조회
 * - PATCH /api/user/profile - 프로필 수정
 * - GET /api/user/interests - 관심분야 조회
 * - PUT /api/user/interests - 관심분야 수정
 */

import { UserProfile } from '../types';

const API_BASE_URL = (import.meta as any).env.VITE_API_URL || 'http://localhost:8080/api';

export interface ApiResponse<T = any> {
  message: string;
  data: T;
  success: boolean;
}

// 백엔드 호환을 위한 임시 응답 타입
export interface AuthResponse {
  isSuccess: boolean;
  message: string;
  data?: any;
}

export interface LoginRequest {
  id: string;
  password: string;
}

export interface RegisterRequest {
  id: string;
  password: string;
  passwordConfirm: string;
  name: string;
  gender: 'MALE' | 'FEMALE';
  militaryStatus: boolean;
  grade: number;
  currentSemester: number;
  department: string;
  enrollmentStatus: 'ENROLLED' | 'LEAVE' | 'GRADUATED';
  residence: string;
  interestAnnouncementCategoryName: string[];
  interestFieldName: string[];
  interestProgramCategoryName: string[];
}

export interface UpdateProfileRequest {
  password?: string;
  name?: string;
  gender?: 'MALE' | 'FEMALE';
  militaryStatus?: boolean;
  grade?: number;
  currentSemester?: number;
  department?: string;
  enrollmentStatus?: 'ENROLLED' | 'LEAVE' | 'GRADUATED';
  residence?: string;
}

export interface UserInterestsResponse {
  interestAnnouncementCategoryName: string[];
  interestFieldName: string[];
  interestProgramCategoryName: string[];
}

export interface UpdateInterestsRequest {
  interestAnnouncementCategoryName: string[];
  interestFieldName: string[];
  interestProgramCategoryName: string[];
}

/**
 * 회원가입
 * @param request - 회원가입 요청 정보
 * @returns 회원가입 결과
 * 
 * 응답 상태 코드:
 * - 200 OK: 회원가입 성공
 * - 400 Bad Request: 필수 값 누락
 */
export async function register(request: RegisterRequest): Promise<AuthResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/user/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(request),
    });

    // 200 OK - 회원가입 성공
    if (response.ok) {
      return await response.json();
    }

    // 400 Bad Request - 필수 값 누락
    if (response.status === 400) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || '필수 항목을 모두 입력해주세요.');
    }

    // 기타 에러
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `회원가입 실패: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('회원가입 오류:', error);
    throw error;
  }
}

/**
 * 로그인
 * @param request - 로그인 요청 정보 (id, password)
 * @returns 로그인 결과 및 사용자 정보
 * 
 * 응답 상태 코드:
 * - 200 OK: 로그인 성공
 * - 401 Unauthorized: 로그인 실패 (아이디 또는 비밀번호 오류)
 */
export async function login(request: LoginRequest): Promise<AuthResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/user/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(request),
    });

    // 200 OK - 로그인 성공
    if (response.ok) {
      return await response.json();
    }

    // 401 Unauthorized - 로그인 실패
    if (response.status === 401) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || '아이디 또는 비밀번호가 올바르지 않습니다.');
    }

    // 기타 에러
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `로그인 실패: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('로그인 오류:', error);
    throw error;
  }
}

/**
 * 로그아웃
 * @returns 로그아웃 결과
 */
export async function logout(): Promise<AuthResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/user/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `로그아웃 실패: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('로그아웃 오류:', error);
    throw error;
  }
}

/**
 * 사용자 프로필 조회
 * @returns 사용자 프로필 정보
 * 
 * Response:
 * - id, name, gender, militaryStatus, grade, currentSemester
 * - department, enrollementStatus, residence
 */
export async function getUserProfile(): Promise<AuthResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/user/profile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `프로필 조회 실패: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('프로필 조회 오류:', error);
    throw error;
  }
}

/**
 * 사용자 프로필 업데이트
 * @param profile - 업데이트할 프로필 정보
 * @returns 업데이트 결과
 * 
 * Request:
 * - password, name, gender, militaryStatus, grade, currentSemester
 * - department, enrollementStatus, residence (모두 선택)
 * 
 * 응답 상태 코드:
 * - 200 OK: 수정 성공
 * - 400 Bad Request: 유효하지 않은 필드
 * - 401 Unauthorized: 인증 실패
 */
export async function updateUserProfile(profile: UpdateProfileRequest): Promise<AuthResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/user/profile`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(profile),
    });

    // 200 OK - 수정 성공
    if (response.ok) {
      return await response.json();
    }

    // 400 Bad Request - 유효하지 않은 필드
    if (response.status === 400) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || '유효하지 않은 정보입니다.');
    }

    // 401 Unauthorized - 인증 실패
    if (response.status === 401) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || '로그인이 필요합니다.');
    }

    // 기타 에러
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `프로필 업데이트 실패: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('프로필 업데이트 오류:', error);
    throw error;
  }
}

/**
 * 사용자 관심분야 조회
 * @returns 관심분야 목록
 * 
 * Response:
 * - interestAnnouncementCategoryName: 관심 공지 카테고리 (학사, 장학, 국제교류 등)
 * - interestFieldName: 관심 분야 (데이터, 반도체, 방산 등)
 * - interestProgramCategoryName: 관심 프로그램 카테고리
 * 
 * 응답 상태 코드:
 * - 200 OK: 정상 조회
 * - 400 Bad Request: 유효하지 않은 필드
 * - 404 Not Found: 해당 사용자 없음
 */
export async function getUserInterests(): Promise<AuthResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/user/interests`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    // 200 OK - 정상 조회
    if (response.ok) {
      return await response.json();
    }

    // 400 Bad Request - 유효하지 않은 필드
    if (response.status === 400) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || '유효하지 않은 요청입니다.');
    }

    // 404 Not Found - 해당 사용자 없음
    if (response.status === 404) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || '사용자를 찾을 수 없습니다.');
    }

    // 기타 에러
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `관심분야 조회 실패: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('관심분야 조회 오류:', error);
    throw error;
  }
}

/**
 * 사용자 관심분야 업데이트
 * @param interests - 관심분야 데이터
 * @returns 업데이트 결과
 * 
 * Request:
 * - interestAnnouncementCategoryName: 관심 공지 카테고리
 * - interestFieldName: 관심 분야
 * - interestProgramCategoryName: 관심 프로그램 카테고리
 * 
 * 응답 상태 코드:
 * - 200 OK: 수정 성공
 * - 400 Bad Request: 유효하지 않은 category_id 포함
 * - 404 Not Found: 사용자 존재하지 않음
 */
export async function updateUserInterests(interests: UpdateInterestsRequest): Promise<AuthResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/user/interests`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(interests),
    });

    // 200 OK - 수정 성공
    if (response.ok) {
      return await response.json();
    }

    // 400 Bad Request - 유효하지 않은 category_id
    if (response.status === 400) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || '유효하지 않은 카테고리가 포함되어 있습니다.');
    }

    // 404 Not Found - 사용자 존재하지 않음
    if (response.status === 404) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || '사용자를 찾을 수 없습니다.');
    }

    // 기타 에러
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `관심분야 업데이트 실패: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('관심분야 업데이트 오류:', error);
    throw error;
  }
}

/**
 * 아이디 중복 확인
 * 
 * GET /api/user/check-duplicate/{id}
 * 
 * ⚠️ TODO: 백엔드에 GET /api/user/check-duplicate/{id} 엔드포인트 연결 필요
 * 
 * Response:
 * - isSuccess: true (사용 가능)
 * - isSuccess: false (이미 사용 중)
 */
export async function checkUsernameAvailability(username: string): Promise<AuthResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/user/check-duplicate/${encodeURIComponent(username)}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`아이디 확인 실패: ${response.statusText}`);
    }

    const result: ApiResponse<boolean> = await response.json();
    
    // 백엔드 응답: { success: true, message: "ID 중복 확인", data: true/false }
    // data가 true면 중복(사용 불가), false면 사용 가능
    return {
      isSuccess: !result.data, // data가 false일 때 사용 가능(isSuccess: true)
      message: result.data ? '이미 사용 중인 아이디입니다.' : '사용 가능한 아이디입니다.'
    };
  } catch (error) {
    console.error('아이디 중복 확인 오류:', error);
    // 에러 발생 시 예외를 던져서 catch 블록에서 처리하도록 함
    throw error;
  }
}
