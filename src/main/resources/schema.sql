-- 1. 기초 참조 테이블들 (먼저 생성해야 함)
CREATE TABLE college (
    id INT AUTO_INCREMENT PRIMARY KEY, -- INT 타입
    name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE interest_field (
    id VARCHAR(20) PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE announcement_category (
    id VARCHAR(20) PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE announcement_department (
    id VARCHAR(20) PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE program_category (
    id VARCHAR(20) PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE program_organization (
    id VARCHAR(20) PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

-- 2. 의존성이 있는 테이블들 (Department가 College를 참조)
CREATE TABLE department (
    id VARCHAR(20) PRIMARY KEY,
    college_id INT NOT NULL, -- [수정] college.id와 동일하게 INT로 변경
    name VARCHAR(100) NOT NULL UNIQUE,
    FOREIGN KEY (college_id) REFERENCES college(id)
);

-- 3. 메인 테이블들 (users로 이름 변경 권장)
CREATE TABLE users (
    id VARCHAR(20) PRIMARY KEY,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(100),
    gender VARCHAR(10) CHECK (gender IN ('MALE', 'FEMALE')),
    military_status BOOLEAN, -- MySQL에서는 TINYINT(1)로 자동 변환됨
    grade SMALLINT,
    current_semester SMALLINT,
    department_id VARCHAR(20),
    enrollment_status VARCHAR(20) CHECK (enrollment_status IN ('ENROLLED', 'LEAVE', 'GRADUATED')),
    residence VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (department_id) REFERENCES department(id)
);

CREATE TABLE announcement (
    id VARCHAR(20) PRIMARY KEY,
    source VARCHAR(50) NOT NULL,
    original_id VARCHAR(100) NOT NULL,
    category_id VARCHAR(20),
    department_id VARCHAR(20),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    summary TEXT,
    url VARCHAR(512) NOT NULL UNIQUE,
    posted_at TIMESTAMP,
    status VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES announcement_category(id),
    FOREIGN KEY (department_id) REFERENCES announcement_department(id),
    UNIQUE (source, original_id)
);

CREATE TABLE program (
    id VARCHAR(20) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    subtitle VARCHAR(255),
    category_id VARCHAR(20),
    organization_id VARCHAR(20),
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
    FOREIGN KEY (category_id) REFERENCES program_category(id),
    FOREIGN KEY (organization_id) REFERENCES program_organization(id)
);

-- 4. 하위 종속 테이블 및 매핑 테이블
CREATE TABLE announcement_file (
    id VARCHAR(20) PRIMARY KEY,
    announcement_id VARCHAR(20) NOT NULL,
    file_url VARCHAR(512) NOT NULL,
    file_name VARCHAR(255),
    FOREIGN KEY (announcement_id) REFERENCES announcement(id)
);

CREATE TABLE user_interest_category (
    user_id VARCHAR(20) NOT NULL,
    category_id VARCHAR(20) NOT NULL,
    PRIMARY KEY (user_id, category_id),
    FOREIGN KEY (user_id) REFERENCES users(id), -- users로 변경
    FOREIGN KEY (category_id) REFERENCES announcement_category(id)
);

CREATE TABLE user_interest_field (
    user_id VARCHAR(20) NOT NULL,
    field_id VARCHAR(20) NOT NULL,
    PRIMARY KEY (user_id, field_id),
    FOREIGN KEY (user_id) REFERENCES users(id), -- users로 변경
    FOREIGN KEY (field_id) REFERENCES interest_field(id)
);