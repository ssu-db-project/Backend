---- 1. 기초 참조 테이블들 (먼저 생성해야 함)
--CREATE TABLE college (
--    id INT AUTO_INCREMENT PRIMARY KEY, -- INT 타입
--    name VARCHAR(100) NOT NULL UNIQUE
--);
---- 키워드 관심분야
--CREATE TABLE interest_field (
--    id VARCHAR(20) PRIMARY KEY,
--    name VARCHAR(100) NOT NULL UNIQUE
--);
----공지사항 카테고리
--CREATE TABLE announcement_category (
--    id VARCHAR(20) PRIMARY KEY,
--    name VARCHAR(100) NOT NULL UNIQUE
--);
--
----비교과 카테고리
--CREATE TABLE program_category (
--    id VARCHAR(20) PRIMARY KEY,
--    name VARCHAR(100) NOT NULL UNIQUE
--);
----삭제해야함
--CREATE TABLE program_organization (
--    id VARCHAR(20) PRIMARY KEY,
--    name VARCHAR(100) NOT NULL UNIQUE
--);
----삭제해야함
--CREATE TABLE announcement_department (
--    id VARCHAR(20) PRIMARY KEY,
--    name VARCHAR(100) NOT NULL UNIQUE
--);
---- 2. 의존성이 있는 테이블들 (Department가 College를 참조)
----단과대학
--CREATE TABLE department (
--    id VARCHAR(20) PRIMARY KEY,
--    college_id INT NOT NULL, -- [수정] college.id와 동일하게 INT로 변경
--    name VARCHAR(100) NOT NULL UNIQUE,
--    FOREIGN KEY (college_id) REFERENCES college(id)
--);
--
---- 3. 메인 테이블들 (users로 이름 변경 권장)
--CREATE TABLE users (
--    id VARCHAR(20) PRIMARY KEY,
--    password VARCHAR(255) NOT NULL,
--    name VARCHAR(100),
--    gender VARCHAR(10) CHECK (gender IN ('MALE', 'FEMALE')),
--    military_status BOOLEAN, -- MySQL에서는 TINYINT(1)로 자동 변환됨
--    grade SMALLINT,
--    current_semester SMALLINT,
--    department_id VARCHAR(20),
--    enrollment_status VARCHAR(20) CHECK (enrollment_status IN ('ENROLLED', 'LEAVE', 'GRADUATED')),
--    residence VARCHAR(255),
--    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--    FOREIGN KEY (department_id) REFERENCES department(id)
--);
----공지사항
--CREATE TABLE announcement (
--    id BIGINT AUTO_INCREMENT PRIMARY KEY,
--    source VARCHAR(50) ,
--    category_id VARCHAR(20),
--    department_id VARCHAR(20),
--    department_name VARCHAR(20),
--    title VARCHAR(255) NOT NULL,
--    content TEXT NOT NULL,
--    summary TEXT,
--    url VARCHAR(512) NOT NULL UNIQUE,
--    posted_at TIMESTAMP,
--    status VARCHAR(50),
--    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--    FOREIGN KEY (category_id) REFERENCES announcement_category(id),
--    FOREIGN KEY (department_id) REFERENCES announcement_department(id)
--);
---- 비교과
--CREATE TABLE program (
--    id VARCHAR(20) PRIMARY KEY,
--    title VARCHAR(255) NOT NULL,
--    subtitle VARCHAR(255),
--    category_id VARCHAR(20),
--    organization_id VARCHAR(20),
--    organization_name VARCHAR(50),
--    operation_method VARCHAR(50),
--    apply_start_at TIMESTAMP,
--    apply_end_at TIMESTAMP,
--    program_start_at TIMESTAMP,
--    program_end_at TIMESTAMP,
--    location VARCHAR(255),
--    target_audience TEXT,
--    capacity INT,
--    content TEXT,
--    original_url VARCHAR(512) NOT NULL UNIQUE,
--    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--    FOREIGN KEY (category_id) REFERENCES program_category(id),
--    FOREIGN KEY (organization_id) REFERENCES program_organization(id)
--);
--
---- 4. 하위 종속 테이블 및 매핑 테이블
--CREATE TABLE announcement_file (
--    id BIGINT AUTO_INCREMENT PRIMARY KEY,
--    announcement_id BIGINT NOT NULL, -- announcement.id와 타입 일치(BIGINT)
--    file_url VARCHAR(512) NOT NULL,
--    file_name VARCHAR(255),
--    FOREIGN KEY (announcement_id) REFERENCES announcement(id) ON DELETE CASCADE
--);
----공지사항 관심분야
--CREATE TABLE user_interest_category (
--    user_id VARCHAR(20) NOT NULL,
--    category_id VARCHAR(20) NOT NULL,
--    PRIMARY KEY (user_id, category_id),
--    FOREIGN KEY (user_id) REFERENCES users(id), -- users로 변경
--    FOREIGN KEY (category_id) REFERENCES announcement_category(id)
--);
----비교과 관심분야
--CREATE TABLE user_interest_field (
--    user_id VARCHAR(20) NOT NULL,
--    field_id VARCHAR(20) NOT NULL,
--    PRIMARY KEY (user_id, field_id),
--    FOREIGN KEY (user_id) REFERENCES users(id), -- users로 변경
--    FOREIGN KEY (field_id) REFERENCES interest_field(id)
--);

