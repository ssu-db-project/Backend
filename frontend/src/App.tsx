import { useState } from 'react';
import { LandingPage } from './components/LandingPage';
import { MainPlatform } from './components/MainPlatform';
import { LoginDialog } from './components/LoginDialog';
import { UserProfileDialog } from './components/UserProfileDialog';
import { Toaster } from './components/ui/sonner';
import { UserProfile } from './lib/types';
import { isProfileComplete } from './lib/utils/validation';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [bookmarkedNotices, setBookmarkedNotices] = useState<Set<string>>(new Set());
  const [currentUsername, setCurrentUsername] = useState('');

  const handleLoginClick = () => {
    setShowLoginDialog(true);
  };

  // 로그인 성공 시 프로필 완성도 확인
  // 필수 정보가 입력되지 않은 경우에만 프로필 입력창 표시
  const handleLoginSuccess = (username: string) => {
    setCurrentUsername(username);
    setIsLoggedIn(true);
    setShowLoginDialog(false);
    
    // TODO: Supabase 연동 - 사용자 프로필 조회
    // const { data: existingProfile } = await supabase
    //   .from('profiles')
    //   .select('*')
    //   .eq('username', username)
    //   .single();
    
    const existingProfile = null; // 임시: Supabase 연동 전
    
    if (existingProfile) {
      if (isProfileComplete(existingProfile)) {
        setUserProfile(existingProfile); // 프로필 완성 → 메인 화면
      } else {
        setShowProfileDialog(true); // 프로필 미완성 → 입력창 표시
      }
    } else {
      setShowProfileDialog(true); // 프로필 없음 → 입력창 표시 (최초 로그인)
    }
  };

  const handleProfileComplete = (profile: UserProfile) => {
    setUserProfile(profile);
    setShowProfileDialog(false);
    
    // TODO: Supabase 연동 - 프로필 저장
    // await supabase.from('profiles').upsert(profile);
  };

  const handleUpdateProfile = (profile: UserProfile) => {
    setUserProfile(profile);
    
    // TODO: Supabase 연동 - 프로필 업데이트
    // await supabase.from('profiles').update(profile).eq('username', profile.username);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserProfile(null);
    setBookmarkedNotices(new Set());
    
    // TODO: Supabase 연동 - 로그아웃
    // await supabase.auth.signOut();
  };

  const toggleNoticeBookmark = (id: string) => {
    setBookmarkedNotices(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        // TODO: Supabase 연동 - 북마크 삭제
        // await supabase.from('bookmarks').delete().match({ username: currentUsername, notice_id: id });
      } else {
        next.add(id);
        // TODO: Supabase 연동 - 북마크 추가
        // await supabase.from('bookmarks').insert({ username: currentUsername, notice_id: id });
      }
      return next;
    });
  };

  return (
    <>
      {!isLoggedIn || !userProfile ? (
        <>
          <LandingPage onLoginClick={handleLoginClick} />
          <LoginDialog
            open={showLoginDialog}
            onClose={() => setShowLoginDialog(false)}
            onLoginSuccess={handleLoginSuccess}
          />
          <UserProfileDialog
            open={showProfileDialog}
            onComplete={handleProfileComplete}
            username={currentUsername}
          />
        </>
      ) : (
        <MainPlatform 
          userProfile={userProfile} 
          onLogout={handleLogout}
          onUpdateProfile={handleUpdateProfile}
          bookmarkedNotices={bookmarkedNotices}
          onToggleNoticeBookmark={toggleNoticeBookmark}
        />
      )}
      <Toaster />
    </>
  );
}
