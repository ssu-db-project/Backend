import { useState } from 'react';
import { LandingPage } from './components/LandingPage';
import { MainPlatform } from './components/MainPlatform';
import { LoginDialog } from './components/LoginDialog';
import { Toaster } from './components/ui/sonner';
import { UserProfile } from './lib/types';
import { toggleBookmark, getBookmarks } from './lib/api/bookmark';
import { toast } from 'sonner';
import { logout as apiLogout, updateUserProfile as apiUpdateUserProfile, updateUserInterests as apiUpdateUserInterests, getUserProfile, getUserInterests } from './lib/api/auth';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [bookmarkedNotices, setBookmarkedNotices] = useState<Set<string>>(new Set());
  const [currentUsername, setCurrentUsername] = useState('');

  const handleLoginClick = () => {
    setShowLoginDialog(true);
  };

  const handleLoginSuccess = async (username: string) => {
    setCurrentUsername(username);
    setIsLoggedIn(true);
    setShowLoginDialog(false);

    // 프로필 조회
    try {
      const profileResp = await getUserProfile();
      const profileData = (profileResp as any).data || profileResp;

      // 관심 분야 조회
      let allInterests: string[] = [];
      try {
        const interestsResp = await getUserInterests();
        const interestsData = (interestsResp as any).data || interestsResp;
        
        if (interestsData) {
          // 세 가지 관심 분야 배열 통합
          const announcementCategories = interestsData.interestAnnouncementCategoryName || [];
          const fieldNames = interestsData.interestFieldName || [];
          const programCategories = interestsData.interestProgramCategoryName || [];
          
          allInterests = [
            ...announcementCategories,
            ...fieldNames,
            ...programCategories
          ];
        }
      } catch (interestsError) {
        console.error('관심 분야 조회 오류:', interestsError);
        // 관심 분야 조회 실패해도 프로필은 계속 로드
      }

      if (profileData && profileData.id) {
        // 백엔드 응답 매핑: MALE/FEMALE -> male/female, ENROLLED/LEAVE/GRADUATED -> enrolled/leave/graduated
        const mapped: UserProfile = {
          username: profileData.id,
          name: profileData.name || '',
          gender: profileData.gender ? profileData.gender.toLowerCase() as 'male' | 'female' : 'male',
          hasMilitary: profileData.militaryStatus ? 'yes' : 'no',
          grade: profileData.grade ? String(profileData.grade) : null,
          department: profileData.department || '',
          status: profileData.enrollmentStatus ? profileData.enrollmentStatus.toLowerCase() as 'enrolled' | 'leave' | 'graduated' : 'enrolled',
          semester: profileData.currentSemester ? String(profileData.currentSemester) : null,
          location: profileData.residence || '',
          interests: allInterests,
        };

        setUserProfile(mapped);
      } else {
        // 프로필 데이터가 없으면 기본 프로필 생성
        const defaultProfile: UserProfile = {
          username: username,
          name: '',
          gender: 'male',
          hasMilitary: 'no',
          grade: null,
          department: '',
          status: 'enrolled',
          semester: null,
          location: '',
          interests: allInterests,
        };
        setUserProfile(defaultProfile);
      }
    } catch (error) {
      console.error('프로필 조회 오류:', error);
      toast.error('프로필을 불러오는 중 오류가 발생했습니다.');
      
      // 에러 발생 시에도 기본 프로필 생성
      const defaultProfile: UserProfile = {
        username: username,
        name: '',
        gender: 'male',
        hasMilitary: 'no',
        grade: null,
        department: '',
        status: 'enrolled',
        semester: null,
        location: '',
        interests: [],
      };
      setUserProfile(defaultProfile);
    }

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
      
      // 1. 프로필 업데이트
      const response = await apiUpdateUserProfile(updateRequest);
      
      if (!response.isSuccess) {
        toast.error(response.message || '프로필 업데이트 실패');
        return;
      }

      // 2. 관심 분야 업데이트 (3개 배열로 분리)
      const announcementCategories = ['학사', '장학', '국제교류', '외국인유학생', '채용', '봉사', '기타 공지'];
      const fieldKeywords = ['데이터', '반도체', '통신', '방산', '자동차'];
      
      const interestsRequest = {
        interestAnnouncementCategoryName: profile.interests.filter(i => announcementCategories.includes(i)),
        interestFieldName: profile.interests.filter(i => fieldKeywords.includes(i)),
        interestProgramCategoryName: profile.interests.filter(i => 
          !announcementCategories.includes(i) && !fieldKeywords.includes(i)
        ),
      };
      
      await apiUpdateUserInterests(interestsRequest);
      toast.success('프로필이 업데이트되었습니다.');
    } catch (error) {
      console.error('프로필 업데이트 오류:', error);
      const errorMessage = error instanceof Error ? error.message : '프로필 업데이트 중 오류가 발생했습니다.';
      toast.error(errorMessage);
      throw error; // 에러를 다시 throw하여 상위에서 처리 가능하도록
    }
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
      ) : userProfile ? (
        <MainPlatform 
          userProfile={userProfile} 
          onLogout={handleLogout}
          onUpdateProfile={handleUpdateProfile}
          bookmarkedPolicies={bookmarkedNotices}
          onTogglePolicyBookmark={toggleNoticeBookmark}
        />
      ) : (
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-lg text-gray-600">프로필 로딩 중...</p>
        </div>
      )}

      <Toaster />
    </>
  );
}
