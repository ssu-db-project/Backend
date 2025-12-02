/**
 * 사용자 인증 API 서비스
 * * 백엔드 API 명세:
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

interface AuthResponse {
  isSuccess: boolean;
  message: string;
  data?: any;
}

// 💡 [수정] DTO 일치를 위해 필드 이름을 'id'로 변경
interface LoginRequest {
  id: string;
  password: string;
}

// 💡 [수정] DTO 일치를 위해 필드 이름을 'id'로 변경
interface RegisterRequest {
  id: string;
  password: string;
  confirmPassword?: string;
}

/**
 * 회원가입
 * @param request - 회원가입 요청 정보
 * @returns 회원가입 결과
 */
export async function register(request: RegisterRequest): Promise<AuthResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/user/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        id: request.id, // 💡 DTO에 맞게 request.id 사용
        password: request.password,
        confirmPassword: request.confirmPassword,
      }),
    });

    if (!response.ok) {
      throw new Error(`회원가입 실패: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('회원가입 오류:', error);
    throw error;
  }
}

/**
 * 로그인
 * @param request - 로그인 요청 정보
 * @returns 로그인 결과 및 사용자 정보
 */
export async function login(request: LoginRequest): Promise<AuthResponse> {
  try {
    const payload = {
          id: request.id, // 💡 DTO에 맞게 request.id 사용
          password: request.password
        };

    const response = await fetch(`${API_BASE_URL}/user/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(payload), // 💡 수정된 payload 전송
    });

    if (!response.ok) {
      throw new Error(`로그인 실패: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('로그인 오류:', error);
    throw error;
  }
}

/**
 * 로그아웃
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
      throw new Error(`로그아웃 실패: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('로그아웃 오류:', error);
    throw error;
  }
}

/**
 * 사용자 프로필 조회
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
      throw new Error(`프로필 조회 실패: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('프로필 조회 오류:', error);
    throw error;
  }
}

/**
 * 사용자 프로필 업데이트
 */
export async function updateUserProfile(profile: Partial<UserProfile>): Promise<AuthResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/user/profile`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(profile),
    });

    if (!response.ok) {
      throw new Error(`프로필 업데이트 실패: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('프로필 업데이트 오류:', error);
    throw error;
  }
}

/**
 * 사용자 관심분야 조회
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

    if (!response.ok) {
      throw new Error(`관심분야 조회 실패: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('관심분야 조회 오류:', error);
    throw error;
  }
}

/**
 * 사용자 관심분야 업데이트
 */
export async function updateUserInterests(interests: string[]): Promise<AuthResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/user/interests`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ interests }),
    });

    if (!response.ok) {
      throw new Error(`관심분야 업데이트 실패: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('관심분야 업데이트 오류:', error);
    throw error;
  }
}

/**
 * 아이디 중복 확인 (mock 환경에서는 mock API에 위임)
 */
export async function checkUsernameAvailability(username: string): Promise<AuthResponse> {
  try {
    // 💡 [수정] 백엔드 컨트롤러 명세에 맞게 쿼리 파라미터를 'username'으로 복구
    const response = await fetch(`${API_BASE_URL}/user/check-username?username=${encodeURIComponent(username)}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`아이디 확인 실패: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('아이디 중복 확인 오류:', error);
    return { isSuccess: false, message: '아이디 확인 중 오류가 발생했습니다.' };
  }
}