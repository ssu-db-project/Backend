### 주요 기능

- 맞춤형 공지사항 추천 (사용자 프로필 기반)
- AI 도우미 (RAG 기반 챗봇: 슈패스 도우미, 숭실 공지 도우미)
- 북마크 기능
- 고급 검색 및 필터링
- 마이 페이지 (프로필 관리, 북마크 관리)
- 반응형 디자인

## 기술 스택

- Frontend: React, TypeScript, Tailwind CSS
- UI Components: shadcn/ui
- Backend (예정): Supabase
- AI: OpenAI API (RAG)
- Build Tool: Vite

## 시작하기

```bash
npm install
npm run dev
npm run build
```

## 프로젝트 구조

```
/
├── lib/
│   ├── types.ts              # TypeScript 타입 정의
│   ├── constants.ts          # 상수 정의
│   └── utils/
│       ├── validation.ts     # 유효성 검사
│       ├── notice.ts         # 공지사항 관련 유틸
│       └── format.ts         # 포맷팅 유틸
│
├── components/
│   ├── notices/              # 공지사항 관련 컴포넌트
│   ├── LandingPage.tsx
│   ├── LoginDialog.tsx
│   ├── MainPlatform.tsx
│   ├── MyPage.tsx
│   └── ui/                   # shadcn/ui 컴포넌트
│
├── styles/
│   └── globals.css           # 디자인 토큰
│
└── App.tsx
```

## 디자인 시스템

### 브랜드 컬러
- Primary (숭실 블루): #1F4788
- Secondary (숭실 레드): #C41E3A
- Accent: #E3F2FD

### 카테고리 컬러
학사(블루), 장학(그린), 국제교류(퍼플), 채용(레드), 봉사(옐로우), 비교과(핑크)

## 사용자 프로필

### 필수 정보
성별, 군필 여부, 단과대학, 학과, 재학 상태, 거주지, 관심 분야(최대 3개)

### 조건부 필수
- 재학/휴학: 학년, 학기 필수
- 졸업: 학년, 학기 null

## 인증 플로우

1. 회원가입: 아이디 중복 확인, 비밀번호 일치 확인, 필수 정보 입력
2. 로그인: 프로필 완성도 확인 → 완성(메인), 미완성(프로필 입력창)
3. 프로필 검증: 필수 정보 누락 시 빨간색 테두리 + 에러 필드로 스크롤

## 공지사항 탭

### 사용자 기반 추천
관심 분야, 학과/학년/성별 타겟팅 기반 필터링

### 전체 DB 기반
모든 공지사항 표시, 고급 검색 필터 제공

## AI 도우미

- 슈패스 도우미: 비교과 공지사항 전용
- 숭실 공지 도우미: 전체 공지사항 대상

## 데이터베이스 스키마 (Supabase)

### profiles
username(PK), name, gender, has_military, grade, department, college, status, semester, location, interests[]

### notices
id(PK), title, category, date, deadline, description, link, target_departments[], target_grades[], target_gender, views

### bookmarks
username(FK), notice_id(FK), created_at

## 주요 유틸리티

### validation.ts
isProfileComplete, getEmptyRequiredFields, isValidEmail, isValidPassword

### notice.ts
filterNoticesByProfile, applyNoticeFilters, sortNotices, getDaysUntilDeadline, isDeadlineNear

### format.ts
formatDate, formatDeadline, formatViews
