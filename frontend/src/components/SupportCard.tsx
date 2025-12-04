import { Calendar, DollarSign, Users, ExternalLink, Heart } from 'lucide-react';
import { toast } from 'sonner';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

export interface SupportInfo {
  id: string;
  title: string;
  summary: string;
  description: string;
  fullText: string;
  sourceUrl: string;
  category: string;
  eligibility: string;
  amount: string;
  deadline: string;
  agency: string;
  tags: string[];
}

interface SupportCardProps {
  support: SupportInfo;
  onAIClick: (support: SupportInfo) => void;
  isBookmarked?: boolean;
  onToggleBookmark?: (id: string) => void;
}

export function SupportCard({ support, onAIClick, isBookmarked = false, onToggleBookmark }: SupportCardProps) {
  const handleOpenDetail = async () => {
    if (support.sourceUrl) {
      window.open(support.sourceUrl, '_blank', 'noopener,noreferrer');
      return;
    }

    if (support.fullText) {
      const dataUrl = `data:text/plain;charset=utf-8,${encodeURIComponent(support.fullText)}`;
      window.open(dataUrl, '_blank', 'noopener,noreferrer');
      return;
    }

    // 원본 링크가 없고 본문도 없을 때는 안내만
    toast.info('원본 링크가 제공되지 않았습니다.');
  };

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="secondary">{support.category}</Badge>
            {support.tags.map((tag) => (
              <Badge key={tag} variant="outline">{tag}</Badge>
            ))}
          </div>
          <h3 className="mb-2">{support.title}</h3>
        </div>
        <div className="flex gap-1 shrink-0">
          {onToggleBookmark && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onToggleBookmark(support.id)}
              className="shrink-0"
            >
              <Heart 
                className={`w-5 h-5 ${isBookmarked ? 'fill-red-500 text-red-500' : ''}`}
              />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onAIClick(support)}
            className="shrink-0"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
          </Button>
        </div>
      </div>

      <p className="text-sm text-gray-500 mb-2">{support.summary}</p>
      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{support.description}</p>

      <div className="space-y-3 mb-4">
        <div className="flex items-start gap-2">
          <Users className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-gray-500">지원 대상</p>
            <p className="text-sm">{support.eligibility}</p>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <DollarSign className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-gray-500">지원 금액</p>
            <p className="text-sm">{support.amount}</p>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <Calendar className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-gray-500">신청 기한</p>
            <p className="text-sm">{support.deadline}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t">
        <p className="text-sm text-gray-500">{support.agency}</p>
        <Button variant="link" className="gap-1" onClick={handleOpenDetail}>
          자세히 보기
          <ExternalLink className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
}
