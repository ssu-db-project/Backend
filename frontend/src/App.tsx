import { useState } from 'react';
import { LandingPage } from './components/LandingPage';
import { MainPlatform } from './components/MainPlatform';
import { LoginDialog } from './components/LoginDialog';
import { Toaster } from './components/ui/sonner';
import { UserProfile, AuthUserData } from './lib/types';
import { toggleBookmark, getBookmarks } from './lib/api/bookmark';
import { toast } from 'sonner';
import { logout as apiLogout, updateUserProfile as apiUpdateUserProfile, getUserProfile, getUserInterests } from './lib/api/auth';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [bookmarkedNotices, setBookmarkedNotices] = useState<Set<string>>(new Set());
  const [currentUsername, setCurrentUsername] = useState('');

  const handleLoginClick = () => {
    setShowLoginDialog(true);
  };

  const handleLoginSuccess = async (user: AuthUserData) => {
    setCurrentUsername(user.id);

    // 서버 응답에 일부 필드가 없을 경우 프로필/관심사를 보강
    const needsFetch =
      !user.name ||
      !user.department ||
      (user.interestAnnouncementCategories?.length ?? 0) +
        (user.interestFields?.length ?? 0) +
        (user.interestProgramCategories?.length ?? 0) === 0;

    let enrichedUser = user;

    if (needsFetch) {
      try {
        const profileResp = await getUserProfile();
        const interestsResp = await getUserInterests().catch(() => null);

        const profileData = (profileResp as any)?.data ?? profileResp ?? {};
        const interestData = interestsResp ? (interestsResp as any)?.data ?? interestsResp : undefined;

        enrichedUser = {
          ...user,
          ...profileData,
          interestAnnouncementCategories:
            interestData?.interestAnnouncementCategoryName ?? user.interestAnnouncementCategories ?? [],
          interestFields: interestData?.interestFieldName ?? user.interestFields ?? [],
          interestProgramCategories: interestData?.interestProgramCategoryName ?? user.interestProgramCategories ?? [],
        };
      } catch (err) {
        console.error('로그인 후 프로필 보강 실패:', err);
        // 보강 실패 시 기존 user 데이터로 진행
      }
    }

    const interests = [
      ...(enrichedUser.interestAnnouncementCategories ?? []),
      ...(enrichedUser.interestFields ?? []),
      ...(enrichedUser.interestProgramCategories ?? []),
    ];

    setUserProfile({
      username: enrichedUser.id,
      name: enrichedUser.name ?? '',
      gender: enrichedUser.gender === 'MALE' ? 'male' : 'female',
      hasMilitary: enrichedUser.militaryStatus ? 'yes' : 'no',
      grade: enrichedUser.grade?.toString() ?? null,
      department: enrichedUser.department ?? '',
      college: '',
      status:
        enrichedUser.enrollmentStatus === 'ENROLLED'
          ? 'enrolled'
          : enrichedUser.enrollmentStatus === 'LEAVE'
          ? 'leave'
          : 'graduated',
      semester: enrichedUser.currentSemester?.toString() ?? null,
      location: enrichedUser.residence ?? '',
      interests,
    });

    // 프로필 설정 이후 로그인 상태 전환
    setIsLoggedIn(true);
    setShowLoginDialog(false);

    // 북마크 목록 초기화
    try {
      const bookmarks = await getBookmarks();
      const ids = new Set<string>(bookmarks.map((b: any) => b.targetId));
      setBookmarkedNotices(ids);
    } catch (error) {
      console.error('북마크 초기화 오류:', error);
    }
  };



  const handleUpdateProfile = async (profile: UserProfile) => {
    setUserProfile(profile);
    
    try {
      // UserProfile을 UpdateProfileRequest로 변환
      const updateRequest = {
        password: undefined, // 비밀번호는 별도 변경 기능에서 처리
        name: profile.name,
        gender: profile.gender === 'male' ? 'MALE' as const : 'FEMALE' as const,
        militaryStatus: profile.hasMilitary === 'yes',
        grade: profile.grade ? parseInt(profile.grade) : undefined,
        currentSemester: profile.semester ? parseInt(profile.semester) : undefined,
        department: profile.department,
        enrollmentStatus: profile.status === 'enrolled' ? 'ENROLLED' as const : 
                         profile.status === 'leave' ? 'LEAVE' as const : 
                         'GRADUATED' as const,
        residence: profile.location,
      };
      
      const response = await apiUpdateUserProfile(updateRequest);
      
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
      await toggleBookmark(id, isCurrentlyBookmarked);
      toast.success(isCurrentlyBookmarked ? '북마크가 삭제되었습니다' : '북마크가 추가되었습니다');
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
      {!isLoggedIn ? (
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
          userProfile={userProfile!} 
          onLogout={handleLogout}
          onUpdateProfile={handleUpdateProfile}
          bookmarkedPolicies={bookmarkedNotices}
          onTogglePolicyBookmark={toggleNoticeBookmark}
        />
      )}

      <Toaster />
    </>
  );
}
