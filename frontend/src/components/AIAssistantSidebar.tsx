import { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Send, Sparkles, X, ChevronLeft } from 'lucide-react';
import { SupportInfo } from './SupportCard';

interface AIAssistantSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSupport: SupportInfo | null;
  assistantType: 'supathon' | 'general'; // 비교과(슈패스) 전용 or 전체 공지사항 전용
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function AIAssistantSidebar({ isOpen, onClose, selectedSupport, assistantType }: AIAssistantSidebarProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // AI 도우미 이름과 설명
  const assistantName = assistantType === 'supathon' ? '슈패스 도우미' : '숭실 공지 도우미';
  const assistantDescription = assistantType === 'supathon' 
    ? 'RAG 기반 비교과 프로그램 질의응답'
    : 'RAG 기반 전체 공지사항 질의응답';

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // 타이핑 효과로 메시지 출력
  const typeMessage = (fullMessage: string) => {
    let currentIndex = 0;
    
    // 빈 assistant 메시지를 먼저 추가
    setMessages(prev => [...prev, { role: 'assistant', content: '' }]);
    
    const typingSpeed = 20; // 20ms마다 한 글자 (50글자/초)
    
    const interval = setInterval(() => {
      currentIndex++;
      
      if (currentIndex <= fullMessage.length) {
        // 마지막 메시지를 업데이트
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = {
            role: 'assistant',
            content: fullMessage.slice(0, currentIndex)
          };
          return newMessages;
        });
      } else {
        clearInterval(interval);
        setIsLoading(false);
      }
    }, typingSpeed);
  };

  // 처음 사이드바를 열었을 때 환영 메시지 자동 추가
  useEffect(() => {
    if (isOpen && !hasInitialized) {
      setHasInitialized(true);
      setIsLoading(true);
      
      let welcomeMessage = '';
      
      if (selectedSupport) {
        welcomeMessage = `안녕하세요! "${selectedSupport.title}"에 대해 궁금한 점을 물어보세요!\n\n다음 정보를 확인하실 수 있습니다:\n- 신청 방법 및 절차\n- 필요 서류\n- 자격 요건\n- 신청 기한 및 담당 기관\n\n무엇을 도와드릴까요?`;
      } else if (assistantType === 'supathon') {
        welcomeMessage = `안녕하세요! 저는 슈패스 도우미입니다.\n\n비교과 프로그램(슈패스) 관련 공지사항을 검색하여 가장 적합한 정보를 찾아드립니다.\n\n다음 분야의 프로그램을 안내해드립니다:\n- 상담/멘토링/코칭\n- 공모전/경진대회\n- 특강/워크숍\n\n무엇을 도와드릴까요?`;
      } else {
        welcomeMessage = `안녕하세요! 저는 숭실 공지 도우미입니다.\n\n숭실대학교 전체 공지사항 데이터베이스를 검색하여 가장 적합한 정보를 찾아드립니다.\n\n다음 분야의 공지사항을 안내해드립니다:\n- 학사\n- 장학\n- 국제교류\n- 외국인유학생\n- 채용\n- 봉사\n- 기타\n\n무엇을 도와드릴까요?`;
      }
      
      // 타이핑 효과로 환영 메시지 출력
      setTimeout(() => typeMessage(welcomeMessage), 300);
    }
  }, [isOpen, hasInitialized, selectedSupport, assistantType]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    // Mock AI response - RAG 기반 응답 시뮬레이션
    setTimeout(() => {
      let mockResponse = '';
      
      if (selectedSupport) {
        mockResponse = `"${selectedSupport.title}"에 대해 질문하셨네요.\n\n✓ 지원 대상: ${selectedSupport.eligibility}\n✓ 지원 금액: ${selectedSupport.amount}\n✓ 신청 기한: ${selectedSupport.deadline}\n✓ 담당 기관: ${selectedSupport.agency}\n\n구체적으로 어떤 부분이 궁금하신가요? 신청 방법, 필요 서류, 자격 요건 등에 대해 더 자세히 안내해드릴 수 있습니다.`;
      } else {
        // 사용자 입력 기반 맞춤형 응답
        const lowerInput = userMessage.toLowerCase();
        
        if (lowerInput.includes('청년') || lowerInput.includes('창업')) {
          mockResponse = '청년 창업 관련 지원 정책을 찾고 계시는군요!\n\n현재 다음과 같은 지원 사업이 있습니다:\n\n1. 청년 창업 지원금 (중소벤처기업부)\n   - 만 19세~39세 대상\n   - 최대 5,000만원 무상 지원\n   - 마감: 2025년 11월 30일\n\n더 자세한 정보가 필요하시거나 다른 조건이 있으신가요?';
        } else if (lowerInput.includes('주거') || lowerInput.includes('월세')) {
          mockResponse = '주거 지원 정책에 관심이 있으시군요.\n\n저소득층 주거 지원 사업을 추천드립니다:\n- 기준 중위소득 50% 이하 무주택 가구 대상\n- 월 최대 40만원 (12개월)\n- 국토교통부 주관\n- 상시 접수\n\n본인의 소득 구간을 확인하시면 신청 가능 여부를 알 수 있습니다.';
        } else {
          mockResponse = '안녕하세요! AI 지원 도우미입니다.\n\n정부 지원 정책 데이터베이스를 검색하여 가장 적합한 정보를 찾아드립니다.\n\n다음 정보를 알려주시면 더 정확한 추천이 가능합니다:\n- 나이 또는 연령대\n- 직업 또는 상황 (학생, 창업자, 소상공인 등)\n- 관심 분야 (주거, 창업, 교육 등)\n\n무엇을 도와드릴까요?';
        }
      }
      
      // 타이핑 효과로 메시지 출력
      typeMessage(mockResponse);
    }, 800);
  };

  return (
    <div
      className={`fixed top-0 right-0 h-full w-full md:w-[480px] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6" />
              <h2 className="text-white">{assistantName}</h2>
            </div>
            <Button
              onClick={onClose}
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
          <p className="text-blue-100 text-sm">
            {assistantDescription}
          </p>
        </div>

        {/* Selected Policy Info */}
        {selectedSupport && (
          <div className="bg-blue-50 p-4 border-b">
            <p className="text-sm text-gray-600 mb-1">현재 상담 중인 정책</p>
            <p className="text-blue-600">{selectedSupport.title}</p>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4" ref={scrollRef}>
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-lg px-4 py-3 ${
                    message.role === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="whitespace-pre-wrap text-sm">{message.content}</p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg px-4 py-3">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Input */}
        <div className="border-t p-4 bg-gray-50">
          <div className="flex gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey && !isLoading) {
                  e.preventDefault();
                  e.stopPropagation();
                  handleSend();
                }
              }}
              placeholder="질문을 입력하세요... (Shift+Enter로 줄바꿈)"
              className="resize-none bg-white"
              rows={2}
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              size="icon"
              className="shrink-0 h-auto"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            💡 Vector DB를 활용한 정책 데이터 검색
          </p>
        </div>
      </div>
    </div>
  );
}
