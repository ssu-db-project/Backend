import { useState } from 'react';
import { useRef } from 'react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ScrollArea } from './ui/scroll-area';
import { toast } from 'sonner@2.0.3';
import { Info } from 'lucide-react';

export interface UserProfile {
  username: string; // 아이디 (로그인에서 가져옴)
  name?: string; // 이름 (선택)
  gender: string; // 성별
  hasMilitary: string; // 군필 여부
  grade: string | null; // 학년 (졸업생은 null)
  department: string; // 학과
  college: string; // 단과대학
  status: string; // 재/휴학/졸업
  semester: string | null; // 학기 (졸업생은 null)
  location: string; // 거주지
  interests: string[]; // 관심 분야 (최대 3개)
}

interface UserProfileDialogProps {
  open: boolean;
  onComplete: (profile: UserProfile) => void;
  username: string; // 로그인에서 전달받은 아이디
}

const interestOptions = [
  '학사',
  '장학',
  '국제교류',
  '외국인유학생',
  '채용',
  '봉사',
  '기타',
  '비교과-상담/멘토링/코칭',
  '비교과-공모전/경진대회',
  '비교과-특강/워크숍',
];

const colleges = [
  '인문대학',
  '자연과학대학',
  '법과대학',
  '사회과학대학',
  '경제통상대학',
  '경영대학',
  'IT대학',
  '공과대학',
  '베어드학부',
];

const provinces = {
  '서울특별시': ['강남구', '강동구', '강북구', '강서구', '관악구', '광진구', '구로구', '금천구', '노원구', '도봉구', '동대문구', '동작구', '마포구', '서대문구', '서초구', '성동구', '성북구', '송파구', '양천구', '영등포구', '용산구', '은평구', '종로구', '중구', '중랑구'],
  '부산광역시': ['강서구', '금정구', '기장군', '남구', '동구', '동래구', '부산진구', '북구', '사상구', '사하구', '서구', '수영구', '연제구', '영도구', '중구', '해운대구'],
  '대구광역시': ['남구', '달서구', '달성군', '동구', '북구', '서구', '수성구', '중구'],
  '인천광역시': ['강화군', '계양구', '남동구', '동구', '미추홀구', '부평구', '서구', '연수구', '옹진군', '중구'],
  '광주광역시': ['광산구', '남구', '동구', '북구', '서구'],
  '대전광역시': ['대덕구', '동구', '서구', '유성구', '중구'],
  '울산광역시': ['남구', '동구', '북구', '울주군', '중구'],
  '세종특별자치시': ['세종시'],
  '경기도': ['가평군', '고양시', '과천시', '광명시', '광주시', '구리시', '군포시', '김포시', '남양주시', '동두천시', '부천시', '성남시', '수원', '시흥시', '안산시', '안성시', '안양시', '양주시', '양평군', '여주시', '연천군', '오산시', '용인시', '의왕시', '의정부시', '이천시', '파주시', '평택시', '포천시', '하남시', '화성시'],
  '강원도': ['강릉시', '고성군', '동해시', '삼척시', '속초시', '양구군', '양양군', '영월군', '원주시', '인제군', '정선군', '철원군', '춘천시', '태백시', '평창군', '홍천군', '화천군', '횡성군'],
  '충청북도': ['괴산군', '단양군', '보은군', '영동군', '옥천군', '음성군', '제천시', '증평군', '진천군', '청주시', '충주시'],
  '충청남도': ['계룡시', '공주시', '금산군', '논산시', '당진시', '보령시', '부여군', '서산시', '서천군', '아산시', '예산군', '천안시', '청양군', '태안군', '홍성군'],
  '전라북도': ['고창군', '군산시', '김제시', '남원시', '무주군', '부안군', '순창군', '완주군', '익산시', '임실군', '장수군', '전주시', '정읍시', '진안군'],
  '전라남도': ['강진군', '고흥군', '곡성군', '광양시', '구례군', '나주시', '담양군', '목포시', '무안군', '보성군', '순천시', '신안군', '여수시', '영광군', '영암군', '완도군', '장성군', '장흥군', '진도군', '함평군', '해남군', '화순군'],
  '경상북도': ['경산시', '경주시', '고령군', '구미시', '군위군', '김천시', '문경시', '봉화군', '상주시', '성주군', '안동시', '영덕군', '영양군', '영주시', '영천시', '예천군', '울릉군', '울진군', '의성군', '청도군', '청송군', '칠곡군', '포항시'],
  '경상남도': ['거제시', '거창군', '고성군', '김해시', '남해군', '밀양시', '사천시', '산청군', '양산시', '의령군', '진주시', '창녕군', '창원시', '통영시', '하동군', '함안군', '함양군', '합천군'],
  '제주특별자치도': ['서귀포시', '제주시'],
};

