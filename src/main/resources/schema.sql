CREATE TABLE Users (
    id VARCHAR(255) PRIMARY KEY,   -- 사용자 로그인 ID (PK)
    name VARCHAR(255) NOT NULL,    -- 사용자 실제 이름
    password_hash VARCHAR(255) NOT NULL, -- 비밀번호 (해시 저장)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- 기본 인적 정보
    age INT,
    gender VARCHAR(10),
    location VARCHAR(100),       -- 거주지
    job VARCHAR(100),            -- 직업 (예: '학생', '직장인', '자영업자')

    -- 상세 인적 정보
    marital_status VARCHAR(20),  -- 혼인 여부 (예: '미혼', '기혼')
    income_quintile INT,         -- 소득분위 (예: 1~10)
    household_type VARCHAR(50),  -- 가구 유형 (예: '1인 가구', '맞벌이 부부', '다자녀 가구')

    -- 주거 정보
    housing_status VARCHAR(30),  -- 주택 상태 (예: '무주택', '자가', '전세', '월세', '기숙사')

    -- 학생 전용 정보
    school_level VARCHAR(20),    -- 대학 분류 (예: '초중고', '대학')
    school_location VARCHAR(20), -- 학교 지역 (예: '서울', '지방')
    school_system VARCHAR(20)    -- 학제 (예: '2년제', '4년제')
);

CREATE TABLE Categories (
    category_id SERIAL PRIMARY KEY,
    category_name VARCHAR(100) UNIQUE NOT NULL -- '고용', '주거', '창업' 등
);

CREATE TABLE User_Categories (
    user_id INT REFERENCES Users(id) ON DELETE CASCADE,
    category_id INT REFERENCES Categories(category_id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, category_id)
);

CREATE TABLE Policies (
    policy_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,          -- 정책 제목
    summary_3line TEXT,                   -- 세줄 요약
    description TEXT,                     -- 설명 (LLM 가공)
    original_text TEXT,                   -- 원문
    source_url VARCHAR(2048) NOT NULL,    -- 출처 URL
    source_organization VARCHAR(100),     -- 제공 기관 (예: '고용노동부')
    last_crawled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 데이터 수집/갱신일

    -- 맞춤형 추천 필터 조건
    target_age_min INT DEFAULT 0,         -- 대상 최소 나이
    target_age_max INT DEFAULT 150,       -- 대상 최대 나이
    target_location VARCHAR(255),         -- 대상 지역
    target_job VARCHAR(255),              -- 대상 직업
    target_gender VARCHAR(20),            -- 지원 성별 (예: '남성', '여성', '무관')

    -- 지원 기간
    support_start_date DATE,         -- 지원 시작일 (NULL 가능: 상시모집 등)
    support_end_date DATE            -- 지원 종료일 (NULL 가능: 상시모집 등)
);

CREATE TABLE Policy_Categories (
    policy_id INT REFERENCES Policies(policy_id) ON DELETE CASCADE,
    category_id INT REFERENCES Categories(category_id) ON DELETE CASCADE,
    PRIMARY KEY (policy_id, category_id)
);

CREATE TABLE News (
    news_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,          -- 뉴스 제목
    summary TEXT,                         -- LLM 요약
    description TEXT,                     -- LLM 설명
    source_url VARCHAR(2048) NOT NULL,    -- 원문 출처 URL
    published_at TIMESTAMP,               -- 발행일
    source_name VARCHAR(100)              -- 뉴스 출처 (예: '네이버 뉴스')
);

CREATE TABLE News_Categories (
    news_id INT REFERENCES News(news_id) ON DELETE CASCADE,
    category_id INT REFERENCES Categories(category_id) ON DELETE CASCADE,
    PRIMARY KEY (news_id, category_id)
);

CREATE TABLE News_Policy_Tags (
    news_id INT REFERENCES News(news_id) ON DELETE CASCADE,
    policy_id INT REFERENCES Policies(policy_id) ON DELETE CASCADE,
    PRIMARY KEY (news_id, policy_id)
);