-- 1. 기초 참조 테이블들
CREATE TABLE college (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

-- 키워드 관심분야
CREATE TABLE interest_field (
    id VARCHAR(20) PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

-- 공지사항 카테고리
CREATE TABLE announcement_category (
    id VARCHAR(20) PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

-- 비교과 카테고리
CREATE TABLE program_category (
    id VARCHAR(20) PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

-- (삭제됨: program_organization)
-- (삭제됨: announcement_department)


-- 2. 의존성이 있는 테이블들 (Department가 College를 참조)
CREATE TABLE department (
    id VARCHAR(20) PRIMARY KEY,
    college_id INT NOT NULL,
    name VARCHAR(100) NOT NULL UNIQUE,
    FOREIGN KEY (college_id) REFERENCES college(id)
);


-- 3. 메인 테이블들
CREATE TABLE users (
    id VARCHAR(20) PRIMARY KEY,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(100),
    gender VARCHAR(10) CHECK (gender IN ('MALE', 'FEMALE')),
    military_status BOOLEAN,
    grade SMALLINT,
    current_semester SMALLINT,
    department_id VARCHAR(20),
    enrollment_status VARCHAR(20) CHECK (enrollment_status IN ('ENROLLED', 'LEAVE', 'GRADUATED')),
    residence VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (department_id) REFERENCES department(id)
);

-- 공지사항 (수정됨: department_id 삭제)
CREATE TABLE announcement (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    source VARCHAR(50),
    category_id VARCHAR(20),
    -- [수정] department_id 삭제됨
    department_name VARCHAR(100), -- [수정] 이름 저장용 (길이 20 -> 100 넉넉하게 변경 권장)
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    summary TEXT,
    url VARCHAR(512) NOT NULL UNIQUE,
    posted_at TIMESTAMP,
    status VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES announcement_category(id)
);

-- 비교과 (수정됨: organization_id 삭제)
CREATE TABLE program (
    id VARCHAR(100) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    subtitle VARCHAR(255),
    category_id VARCHAR(20),
    -- [수정] organization_id 삭제됨
    organization_name VARCHAR(100), -- [수정] 이름 저장용 (길이 50 -> 100)
    operation_method VARCHAR(50),
    apply_start_at TIMESTAMP,
    apply_end_at TIMESTAMP,
    program_start_at TIMESTAMP,
    program_end_at TIMESTAMP,
    location VARCHAR(255),
    target_audience TEXT,
    capacity INT,
    content TEXT,
    original_url VARCHAR(512) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES program_category(id)
);


-- 4. 하위 종속 테이블 및 매핑 테이블
CREATE TABLE announcement_file (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    announcement_id BIGINT NOT NULL,
    file_url VARCHAR(512) NOT NULL,
    file_name VARCHAR(255),
    FOREIGN KEY (announcement_id) REFERENCES announcement(id) ON DELETE CASCADE
);

-- 1. 공지사항 관심분야 매핑 (수정됨)
CREATE TABLE user_interest_category (
    user_id VARCHAR(20) NOT NULL,
    category_id VARCHAR(20) NOT NULL,
    PRIMARY KEY (user_id, category_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE, -- ★ 여기 추가
    FOREIGN KEY (category_id) REFERENCES announcement_category(id) ON DELETE CASCADE -- 카테고리 지워져도 같이 삭제
);

-- 2. 관심 키워드 매핑 (수정됨)
CREATE TABLE user_interest_field (
    user_id VARCHAR(20) NOT NULL,
    field_id VARCHAR(20) NOT NULL,
    PRIMARY KEY (user_id, field_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE, -- ★ 여기 추가
    FOREIGN KEY (field_id) REFERENCES interest_field(id) ON DELETE CASCADE
);

-- 3. 비교과 관심 카테고리 매핑 (수정됨)
CREATE TABLE user_interest_program_category (
    user_id VARCHAR(20) NOT NULL,
    category_id VARCHAR(20) NOT NULL,
    PRIMARY KEY (user_id, category_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE, -- ★ 여기 추가
    FOREIGN KEY (category_id) REFERENCES program_category(id) ON DELETE CASCADE
);
-- 북마크 테이블
CREATE TABLE bookmark (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(20) NOT NULL,
    announcement_id BIGINT,
    program_id VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (announcement_id) REFERENCES announcement(id) ON DELETE CASCADE,
    FOREIGN KEY (program_id) REFERENCES program(id) ON DELETE CASCADE
);
