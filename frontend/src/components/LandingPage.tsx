import { TrendingUp, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';

interface LandingPageProps {
  onLoginClick: () => void;
}

const trendingKeywords = [
  { keyword: '장학금', count: 1234 },
  { keyword: '수강신청', count: 987 },
  { keyword: '교환학생', count: 856 },
  { keyword: '슈패스', count: 743 },
  { keyword: '채용박람회', count: 621 },
  { keyword: '기숙사', count: 534 },
  { keyword: '창업지원', count: 487 },
  { keyword: '봉사활동', count: 412 },
];



export function LandingPage({ onLoginClick }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-8 h-8 text-blue-600" />
              <h2 className="text-blue-600">AI 맞춤형 지원 정보</h2>
            </div>
            <Button onClick={onLoginClick} size="lg">
              로그인
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Content */}
        <div className="text-center space-y-6">
          <div className="inline-block p-4 bg-blue-100 rounded-full mb-4">
            <Sparkles className="w-16 h-16 text-blue-600" />
          </div>
          <h1 className="text-blue-600">숭실대학교 AI 맞춤형 정보 플랫폼</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            학생 맞춤형 공지사항, 장학금, 국제교류, 채용 정보 등<br />
            숭실대학교의 모든 정보를 AI가 분석하여 추천해드립니다
          </p>
        </div>

        {/* Trending Keywords Section */}
        <section className="mb-16">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-6 h-6 text-blue-600" />
            <h2>인기 검색어</h2>
          </div>
          <Card className="p-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {trendingKeywords.map((item, index) => (
                <button
                  key={item.keyword}
                  onClick={onLoginClick}
                  className="flex items-center gap-3 p-4 rounded-lg bg-gray-50 hover:bg-blue-50 hover:border-blue-200 border-2 border-transparent transition-all group"
                >
                  <span className="text-blue-600 shrink-0">{index + 1}</span>
                  <div className="flex-1 text-left">
                    <p className="group-hover:text-blue-600 transition-colors">{item.keyword}</p>
                    <p className="text-sm text-gray-500">{item.count.toLocaleString()}</p>
                  </div>
                </button>
              ))}
            </div>
          </Card>
        </section>

        {/* CTA Section */}
        <section className="mt-16 text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white">
          <h2 className="text-white mb-4">지금 바로 시작하세요</h2>
          <p className="mb-8 text-blue-100">
            로그인하고 더 많은 지원 정책을 확인해보세요
          </p>
          <Button
            onClick={onLoginClick}
            size="lg"
            variant="secondary"
            className="gap-2"
          >
            <Sparkles className="w-5 h-5" />
            로그인하고 시작하기
          </Button>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-gray-500 text-sm">
            © 2025 AI 맞춤형 지원 정보 플랫폼. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
