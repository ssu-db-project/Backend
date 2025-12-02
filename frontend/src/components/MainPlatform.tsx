import { useState, useEffect } from 'react';
import { SearchBar } from './SearchBar';
import { SupportCard, SupportInfo } from './SupportCard';
import { AIAssistantSidebar } from './AIAssistantSidebar';
import { MyPage } from './MyPage';
import { Button } from './ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
import { Sparkles, LogOut, User, Filter, School } from 'lucide-react';
import { UserProfile } from './UserProfileDialog';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { getInterestAnnouncements, getInterestPrograms, searchAnnouncementsAndPrograms } from '../lib/api/notices';

const mockSupportData: SupportInfo[] = [
  {
    id: '1',
    title: '[더미데이터] 2025학년도 1학기 국가장학금 신청 안내',
    summary: '한국장학재단 국가장학금 신청 기간 및 방법 안내',
    description: '2025학년도 1학기 국가장학금 신청 안내입니다. 소득분위 8구간 이하 학생들은 필수로 신청하세요.',
    fullText: '한국장학재단에서 시행하는 국가장학금은 경제적 여건에 관계없이 누구나 의지와 능력에 따라 고등교육 기회를 가질 수 있도록 지원하는 제도입니다. 소득 8구간 이하 대학생 중 성적 기준을 충족하는 학생게 등록금을 지원합니다.',
    sourceUrl: 'https://www.ssu.ac.kr',
    category: '장학',
    eligibility: '재학생 (소득 8구간 이하, 직전학기 성적 B학점 이상)',
    amount: '학기당 최대 350만원',
    deadline: '2025년 11월 30일',
    agency: '학생처',
    tags: ['장학금', '국가장학금'],
  },
  {
    id: '2',
    title: '[더미데이터] 2025-1학기 수강신청 일정 공지',
    summary: '2025학년도 1학기 수강신청 일정 및 유의사항',
    description: '2025학년도 1학기 수강신청 일정 및 유의사항을 안내합니다.',
    fullText: '2025학년도 1학기 수강신청은 학년별로 순차적으로 진행됩니다. 4학년 2월 4일, 3학년 2월 5일, 2학년 2월 6일, 1학년 2월 7일입니다. 수강신청 전 반드시 학사시스템에서 본인의 이수학점 및 졸업요건을 확인하시기 바랍니다.',
    sourceUrl: 'https://www.ssu.ac.kr',
    category: '학사',
    eligibility: '전체 재학생',
    amount: '-',
    deadline: '2025년 2월 4일~7일',
    agency: '교무처',
    tags: ['수강신청', '학사일정'],
  },
  {
    id: '3',
    title: '[더미데이터] 2025 글로벌 교환학생 프로그램 선발',
    summary: '해외 자매대학 교환학생 프로그램 참가자 모집',
    description: '2025학년도 글로벌 교환학생 프로그램에 참가할 학생을 선발합니다.',
    fullText: '숭실대학교와 교류협정을 맺은 해외 자매대학에서 1~2학기 동안 수학할 수 있는 기회입니다. 미국, 유럽, 아시아 등 30여개국 100여개 대학 중 선택 가능합니다. 파견 기간 동안 본교 등록금만 납부하고 해외대학 수업을 들을 수 있습니다.',
    sourceUrl: 'https://www.ssu.ac.kr',
    category: '국제교류',
    eligibility: '재학생 (평점 3.0 이상, 어학성적 보유)',
    amount: '본교 등록금만 납부',
    deadline: '2025년 11월 25일',
    agency: '국제처',
    tags: ['교환학생', '해외'],
  },
  {
    id: '4',
    title: '[더미데이터] 외국인 유학생 기숙사 신청 안내',
    summary: '2025-1학기 외국인 유학생 기숙사 입사 신청',
    description: '외국인 유학생을 위한 기숙사 입사 신청을 받습니다.',
    fullText: '2025학년도 1학기 외국인 유학생 기숙사 입사 신청을 받습니다. 기숙사는 학교 내에 위치하고 있으며 2인 1실 기준입니다. 학기당 약 120만원의 비용이 소요되며, 식사는 별도입니다.',
    sourceUrl: 'https://www.ssu.ac.kr',
    category: '외국인유학생',
    eligibility: '외국인 유학생 전체',
    amount: '학기당 약 120만원',
    deadline: '2025년 12월 10일',
    agency: '국제처',
    tags: ['기숙사', '외국인'],
  },
  {
    id: '5',
    title: '[더미데이터] 삼성전자 대학생 채용 설명회 개최',
    summary: '2025 상반기 삼성전자 채용설명회 및 모의면접',
    description: '삼성전자 인사담당자가 직접 방문하여 채용 설명회를 진행합니다.',
    fullText: '삼성전자 2025년 상반기 신입사원 공채 관련 설명회를 개최합니다. HR팀 담당자가 직접 방문하여 채용 프로세스, 직무 소개, 합격 TIP 등을 공유합니다. 설명회 후 희망자에 한해 1:1 모의면접도 진행됩니다.',
    sourceUrl: 'https://www.ssu.ac.kr',
    category: '채용',
    eligibility: '졸업예정자 및 졸업생',
    amount: '무료',
    deadline: '2025년 11월 28일',
    agency: '취업진로지원센터',
    tags: ['채용', '대기업'],
  },
  {
    id: '6',
    title: '[더미데이터] 2025 겨울방학 해외봉사단 모집',
    summary: '캄보디아 교육봉사 및 시설 개선 활동',
    description: '캄보디아 지역 교육봉사 및 시설 개선 활동을 진행할 봉사단을 모집합니다.',
    fullText: '2025년 겨울방학 기간 캄보디아 프놈펜 지역에서 2주간 교육봉사 및 시설 개선 활동을 진행합니다. 현지 초등학교에서 한글, 영어, 미술, 체육 등을 가르치고 학교 시설 보수 작업을 지원합니다. 참가비 일부는 학교에서 지원합니다.',
    sourceUrl: 'https://www.ssu.ac.kr',
    category: '봉사',
    eligibility: '전체 학생 (학년 무관)',
    amount: '참가비 50만원 (일부 지원)',
    deadline: '2025년 11월 20일',
    agency: '학생처',
    tags: ['봉사', '해외'],
  },
  {
    id: '7',
    title: '[더미데이터] 슈패스 상담 프로그램 신청',
    summary: '전문 상담사와의 1:1 심리상담 및 진로상담',
    description: '학생들의 정신건강과 진로고민 해결을 위한 전문 상담 프로그램입니다.',
    fullText: '슈패스(SSUPASS) 프로그램의 일환으로 전문 상담사와의 1:1 상담을 무료로 제공합니다. 학업 스트레스, 대인관계, 진로 고민, 심리적 어려움 등 다양한 주제로 상담 가능합니다. 1회 50분, 학기당 최대 10회까지 신청 가능합니다.',
    sourceUrl: 'https://www.ssu.ac.kr',
    category: '비교과-상담/멘토링/코칭',
    eligibility: '전체 재학생',
    amount: '무료',
    deadline: '상시 신청',
    agency: '학생상담센터',
    tags: ['상담', '슈패스'],
  },
  {
    id: '8',
    title: '[더미데이터] 2025 캡스톤 디자인 경진대회',
    summary: '학과별 캡스톤 디자인 프로젝트 경진대회 개최',
    description: '학생들의 창의적인 아이디어와 기술력을 겨루는 캡스톤 디자인 경진대회입니다.',
    fullText: '2025학년도 캡스톤 디자인 경진대회를 개최합니다. 각 학과에서 진행한 캡스톤 프로젝트 중 우수작을 선발하여 시상합니다. 대상 500만원, 금상 300만원, 은상 200만원, 동상 100만원의 상금과 총장상이 수여됩니다.',
    sourceUrl: 'https://www.ssu.ac.kr',
    category: '비교과-공모전/경진대회',
    eligibility: '캡스톤 디자인 수강생',
    amount: '상금 최대 500만원',
    deadline: '2025년 12월 1일',
    agency: '교무처',
    tags: ['공모전', '캡스톤'],
  },
  {
    id: '9',
    title: '[더미데이터] AI 실무 특강 시리즈',
    summary: '현업 전문가가 전하는 AI 트렌드와 실무 활용법',
    description: 'ChatGPT, 딥러닝, 생성형 AI 등 최신 AI 기술과 실무 활용 사례를 배우는 특강입니다.',
    fullText: 'IT업계 현업 전문가들을 초청하여 AI 기술의 최신 트렌드와 실무 활용 방법을 소개합니다. 총 4회 시리즈로 진행되며 ChatGPT 활용법, 딥러닝 모델 구축, 생성형 AI 서비스 개발, AI 윤리 등을 다룹니다. 참석자에게는 슈패스 마일리지가 부여됩니다.',
    sourceUrl: 'https://www.ssu.ac.kr',
    category: '비교과-특강/워크숍',
    eligibility: '전체 학생',
    amount: '무료 (슈패스 마일리지 4점)',
    deadline: '2025년 11월 22일',
    agency: 'IT대학',
    tags: ['특강', 'AI'],
  },
  {
    id: '10',
    title: '[더미데이터] 학생 창업 지원 프로그램',
    summary: '예비 창업자를 위한 창업 교육 및 자금 지원',
    description: '학생 창업을 꿈꾸는 재학생을 위한 종합 지원 프로그램입니다.',
    fullText: '창업에 관심있는 학생들을 위한 창업 교육, 멘토링, 공간 제공, 자금 지원 등을 종합적으로 제공합니다. 선발된 팀은 창업보육센터 입주 공간과 초기 창업 자금 최대 1,000만원을 지원받을 수 있습니다.',
    sourceUrl: 'https://www.ssu.ac.kr',
    category: '기타',
    eligibility: '재학생 및 졸업 2년 이내',
    amount: '최대 1,000만원',
    deadline: '2025년 12월 5일',
    agency: '창업지원단',
    tags: ['창업', '지원금'],
  },
  {
    id: '11',
    title: '[더미데이터] 2025-1 복수전공/부전공 신청',
    summary: '2025학년도 1학기 복수전공 및 부전공 신청 안내',
    description: '복수전공 및 부전공 신청 기간 및 절차를 안내합니다.',
    fullText: '복수전공 및 부전공 신청을 받습니다. 2학년 이상 재학생이 신청 가능하며, 직전학기 평점 2.5 이상이어야 합니다. 학사시스템에서 온라인으로 신청하며, 학과별 인원 제한이 있을 수 있습니다.',
    sourceUrl: 'https://www.ssu.ac.kr',
    category: '학사',
    eligibility: '2학년 이상 재학생 (평점 2.5 이상)',
    amount: '-',
    deadline: '2025년 2월 10일~14일',
    agency: '교무처',
    tags: ['복수전공', '부전공'],
  },
  {
    id: '12',
    title: '[더미데이터] 교내 장학금 신청 안내',
    summary: '숭실대학교 자체 장학금 신청 기간',
    description: '성적 우수, 가계곤란, 봉사 등 다양한 교내 장학금을 신청하세요.',
    fullText: '숭실대학교 자체 장학금 신청을 받습니다. 성적우수장학금, 가계곤란장학금, 봉사장학금, 국가유공자장학금 등 다양한 장학금이 있습니다. 학사시스템에서 신청 후 필요 서류를 제출하면 됩니다.',
    sourceUrl: 'https://www.ssu.ac.kr',
    category: '장학',
    eligibility: '재학생 (장학금별 상이)',
    amount: '장학금별 상이',
    deadline: '2025년 2월 20일',
    agency: '학생처',
    tags: ['장학금', '교내'],
  },
  {
    id: '13',
    title: '[더미데이터] 일본 단기 어학연수 프로그램',
    summary: '여름방학 일본 도쿄 4주 어학연수',
    description: '일본 도쿄 소재 자매대학에서 진행하는 4주 어학연수 프로그램입니다.',
    fullText: '여름방학 기간 일본 도쿄에 위치한 와세다대학에서 4주간 일본어 어학연수를 진행합니다. 오전에는 일본어 수업, 오후에는 문화체험 활동으로 구성됩니다. 참가비는 약 250만원이며 일부 장학금 지원이 가능합니다.',
    sourceUrl: 'https://www.ssu.ac.kr',
    category: '국제교류',
    eligibility: '전체 재학생',
    amount: '참가비 약 250만원 (장학금 지원 가능)',
    deadline: '2025년 12월 15일',
    agency: '국제처',
    tags: ['어학연수', '일본'],
  },
  {
    id: '14',
    title: '[더미데이터] 외국인 유학생 한국어 튜터링',
    summary: '외국인 유학생의 한국어 학습을 돕는 튜터 모집',
    description: '외국인 유학생의 한국어 실력 향상을 돕는 튜터를 모집합니다.',
    fullText: '외국인 유학생과 1:1 또는 그룹으로 매칭되어 한국어 학습을 돕는 튜터를 모집합니다. 주 2회, 회당 2시간씩 활동하며 학기당 30만원의 활동비가 지급됩니다. 한국 학생과 외국인 학생 모두에게 유익한 문화교류의 기회입니다.',
    sourceUrl: 'https://www.ssu.ac.kr',
    category: '외국인유학생',
    eligibility: '전체 재학생',
    amount: '학기당 30만원',
    deadline: '2025년 2월 25일',
    agency: '국제처',
    tags: ['튜터링', '한국어'],
  },
  {
    id: '15',
    title: '[더미데이터] 스타트업 채용박람회',
    summary: '유망 스타트업 30개사 참가 채용박람회',
    description: '성장 가능성이 높은 스타트업 기업들과 직접 만나는 채용박람회입니다.',
    fullText: '유니콘 기업 및 시리즈 B 이상 투자 유치 스타트업 30개사가 참가하는 채용박람회를 개최합니다. 각 기업 부스에서 회사 소개, 채용 상담, 현장 면접이 진행됩니다. IT, 핀테크, 헬스케어, 에듀테크 등 다양한 분야의 기업이 참여합니다.',
    sourceUrl: 'https://www.ssu.ac.kr',
    category: '채용',
    eligibility: '졸업예정자 및 재학생',
    amount: '무료',
    deadline: '2025년 11월 27일 (현장 참가)',
    agency: '취업진로지원센터',
    tags: ['채용', '스타트업'],
  },
];

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
  const [supports, setSupports] = useState<SupportInfo[]>(mockSupportData);
  const [searchQuery, setSearchQuery] = useState('');
  const [mainTab, setMainTab] = useState('interest-based'); // interest-based | all-db
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [generalAiOpen, setGeneralAiOpen] = useState(false); // 일반 AI 도우미
  const [supathonAiOpen, setSupathonAiOpen] = useState(false); // 슈패스 AI 도우미
  const [selectedSupport, setSelectedSupport] = useState<SupportInfo | null>(null);
  const [advancedSearchOpen, setAdvancedSearchOpen] = useState(false);
  const [currentView, setCurrentView] = useState<'main' | 'mypage'>('main');
  
  // Advanced search filters
  const [categoryFilter, setCategoryFilter] = useState('');
  const [eligibilityFilter, setEligibilityFilter] = useState('');

  const interestCategories = ['전체', ...userProfile.interests, '추천'];
  // Load interest-based supports from API when userProfile changes
  useEffect(() => {
    async function loadInterestSupports() {
      try {
        const resp = await getInterestAnnouncements();
        if (resp && (resp as any).data) {
          const data = (resp as any).data as any[];
          const mapped: SupportInfo[] = data.map((n: any) => ({
            id: String(n.id || n.noticeId || n.notice_id || n.id),
            title: n.title || n.subject || '',
            summary: n.summary || n.description || '',
            description: n.description || n.fullText || '',
            fullText: n.fullText || n.description || '',
            sourceUrl: n.link || n.sourceUrl || '',
            category: n.category || '기타',
            eligibility: n.eligibility || '-',
            amount: n.amount || '-',
            deadline: n.deadline || n.date || '',
            agency: n.agency || '',
            tags: n.tags || [],
          }));
          setSupports(mapped.length ? mapped : mockSupportData);
        }
      } catch (error) {
        console.error('관심 공지사항 로드 오류:', error);
        setSupports(mockSupportData);
      }
    }

    if (userProfile) loadInterestSupports();
  }, [userProfile]);

  // Keyword search: when user types a query, call search API (length >= 2)
  useEffect(() => {
    let mounted = true;
    async function doSearch() {
      if (!searchQuery || searchQuery.trim().length < 2) {
        // restore interest-based supports when query cleared
        if (userProfile) {
          try {
            const resp = await getInterestAnnouncements();
            const data = (resp as any).data || [];
            const mapped: SupportInfo[] = data.map((n: any) => ({
              id: String(n.id || n.noticeId || n.notice_id || n.id),
              title: n.title || n.subject || '',
              summary: n.summary || n.description || '',
              description: n.description || n.fullText || '',
              fullText: n.fullText || n.description || '',
              sourceUrl: n.link || n.sourceUrl || '',
              category: n.category || '기타',
              eligibility: n.eligibility || '-',
              amount: n.amount || '-',
              deadline: n.deadline || n.date || '',
              agency: n.agency || '',
              tags: n.tags || [],
            }));
            if (mounted) setSupports(mapped.length ? mapped : mockSupportData);
          } catch (_) {
            if (mounted) setSupports(mockSupportData);
          }
        }
        return;
      }

      try {
        // 공지/비교과 통합 검색 API 호출
        const searchResults = await searchAnnouncementsAndPrograms(searchQuery.trim());
        
        // SearchResultDto[] → SupportInfo[] 변환
        const mapped: SupportInfo[] = searchResults.map((result) => ({
          id: result.id,
          title: result.title,
          summary: result.sourceContent.substring(0, 100) + '...', // 원본 내용 일부를 요약으로
          description: result.sourceContent,
          fullText: result.sourceContent,
          sourceUrl: '', // SearchResultDto에는 URL 없음
          category: result.type === 'announcement' ? '공지사항' : '비교과',
          eligibility: '-',
          amount: '-',
          deadline: '',
          agency: result.type === 'announcement' ? '공지사항' : '비교과 프로그램',
          tags: [result.type],
        }));
        if (mounted) setSupports(mapped.length ? mapped : mockSupportData);
      } catch (error) {
        console.error('검색 오류:', error);
        if (mounted) setSupports(mockSupportData);
      }
    }

    doSearch();
    return () => { mounted = false; };
  }, [searchQuery, userProfile]);

  // Filter logic for interest-based tab
  const getInterestBasedSupports = () => {
    return supports.filter((support) => {
      const matchesSearch =
        searchQuery === '' ||
        support.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        support.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        support.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      if (selectedCategory === '전체') {
        // Show all notices that match user interests
        return matchesSearch && userProfile.interests.includes(support.category);
      } else if (selectedCategory === '추천') {
        // Show recommended notices based on user profile
        return matchesSearch && userProfile.interests.includes(support.category);
      } else {
        // Show notices for specific interest
        return matchesSearch && support.category === selectedCategory;
      }
    });
  };

  // Filter logic for all-db tab
  const getAllDbSupports = () => {
    return supports.filter((support) => {
      const matchesSearch =
        searchQuery === '' ||
        support.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        support.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        support.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = !categoryFilter || categoryFilter === '전체' || support.category === categoryFilter;
      const matchesEligibility = !eligibilityFilter || support.eligibility.toLowerCase().includes(eligibilityFilter.toLowerCase());

      return matchesSearch && matchesCategory && matchesEligibility;
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
            setCategoryFilter('');
            setEligibilityFilter('');
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

      {/* Search Bar Section */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder={
              mainTab === 'interest-based' 
                ? "💡 관심 분야 기반 맞춤형 공지사항 검색..." 
                : "🔍 전체 공지사항 검색..."
            }
          />
        </div>
      </div>

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
              <p className="text-gray-600">
                총 <span className="text-blue-600">{filteredSupports.length}</span>개의 맞춤형 공지사항
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
                <p className="text-gray-400">다른 키워드로 검색해보세요</p>
              </div>
            )}
          </div>
        )}

        {/* All DB Tab Content */}
        {mainTab === 'all-db' && (
          <div>
            {/* Advanced Search */}
            <Collapsible open={advancedSearchOpen} onOpenChange={setAdvancedSearchOpen}>
              <div className="mb-6">
                <CollapsibleTrigger asChild>
                  <Button variant="outline" className="w-full sm:w-auto gap-2">
                    <Filter className="w-4 h-4" />
                    세부 검색 {advancedSearchOpen ? '접기' : '펼치기'}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-4">
                  <div className="bg-white p-6 rounded-lg border space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="category-filter">분야</Label>
                        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                          <SelectTrigger id="category-filter">
                            <SelectValue placeholder="전체" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="전체">전체</SelectItem>
                            <SelectItem value="학사">학사</SelectItem>
                            <SelectItem value="장학">장학</SelectItem>
                            <SelectItem value="국제교류">국제교류</SelectItem>
                            <SelectItem value="외국인유학생">외국인유학생</SelectItem>
                            <SelectItem value="채용">채용</SelectItem>
                            <SelectItem value="봉사">봉사</SelectItem>
                            <SelectItem value="기타">기타</SelectItem>
                            <SelectItem value="비교과-상담/멘토링/코칭">비교과-상담/멘토링/코칭</SelectItem>
                            <SelectItem value="비교과-공모전/경진대회">비교과-공모전/경진대회</SelectItem>
                            <SelectItem value="비교과-특강/워크숍">비교과-특강/워크숍</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="eligibility-filter">대상 조건</Label>
                        <Input
                          id="eligibility-filter"
                          placeholder="예: 재학생, 졸업예정자"
                          value={eligibilityFilter}
                          onChange={(e) => setEligibilityFilter(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setCategoryFilter('');
                          setEligibilityFilter('');
                        }}
                      >
                        필터 초기화
                      </Button>
                    </div>
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>

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
      />
      <AIAssistantSidebar
        isOpen={supathonAiOpen}
        onClose={() => setSupathonAiOpen(false)}
        selectedSupport={selectedSupport}
        assistantType="supathon"
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
