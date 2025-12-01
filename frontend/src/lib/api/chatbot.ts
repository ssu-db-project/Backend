/**
 * AI 챗봇 API 서비스
 * 
 * 백엔드 API 명세:
 * - POST /api/announcement/chat/ask - 공지사항 AI 챗
 * - POST /api/program/chat/ask - 프로그램 AI 챗
 */

const API_BASE_URL = (import.meta as any).env.VITE_API_URL || 'http://localhost:8080/api';

interface ChatResponse {
  isSuccess?: boolean;
  message?: string;
  data?: string;
  // API 응답이 직접 문자열일 수도 있음
  [key: string]: any;
}

interface ChatRequest {
  userId: string;
  question: string;
}

/**
 * 공지사항 AI 챗봇에 질문
 * @param userId - 사용자 ID
 * @param question - 사용자 질문
 * @returns AI 응답
 */
export async function askAnnouncementChatbot(userId: string, question: string): Promise<ChatResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/announcement/chat/ask`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        userId,
        question,
      }),
    });

    if (!response.ok) {
      throw new Error(`공지사항 AI 챗 실패: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('공지사항 AI 챗 오류:', error);
    throw error;
  }
}

/**
 * 프로그램 AI 챗봇에 질문
 * @param userId - 사용자 ID
 * @param question - 사용자 질문
 * @returns AI 응답
 */
export async function askProgramChatbot(userId: string, question: string): Promise<ChatResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/program/chat/ask`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        userId,
        question,
      }),
    });

    if (!response.ok) {
      throw new Error(`프로그램 AI 챗 실패: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('프로그램 AI 챗 오류:', error);
    throw error;
  }
}
