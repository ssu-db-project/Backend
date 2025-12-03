import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ScrollArea } from './ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { login, register, checkUsernameAvailability as apiCheckUsernameAvailability } from '../lib/api/auth';

interface LoginDialogProps {
  open: boolean;
  onClose: () => void;
  onLoginSuccess: (username: string) => void;
}

export function LoginDialog({ open, onClose, onLoginSuccess }: LoginDialogProps) {
  const [loginData, setLoginData] = useState({ id: '', password: '' });
  const [signupData, setSignupData] = useState({
    id: '',
    password: '',
    passwordConfirm: '',
    name: '',
    gender: 'MALE' as 'MALE' | 'FEMALE',
    militaryStatus: false,
    grade: 1,
    currentSemester: 1,
    department: '',
    enrollmentStatus: 'ENROLLED' as 'ENROLLED' | 'LEAVE' | 'GRADUATED',
    residence: '',
    interestAnnouncementCategoryName: [] as string[],
    interestFieldName: [] as string[],
    interestProgramCategoryName: [] as string[],
  });
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [usernameCheckStatus, setUsernameCheckStatus] = useState<'idle' | 'checking' | 'available' | 'taken' | 'error'>('idle');
  const [passwordMatchError, setPasswordMatchError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // 관심 분야 선택 상태 (통합: 최대 3개)
  const [selectedInterests, setSelectedInterests] = useState<Array<{type: 'announcement' | 'field' | 'program', value: string}>>([]);

  // 관심 분야 옵션 (백엔드 data.sql 기준)
  const interestOptions = [
    // 공지 카테고리
    { type: 'announcement' as const, label: '학사', value: '학사' },
    { type: 'announcement' as const, label: '장학', value: '장학' },
    { type: 'announcement' as const, label: '국제교류', value: '국제교류' },
    { type: 'announcement' as const, label: '외국인유학생', value: '외국인유학생' },
    { type: 'announcement' as const, label: '채용', value: '채용' },
    { type: 'announcement' as const, label: '봉사', value: '봉사' },
    { type: 'announcement' as const, label: '기타 공지', value: '기타' },
    // 키워드
    { type: 'field' as const, label: '데이터', value: '데이터' },
    { type: 'field' as const, label: '반도체', value: '반도체' },
    { type: 'field' as const, label: '통신', value: '통신' },
    { type: 'field' as const, label: '방산', value: '방산' },
    { type: 'field' as const, label: '자동차', value: '자동차' },
    // 비교과 프로그램
    { type: 'program' as const, label: '상담/멘토링/코칭', value: '상담/멘토링/코칭' },
    { type: 'program' as const, label: '공모전/경진대회', value: '공모전/경진대회' },
    { type: 'program' as const, label: '특강/워크숍', value: '특강/워크숍' },
    { type: 'program' as const, label: '소모임/동아리', value: '소모임/동아리' },
    { type: 'program' as const, label: '국내/외 현장실습, 인턴십', value: '국내/외 현장실습, 인턴십' },
    { type: 'program' as const, label: '공연, 전시회/견학, 답사', value: '공연, 전시회/견학, 답사' },
    { type: 'program' as const, label: '자격증/어학시험', value: '자격증/어학시험' },
    { type: 'program' as const, label: '서포터즈/홍보대사', value: '서포터즈/홍보대사' },
    { type: 'program' as const, label: '국내/외 봉사활동', value: '국내/외 봉사활동' },
    { type: 'program' as const, label: '발표(졸업/논문)', value: '발표(졸업/논문)' },
    { type: 'program' as const, label: '국내/외 교환학생 및 연수', value: '국내/외 교환학생 및 연수' },
    { type: 'program' as const, label: '전공탐색프로그램', value: '전공탐색프로그램' },
    { type: 'program' as const, label: '진로탐색프로그램', value: '진로탐색프로그램' },
    { type: 'program' as const, label: '채용설명회/채용상담', value: '채용설명회/채용상담' },
    { type: 'program' as const, label: '공공인재양성반', value: '공공인재양성반' },
    { type: 'program' as const, label: '독서및토론', value: '독서및토론' },
    { type: 'program' as const, label: '창업', value: '창업' },
    { type: 'program' as const, label: 'AI 비교과', value: 'AI 비교과' },
    { type: 'program' as const, label: '졸업생 특화 프로그램', value: '졸업생 특화 프로그램' },
    { type: 'program' as const, label: '기타 프로그램', value: '기타' },
  ];

  // 시/도별 시/군/구 데이터
  const districtsByCity: { [key: string]: string[] } = {
    '서울특별시': ['강남구', '강동구', '강북구', '강서구', '관악구', '광진구', '구로구', '금천구', '노원구', '도봉구', '동대문구', '동작구', '마포구', '서대문구', '서초구', '성동구', '성북구', '송파구', '양천구', '영등포구', '용산구', '은평구', '종로구', '중구', '중랑구'],
    '부산광역시': ['강서구', '금정구', '기장군', '남구', '동구', '동래구', '부산진구', '북구', '사상구', '사하구', '서구', '수영구', '연제구', '영도구', '중구', '해운대구'],
    '대구광역시': ['남구', '달서구', '달성군', '동구', '북구', '서구', '수성구', '중구'],
    '인천광역시': ['강화군', '계양구', '남동구', '동구', '미추홀구', '부평구', '서구', '연수구', '옹진군', '중구'],
    '광주광역시': ['광산구', '남구', '동구', '북구', '서구'],
    '대전광역시': ['대덕구', '동구', '서구', '유성구', '중구'],
    '울산광역시': ['남구', '동구', '북구', '울주군', '중구'],
    '세종특별자치시': ['세종시'],
    '경기도': ['가평군', '고양시', '과천시', '광명시', '광주시', '구리시', '군포시', '김포시', '남양주시', '동두천시', '부천시', '성남시', '수원시', '시흥시', '안산시', '안성시', '안양시', '양주시', '양평군', '여주시', '연천군', '오산시', '용인시', '의왕시', '의정부시', '이천시', '파주시', '평택시', '포천시', '하남시', '화성시'],
    '강원특별자치도': ['강릉시', '고성군', '동해시', '삼척시', '속초시', '양구군', '양양군', '영월군', '원주시', '인제군', '정선군', '철원군', '춘천시', '태백시', '평창군', '홍천군', '화천군', '횡성군'],
    '충청북도': ['괴산군', '단양군', '보은군', '영동군', '옥천군', '음성군', '제천시', '증평군', '진천군', '청주시', '충주시'],
    '충청남도': ['계룡시', '공주시', '금산군', '논산시', '당진시', '보령시', '부여군', '서산시', '서천군', '아산시', '예산군', '천안시', '청양군', '태안군', '홍성군'],
    '전북특별자치도': ['고창군', '군산시', '김제시', '남원시', '무주군', '부안군', '순창군', '완주군', '익산시', '임실군', '장수군', '전주시', '정읍시', '진안군'],
    '전라남도': ['강진군', '고흥군', '곡성군', '광양시', '구례군', '나주시', '담양군', '목포시', '무안군', '보성군', '순천시', '신안군', '여수시', '영광군', '영암군', '완도군', '장성군', '장흥군', '진도군', '함평군', '해남군', '화순군'],
    '경상북도': ['경산시', '경주시', '고령군', '구미시', '군위군', '김천시', '문경시', '봉화군', '상주시', '성주군', '안동시', '영덕군', '영양군', '영주시', '영천시', '예천군', '울릉군', '울진군', '의성군', '청도군', '청송군', '칠곡군', '포항시'],
    '경상남도': ['거제시', '거창군', '고성군', '김해시', '남해군', '밀양시', '사천시', '산청군', '양산시', '의령군', '진주시', '창녕군', '창원시', '통영시', '하동군', '함안군', '함양군', '합천군'],
    '제주특별자치도': ['서귀포시', '제주시']
  };

  const handleCityChange = (city: string) => {
    setSelectedCity(city);
    setSelectedDistrict('');
    setSignupData({ ...signupData, residence: '' });
  };

  const handleDistrictChange = (district: string) => {
    setSelectedDistrict(district);
    setSignupData({ ...signupData, residence: `${selectedCity} ${district}` });
  };

  // 관심 분야 토글 함수 (통합: 전체 최대 3개)
  const handleInterestToggle = (type: 'announcement' | 'field' | 'program', value: string) => {
    const isSelected = selectedInterests.some(item => item.type === type && item.value === value);
    
    if (isSelected) {
      // 선택 해제
      setSelectedInterests(selectedInterests.filter(item => !(item.type === type && item.value === value)));
    } else if (selectedInterests.length < 3) {
      // 선택 추가 (전체 3개 미만일 때만)
      setSelectedInterests([...selectedInterests, { type, value }]);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!loginData.id || !loginData.password) {
      toast.error('아이디와 비밀번호를 입력해주세요.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await login({
        id: loginData.id,
        password: loginData.password,
      });

      if (response.isSuccess) {
        toast.success('로그인이 완료되었습니다!');
        const serverId = (response as any).data?.id || loginData.id;
        onLoginSuccess(serverId);
        setLoginData({ id: '', password: '' });
        onClose();
      } else {
        toast.error(response.message || '로그인 실패');
      }
    } catch (error) {
      console.error('로그인 오류:', error);
      toast.error('로그인 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!signupData.id || !signupData.password) {
      toast.error('아이디와 비밀번호를 입력해주세요.');
      return;
    }
    
    if (usernameCheckStatus === 'error') {
      toast.error('서버 연결 실패. 네트워크를 확인해주세요.');
      return;
    }
    
    if (usernameCheckStatus !== 'available') {
      toast.error('사용 가능한 아이디를 입력해주세요.');
      return;
    }
    
    if (signupData.password !== signupData.passwordConfirm) {
      toast.error('비밀번호가 일치하지 않습니다.');
      setPasswordMatchError(true);
      return;
    }
    
    if (signupData.password.length < 6) {
      toast.error('비밀번호는 최소 6자 이상이어야 합니다.');
      return;
    }

    if (selectedInterests.length < 1) {
      toast.error('관심 분야를 최소 1개 이상 선택해주세요.');
      return;
    }

    setIsLoading(true);
    try {
      // 관심 분야를 타입별로 분류
      const announcementCategories = selectedInterests
        .filter(item => item.type === 'announcement')
        .map(item => item.value);
      const fields = selectedInterests
        .filter(item => item.type === 'field')
        .map(item => item.value);
      const programCategories = selectedInterests
        .filter(item => item.type === 'program')
        .map(item => item.value);

      const registerPayload = {
        ...signupData,
        interestAnnouncementCategoryName: announcementCategories,
        interestFieldName: fields,
        interestProgramCategoryName: programCategories,
      };
      
      const response = await register(registerPayload);

      if (response.isSuccess) {
        toast.success('회원가입이 완료되었습니다!');
        
        // 회원가입 성공 후 자동 로그인
        try {
          const loginResponse = await login({ id: signupData.id, password: signupData.password });
          
          if (loginResponse.isSuccess) {
            const serverId = (loginResponse as any).data?.id || signupData.id;
            onLoginSuccess(serverId);
            
            // 상태 초기화
            setSignupData({
              id: '',
              password: '',
              passwordConfirm: '',
              name: '',
              gender: 'MALE',
              militaryStatus: false,
              grade: 1,
              currentSemester: 1,
              department: '',
              enrollmentStatus: 'ENROLLED',
              residence: '',
              interestAnnouncementCategoryName: [],
              interestFieldName: [],
              interestProgramCategoryName: [],
            });
            setUsernameCheckStatus('idle');
            setPasswordMatchError(false);
            setSelectedCity('');
            setSelectedDistrict('');
            setSelectedInterests([]);
            onClose();
          } else {
            toast.error('회원가입은 성공했으나 로그인에 실패했습니다. 다시 로그인해주세요.');
          }
        } catch (loginError) {
          console.error('자동 로그인 오류:', loginError);
          toast.error('회원가입은 성공했으나 로그인에 실패했습니다. 다시 로그인해주세요.');
        }
      } else {
        toast.error(response.message || '회원가입 실패');
      }
    } catch (error) {
      console.error('회원가입 오류:', error);
      toast.error('회원가입 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const checkUsernameAvailability = async (username: string) => {
    if (!username) {
      setUsernameCheckStatus('idle');
      return;
    }

    setUsernameCheckStatus('checking');
    try {
      const resp = await apiCheckUsernameAvailability(username);
      if (resp.isSuccess) {
        setUsernameCheckStatus('available');
      } else {
        setUsernameCheckStatus('taken');
      }
    } catch (error) {
      console.error('아이디 중복 확인 오류:', error);
      setUsernameCheckStatus('error');
    }
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const id = e.target.value;
    setSignupData({ ...signupData, id });
    if (id) {
      checkUsernameAvailability(id);
    } else {
      setUsernameCheckStatus('idle');
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value;
    setSignupData({ ...signupData, password });
    if (signupData.passwordConfirm && password !== signupData.passwordConfirm) {
      setPasswordMatchError(true);
    } else {
      setPasswordMatchError(false);
    }
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const passwordConfirm = e.target.value;
    setSignupData({ ...signupData, passwordConfirm });
    if (signupData.password && passwordConfirm !== signupData.password) {
      setPasswordMatchError(true);
    } else {
      setPasswordMatchError(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] !max-h-[95vh] !h-auto flex flex-col p-6 overflow-hidden">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>숭실대학교 AI 맞춤형 정보 플랫폼</DialogTitle>
          <DialogDescription>
            로그인하고 맞춤형 학교 공지사항을 확인하세요
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="login" className="flex-1 flex flex-col min-h-0 mt-4">
          <TabsList className="grid w-full grid-cols-2 flex-shrink-0">
            <TabsTrigger value="login">로그인</TabsTrigger>
            <TabsTrigger value="signup">회원가입</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="mt-4 flex-shrink-0">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="login-username">아이디</Label>
                <Input
                  id="login-username"
                  type="text"
                  placeholder="아이디를 입력하세요"
                  value={loginData.id}
                  onChange={(e) => setLoginData({ ...loginData, id: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="login-password">비밀번호</Label>
                <Input
                  id="login-password"
                  type="password"
                  placeholder="••••••••"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? '로그인 중...' : '로그인'}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup" className="mt-4 flex-1 min-h-0" style={{display: 'flex', flexDirection: 'column'}}>
            <div 
              className="border-4 border-red-500 rounded-lg bg-yellow-50 p-4"
              style={{
                height: '450px',
                overflowY: 'scroll',
                WebkitOverflowScrolling: 'touch'
              }}
            >
              <form onSubmit={handleSignup} className="space-y-4">
                {/* 1. 아이디/비밀번호 */}
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="signup-username">아이디 *</Label>
                    <Input
                      id="signup-username"
                      type="text"
                      placeholder="아이디를 입력하세요"
                      value={signupData.id}
                      onChange={handleUsernameChange}
                      required
                    />
                    {usernameCheckStatus === 'checking' && (
                      <p className="text-sm text-gray-500">아이디 확인 중...</p>
                    )}
                    {usernameCheckStatus === 'available' && (
                      <p className="text-sm text-green-500 flex items-center">
                        <CheckCircle2 className="inline-block mr-1 w-4 h-4" />
                        사용 가능한 아이디입니다.
                      </p>
                    )}
                    {usernameCheckStatus === 'taken' && (
                      <p className="text-sm text-red-500 flex items-center">
                        <AlertCircle className="inline-block mr-1 w-4 h-4" />
                        이미 사용 중인 아이디입니다.
                      </p>
                    )}
                    {usernameCheckStatus === 'error' && (
                      <p className="text-sm text-orange-500 flex items-center">
                        <AlertCircle className="inline-block mr-1 w-4 h-4" />
                        서버 연결 실패. 아이디를 다시 입력하거나 계속 진행하세요.
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="signup-password">비밀번호 *</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="••••••••"
                      value={signupData.password}
                      onChange={handlePasswordChange}
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="signup-confirm-password">비밀번호 확인 *</Label>
                    <Input
                      id="signup-confirm-password"
                      type="password"
                      placeholder="••••••••"
                      value={signupData.passwordConfirm}
                      onChange={handleConfirmPasswordChange}
                      required
                    />
                    {passwordMatchError && (
                      <p className="text-sm text-red-500 flex items-center">
                        <AlertCircle className="inline-block mr-1 w-4 h-4" />
                        비밀번호가 일치하지 않습니다.
                      </p>
                    )}
                  </div>
                </div>

                {/* 2. 개인정보 및 학적정보 */}
                <div className="space-y-3 pt-4 border-t">
                  <div className="space-y-1.5">
                    <Label htmlFor="signup-name">이름</Label>
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="이름을 입력하세요"
                      value={signupData.name}
                      onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="signup-department">학과 *</Label>
                    <Input
                      id="signup-department"
                      type="text"
                      placeholder="예: 소프트웨어학부"
                      value={signupData.department}
                      onChange={(e) => setSignupData({ ...signupData, department: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="signup-status">재학 상태 *</Label>
                    <Select 
                      value={signupData.enrollmentStatus} 
                      onValueChange={(value: 'ENROLLED' | 'LEAVE' | 'GRADUATED') => {
                        setSignupData({ 
                          ...signupData, 
                          enrollmentStatus: value,
                          grade: value === 'GRADUATED' ? 0 : signupData.grade,
                          currentSemester: value === 'GRADUATED' ? 0 : signupData.currentSemester,
                        });
                      }}
                    >
                      <SelectTrigger id="signup-status">
                        <SelectValue placeholder="재학상태를 선택하세요" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ENROLLED">재학</SelectItem>
                        <SelectItem value="LEAVE">휴학</SelectItem>
                        <SelectItem value="GRADUATED">졸업</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {signupData.enrollmentStatus !== 'GRADUATED' && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="signup-grade">학년 *</Label>
                        <Input
                          id="signup-grade"
                          type="text"
                          placeholder="예: 1, 2, 3, 4"
                          value={signupData.grade}
                          onChange={(e) => {
                            const value = e.target.value;
                            // 빈 값이거나 정수인 경우만 허용
                            if (value === '' || /^\d+$/.test(value)) {
                              setSignupData({ ...signupData, grade: value === '' ? 1 : parseInt(value) });
                            } else {
                              toast.error('학년은 정수만 입력 가능합니다.');
                            }
                          }}
                          required
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="signup-semester">학기 *</Label>
                        <Input
                          id="signup-semester"
                          type="text"
                          placeholder="예: 1, 2, 3..."
                          value={signupData.currentSemester}
                          onChange={(e) => {
                            const value = e.target.value;
                            // 빈 값이거나 정수인 경우만 허용
                            if (value === '' || /^\d+$/.test(value)) {
                              setSignupData({ ...signupData, currentSemester: value === '' ? 1 : parseInt(value) });
                            } else {
                              toast.error('학기는 정수만 입력 가능합니다.');
                            }
                          }}
                          required
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <Label htmlFor="signup-gender">성별</Label>
                    <Select 
                      value={signupData.gender} 
                      onValueChange={(value: 'MALE' | 'FEMALE') => {
                        setSignupData({ ...signupData, gender: value });
                      }}
                    >
                      <SelectTrigger id="signup-gender">
                        <SelectValue placeholder="성별을 선택하세요" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MALE">남성</SelectItem>
                        <SelectItem value="FEMALE">여성</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="signup-military">병역여부</Label>
                    <Select 
                      value={signupData.militaryStatus.toString()} 
                      onValueChange={(value: string) => {
                        setSignupData({ ...signupData, militaryStatus: value === 'true' });
                      }}
                    >
                      <SelectTrigger id="signup-military">
                        <SelectValue placeholder="군필 여부를 선택하세요" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">군필</SelectItem>
                        <SelectItem value="false">미필 / 해당없음</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="signup-city">시/도 선택</Label>
                      <select
                        id="signup-city"
                        value={selectedCity}
                        onChange={(e) => handleCityChange(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">시/도 선택</option>
                        <option value="서울특별시">서울특별시</option>
                        <option value="부산광역시">부산광역시</option>
                        <option value="대구광역시">대구광역시</option>
                        <option value="인천광역시">인천광역시</option>
                        <option value="광주광역시">광주광역시</option>
                        <option value="대전광역시">대전광역시</option>
                        <option value="울산광역시">울산광역시</option>
                        <option value="세종특별자치시">세종특별자치시</option>
                        <option value="경기도">경기도</option>
                        <option value="강원특별자치도">강원특별자치도</option>
                        <option value="충청북도">충청북도</option>
                        <option value="충청남도">충청남도</option>
                        <option value="전북특별자치도">전북특별자치도</option>
                        <option value="전라남도">전라남도</option>
                        <option value="경상북도">경상북도</option>
                        <option value="경상남도">경상남도</option>
                        <option value="제주특별자치도">제주특별자치도</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="signup-district">시/군/구 선택</Label>
                      <select
                        id="signup-district"
                        value={selectedDistrict}
                        onChange={(e) => handleDistrictChange(e.target.value)}
                        disabled={!selectedCity}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                      >
                        <option value="">시/군/구 선택</option>
                        {selectedCity && districtsByCity[selectedCity]?.map((district) => (
                          <option key={district} value={district}>{district}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* 3. 관심 분야 */}
                <div className="space-y-2 pt-4 border-t">
                  <Label>관심 분야 선택 * (최소 1개, 최대 3개)</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {interestOptions.map((option) => {
                      const isSelected = selectedInterests.some(
                        item => item.type === option.type && item.value === option.value
                      );
                      return (
                        <Button
                          key={`${option.type}-${option.value}`}
                          type="button"
                          size="sm"
                          variant={isSelected ? 'default' : 'outline'}
                          onClick={() => handleInterestToggle(option.type, option.value)}
                          className="w-full text-xs h-9"
                          disabled={!isSelected && selectedInterests.length >= 3}
                        >
                          {option.label}
                        </Button>
                      );
                    })}
                  </div>
                  <p className="text-sm text-gray-500">{selectedInterests.length}/3개 선택됨</p>
                </div>

                {/* 회원가입 버튼 */}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? '회원가입 중...' : '회원가입'}
                </Button>
              </form>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
