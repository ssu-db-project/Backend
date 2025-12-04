import { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ScrollArea } from './ui/scroll-area';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
import { UserProfile } from './UserProfileDialog';
import { SupportCard, SupportInfo } from './SupportCard';
import { ArrowLeft, Save, User, Bookmark, Loader2 } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { getInterestAnnouncements, getInterestPrograms } from '../lib/api/notices';

interface MyPageProps {
  onBack: () => void;
  userProfile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
  bookmarkedPolicies: Set<string>;
  allPolicies: SupportInfo[];
  onTogglePolicyBookmark: (id: string) => void;
}

// 회원가입 화면과 동일한 관심 분야 목록
const interestOptions = [
  '학사',
  '장학',
  '국제교류',
  '외국인유학생',
  '채용',
  '봉사',
  '기타',
  '데이터',
  '반도체',
  '통신',
  '방산',
  '자동차',
  '상담/멘토링/코칭',
  '공모전/경진대회',
  '특강/워크숍',
  '소모임/동아리',
  '국내/외 현장실습, 인턴십',
  '공연, 전시회/견학, 답사',
  '자격증/어학시험',
  '서포터즈/홍보대사',
  '국내/외 봉사활동',
  '발표(졸업/논문)',
  '국내/외 교환학생 및 연수',
  '전공탐색프로그램',
  '진로탐색프로그램',
  '채용설명회/채용상담',
  '공공인재양성반',
  '독서및토론',
  '창업',
  'AI 비교과',
  '졸업생 특화 프로그램',
  '기타 프로그램',
];

const provinces = {
  '서울특별시': ['강남구', '강동구', '강북구', '강서', '관악구', '광진구', '구로구', '금천구', '노원구', '도봉구', '동대문구', '동작구', '마포구', '서대문구', '서초구', '성동구', '성북구', '송파구', '양천구', '영등포구', '용산구', '은평구', '종로구', '중구', '중랑구'],
  '부산광역시': ['강서구', '금정구', '기장군', '남구', '동구', '동래구', '부산진구', '북구', '사상구', '사하구', '서구', '수영구', '연제구', '영도구', '중구', '해운대구'],
  '대구광역시': ['남구', '달서구', '달성군', '동구', '북구', '서구', '수성구', '중구'],
  '인천광역시': ['강화군', '계양구', '남동구', '동구', '미추홀구', '부평구', '서구', '연수구', '옹진군', '중구'],
  '광주광역시': ['광산구', '남구', '동구', '북구', '서구'],
  '대전광역시': ['대덕구', '동구', '서구', '유성구', '중구'],
  '울산광역시': ['남구', '동구', '북구', '울주군', '중구'],
  '세종특별자치시': ['세종시'],
  '경기도': ['가평군', '고양시', '과천시', '광명시', '광주시', '구리시', '군포시', '김포시', '남양주시', '동두천시', '부천시', '성남시', '수원시', '시흥시', '안산시', '안성시', '안양시', '양주시', '양평군', '여주시', '연천군', '오산시', '용인시', '의왕시', '의정부시', '이천시', '파주시', '평택', '포천시', '하남시', '화성시'],
  '강원도': ['강릉시', '고성군', '동해시', '삼척시', '속초시', '양구군', '양양군', '영월군', '원주시', '인제군', '정선군', '철원군', '춘천시', '태백시', '평창군', '홍천군', '화천군', '횡성군'],
  '충청북도': ['괴산군', '단양군', '보은군', '영동군', '옥천군', '음성군', '제천시', '증평군', '진천군', '청주시', '충주시'],
  '충청남도': ['계룡시', '공주시', '금산군', '논산시', '당진시', '보령시', '부여군', '서산시', '서천군', '아산시', '예산군', '천안시', '청양군', '태안군', '홍성군'],
  '전라북도': ['고창군', '군산시', '김제시', '남원시', '무주군', '부안군', '순창군', '완주군', '익산시', '임실군', '장수군', '전주시', '정읍시', '진안군'],
  '전라남도': ['강진군', '고흥군', '곡성군', '광양시', '구례군', '나주시', '담양군', '목포시', '무안군', '보성군', '순천시', '신안군', '여수시', '영광군', '영암군', '완도군', '장성군', '장흥군', '진도군', '함평군', '해남군', '화순군'],
  '경상북도': ['경산시', '경주시', '고령군', '구미시', '군위군', '김천시', '문경시', '봉화군', '상주시', '성주군', '안동시', '영덕군', '영양군', '영주시', '영천시', '예천군', '울릉군', '울진군', '의성군', '청도군', '청송군', '칠곡군', '포항시'],
  '경상남도': ['거제시', '거창군', '고성군', '김해시', '남해군', '밀양시', '사천시', '산청군', '양산시', '의령군', '진주시', '창녕군', '창원시', '통영시', '하동군', '함안군', '함양군', '합천군'],
  '제주특별자치도': ['서귀포시', '제주시'],
};

