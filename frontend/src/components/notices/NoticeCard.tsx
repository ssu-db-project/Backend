/**
 * 공지사항 카드 컴포넌트
 * 
 * 개별 공지사항을 카드 형태로 표시
 */

import { Calendar, ExternalLink, Heart, Bell } from 'lucide-react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { NoticeInfo } from '../../lib/types';
import { formatDate, formatDeadline } from '../../lib/utils/format';
import { getDaysUntilDeadline, isDeadlineNear, isNewNotice } from '../../lib/utils/notice';

/**
 * NoticeCard 컴포넌트 Props
 */
interface NoticeCardProps {
  /** 공지사항 정보 */
  notice: NoticeInfo;
  
  /** AI 도우미 버튼 클릭 핸들러 */
  onAIClick: (notice: NoticeInfo) => void;
  
  /** 북마크 여부 */
  isBookmarked?: boolean;
  
  /** 북마크 토글 핸들러 */
  onToggleBookmark?: (id: string) => void;
  
  /** 카드 variant */
  variant?: 'default' | 'compact';
}

/**
 * 공지사항 카드 컴포넌트
 */
export function NoticeCard({ 
  notice, 
  onAIClick, 
  isBookmarked = false, 
  onToggleBookmark,
  variant = 'default'
}: NoticeCardProps) {
  const daysLeft = getDaysUntilDeadline(notice.deadline);
  const isNearDeadline = isDeadlineNear(notice.deadline);
  const isNew = isNewNotice(notice.date);

  return (
    <Card className={`hover:shadow-lg transition-shadow ${variant === 'compact' ? 'p-4' : 'p-6'}`}>
      {/* 헤더: 제목 및 액션 버튼 */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          {/* 카테고리 및 태그 */}
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <Badge variant="secondary">{notice.category}</Badge>
            {isNew && <Badge variant="default" className="bg-blue-500">NEW</Badge>}
            {isNearDeadline && notice.deadline && (
              <Badge variant="destructive">{formatDeadline(notice.deadline)}</Badge>
            )}
          </div>
          
          {/* 제목 */}
          <h3 className="mb-2 line-clamp-2">{notice.title}</h3>
        </div>
        
        {/* 액션 버튼 */}
        <div className="flex gap-1 shrink-0 ml-2">
          {/* 북마크 버튼 */}
          {onToggleBookmark && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onToggleBookmark(notice.id)}
              className="shrink-0"
              aria-label="북마크"
            >
              <Heart 
                className={`w-5 h-5 ${isBookmarked ? 'fill-red-500 text-red-500' : ''}`}
              />
            </Button>
          )}
          
          {/* AI 도우미 버튼 */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onAIClick(notice)}
            className="shrink-0"
            aria-label="AI 도우미"
          >
            <Bell className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* 공지사항 설명 */}
      <p className="text-sm text-gray-600 mb-4 line-clamp-3">{notice.description}</p>

      {/* 공지사항 메타 정보 */}
      <div className="space-y-2 mb-4">
        {/* 게시일 */}
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <p className="text-sm text-gray-500">
            게시일: {formatDate(notice.date, 'short')}
          </p>
        </div>

        {/* 마감일 */}
        {notice.deadline && (
          <div className="flex items-center gap-2">
            <Calendar className={`w-4 h-4 ${isNearDeadline ? 'text-red-500' : 'text-orange-500'}`} />
            <p className={`text-sm ${isNearDeadline ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
              마감일: {formatDate(notice.deadline, 'short')}
              {daysLeft !== null && ` (${formatDeadline(notice.deadline)})`}
            </p>
          </div>
        )}
      </div>

      {/* 푸터: 외부 링크 */}
      <div className="flex items-center justify-end pt-4 border-t">
        <Button variant="link" className="gap-1" asChild>
          <a href={notice.link} target="_blank" rel="noopener noreferrer">
            자세히 보기
            <ExternalLink className="w-4 h-4" />
          </a>
        </Button>
      </div>
    </Card>
  );
}

/**
 * 이전 SupportCard와의 호환성을 위한 export
 * @deprecated NoticeCard 사용을 권장합니다
 */
export { NoticeCard as SupportCard };
export type { NoticeInfo as SupportInfo };
