import { useState } from 'react';
import { LandingPage } from './components/LandingPage';
import { MainPlatform } from './components/MainPlatform';
import { LoginDialog } from './components/LoginDialog';
import { UserProfileDialog } from './components/UserProfileDialog';
import { Toaster } from './components/ui/sonner';
import { UserProfile } from './lib/types';
import { isProfileComplete } from './lib/utils/validation';
import { toggleBookmark, getBookmarks } from './lib/api/bookmark';
import { getUserProfile } from './lib/api/auth';
import { toast } from 'sonner';
import { logout as apiLogout, updateUserProfile as apiUpdateUserProfile } from './lib/api/auth';

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
  const handleLoginSuccess = async (username: string) => {
    setCurrentUsername(username);
    setIsLoggedIn(true);
    setShowLoginDialog(false);

    // 1) 프로필 조회
    try {
      const profileResp = await getUserProfile();
      // backend may return { isSuccess, message, data } or direct object
      const profileData = (profileResp as any).data || profileResp;

      if (profileData && profileData.id) {
        // map backend UserProfileResponse -> frontend UserProfile
        const mapped: UserProfile = {
          username: profileData.id,
          name: profileData.name || '',
          gender: profileData.gender || 'male',
          hasMilitary: profileData.militaryStatus ? 'yes' : 'no',
          grade: profileData.grade ? String(profileData.grade) : null,
          department: profileData.department || '',
          college: profileData.college || '',
          status: profileData.enrollmentStatus || 'enrolled',
          semester: profileData.currentSemester ? String(profileData.currentSemester) : null,
          location: profileData.residence || '',
          interests: (profileData.interests && profileData.interests.length) ? profileData.interests : [],
        };

        setUserProfile(mapped);
        // 필수 프로필 항목이 비어있으면 프로필 입력 다이얼로그를 표시
        if (!isProfileComplete(mapped)) {
          setShowProfileDialog(true);
        }
      } else {
        // 프로필이 없으면 프로필 입력 필요
        setShowProfileDialog(true);
      }
    } catch (error) {
      console.error('프로필 초기화 오류:', error);
      setShowProfileDialog(true);
    }

    // 2) 북마크 목록 초기화
    try {
      const bmResp = await getBookmarks(username);
      const bmData = (bmResp as any).data || [];
      const ids = new Set<string>((bmData || []).map((b: any) => b.noticeId || b.notice_id || b.noticeId || b.noticeId));
      setBookmarkedNotices(ids);
    } catch (error) {
      console.error('북마크 초기화 오류:', error);
    }
  };

  const handleProfileComplete = async (profile: UserProfile) => {
    setUserProfile(profile);
    setShowProfileDialog(false);
    
    try {
      // API 호출 준비 (실제 연결 시 여기서 동작함)
      const response = await apiUpdateUserProfile(profile);
      
      if (!response.isSuccess) {
        toast.error(response.message || '프로필 저장 실패');
      } else {
        toast.success('프로필이 저장되었습니다.');
      }
    } catch (error) {
      console.error('프로필 저장 오류:', error);
      toast.error('프로필 저장 중 오류가 발생했습니다.');
    }
    
    // TODO: Supabase 연동 - 프로필 저장
    // await supabase.from('profiles').upsert(profile);
  };

  const handleUpdateProfile = async (profile: UserProfile) => {
    setUserProfile(profile);
    
    try {
      // API 호출 준비 (실제 연결 시 여기서 동작함)
      const response = await apiUpdateUserProfile(profile);
      
      if (!response.isSuccess) {
        toast.error(response.message || '프로필 업데이트 실패');
      } else {
        toast.success('프로필이 업데이트되었습니다.');
      }
    } catch (error) {
      console.error('프로필 업데이트 오류:', error);
      toast.error('프로필 업데이트 중 오류가 발생했습니다.');
    }
    
    // TODO: Supabase 연동 - 프로필 업데이트
    // await supabase.from('profiles').update(profile).eq('username', profile.username);
  };

  const handleLogout = async () => {
    try {
      // API 호출 (실제 연결 시 여기서 동작함)
      await apiLogout();
    } catch (error) {
      console.error('로그아웃 API 오류:', error);
    } finally {
      // 로컬 상태 초기화 (API 결과와 관계없이 진행)
      setIsLoggedIn(false);
      setUserProfile(null);
      setBookmarkedNotices(new Set());
      toast.success('로그아웃되었습니다.');
    }
    
    // TODO: Supabase 연동 - 로그아웃
    // await supabase.auth.signOut();
  };

  const toggleNoticeBookmark = async (id: string) => {
    if (!currentUsername) {
      toast.error('로그인이 필요합니다');
      return;
    }

    const isCurrentlyBookmarked = bookmarkedNotices.has(id);
    
    try {
      // 낙관적 업데이트: UI 즉시 반영
      setBookmarkedNotices(prev => {
        const next = new Set(prev);
        if (next.has(id)) {
          next.delete(id);
        } else {
          next.add(id);
        }
        return next;
      });

      // API 호출 (실제 연결 시 여기서 동작함)
      const response = await toggleBookmark(currentUsername, id, isCurrentlyBookmarked);
      
      if (!response.isSuccess) {
        // API 호출 실패 시 롤백
        setBookmarkedNotices(prev => {
          const next = new Set(prev);
          if (isCurrentlyBookmarked) {
            next.add(id);
          } else {
            next.delete(id);
          }
          return next;
        });
        toast.error(response.message || '북마크 처리 실패');
      } else {
        toast.success(isCurrentlyBookmarked ? '북마크가 삭제되었습니다' : '북마크가 추가되었습니다');
      }
    } catch (error) {
      console.error('북마크 토글 오류:', error);
      // 오류 발생 시 롤백
      setBookmarkedNotices(prev => {
        const next = new Set(prev);
        if (isCurrentlyBookmarked) {
          next.add(id);
        } else {
          next.delete(id);
        }
        return next;
      });
      toast.error('북마크 처리 중 오류가 발생했습니다');
    }
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
        </>
      ) : (
        <MainPlatform 
          userProfile={userProfile} 
          onLogout={handleLogout}
          onUpdateProfile={handleUpdateProfile}
          bookmarkedPolicies={bookmarkedNotices}
          onTogglePolicyBookmark={toggleNoticeBookmark}
        />
      )}

      {/* UserProfileDialog는 로그인 여부와 무관하게 항상 렌더링하여
          showProfileDialog 상태로 열고 닫을 수 있도록 함 */}
      <UserProfileDialog
        open={showProfileDialog}
        onComplete={handleProfileComplete}
        username={currentUsername}
      />
      <Toaster />
    </>
  );
}