export function MyPage({
  onBack,
  userProfile,
  onUpdateProfile,
  bookmarkedPolicies,
  allPolicies,
  onTogglePolicyBookmark,
}: MyPageProps) {
  const [profile, setProfile] = useState<UserProfile>(userProfile);
  const [selectedProvince, setSelectedProvince] = useState(
    userProfile.location.split(' ')[0] || ''
  );
  const [selectedCity, setSelectedCity] = useState(
    userProfile.location.split(' ')[1] || ''
  );
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [loadedPolicies, setLoadedPolicies] = useState<SupportInfo[]>(allPolicies || []);
  const [isLoadingPolicies, setIsLoadingPolicies] = useState(allPolicies.length === 0);
  
  // 마이페이지 진입 시 공지사항 로드 (allPolicies가 비어있을 때)
  useEffect(() => {
    if (allPolicies.length === 0) {
      setIsLoadingPolicies(true);
      Promise.all([getInterestAnnouncements(), getInterestPrograms()])
        .then(([annResp, progResp]) => {
          const annData = (annResp as any)?.data || [];
          const progData = (progResp as any)?.data || [];

          const mappedAnnouncements: SupportInfo[] = annData.map((n: any) => ({
            id: String(n.id ?? n.noticeId ?? n.notice_id ?? ''),
            title: n.title || '',
            summary: n.summary || (n.content ? n.content.substring(0, 100) + '...' : ''),
            description: n.content || n.summary || '',
            fullText: n.content || n.summary || '',
            sourceUrl: n.url || '',
            category: n.categoryName || n.category || '공지사항',
            eligibility: n.departmentName || '-',
            amount: n.status || '-',
            deadline: n.postedAt || '',
            agency: n.departmentName || '',
            tags: ['announcement', n.categoryName || ''],
          }));

          const mappedPrograms: SupportInfo[] = progData.map((p: any) => ({
            id: String(p.id ?? ''),
            title: p.title || '',
            summary: p.subtitle || (p.content ? p.content.substring(0, 100) + '...' : ''),
            description: p.content || p.subtitle || '',
            fullText: p.content || p.subtitle || '',
            sourceUrl: p.originalUrl || '',
            category: p.categoryName || '비교과',
            eligibility: p.targetAudience || '-',
            amount: p.capacity ? `정원 ${p.capacity}` : '-',
            deadline: p.applyEndAt || p.programEndAt || '',
            agency: p.organizationName || '',
            tags: ['program', p.categoryName || ''],
          }));

          setLoadedPolicies([...mappedAnnouncements, ...mappedPrograms]);
        })
        .catch((err) => {
          console.error('공지사항 로드 오류:', err);
          setLoadedPolicies([]);
        })
        .finally(() => {
          setIsLoadingPolicies(false);
        });
    } else {
      setLoadedPolicies(allPolicies);
      setIsLoadingPolicies(false);
    }
  }, [allPolicies]);
  
  // Refs for scrolling to error fields
  const departmentRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const gradeRef = useRef<HTMLDivElement>(null);
  const semesterRef = useRef<HTMLDivElement>(null);
  const interestsRef = useRef<HTMLDivElement>(null);

  const handleInterestToggle = (interest: string) => {
    setProfile((prev) => {
      if (prev.interests.includes(interest)) {
        return {
          ...prev,
          interests: prev.interests.filter((i) => i !== interest),
        };
      } else if (prev.interests.length < 3) {
        return {
          ...prev,
          interests: [...prev.interests, interest],
        };
      }
      return prev;
    });
  };

  const handleProvinceChange = (value: string) => {
    setSelectedProvince(value);
    setSelectedCity('');
    setProfile({ ...profile, location: '' });
  };

  const handleCityChange = (value: string) => {
    setSelectedCity(value);
    setProfile({ ...profile, location: `${selectedProvince} ${value}` });
  };

  const handleSave = () => {
    // Validate fields (회원가입 필수 항목과 맞춤)
    const newErrors: Record<string, boolean> = {};
    if (!profile.department) newErrors.department = true;
    if (!profile.status) newErrors.status = true;

    const gradeNum = profile.grade ? parseInt(profile.grade, 10) : NaN;
    const semesterNum = profile.semester ? parseInt(profile.semester, 10) : NaN;

    if (profile.status && profile.status !== 'graduated') {
      if (!Number.isFinite(gradeNum) || gradeNum < 1 || gradeNum > 10) newErrors.grade = true;
      if (!Number.isFinite(semesterNum) || semesterNum < 1 || semesterNum > 20) newErrors.semester = true;
    }

    if (profile.interests.length < 1) newErrors.interests = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // Scroll to the first error field
      const firstErrorField = Object.keys(newErrors)[0];
      const ref = {
        department: departmentRef,
        status: statusRef,
        grade: gradeRef,
        semester: semesterRef,
        interests: interestsRef,
      }[firstErrorField];
      if (ref.current) {
        ref.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    onUpdateProfile(profile);
    toast.success('프로필이 업데이트되었습니다');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-blue-600">마이 페이지</h1>
              <p className="text-sm text-gray-600">프로필 정보를 확인하고 수정하거나 북마크한 콘텐츠를 관리하세요</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="profile" className="gap-2">
                <User className="w-4 h-4" />
                프로필 정보
              </TabsTrigger>
              <TabsTrigger value="bookmarks" className="gap-2">
                <Bookmark className="w-4 h-4" />
                북마크 ({bookmarkedPolicies.size})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <ScrollArea className="h-[calc(100vh-280px)]">
                <div className="space-y-6 pr-4">
                  {/* 계정 정보 */}
                  <div className="space-y-4">
                    <h3 className="text-blue-600 pb-2 border-b">계정 정보</h3>
                    
                    <div className="space-y-2">
                      <Label htmlFor="username">아이디</Label>
                      <Input
                        id="username"
                        value={profile.username}
                        disabled
                        className="bg-gray-100 cursor-not-allowed"
                      />
                      <p className="text-sm text-gray-500">아이디는 변경할 수 없습니다.</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="name">이름 (선택)</Label>
                      <Input
                        id="name"
                        placeholder="이름을 입력하세요"
                        value={profile.name || ''}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* 기본 정보 */}
                  <div className="space-y-4">
                    <h3 className="text-blue-600 pb-2 border-b">기본 정보</h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="gender">성별</Label>
                        <Select
                          value={profile.gender}
                          onValueChange={(value) => setProfile({ ...profile, gender: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="성별 선택" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">남성</SelectItem>
                            <SelectItem value="female">여성</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="military">군필 여부</Label>
                        <Select
                          value={profile.hasMilitary}
                          onValueChange={(value) => setProfile({ ...profile, hasMilitary: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="선택" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="yes">군필</SelectItem>
                            <SelectItem value="no">미필</SelectItem>
                            <SelectItem value="exempt">면제</SelectItem>
                            <SelectItem value="notApplicable">해당없음</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* 학적 정보 */}
                  <div className="space-y-4">
                    <h3 className="text-blue-600 pb-2 border-b">학적 정보</h3>

                    <div className="space-y-2" ref={departmentRef}>
                      <Label htmlFor="department">학과</Label>
                      <Input
                        id="department"
                        placeholder="예: 컴퓨터학부"
                        value={profile.department}
                        onChange={(e) => setProfile({ ...profile, department: e.target.value })}
                        className={errors.department ? 'border-red-500' : ''}
                      />
                      {errors.department && <p className="text-sm text-red-500">학과를 입력하세요</p>}
                    </div>

                    <div className="space-y-2" ref={statusRef}>
                      <Label htmlFor="status">재학 상태</Label>
                      <Select
                        value={profile.status}
                        onValueChange={(value) => {
                          // 졸업 상태로 변경 시 학년과 학기를 null로 설정
                          if (value === 'graduated') {
                            setProfile({ ...profile, status: value, grade: null, semester: null });
                          } else {
                            setProfile({ ...profile, status: value });
                          }
                        }}
                      >
                        <SelectTrigger className={errors.status ? 'border-red-500' : ''}>
                          <SelectValue placeholder="재학 상태 선택" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="enrolled">재학</SelectItem>
                          <SelectItem value="leave">휴학</SelectItem>
                          <SelectItem value="graduated">졸업</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.status && <p className="text-sm text-red-500">재학 상태를 선택하세요</p>}
                    </div>

                    {/* 학년과 학기는 재학/휴학인 경우에만 표시 */}
                    {profile.status && profile.status !== 'graduated' && (
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2" ref={gradeRef}>
                          <Label htmlFor="grade">학년</Label>
                          <Input
                            id="grade"
                            type="number"
                            min={1}
                            max={10}
                            placeholder="1"
                            value={profile.grade ?? ''}
                            onChange={(e) => {
                              const next = parseInt(e.target.value, 10);
                              if (isNaN(next)) {
                                setProfile({ ...profile, grade: '' });
                                return;
                              }
                              const clamped = Math.min(10, Math.max(1, next));
                              setProfile({ ...profile, grade: clamped.toString() });
                            }}
                            className={errors.grade ? 'border-red-500' : ''}
                          />
                          {errors.grade && <p className="text-sm text-red-500">학년을 입력하세요 (1-10)</p>}
                        </div>

                        <div className="space-y-2" ref={semesterRef}>
                          <Label htmlFor="semester">학기 (전체 이수 학기)</Label>
                          <Input
                            id="semester"
                            type="number"
                            min={1}
                            max={20}
                            placeholder="1"
                            value={profile.semester ?? ''}
                            onChange={(e) => {
                              const next = parseInt(e.target.value, 10);
                              if (isNaN(next)) {
                                setProfile({ ...profile, semester: '' });
                                return;
                              }
                              const clamped = Math.min(20, Math.max(1, next));
                              setProfile({ ...profile, semester: clamped.toString() });
                            }}
                            className={errors.semester ? 'border-red-500' : ''}
                          />
                          {errors.semester && <p className="text-sm text-red-500">학기를 입력하세요 (1-20)</p>}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 거주 정보 */}
                  <div className="space-y-4">
                    <h3 className="text-blue-600 pb-2 border-b">거주 정보</h3>

                    <div className="space-y-2">
                      <Label>거주지</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <Select value={selectedProvince} onValueChange={handleProvinceChange}>
                          <SelectTrigger>
                            <SelectValue placeholder="시/도 선택" />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.keys(provinces).map((province) => (
                              <SelectItem key={province} value={province}>
                                {province}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <Select
                          value={selectedCity}
                          onValueChange={handleCityChange}
                          disabled={!selectedProvince}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="시/군/구 선택" />
                          </SelectTrigger>
                          <SelectContent>
                            {selectedProvince &&
                              provinces[selectedProvince as keyof typeof provinces]?.map((city) => (
                                <SelectItem key={city} value={city}>
                                  {city}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* 관심 분야 */}
                  <div className="space-y-4">
                    <h3 className="text-blue-600 pb-2 border-b">관심 분야</h3>

                    <div className="space-y-2" ref={interestsRef}>
                      <Label>관심 분야 (최대 3개 선택)</Label>
                      <div className="grid grid-cols-2 gap-2 max-h-[240px] overflow-y-auto p-3 border rounded-md">
                        {interestOptions.map((interest) => (
                          <Button
                            key={interest}
                            type="button"
                            size="sm"
                            variant={profile.interests.includes(interest) ? 'default' : 'outline'}
                            onClick={() => handleInterestToggle(interest)}
                            className="w-full"
                            disabled={
                              !profile.interests.includes(interest) && profile.interests.length >= 3
                            }
                          >
                            {interest}
                          </Button>
                        ))}
                      </div>
                      <p className="text-sm text-gray-500">{profile.interests.length}/3개 선택됨</p>
                      {errors.interests && <p className="text-sm text-red-500">최소 1개 이상의 관심 분야를 선택하세요</p>}
                    </div>
                  </div>

                  <Button onClick={handleSave} className="w-full gap-2">
                    <Save className="w-4 h-4" />
                    프로필 저장
                  </Button>
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="bookmarks">
              <ScrollArea className="h-[calc(100vh-280px)]">
                <div className="space-y-6 pr-4">
                  {/* 북마크된 공지 */}
                  <div>
                    <h3 className="text-blue-600 pb-2 border-b mb-4">
                      북마크한 공지사항 ({bookmarkedPolicies.size})
                    </h3>
                    {isLoadingPolicies ? (
                      <div className="text-center py-12 text-gray-500">
                        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-gray-400" />
                        <p>공지사항을 로드 중입니다...</p>
                      </div>
                    ) : loadedPolicies && loadedPolicies.length > 0 ? (
                      <div className="space-y-4">
                        {loadedPolicies
                          .filter((policy) => bookmarkedPolicies.has(policy.id))
                          .map((policy) => (
                            <SupportCard
                              key={policy.id}
                              support={policy}
                              onAIClick={() => {}}
                              isBookmarked={true}
                              onToggleBookmark={onTogglePolicyBookmark}
                            />
                          ))}
                        {loadedPolicies.filter((policy) => bookmarkedPolicies.has(policy.id)).length === 0 && (
                          <div className="text-center py-12 text-gray-500">
                            <p>북마크한 공지사항이 없습니다</p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-12 text-gray-500">
                        <p>공지사항이 없습니다</p>
                      </div>
                    )}
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
