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
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [signupData, setSignupData] = useState({ username: '', password: '', confirmPassword: '' });
  const [usernameCheckStatus, setUsernameCheckStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');
  const [passwordMatchError, setPasswordMatchError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!loginData.username || !loginData.password) {
      toast.error('아이디와 비밀번호를 입력해주세요.');
      return;
    }

    setIsLoading(true);
    try {
      // API 호출 준비 (실제 연결은 백엔드 팀이 진행)
      const response = await login({
        username: loginData.username,
        password: loginData.password,
      });

      if (response.isSuccess) {
        toast.success('로그인이 완료되었습니다!');
        const serverId = (response as any).data?.id || (response as any).data?.userId || loginData.username;
        onLoginSuccess(serverId);
        setLoginData({ username: '', password: '' });
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
    
    // 아이디 중복 확인
    if (usernameCheckStatus !== 'available') {
      toast.error('사용 가능한 아이디를 입력해주세요.');
      return;
    }
    
    // 비밀번호 일치 확인
    if (signupData.password !== signupData.confirmPassword) {
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
      // API 호출 준비 (실제 연결은 백엔드 팀이 진행)
      const response = await register({
        username: signupData.username,
        password: signupData.password,
        confirmPassword: signupData.confirmPassword,
      });

      if (response.isSuccess) {
        toast.success('회원가입이 완료되었습니다!');
        const serverId = (response as any).data?.id || signupData.username;
        onLoginSuccess(serverId);
        setSignupData({ username: '', password: '', confirmPassword: '' });
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
    const username = e.target.value;
    setSignupData({ ...signupData, username });
    if (username) {
      checkUsernameAvailability(username);
    } else {
      setUsernameCheckStatus('idle');
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value;
    setSignupData({ ...signupData, password });
    if (signupData.confirmPassword && password !== signupData.confirmPassword) {
      setPasswordMatchError(true);
    } else {
      setPasswordMatchError(false);
    }
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const confirmPassword = e.target.value;
    setSignupData({ ...signupData, confirmPassword });
    if (signupData.password && confirmPassword !== signupData.password) {
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
                  value={loginData.username}
                  onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
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
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-username">아이디</Label>
                <Input
                  id="signup-username"
                  type="text"
                  placeholder="아이디를 입력하세요"
                  value={signupData.username}
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
                <Label htmlFor="signup-password">비밀번호</Label>
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
                <Label htmlFor="signup-confirm-password">비밀번호 확인</Label>
                <Input
                  id="signup-confirm-password"
                  type="password"
                  placeholder="••••••••"
                  value={signupData.confirmPassword}
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