export function UserProfileDialog({ open, onComplete, username }: UserProfileDialogProps) {
  const [profile, setProfile] = useState<UserProfile>({
    username: username,
    name: '',
    gender: '',
    hasMilitary: '',
    grade: null,
    department: '',
    college: '',
    status: '',
    semester: null,
    location: '',
    interests: [],
  });
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  
  // Refs for scrolling to error fields
  const genderRef = useRef<HTMLDivElement>(null);
  const militaryRef = useRef<HTMLDivElement>(null);
  const collegeRef = useRef<HTMLDivElement>(null);
  const departmentRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const gradeRef = useRef<HTMLDivElement>(null);
  const semesterRef = useRef<HTMLDivElement>(null);
  const locationRef = useRef<HTMLDivElement>(null);
  const interestsRef = useRef<HTMLDivElement>(null);

  const handleInterestToggle = (interest: string) => {
    setProfile(prev => {
      if (prev.interests.includes(interest)) {
        return {
          ...prev,
          interests: prev.interests.filter(i => i !== interest),
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

  const handleSubmit = () => {
    // Validation
    const newErrors: Record<string, boolean> = {};
    
    if (!profile.gender) newErrors.gender = true;
    if (!profile.hasMilitary) newErrors.hasMilitary = true;
    if (!profile.college) newErrors.college = true;
    if (!profile.department.trim()) newErrors.department = true;
    if (!profile.status) newErrors.status = true;
    if (!profile.location) newErrors.location = true;
    if (profile.interests.length === 0) newErrors.interests = true;
    
    // 재학/휴학인 경우 학년과 학기 필수
    if (profile.status && profile.status !== 'graduated') {
      if (!profile.grade) newErrors.grade = true;
      if (!profile.semester) newErrors.semester = true;
    }
    
    setErrors(newErrors);
    
    // If there are errors, scroll to first error and show toast
    if (Object.keys(newErrors).length > 0) {
      const errorField = Object.keys(newErrors)[0];
      const refs: Record<string, React.RefObject<HTMLDivElement>> = {
        gender: genderRef,
        hasMilitary: militaryRef,
        college: collegeRef,
        department: departmentRef,
        status: statusRef,
        grade: gradeRef,
        semester: semesterRef,
        location: locationRef,
        interests: interestsRef,
      };
      
      const targetRef = refs[errorField];
      if (targetRef?.current) {
        targetRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      
      toast.error('필수 정보를 모두 입력해주세요.');
      return;
    }
    
    onComplete(profile);
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-[600px]" hideClose>
        <DialogHeader>
          <DialogTitle>숭실대학교 학생 정보 입력</DialogTitle>
          <DialogDescription className="flex items-start gap-2">
            <Info className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-500" />
            <span>
              맞춤형 공지사항 추천을 위해 필수 정보를 입력해주세요. 
              {profile.status && profile.status !== 'graduated' && ' 재학/휴학 상태에서는 학년과 학기가 필수입니다.'}
            </span>
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh]">
          <div className="space-y-4 py-4 pr-4">
            {/* 계정 정보 - 아이디는 로그인 정보로 자동 표시 */}
            <div className="space-y-2">
              <Label htmlFor="username">아이디</Label>
              <Input
                id="username"
                value={username}
                disabled
                className="bg-gray-50"
              />
              <p className="text-sm text-gray-500">로그인한 아이디가 자동으로 표시됩니다</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">이름 (선택)</Label>
              <Input
                id="name"
                placeholder="이름을 입력하세요"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              />
            </div>

            {/* 기본 정보 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2" ref={genderRef}>
                <Label htmlFor="gender">성별 *</Label>
                <Select value={profile.gender} onValueChange={(value) => setProfile({ ...profile, gender: value })}>
                  <SelectTrigger className={errors.gender ? 'border-red-500' : ''}>
                    <SelectValue placeholder="성별 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">남성</SelectItem>
                    <SelectItem value="female">여성</SelectItem>
                  </SelectContent>
                </Select>
                {errors.gender && <p className="text-sm text-red-500">성별을 선택해주세요.</p>}
              </div>

              <div className="space-y-2" ref={militaryRef}>
                <Label htmlFor="military">군필 여부 *</Label>
                <Select value={profile.hasMilitary} onValueChange={(value) => setProfile({ ...profile, hasMilitary: value })}>
                  <SelectTrigger className={errors.hasMilitary ? 'border-red-500' : ''}>
                    <SelectValue placeholder="선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">군필</SelectItem>
                    <SelectItem value="no">미필</SelectItem>
                    <SelectItem value="exempt">면제</SelectItem>
                    <SelectItem value="notApplicable">해당없음</SelectItem>
                  </SelectContent>
                </Select>
                {errors.hasMilitary && <p className="text-sm text-red-500">군필 여부를 선택해주세요.</p>}
              </div>
            </div>

            {/* 학적 정보 */}
            <div className="space-y-2" ref={collegeRef}>
              <Label htmlFor="college">단과대학 *</Label>
              <Select value={profile.college} onValueChange={(value) => setProfile({ ...profile, college: value })}>
                <SelectTrigger className={errors.college ? 'border-red-500' : ''}>
                  <SelectValue placeholder="단과대학 선택" />
                </SelectTrigger>
                <SelectContent>
                  {colleges.map((college) => (
                    <SelectItem key={college} value={college}>
                      {college}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.college && <p className="text-sm text-red-500">단과대학을 선택해주세요.</p>}
            </div>

            <div className="space-y-2" ref={departmentRef}>
              <Label htmlFor="department">학과 *</Label>
              <Input
                id="department"
                placeholder="예: 컴퓨터학부"
                value={profile.department}
                onChange={(e) => setProfile({ ...profile, department: e.target.value })}
                className={errors.department ? 'border-red-500' : ''}
              />
              {errors.department && <p className="text-sm text-red-500">학과를 입력해주세요.</p>}
            </div>

            <div className="space-y-2" ref={statusRef}>
              <Label htmlFor="status">재학 상태 *</Label>
              <Select value={profile.status} onValueChange={(value) => setProfile({ ...profile, status: value })}>
                <SelectTrigger className={errors.status ? 'border-red-500' : ''}>
                  <SelectValue placeholder="재학 상태 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="enrolled">재학</SelectItem>
                  <SelectItem value="leave">휴학</SelectItem>
                  <SelectItem value="graduated">졸업</SelectItem>
                </SelectContent>
              </Select>
              {errors.status && <p className="text-sm text-red-500">재학 상태를 선택해주세요.</p>}
            </div>

            {/* 학년과 학기는 재학/휴학인 경우에만 표시 */}
            {profile.status && profile.status !== 'graduated' && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2" ref={gradeRef}>
                  <Label htmlFor="grade">학년 *</Label>
                  <Select value={profile.grade || ''} onValueChange={(value) => setProfile({ ...profile, grade: value })}>
                    <SelectTrigger className={errors.grade ? 'border-red-500' : ''}>
                      <SelectValue placeholder="학년 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1학년</SelectItem>
                      <SelectItem value="2">2학년</SelectItem>
                      <SelectItem value="3">3학년</SelectItem>
                      <SelectItem value="4">4학년</SelectItem>
                      <SelectItem value="graduate">대학원</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.grade && <p className="text-sm text-red-500">학년을 선택해주세요.</p>}
                </div>

                <div className="space-y-2" ref={semesterRef}>
                  <Label htmlFor="semester">학기 (전체 이수 학기) *</Label>
                  <Select value={profile.semester || ''} onValueChange={(value) => setProfile({ ...profile, semester: value })}>
                    <SelectTrigger className={errors.semester ? 'border-red-500' : ''}>
                      <SelectValue placeholder="학기 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1학기</SelectItem>
                      <SelectItem value="2">2학기</SelectItem>
                      <SelectItem value="3">3학기</SelectItem>
                      <SelectItem value="4">4학기</SelectItem>
                      <SelectItem value="5">5학기</SelectItem>
                      <SelectItem value="6">6학기</SelectItem>
                      <SelectItem value="7">7학기</SelectItem>
                      <SelectItem value="8">8학기</SelectItem>
                      <SelectItem value="9+">9학기 이상</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.semester && <p className="text-sm text-red-500">학기를 선택해주세요.</p>}
                </div>
              </div>
            )}

            {/* 거주 정보 */}
            <div className="space-y-2" ref={locationRef}>
              <Label>거주지 *</Label>
              <div className="grid grid-cols-2 gap-2">
                <Select value={selectedProvince} onValueChange={handleProvinceChange}>
                  <SelectTrigger className={errors.location ? 'border-red-500' : ''}>
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

                <Select value={selectedCity} onValueChange={handleCityChange} disabled={!selectedProvince}>
                  <SelectTrigger className={errors.location ? 'border-red-500' : ''}>
                    <SelectValue placeholder="시/군/구 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedProvince && provinces[selectedProvince as keyof typeof provinces].map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {errors.location && <p className="text-sm text-red-500">거주지를 선택해주세요.</p>}
            </div>

            {/* 관심 분야 */}
            <div className="space-y-2" ref={interestsRef}>
              <Label>관심 분야 (최대 3개 선택) *</Label>
              <ScrollArea className={`h-[200px] rounded-md border p-3 ${errors.interests ? 'border-red-500' : ''}`}>
                <div className="grid grid-cols-2 gap-2">
                  {interestOptions.map((interest) => (
                    <Button
                      key={interest}
                      type="button"
                      size="sm"
                      variant={profile.interests.includes(interest) ? 'default' : 'outline'}
                      onClick={() => handleInterestToggle(interest)}
                      className="w-full"
                      disabled={!profile.interests.includes(interest) && profile.interests.length >= 3}
                    >
                      {interest}
                    </Button>
                  ))}
                </div>
              </ScrollArea>
              <p className="text-sm text-gray-500">
                {profile.interests.length}/3개 선택됨
              </p>
              {errors.interests && <p className="text-sm text-red-500">관심 분야를 최소 1개 선택해주세요.</p>}
            </div>
          </div>
        </ScrollArea>

        <Button onClick={handleSubmit} className="w-full">
          시작하기
        </Button>
      </DialogContent>
    </Dialog>
  );
}
