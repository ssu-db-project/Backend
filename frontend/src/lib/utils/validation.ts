/**
 * 숭실대학교 공지사항 플랫폼 - 유효성 검사 유틸리티
 * 
 * 사용자 입력 및 데이터 검증 관련 함수를 제공합니다.
 */

import { UserProfile } from '../types';

/**
 * 사용자 프로필의 필수 정보가 모두 입력되었는지 확인
 * 
 * @param profile - 검증할 사용자 프로필
 * @returns 모든 필수 정보가 입력되었으면 true, 아니면 false
 */
export function isProfileComplete(profile: UserProfile | null): boolean {
  if (!profile) return false;

  const hasBasicInfo =
    !!profile.gender &&
    !!profile.hasMilitary &&
    !!profile.college &&
    !!profile.department?.trim() &&
    !!profile.status &&
    !!profile.location &&
    profile.interests && profile.interests.length > 0;

  if (!hasBasicInfo) return false;

  // 재학/휴학인 경우 학년과 학기 필수
  if (profile.status !== 'graduated') {
    return !!profile.grade && !!profile.semester;
  }

  return true;
}

/**
 * 필수 필드 중 비어있는 필드를 찾아 반환
 * 
 * @param profile - 검증할 사용자 프로필
 * @returns 비어있는 필드명 배열
 */
export function getEmptyRequiredFields(profile: UserProfile): string[] {
  const emptyFields: string[] = [];

  if (!profile.gender) emptyFields.push('gender');
  if (!profile.hasMilitary) emptyFields.push('hasMilitary');
  if (!profile.college) emptyFields.push('college');
  if (!profile.department?.trim()) emptyFields.push('department');
  if (!profile.status) emptyFields.push('status');
  if (!profile.location) emptyFields.push('location');
  if (!profile.interests || profile.interests.length === 0) emptyFields.push('interests');

  // 재학/휴학인 경우 학년과 학기 필수
  if (profile.status && profile.status !== 'graduated') {
    if (!profile.grade) emptyFields.push('grade');
    if (!profile.semester) emptyFields.push('semester');
  }

  return emptyFields;
}

/**
 * 이메일 형식 검증
 * 
 * @param email - 검증할 이메일 주소
 * @returns 유효한 이메일 형식이면 true
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * 비밀번호 강도 검증 (최소 8자, 영문, 숫자 포함)
 * 
 * @param password - 검증할 비밀번호
 * @returns 유효한 비밀번호면 true
 */
export function isValidPassword(password: string): boolean {
  if (password.length < 8) return false;
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  return hasLetter && hasNumber;
}

/**
 * 아이디 형식 검증 (영문, 숫자만 허용, 4-20자)
 * 
 * @param username - 검증할 아이디
 * @returns 유효한 아이디면 true
 */
export function isValidUsername(username: string): boolean {
  const usernameRegex = /^[a-zA-Z0-9]{4,20}$/;
  return usernameRegex.test(username);
}
