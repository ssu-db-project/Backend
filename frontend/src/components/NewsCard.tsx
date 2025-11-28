import { ExternalLink, Calendar, Heart } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  date: string;
  url: string;
  relatedPolicies: string[];
}

interface NewsCardProps {
  news: NewsItem;
  isBookmarked?: boolean;
  onToggleBookmark?: (id: string) => void;
}

export function NewsCard({ news, isBookmarked = false, onToggleBookmark }: NewsCardProps) {
  return (
    <Card className="p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3 mb-3">
        <h4 className="flex-1 line-clamp-2">{news.title}</h4>
        <div className="flex gap-1 shrink-0">
          {onToggleBookmark && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="shrink-0"
              onClick={() => onToggleBookmark(news.id)}
            >
              <Heart className={`w-4 h-4 ${isBookmarked ? 'fill-red-500 text-red-500' : ''}`} />
            </Button>
          )}
          <Button variant="ghost" size="icon" className="shrink-0" asChild>
            <a href={news.url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-4 h-4" />
            </a>
          </Button>
        </div>
      </div>

      <p className="text-sm text-gray-600 mb-3 line-clamp-3">{news.summary}</p>

      <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
        <Calendar className="w-3 h-3" />
        <span>{news.date}</span>
        <span>•</span>
        <span>{news.source}</span>
      </div>

      {news.relatedPolicies.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {news.relatedPolicies.map((policy) => (
            <Badge key={policy} variant="outline" className="text-xs">
              {policy}
            </Badge>
          ))}
        </div>
      )}
    </Card>
  );
}
