import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Send, Sparkles } from 'lucide-react';
import { SupportInfo } from './SupportCard';
import { askAnnouncementChatbot, askProgramChatbot } from '../lib/api/chatbot';
import { toast } from 'sonner';

interface AIAssistantDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedSupport: SupportInfo | null;
  userId?: string | null;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function AIAssistantDialog({ open, onOpenChange, selectedSupport, userId }: AIAssistantDialogProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      // 사용자 ID: prop에서 전달받음
      const activeUserId = userId || 'anonymous';
      let response;
      
      // API 호출 (실제 연결 시 여기서 백엔드 호출)
      if (selectedSupport && selectedSupport.category.startsWith('비교과')) {
        // 프로그램/비교과 챗봇 API
        response = await askProgramChatbot(activeUserId, userMessage);
      } else {
        // 공지사항 챗봇 API
        response = await askAnnouncementChatbot(activeUserId, userMessage);
      }
      
      // API 응답 처리
      let aiMessage = '';
      if (typeof response === 'string') {
        aiMessage = response;
      } else if (response.data) {
        aiMessage = response.data;
      } else if (response.message) {
        aiMessage = response.message;
      } else {
        aiMessage = '죄송합니다. 응답을 받지 못했습니다.';
      }
      
      setMessages(prev => [...prev, { role: 'assistant', content: aiMessage }]);
    } catch (error) {
      console.error('AI 챗봇 오류:', error);
      
      // 폴백: Mock 응답 사용 (API 연결 전까지는 기본 응답 제공)
      const fallbackMessage = selectedSupport
        ? `"${selectedSupport.title}"에 대해 질문하셨네요. 이 지원 사업은 ${selectedSupport.eligibility}를 대상으로 하며, ${selectedSupport.amount}을 지원합니다. 구체적으로 어떤 부분이 궁금하신가요?`
        : '안녕하세요! 정부 지원 정책에 대해 궁금하신 점을 알려주시면 자세히 안내해드리겠습니다.';
      
      setMessages(prev => [...prev, { role: 'assistant', content: fallbackMessage }]);
      toast.error('AI 응답 중 일시적 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-500" />
            AI 지원 도우미
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4 py-4 min-h-[300px]">
          {messages.length === 0 && (
            <div className="text-center text-gray-500 py-12">
              {selectedSupport ? (
                <>
                  <p className="mb-2">"{selectedSupport.title}"에 대해</p>
                  <p>궁금한 점을 물어보세요!</p>
                </>
              ) : (
                <p>무엇이든 물어보세요!</p>
              )}
            </div>
          )}

          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  message.role === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-lg px-4 py-2">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-2 pt-4 border-t">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="질문을 입력하세요..."
            className="resize-none"
            rows={2}
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            size="icon"
            className="shrink-0"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
