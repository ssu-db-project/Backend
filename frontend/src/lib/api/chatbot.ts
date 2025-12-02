/**
 * AI 챗봇 API 서비스
 * 
 * 백엔드 API 명세:
 * - POST /api/announcement/chat/ask - 공지사항 관련 질문
 * - POST /api/program/chat/ask - 비교과 프로그램 관련 질문
 */

const API_BASE_URL = (import.meta as any).env.VITE_API_URL || 'http://localhost:8080/api';

export interface ChatRequest {
  userId: string;
  question: string;
}

/**
 * 공지사항 관련 질문하기
 * @param userId - 사용자 ID
 * @param question - 사용자 질문
 * @returns AI 답변 (String)
 * 
 * Request:
 * - userId (String, 필수): user table의 id
 * - question (String, 필수): 사용자 질문
 * 
 * Response: String (답변 텍스트)
 * 
 * 예시:
 * 1. 일반 질문: "2025학년도 1학기 수강신청 기간이 어떻게 돼?"
 *    → "2025학년도 1학기 수강신청 기간은 다음과 같습니다..."
 * 
 * 2. 사용자 정보 기반: "새학기에 내게 필요한 공지가 뭐야?"
 *    → "새학기에 필요한 공지는 다음과 같습니다: ..."
 */
export async function askAnnouncementChatbot(userId: string, question: string): Promise<string> {
  try {
    const response = await fetch(`${API_BASE_URL}/announcement/chat/ask`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ userId, question } as ChatRequest),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `공지 질문 실패: ${response.statusText}`);
    }

    // 응답이 String으로 직접 반환됨
    return await response.text();
  } catch (error) {
    console.error('공지 질문 오류:', error);
    throw error;
  }
}

/**
 * 비교과 프로그램 관련 질문하기
 * @param userId - 사용자 ID
 * @param question - 사용자 질문
 * @returns AI 답변 (String)
 * 
 * Request:
 * - userId (String, 필수): user table의 id
 * - question (String, 필수): 사용자 질문
 * 
 * Response: String (답변 텍스트)
 * 
 * 예시:
 * 1. 사용자 정보 기반: "비교과 프로그램 뭐 있어?"
 *    → "홍길동님, 소프트웨어학부에서 참여할 수 있는 비교과 프로그램으로는..."
 * 
 * 2. 추천 요청: "나에게 맞는 공지 추천해줘"
 *    → "홍길동님에게 맞는 공지를 추천드립니다..."
 */
export async function askProgramChatbot(userId: string, question: string): Promise<string> {
  try {
    const response = await fetch(`${API_BASE_URL}/program/chat/ask`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ userId, question } as ChatRequest),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `프로그램 질문 실패: ${response.statusText}`);
    }

    // 응답이 String으로 직접 반환됨
    return await response.text();
  } catch (error) {
    console.error('프로그램 질문 오류:', error);
    throw error;
  }
}
