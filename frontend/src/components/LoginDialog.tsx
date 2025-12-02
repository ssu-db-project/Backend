import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
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
  const [usernameCheckStatus, setUsernameCheckStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');
  const [passwordMatchError, setPasswordMatchError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
    
    // 필수 필드 확인
    if (!signupData.id || !signupData.name || !signupData.department) {
      toast.error('필수 정보를 모두 입력해주세요.');
      return;
    }
    
    // 아이디 중복 확인
    if (usernameCheckStatus !== 'available') {
      toast.error('사용 가능한 아이디를 입력해주세요.');
      return;
    }
    
    // 비밀번호 일치 확인
    if (signupData.password !== signupData.passwordConfirm) {
      toast.error('비밀번호가 일치하지 않습니다.');
      setPasswordMatchError(true);
      return;
    }
    
    // 비밀번호 길이 확인
    if (signupData.password.length < 6) {
      toast.error('비밀번호는 최소 6자 이상이어야 합니다.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await register(signupData);

      if (response.isSuccess) {
        toast.success('회원가입이 완료되었습니다!');
        const serverId = (response as any).data?.id || signupData.id;
        onLoginSuccess(serverId);
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
        onClose();
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
      if (username.length < 3) {
        // 너무 짧으면 아직 검사하지 않음 — 'taken'으로 오해하지 않도록 idle로 유지
        setUsernameCheckStatus('idle');
        return;
      }

      const resp = await apiCheckUsernameAvailability(username);
      // resp.isSuccess === true means 'available' (mock implementation follows that contract)
      if (resp && resp.isSuccess) {
        setUsernameCheckStatus('available');
      } else {
        setUsernameCheckStatus('taken');
      }
    } catch (error) {
      console.error('아이디 중복 확인 오류:', error);
      setUsernameCheckStatus('idle');
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
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>숭실대학교 AI 맞춤형 정보 플랫폼</DialogTitle>
          <DialogDescription>
            로그인하고 맞춤형 학교 공지사항을 확인하세요
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">로그인</TabsTrigger>
            <TabsTrigger value="signup">회원가입</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
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

              <div className="space-y-2">
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

          <TabsContent value="signup">
            <form onSubmit={handleSignup} className="space-y-4 max-h-[500px] overflow-y-auto">
              <div className="space-y-2">
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
              </div>

              <div className="space-y-2">
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

              <div className="space-y-2">
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

              <div className="space-y-2">
                <Label htmlFor="signup-name">이름 *</Label>
                <Input
                  id="signup-name"
                  type="text"
                  placeholder="이름을 입력하세요"
                  value={signupData.name}
                  onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
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

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-grade">학년</Label>
                  <Input
                    id="signup-grade"
                    type="number"
                    min="1"
                    max="4"
                    placeholder="1"
                    value={signupData.grade}
                    onChange={(e) => setSignupData({ ...signupData, grade: parseInt(e.target.value) || 1 })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-semester">학기</Label>
                  <Input
                    id="signup-semester"
                    type="number"
                    min="1"
                    max="8"
                    placeholder="1"
                    value={signupData.currentSemester}
                    onChange={(e) => setSignupData({ ...signupData, currentSemester: parseInt(e.target.value) || 1 })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>성별</Label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="gender"
                      value="MALE"
                      checked={signupData.gender === 'MALE'}
                      onChange={(e) => setSignupData({ ...signupData, gender: e.target.value as 'MALE' | 'FEMALE' })}
                      className="mr-2"
                    />
                    남성
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="gender"
                      value="FEMALE"
                      checked={signupData.gender === 'FEMALE'}
                      onChange={(e) => setSignupData({ ...signupData, gender: e.target.value as 'MALE' | 'FEMALE' })}
                      className="mr-2"
                    />
                    여성
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <Label>병역여부</Label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="military"
                      value="true"
                      checked={signupData.militaryStatus === true}
                      onChange={() => setSignupData({ ...signupData, militaryStatus: true })}
                      className="mr-2"
                    />
                    필
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="military"
                      value="false"
                      checked={signupData.militaryStatus === false}
                      onChange={() => setSignupData({ ...signupData, militaryStatus: false })}
                      className="mr-2"
                    />
                    미필
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-residence">거주지</Label>
                <Input
                  id="signup-residence"
                  type="text"
                  placeholder="예: 서울시 동작구"
                  value={signupData.residence}
                  onChange={(e) => setSignupData({ ...signupData, residence: e.target.value })}
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? '회원가입 중...' : '회원가입'}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
