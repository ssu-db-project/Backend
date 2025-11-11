CREATE TABLE Users (
    id VARCHAR(255) PRIMARY KEY, -- 사용자 로그인 ID (PK)
    name VARCHAR(255) NOT NULL, -- 사용자 실제 이름
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- 기본 인적 정보
    age INT,
    gender VARCHAR(10),
    job VARCHAR(10),
    location VARCHAR(100) -- 거주지 (대분류)
);

CREATE TABLE User_Details (
    user_id VARCHAR(255) PRIMARY KEY,
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,

    -- 1. 기존 상세 정보
    -- job VARCHAR(100),            -- 직업 (대분류)
    marital_status VARCHAR(20),  -- 혼인 여부
    income_quintile INT,         -- 소득분위
    housing_status VARCHAR(30),  -- 주택 상태

    -- 2. 학생 전용 정보
    school_level VARCHAR(20),
    school_location VARCHAR(20),
    school_system VARCHAR(20),

    -- 3. [신규] 소득/고용 형태 (Yes/No)
    is_regular_worker BOOLEAN DEFAULT FALSE,  -- 정규직
    is_irregular_worker BOOLEAN DEFAULT FALSE, -- 비정규직
    is_part_timer BOOLEAN DEFAULT FALSE,     -- 아르바이트
    is_self_employed BOOLEAN DEFAULT FALSE,   -- 자영업자
    is_job_seeker BOOLEAN DEFAULT FALSE,      -- 구직자

    -- 4. [신규] 가구 유형 (자녀 및 특성)
    child_status VARCHAR(20),           -- 자녀 유형 (예: '초등', '중등')
    is_grandparent_family BOOLEAN DEFAULT FALSE, -- 조손가정
    is_child_head_family BOOLEAN DEFAULT FALSE, -- 소년소녀가정
    is_extended_family BOOLEAN DEFAULT FALSE,    -- 확대가족 (3대 이상)
    is_foster_child BOOLEAN DEFAULT FALSE,       -- 가정위탁아동
    is_adopted_child BOOLEAN DEFAULT FALSE,      -- 입양아동
    is_in_facility BOOLEAN DEFAULT FALSE,        -- 사회복지시설 입소자

    -- 5. [신규] 창업/사업 (Yes/No)
    is_small_business_owner BOOLEAN DEFAULT FALSE, -- 소상공인
    is_preliminary_founder BOOLEAN DEFAULT FALSE,   -- 예비창업자

    -- 6. [신규] 기타 상황 (Yes/No)
    is_infertile BOOLEAN DEFAULT FALSE, -- 난임
    is_postpartum BOOLEAN DEFAULT FALSE, -- 출산 (예: 3년 이내)
    is_moved_in BOOLEAN DEFAULT FALSE   -- 전입(이사) (예: 1년 이내)
);

CREATE TABLE Categories (
    category_id SERIAL PRIMARY KEY,
    category_name VARCHAR(100) UNIQUE NOT NULL -- '고용', '주거', '창업' 등
);

CREATE TABLE User_Categories (
    id VARCHAR(255) REFERENCES Users(id) ON DELETE CASCADE,
    category_id INT REFERENCES Categories(category_id) ON DELETE CASCADE,
    PRIMARY KEY (id, category_id)
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

