import { useState, useEffect } from 'react';
import { SearchBar } from './SearchBar';
import { SupportCard, SupportInfo } from './SupportCard';
import { AIAssistantSidebar } from './AIAssistantSidebar';
import { MyPage } from './MyPage';
import { Button } from './ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
import { Sparkles, LogOut, User, School, Filter } from 'lucide-react';
import { UserProfile } from './UserProfileDialog';
import { getInterestAnnouncements, getInterestPrograms, searchAnnouncementsAndPrograms } from '../lib/api/notices';
import { toast } from 'sonner';


interface MainPlatformProps {
  userProfile: UserProfile;
  onLogout: () => void;
  onUpdateProfile: (profile: UserProfile) => void;
  bookmarkedPolicies: Set<string>;
  onTogglePolicyBookmark: (id: string) => void;
}

export function MainPlatform({ 
  userProfile, 
  onLogout,
  onUpdateProfile,
  bookmarkedPolicies,
  onTogglePolicyBookmark
}: MainPlatformProps) {
  const [supports, setSupports] = useState<SupportInfo[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [mainTab, setMainTab] = useState('interest-based'); // interest-based | all-db
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [generalAiOpen, setGeneralAiOpen] = useState(false); // 일반 AI 도우미
  const [supathonAiOpen, setSupathonAiOpen] = useState(false); // 슈패스 AI 도우미
  const [selectedSupport, setSelectedSupport] = useState<SupportInfo | null>(null);
  const [currentView, setCurrentView] = useState<'main' | 'mypage'>('main');

  const interestCategories = ['전체', ...userProfile.interests, '추천'];

  // 관심 기반/비교과 데이터를 서버에서 불러와 supports로 변환하는 공통 함수
  // 관심 기반 공지/비교과를 서버에서 불러와 supports로 변환
  const fetchInterestSupports = async () => {
    const [annResp, progResp] = await Promise.all([
      getInterestAnnouncements(),
      getInterestPrograms(),
    ]);

    const announcementData = (annResp as any)?.data || [];
    const programData = (progResp as any)?.data || [];

    const mappedAnnouncements: SupportInfo[] = announcementData.map((n: any) => ({
      id: String(n.id ?? n.noticeId ?? n.notice_id ?? ''),
      title: n.title || '',
      summary: n.summary || (n.content ? n.content.substring(0, 100) + '...' : ''),
      description: n.content || n.summary || '',
      fullText: n.content || n.summary || '',
      sourceUrl: n.url || n.originalUrl || n.link || '',
      category: n.categoryName || n.category || '공지사항',
      eligibility: n.departmentName || '-',
      amount: n.status || '-',
      deadline: n.postedAt || '',
      agency: n.departmentName || '',
      tags: [],
    }));

    const mappedPrograms: SupportInfo[] = programData.map((p: any) => ({
      id: String(p.id ?? ''),
      title: p.title || '',
      summary: p.subtitle || (p.content ? p.content.substring(0, 100) + '...' : ''),
      description: p.content || p.subtitle || '',
      fullText: p.content || p.subtitle || '',
      sourceUrl: p.originalUrl || p.url || p.link || '',
      category: p.categoryName || '비교과',
      eligibility: p.targetAudience || '-',
      amount: p.capacity ? `정원 ${p.capacity}` : '-',
      deadline: p.applyEndAt || p.programEndAt || '',
      agency: p.organizationName || '',
      tags: [],
    }));

    setSupports([...mappedAnnouncements, ...mappedPrograms]);
  };

  // Load interest-based supports from API when userProfile changes
  useEffect(() => {
    async function loadInitialSupports() {
      try {
        await fetchInterestSupports();
      } catch (error) {
        console.error('관심 공지사항 로드 오류:', error);
        setSupports([]);
      }
    }

    if (userProfile) loadInitialSupports();
  }, [userProfile]);

  // Keyword search: 전체 DB 탭에서만 검색 (길이 >= 1)
  useEffect(() => {
    let mounted = true;
    async function doSearch() {
      if (mainTab !== 'all-db') {
        return;
      }

      try {
        const keyword = (searchQuery || '').trim();
        if (keyword.length < 1) {
          // 검색어가 없으면 관심 기반 데이터를 대신 보여준다
          if (userProfile) {
            try {
              await fetchInterestSupports();
            } catch {
              if (mounted) setSupports([]);
            }
          } else {
            setSupports([]);
          }
          return;
        }
        // 공지/비교과 통합 검색 API 호출
        const searchResults = await searchAnnouncementsAndPrograms(keyword);
        
        // SearchResultDto[] → SupportInfo[] 변환
        const mapped: SupportInfo[] = searchResults.map((result) => ({
          id: result.id,
          title: result.title || '',
          summary: result.sourceContent ? result.sourceContent.substring(0, 100) + '...' : '',
          description: result.sourceContent || '',
          fullText: result.sourceContent || '',
          sourceUrl: '', // SearchResultDto에는 URL 없음
          category: result.type === 'announcement' ? '공지사항' : '비교과',
          eligibility: '-',
          amount: '-',
          deadline: '',
          agency: result.type === 'announcement' ? '공지사항' : '비교과 프로그램',
          tags: [],
        }));
        if (mounted) {
          if (mapped.length === 0) {
            toast.error('검색 결과가 없거나 서버 오류가 발생했습니다.');
            setSupports([]);
          } else {
            setSupports(mapped);
          }
        }
      } catch (error) {
        console.error('검색 오류:', error);
        if (mounted) {
          toast.error('검색 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
          setSupports([]);
        }
      }
    }

    doSearch();
    return () => { mounted = false; };
  }, [searchQuery, mainTab, userProfile]);

  // 탭을 맞춤형 추천으로 전환할 때 관심 데이터 다시 로드
  useEffect(() => {
    async function reloadInterestSupports() {
      try {
        await fetchInterestSupports();
      } catch (error) {
        console.error('관심 공지사항 로드 오류:', error);
        setSupports([]);
      }
    }

    if (mainTab === 'interest-based' && userProfile) {
      reloadInterestSupports();
    }
  }, [mainTab, userProfile]);

  // Filter logic for interest-based tab
  const getInterestBasedSupports = () => {
    const normalizedInterests = (userProfile.interests || [])
      .map((i) => (i || '').toLowerCase())
      .filter(Boolean);

    return supports.filter((support) => {
      const title = support.title || '';
      const description = support.description || '';
      const tags = support.tags || [];
      const category = support.category || '';

      const titleLower = title.toLowerCase();
      const descriptionLower = description.toLowerCase();
      const tagsLower = tags.map((t) => (t || '').toLowerCase());
      const categoryLower = category.toLowerCase();

      const matchesInterest =
        normalizedInterests.length === 0 ||
        normalizedInterests.some((interest) =>
          categoryLower.includes(interest) ||
          tagsLower.some((t) => t.includes(interest)) ||
          titleLower.includes(interest) ||
          descriptionLower.includes(interest)
        );
      
      if (selectedCategory === '전체') {
        // Show all notices that match user interests
        return matchesInterest;
      } else if (selectedCategory === '추천') {
        // Show recommended notices based on user profile
        return matchesInterest;
      } else {
        // Show notices for specific interest
        return category === selectedCategory;
      }
    });
  };

  // Filter logic for all-db tab
  const getAllDbSupports = () => {
    return supports.filter((support) => {
      const title = support.title || '';
      const description = support.description || '';
      const tags = support.tags || [];

      const matchesSearch =
        searchQuery === '' ||
        title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tags.some(tag => (tag || '').toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesSearch;
    });
  };

  const filteredSupports = mainTab === 'all-db' ? getAllDbSupports() : getInterestBasedSupports();

  const handleAIClick = (support: SupportInfo) => {
    setSelectedSupport(support);
    if (support.category.startsWith('비교과')) {
      setSupathonAiOpen(true);
    } else {
      setGeneralAiOpen(true);
    }
  };

  const handleGlobalAIClick = () => {
    setSelectedSupport(null);
    setGeneralAiOpen(true);
  };

  // Show MyPage if currentView is 'mypage'
  if (currentView === 'mypage') {
    return (
      <MyPage
        onBack={() => setCurrentView('main')}
        userProfile={userProfile}
        onUpdateProfile={onUpdateProfile}
        bookmarkedPolicies={bookmarkedPolicies}
        allPolicies={supports}
        onTogglePolicyBookmark={onTogglePolicyBookmark}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Fixed Header with Title and Tabs */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          {/* Top row: Title and Buttons */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-blue-600 mb-1 flex items-center gap-2">
                <School className="w-7 h-7" />
                숭실대학교 AI 맞춤형 정보 플랫폼
              </h1>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <User className="w-4 h-4" />
                <span>
                  {userProfile.department} • 
                  {userProfile.status === 'graduated' 
                    ? ' 졸업' 
                    : ` ${userProfile.semester}학기 • ${userProfile.status === 'enrolled' ? '재학' : '휴학'}`
                  }
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => setCurrentView('mypage')}
                variant="outline"
                className="gap-2"
              >
                <User className="w-5 h-5" />
                마이 페이지
              </Button>
              <Button
                onClick={() => {
                  setSelectedSupport(null);
                  setGeneralAiOpen(true);
                }}
                className="gap-2 bg-blue-600 hover:bg-blue-700"
              >
                <Sparkles className="w-5 h-5" />
                숭실 공지 도우미
              </Button>
              <Button
                onClick={() => {
                  setSelectedSupport(null);
                  setSupathonAiOpen(true);
                }}
                className="gap-2 bg-purple-600 hover:bg-purple-700"
              >
                <Sparkles className="w-5 h-5" />
                슈패스 도우미
              </Button>
              <Button
                onClick={onLogout}
                variant="outline"
                className="gap-2"
              >
                <LogOut className="w-5 h-5" />
                로그아웃
              </Button>
            </div>
          </div>

          {/* Bottom row: Main Navigation Tabs */}
          <Tabs value={mainTab} onValueChange={(value) => {
            setMainTab(value);
            setSelectedCategory('전체');
            setSearchQuery('');
          }}>
          <TabsList className="w-full justify-start border-0 bg-transparent h-12 rounded-none p-0">
            <TabsTrigger 
              value="interest-based" 
              className="gap-2 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none px-6"
            >
              <Sparkles className="w-4 h-4" />
              맞춤형 추천
            </TabsTrigger>
            <TabsTrigger 
              value="all-db" 
              className="gap-2 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none px-6"
            >
              <Filter className="w-4 h-4" />
              전체 공지사항
            </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Search Bar Section (전체 공지 탭에서만) */}
      {mainTab === 'all-db' && (
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="🔍 전체 공지사항 검색..."
            />
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Interest-based Tab Content */}
        {mainTab === 'interest-based' && (
          <div>
            {/* Category Buttons */}
            <div className="mb-6">
              <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
                <TabsList className="w-full justify-start overflow-x-auto">
                  {interestCategories.map((category) => (
                    <TabsTrigger key={category} value={category}>
                      {category === '전체' ? '전체 (관심 분야 전부)' : category === '추천' ? '추천 (맞춤 공지)' : category}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>

            {/* Results Count */}
            <div className="mb-4">
              <div className="flex items-center gap-3">
                <p className="text-gray-600">
                  총 <span className="text-blue-600">{filteredSupports.length}</span>개의 맞춤형 공지사항
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={async () => {
                    try {
                      await fetchInterestSupports();
                      toast.success('관심 공지사항을 새로고침했습니다.');
                    } catch {
                      toast.error('새로고침에 실패했습니다. 잠시 후 다시 시도해주세요.');
                    }
                  }}
                >
                  새로고침
                </Button>
              </div>
            </div>

            {/* Support Cards Grid */}
            {filteredSupports.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredSupports.map((support) => (
                  <SupportCard
                    key={support.id}
                    support={support}
                    onAIClick={handleAIClick}
                    isBookmarked={bookmarkedPolicies.has(support.id)}
                    onToggleBookmark={onTogglePolicyBookmark}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-gray-500 mb-4">검색 결과가 없습니다</p>
                <p className="text-gray-400">다른 키워드로 검색해보세요</p>
              </div>
            )}
          </div>
        )}

        {/* All DB Tab Content */}
        {mainTab === 'all-db' && (
          <div>
            {/* Results Count */}
            <div className="mb-4">
              <p className="text-gray-600">
                총 <span className="text-blue-600">{filteredSupports.length}</span>개의 공지사항
              </p>
            </div>

            {/* Support Cards Grid */}
            {filteredSupports.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredSupports.map((support) => (
                  <SupportCard
                    key={support.id}
                    support={support}
                    onAIClick={handleAIClick}
                    isBookmarked={bookmarkedPolicies.has(support.id)}
                    onToggleBookmark={onTogglePolicyBookmark}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-gray-500 mb-4">검색 결과가 없습니다</p>
                <p className="text-gray-400">다른 키워드나 필터 조건으로 검색해보세요</p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* AI Assistant Sidebar */}
      <AIAssistantSidebar
        isOpen={generalAiOpen}
        onClose={() => setGeneralAiOpen(false)}
        selectedSupport={selectedSupport}
        assistantType="general"
        userId={userProfile.username}
      />
      <AIAssistantSidebar
        isOpen={supathonAiOpen}
        onClose={() => setSupathonAiOpen(false)}
        selectedSupport={selectedSupport}
        assistantType="supathon"
        userId={userProfile.username}
      />

      {/* Overlay */}
      {(generalAiOpen || supathonAiOpen) && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => {
            setGeneralAiOpen(false);
            setSupathonAiOpen(false);
          }}
        />
      )}
    </div>
  );
}
