INSERT INTO interest_field (id, name) VALUES
('field_1', '데이터'),
('field_2', '반도체'),
('field_3', '통신'),
('field_4', '방산'),
('field_5', '자동차');

INSERT INTO announcement_category (id, name) VALUES
('anc_1', '학사'),
('anc_2', '장학'),
('anc_3', '국제교류'),
('anc_4', '외국인유학생'),
('anc_5', '채용'),
('anc_6', '봉사'),
('anc_7', '기타'),
('anc_8', '비교과·행사'),
('anc_9', '교직'),
('anc_10', '교원채용');

INSERT INTO program_category (id, name) VALUES
('prg_1', '상담/멘토링/코칭'),
('prg_2', '공모전/경진대회'),
('prg_3', '특강/워크숍'),
('prg_4', '소모임/동아리'),
('prg_5', '국내/외 현장실습, 인턴십'),
('prg_6', '공연, 전시회/견학, 답사'),
('prg_7', '자격증/어학시험'),
('prg_8', '서포터즈/홍보대사'),
('prg_9', '국내/외 봉사활동'),
('prg_10', '발표(졸업/논문)'),
('prg_11', '국내/외 교환학생 및 연수'),
('prg_12', '전공탐색프로그램'),
('prg_13', '진로탐색프로그램'),
('prg_14', '채용설명회/채용상담'),
('prg_15', '공공인재양성반'),
('prg_16', '독서및토론'),
('prg_17', '창업'),
('prg_18', 'AI 비교과'),
('prg_19', '졸업생 특화 프로그램'),
('prg_20', '기타');

--INSERT INTO announcement_department (id, name) VALUES
--('D001', '소프트웨어학부'),
--('D002', 'AI융합학부'),
--('D003', '전자정보공학부'),
--('D999', '기타');

-- [1] 단과대학 (College) 데이터
INSERT INTO college (id, name) VALUES (1, 'IT대학');
INSERT INTO college (id, name) VALUES (2, '인문대학');
INSERT INTO college (id, name) VALUES (3, '자연과학대학');
INSERT INTO college (id, name) VALUES (4, '법과대학');
INSERT INTO college (id, name) VALUES (5, '사회과학대학');
INSERT INTO college (id, name) VALUES (6, '경제통상대학');
INSERT INTO college (id, name) VALUES (7, '경영대학');
INSERT INTO college (id, name) VALUES (8, '공과대학');
INSERT INTO college (id, name) VALUES (9, '융합특성화자유전공학부');


-- [2] 학과 (Department) 데이터

-- 1. IT대학 소속 (College ID: 1)
INSERT INTO department (id, name, college_id) VALUES ('D001', '소프트웨어학부', 1);
INSERT INTO department (id, name, college_id) VALUES ('D002', '컴퓨터학부', 1);
INSERT INTO department (id, name, college_id) VALUES ('D003', '전자정보공학부', 1);
INSERT INTO department (id, name, college_id) VALUES ('D004', '글로벌미디어학부', 1);
INSERT INTO department (id, name, college_id) VALUES ('D005', 'AI융합학부', 1);
INSERT INTO department (id, name, college_id) VALUES ('D006', '미디어경영학과', 1);
INSERT INTO department (id, name, college_id) VALUES ('D007', '정보보호학과', 1);

-- 2. 인문대학 소속 (College ID: 2)
INSERT INTO department (id, name, college_id) VALUES ('D008', '기독교학과', 2);
INSERT INTO department (id, name, college_id) VALUES ('D009', '국어국문학과', 2);
INSERT INTO department (id, name, college_id) VALUES ('D010', '영어영문학과', 2);
INSERT INTO department (id, name, college_id) VALUES ('D011', '독어독문학과', 2);
INSERT INTO department (id, name, college_id) VALUES ('D012', '불어불문학과', 2);
INSERT INTO department (id, name, college_id) VALUES ('D013', '중어중문학과', 2);
INSERT INTO department (id, name, college_id) VALUES ('D014', '일어일문학과', 2);
INSERT INTO department (id, name, college_id) VALUES ('D015', '철학과', 2);
INSERT INTO department (id, name, college_id) VALUES ('D016', '사학과', 2);
INSERT INTO department (id, name, college_id) VALUES ('D017', '예술창작학부', 2);
INSERT INTO department (id, name, college_id) VALUES ('D018', '스포츠학부', 2);

-- 3. 자연과학대학 소속 (College ID: 3)
INSERT INTO department (id, name, college_id) VALUES ('D019', '수학과', 3);
INSERT INTO department (id, name, college_id) VALUES ('D020', '물리학과', 3);
INSERT INTO department (id, name, college_id) VALUES ('D021', '화학과', 3);
INSERT INTO department (id, name, college_id) VALUES ('D022', '정보통계·보험수리학과', 3);
INSERT INTO department (id, name, college_id) VALUES ('D023', '의생명시스템학부', 3);

-- 4. 법과대학 소속 (College ID: 4)
INSERT INTO department (id, name, college_id) VALUES ('D024', '법학과', 4);
INSERT INTO department (id, name, college_id) VALUES ('D025', '국제법무학과', 4);

-- 5. 사회과학대학 소속 (College ID: 5)
INSERT INTO department (id, name, college_id) VALUES ('D026', '사회복지학부', 5);
INSERT INTO department (id, name, college_id) VALUES ('D027', '행정학부', 5);
INSERT INTO department (id, name, college_id) VALUES ('D028', '정치외교학과', 5);
INSERT INTO department (id, name, college_id) VALUES ('D029', '정보사회학과', 5);
INSERT INTO department (id, name, college_id) VALUES ('D030', '언론홍보학과', 5);
INSERT INTO department (id, name, college_id) VALUES ('D031', '평생교육학과', 5);

-- 6. 경제통상대학 소속 (College ID: 6)
INSERT INTO department (id, name, college_id) VALUES ('D032', '경제학과', 6);
INSERT INTO department (id, name, college_id) VALUES ('D033', '글로벌통상학과', 6);
INSERT INTO department (id, name, college_id) VALUES ('D034', '금융경제학과', 6);
INSERT INTO department (id, name, college_id) VALUES ('D035', '국제무역학과', 6);

-- 7. 경영대학 소속 (College ID: 7)
INSERT INTO department (id, name, college_id) VALUES ('D036', '경영학부', 7);
INSERT INTO department (id, name, college_id) VALUES ('D037', '회계학과', 7);
INSERT INTO department (id, name, college_id) VALUES ('D038', '벤처중소기업학과', 7);
INSERT INTO department (id, name, college_id) VALUES ('D039', '금융학부', 7);
INSERT INTO department (id, name, college_id) VALUES ('D040', '혁신경영학과', 7);
INSERT INTO department (id, name, college_id) VALUES ('D041', '복지경영학과', 7);
INSERT INTO department (id, name, college_id) VALUES ('D042', '회계세무학과', 7);

-- 8. 공과대학 소속 (College ID: 8)
INSERT INTO department (id, name, college_id) VALUES ('D043', '화학공학과', 8);
INSERT INTO department (id, name, college_id) VALUES ('D044', '신소재공학과', 8);
INSERT INTO department (id, name, college_id) VALUES ('D045', '전기공학부', 8);
INSERT INTO department (id, name, college_id) VALUES ('D046', '기계공학부', 8);
INSERT INTO department (id, name, college_id) VALUES ('D047', '산업·정보시스템공학과', 8);
INSERT INTO department (id, name, college_id) VALUES ('D048', '건축학부', 8);

-- 9. 융합특성화자유전공학부 소속 (College ID: 9)
INSERT INTO department (id, name, college_id) VALUES ('D049', '융합특성화자유전공학부', 9);
INSERT INTO department (id, name, college_id) VALUES ('D050', '차세대반도체학과', 9);

--INSERT INTO program_organization (id, name)
--VALUES ('org_1', '소프트웨어학부');

-- PROGRAM 테이블 INSERT 문
 -- 1. [특성화학과] AI융합학부 콜로퀴움(7차)
 INSERT INTO program (
     id, title, subtitle, category_id, organization_name, operation_method,
     apply_start_at, apply_end_at, program_start_at, program_end_at,
     location, target_audience, capacity, content, original_url, created_at
 ) VALUES (
     'prg_1764851294875',
     '[특성화학과] AI융합학부 콜로퀴움(7차)',
     '[특성화학과] AI융합학부 콜로퀴움(7차)',
     'prg_3',
     'AI융합학부',
     '비대면',
     '2025-12-04 00:00:00',
     '2025-12-11 23:59:00',
     '2025-12-12 12:00:00',
     '2025-12-12 14:00:00',
     '온라인 ZOOM',
     '숭실대학교 학생(재학, 휴학, 수료)',
     100,
     '2025학년도 AI융합학부 콜로퀴움(7차)를 안내합니다. 학생들의 많은 관심과 참여 바랍니다. 1. 일시 : 2025.12.12(금) 12:00 2. 장소 : 온라인 ZOOM(https://ssu-ac-kr.zoom.us/my/ssuaix)  * 참여자 확인을 위해 줌링크 접속시 학번-이름으로 변경 3. 강사 : 박재식 교수(서울대학교 컴퓨터공학부) 4. 주제 : AI 기술 동향: 시각 지능 분야 5. 신청 : 12.11(목)까지 슈패스(SSU-PATH)',
     'https://path.ssu.ac.kr/ptfol/imng/icmpNsbjtPgm/findIcmpNsbjtPgmInfo.do?encSddpbSeq=0f54a6f2f29e5b468142836739bfd6f4',
     '2025-12-04 21:28:14' -- 로그 타임스탬프 근사치 사용
 );

 -- 2. [특성화학과] AI융합학부 콜로퀴움(6차)
 INSERT INTO program (
     id, title, subtitle, category_id, organization_name, operation_method,
     apply_start_at, apply_end_at, program_start_at, program_end_at,
     location, target_audience, capacity, content, original_url, created_at
 ) VALUES (
     'prg_1764851302813',
     '[특성화학과] AI융합학부 콜로퀴움(6차)',
     '[특성화학과] AI융합학부 콜로퀴움(6차)',
     'prg_3',
     'AI융합학부',
     '비대면',
     '2025-12-04 00:00:00',
     '2025-12-09 23:59:00',
     '2025-12-10 12:00:00',
     '2025-12-10 14:00:00',
     '온라인 ZOOM(https://ssu-ac-kr.zoom.us/my/ssuaix)',
     '숭실대학교 학생 (재학, 휴학, 수료)',
     100,
     '콜로퀴움을 통해 현 업계의 동향을 파악하고, 관련 분야의 지식 및 취업 정보 등을 제공하고자 한다. 현업에 종사중인 전문가를 초청하여 관련 분야의 지식과 함께 현 업계의 동향을 파악하고 취업에 관련된 정보를 제공하고자 하는 프로그램입니다.',
     'https://path.ssu.ac.kr/ptfol/imng/icmpNsbjtPgm/findIcmpNsbjtPgmInfo.do?encSddpbSeq=fe67d9f4e3715b71b018f92d6349bb27',
     '2025-12-04 21:28:22' -- 로그 타임스탬프 근사치 사용
 );

 -- 3. 새빛독서캠프
 INSERT INTO program (
     id, title, subtitle, category_id, organization_name, operation_method,
     apply_start_at, apply_end_at, program_start_at, program_end_at,
     location, target_audience, capacity, content, original_url, created_at
 ) VALUES (
     'prg_1764851309937',
     '새빛독서캠프',
     '숭실대학교 중앙도서관 독서캠프',
     'prg_16',
     '중앙도서관',
     '대면',
     '2025-12-03 00:00:00',
     '2025-12-18 23:59:00',
     '2026-01-15 00:00:00',
     '2026-01-16 00:00:00',
     '서해마루 유스호스텔(경기도 화성시 소재)',
     '숭실대학교 재학생 및 휴학생',
     32,
     '독서캠프는 책 읽을 시간이 없는 학생들에게 1박 2일 동안 독서에 집중할 수 있는 시간을 제공하는 프로그램입니다.',
     'https://path.ssu.ac.kr/ptfol/imng/icmpNsbjtPgm/findIcmpNsbjtPgmInfo.do?encSddpbSeq=10d2e3a9208ee0e31dab9ba2fddcd945',
     '2025-12-04 21:28:29' -- 로그 타임스탬프 근사치 사용
 );

 -- 4. 2026 신입생 예비대학 접수(인문대학)
 INSERT INTO program (
     id, title, subtitle, category_id, organization_name, operation_method,
     apply_start_at, apply_end_at, program_start_at, program_end_at,
     location, target_audience, capacity, content, original_url, created_at
 ) VALUES (
     'prg_1764851318912',
     '2026 신입생 예비대학 접수(인문대학)',
     '2026 신입생 예비대학 접수(인문대학)',
     'prg_12',
     '교양교육운영팀',
     '대면',
     '2025-12-03 00:00:00',
     '2025-12-26 23:59:00',
     '2026-01-14 10:30:00',
     '2026-01-16 13:50:00',
     NULL,
     '숭실대학교 일반인',
     50,
     '신입생 예비대학 프로그램은 교과 과정과 함께 메타버스 및 멘토링 프로그램을 융합한 프로그램으로 신입생의 대학생활 적응을 지원하는 프로그램입니다. 신입생 예비대학은 수시 입학생 신입생을 대상으로 진행하는 학사 제도 안내 및 학과(부)별 선후배 멘토링 프로그램입니다.',
     'https://path.ssu.ac.kr/ptfol/imng/icmpNsbjtPgm/findIcmpNsbjtPgmInfo.do?encSddpbSeq=0beacc39f5e7a221bca8e732badf4233',
     '2025-12-04 21:28:38' -- 로그 타임스탬프 근사치 사용
 );

 -- 5. 숭실대학교 학생기자단 프레슈 16기
 INSERT INTO program (
     id, title, subtitle, category_id, organization_name, operation_method,
     apply_start_at, apply_end_at, program_start_at, program_end_at,
     location, target_audience, capacity, content, original_url, created_at
 ) VALUES (
     'prg_1764851331572',
     '숭실대학교 학생기자단 프레슈 16기',
     '숭실대학교 학생기자단 프레슈 16기',
     'prg_8',
     '홍보팀',
     '대면',
     '2025-12-04 09:00:00',
     '2025-12-15 23:59:00',
     '2026-02-01 00:00:00',
     '2027-01-31 00:00:00',
     NULL,
     '숭실대학교 학생',
     15,
     '숭실대학교 학생기자단 프레슈(PRESSU)는 대외협력실 홍보팀 소속으로, SNS 관리, 홍보 콘텐츠(영상/카드뉴스/인터뷰) 제작, 학교 행사 취재(기사)등의 활동을 수행합니다.',
     'https://path.ssu.ac.kr/ptfol/imng/icmpNsbjtPgm/findIcmpNsbjtPgmInfo.do?encSddpbSeq=7649d2029ce1e4d81444f11746470e97',
     '2025-12-04 21:28:51' -- 로그 타임스탬프 근사치 사용
 );

 -- 6. 프로그래밍 중급(생성형AI와 AI에이전트 개발 교육)
 INSERT INTO program (
     id, title, subtitle, category_id, organization_name, operation_method,
     apply_start_at, apply_end_at, program_start_at, program_end_at,
     location, target_audience, capacity, content, original_url, created_at
 ) VALUES (
     'prg_1764851339161',
     '프로그래밍 중급(생성형AI와 AI에이전트 개발 교육)',
     '프로그래밍 중급(생성형AI와 AI에이전트 개발 교육)',
     'prg_12',
     '공학교육혁신팀',
     '대면',
     '2025-12-02 00:00:00',
     '2025-12-24 10:00:00',
     '2025-12-29 10:00:00',
     '2025-12-31 17:00:00',
     '형남공학관 B109호(창의공학설계실)',
     '공과대학, IT대학, 자연과학대학의 재학, 휴학, 수료 학생',
     25,
     '프로그래밍 언어인 파이썬의 기초 문법을 이해하고 20함수, 데이터 분석과 수집을 위한 스크래핑 방법을 학습하는 프로그램입니다.',
     'https://path.ssu.ac.kr/ptfol/imng/icmpNsbjtPgm/findIcmpNsbjtPgmInfo.do?encSddpbSeq=f479e610b804e0be23c458c52f98cbaf',
     '2025-12-04 21:28:59' -- 로그 타임스탬프 근사치 사용
 );

 -- 7. 2025학년도 27주년 평생교육학과의 날
 INSERT INTO program (
     id, title, subtitle, category_id, organization_name, operation_method,
     apply_start_at, apply_end_at, program_start_at, program_end_at,
     location, target_audience, capacity, content, original_url, created_at
 ) VALUES (
     'prg_1764851346697',
     '2025학년도 27주년 평생교육학과의 날',
     '2025학년도 27주년 평생교육학과의 날',
     'prg_3',
     '평생교육학과',
     '대면',
     '2025-12-02 00:00:00',
     '2025-12-07 00:00:00',
     '2025-12-03 00:00:00',
     '2025-12-10 00:00:00',
     NULL,
     '평생교육학과 학생',
     50,
     '교수, 학부생 및 대학원생, 학부와 석박사 동문들이 한 자리에 모여 평생교육학과의 날을 기념하며, 학부생들에게 장학금을 수여하고 전체 동문간의 network을 구축한다.',
     'https://path.ssu.ac.kr/ptfol/imng/icmpNsbjtPgm/findIcmpNsbjtPgmInfo.do?encSddpbSeq=a37bbf0fb0b81d221d74de34b97f4db4',
     '2025-12-04 21:29:06' -- 로그 타임스탬프 근사치 사용
 );

 -- 8. 2025 동계 금융학부 성공취업캠프
 INSERT INTO program (
     id, title, subtitle, category_id, organization_name, operation_method,
     apply_start_at, apply_end_at, program_start_at, program_end_at,
     location, target_audience, capacity, content, original_url, created_at
 ) VALUES (
     'prg_1764851355515',
     '2025 동계 금융학부 성공취업캠프',
     '2025 동계 금융학부 성공취업캠프',
     'prg_3',
     '금융학부',
     '대면',
     '2025-12-01 00:00:00',
     '2025-12-19 23:59:00',
     '2026-02-27 09:00:00',
     '2026-02-28 18:00:00',
     '일산 동양인재개발원',
     '금융학부 1~4학년생',
     20,
     '본 프로그램은 취업 전략에 대한 체계적 소개를 통해 취업준비에 대한 필요성을 고취시키고, 취업시장에서 개별 학생들의 취업경쟁력을 강화하는 것을 목표로 함',
     'https://path.ssu.ac.kr/ptfol/imng/icmpNsbjtPgm/findIcmpNsbjtPgmInfo.do?encSddpbSeq=56a22a7a2eb9be57ecdbfb6e0ed08192',
     '2025-12-04 21:29:15' -- 로그 타임스탬프 근사치 사용
 );

 -- 9. 글로벌 리더십 프로그램(캐나다어학연수_동계)
 INSERT INTO program (
     id, title, subtitle, category_id, organization_name, operation_method,
     apply_start_at, apply_end_at, program_start_at, program_end_at,
     location, target_audience, capacity, content, original_url, created_at
 ) VALUES (
     'prg_1764851362779',
     '글로벌 리더십 프로그램(캐나다어학연수_동계)',
     '글로벌 리더십 프로그램(캐나다어학연수_동계)',
     'prg_11',
     '금융경제학과',
     '대면',
     '2025-12-01 16:00:00',
     '2025-12-10 23:00:00',
     '2026-01-16 00:00:00',
     '2026-02-14 00:00:00',
     '캐나다 밴쿠버 Global College',
     '숭실대학교 재학 중인 2학년, 3학년, 4학년 학생',
     6,
     '글로벌 리더십 프로그램(캐나다어학연수_동계) 비교과 신청 상세 정보 테이블 입니다.',
     'https://path.ssu.ac.kr/ptfol/imng/icmpNsbjtPgm/findIcmpNsbjtPgmInfo.do?encSddpbSeq=27294516e244807b6f85294b822b0477',
     '2025-12-04 21:29:22' -- 로그 타임스탬프 근사치 사용
 );

 -- 10. 25학년도 겨울방학 맞춤형 심리검사 프로그램
 INSERT INTO program (
     id, title, subtitle, category_id, organization_name, operation_method,
     apply_start_at, apply_end_at, program_start_at, program_end_at,
     location, target_audience, capacity, content, original_url, created_at
 ) VALUES (
     'prg_1764851372897',
     '25학년도 겨울방학 맞춤형 심리검사 프로그램',
     '25학년도 겨울방학 맞춤형 심리검사 프로그램',
     'prg_1',
     '상담팀',
     '대면',
     '2025-12-03 09:00:00',
     '2025-12-24 17:00:00',
     '2025-12-03 09:00:00',
     '2026-01-23 17:00:00',
     '숭실대 상담센터',
     '숭실대학교 학생 (재학, 휴학 가능)',
     80,
     '성격, 진로, 대인관계, 학습 등 다양한 주제의 검사를 실시하고 1:1 또는 집단 활동을 통해 자기 이해를 높이는 프로그램임.',
     'https://path.ssu.ac.kr/ptfol/imng/icmpNsbjtPgm/findIcmpNsbjtPgmInfo.do?encSddpbSeq=9db227791db3cfac574d04f371ddd46f',
     '2025-12-04 21:29:32' -- 로그 타임스탬프 근사치 사용
 );


 -- INSERT 문 구분


-- ANNOUNCEMENT 테이블 INSERT 문
 -- 1. 채용 2026-1학기 언론홍보학과 교육연구조교 모집 안내
 INSERT INTO announcement (
     id, source, category_id, department_name, title, content, summary, url, posted_at, status, created_at
 ) VALUES (
     1,
     NULL, -- 로그에 source 정보가 명시되어 있지 않아 NULL 처리
     'anc_5',
     '사회과학대학 교학팀',
     '채용 2026-1학기 언론홍보학과 교육연구조교 모집 안내',
     '언론홍보학과 사무실에서 근무할 교육연구조교를 아래 아래와 같이 모집하오니 많은 지원 바랍니다.\n  1. 모집요건\n가. 지원 자격 : 현재 본교 대학원 석·박사과정 재학생 및 입학예정자\n나. 채용 인원 : 3명 (내국인 0명 / 외국인 0명)\n다. 우대사항: 한국어 행정 업무가 가능한 자\n  2. 제출서류\n가. 이력서(첨부파일) 1부\n나. 신입생의 경우 대학원 합격 통지서 1부\n  3. 채용일정\n가. 모집기간 : ~  2025.12.16(화)\n나. 모집방법 : e-mail 접수 (masscom@ssu.ac.kr) / 이메일 및 파일 제목: ‘언론홍보학과 연구조교지원_성명’\n다. 면접날짜 : 서류전형 합격자에 한하여 개별 통보\n  4. 유의사항\n가. 임용기간 : 2026.03.02. ~ 2026.08.31. 한 학기 (재학기간 내 연장 가능)\n나. 근무시간 : 교내 조교 근무관련지침에 따름\n(학기 중, 방학 중 – 평일 주 14시간/ 한 학기 단위로 임용)\n다. 근무장소 : 사회과학대학 언론홍보학과 사무실 ( 조만식기념관 747호 )\n라. 담당업무 : 학사업무 및 행정업무\n마. 급여조건: 14시간 근무-3,640,000원(학비 사전감면 장학금 형식으로 지급 or 사후지급)\n※ 장학금의 지급은 대학원 장학금의 지급 기준에 준함.\n  5. 문의 : 언론홍보학과 사무실 02-820-0306\n  6. 기타\n채용 서류를 원본으로 제출한 경우(온라인/전자메일 제출 서류는 해당되지 않음), 모든 서류는 지원 이메일 주소로 반환 청구 신청 시 본인 확인 후 등기 발송(학교 부담)이 가능하며, 반환 요구가 없는 경우 채용 확정일로부터 180일 경과 후 폐기함\n  붙임1. 이력서 및 자기소개서\n붙임1. 이력서 및 자기소개서.hwp',
     '2026-1학기 언론홍보학과 교육연구조교를 모집합니다. 지원 자격은 현재 대학원 석·박사과정 재학생 및 입학예정자이며, 채용 인원은 3명입니다. 모집 기간은 2025년 12월 16일까지이며, 이력서와 신입생의 경우 대학원 합격 통지서를 제출해야 합니다.',
     'https://scatch.ssu.ac.kr/%ea%b3%b5%ec%a7%80%ec%82%ac%ed%95%ad/?f&category&paged=1&slug=2026-1%ED%95%99%EA%B8%B0-%EC%96%B8%EB%A1%A0%ED%99%8D%EB%B3%B4%ED%95%99%EA%B3%BC-%EA%B5%90%EC%9C%A5%EC%97%B0%EA%B5%AC%EC%A1%B0%EA%B5%90-%EB%AA%A8%EC%A7%91-%EC%95%88%EB%82%B4&keyword',
     '2025-12-04 00:00:00',
     '진행',
     '2025-12-04 21:30:18' -- 로그 created_at 값 사용
 );

 -- 2. 채용 2026-1학기 평양숭실재건추진사업팀(총동문회) 교육연구조교 모집 안내
 INSERT INTO announcement (
     id, source, category_id, department_name, title, content, summary, url, posted_at, status, created_at
 ) VALUES (
     2,
     NULL,
     'anc_5',
     '대외협력팀',
     '채용 2026-1학기 평양숭실재건추진사업팀(총동문회) 교육연구조교 모집 안내',
     '2026-1학기 평양숭실재건추진사업팀(총동문회) 교육연구조교 모집\n평양숭실재건추진사업팀(총동문회)에서 2026학년도 1학기 교육연구조교를 다음과 같이 모집하니 관심 있는 분들의 많은 지원 바랍니다.\n  1. 모집 요건\n가. 지원 자격 : 현재 본교 대학원 석·박사과정 재학생 및 입학예정자(2026학년도 전기 기준 정시 신입생 및 재학생)\n나. 채용 인원 : 2명 \n  2. 제출서류\n가. 지원서 1부(붙임1 양식 활용)\n나. 대학원 합격통지서(입학예정자의 경우만)  1부\n  3. 채용 일정\n가. 서류제출 기간 : 12월 4일(목)~12월 15일(월)\n나. 서류제출 방법 : fund@ssu.ac.kr 로 이메일 제출 / 이메일 및 파일 제목: ‘평양숭실재건추진사업팀(총동문회) 교육연구조교 지원_성명’\n다. 면접 일정 : 12/16(화)~12/17(수) 중 서류전형 합격자에 한하여 개별 통보 예정 / 장소: 베어드홀 502호 대외협력팀 사무실\n  4. 임용 기간 : 2026.03.01. ~ 2026.08.31. (연장 가능)\n  5. 근무 시간 : 주 14시간 (9시~17시30분 내에서 근무 요일 및 시간은 조율 가능)\n※타 부서에서 교육연구조교로 임용된 경우 중복 임용이 불가능함.(주당 최대 14시간 근무 가능)\n  6. 담당 업무 : 총동문회 업무 보조(평양숭실재건추진사업팀 소속으로 실제 근무는 본교 총동문회 사무국에서 근무함)\n  7. 급여조건: 장학금 3,640,000원(사전감면, 세부요건은 본교 교육연구조교 급여조건을 따름)\n  8. 문의 : 대외협력팀 (02-820-0309)\n  붙임  1. 조교 이력서 서식 1부.',
     '2026학년도 1학기 평양숭실재건추진사업팀(총동문회) 교육연구조교를 2명 모집하며, 지원은 12월 4일부터 15일까지 가능하고, 이메일로 제출해야 합니다. 면접은 12월 16일부터 17일 사이에 진행될 예정입니다.',
     'https://scatch.ssu.ac.kr/%ea%b3%b5%ec%a7%80%ec%82%ac%ed%95%ad/?f&category&paged=1&slug=2026-1%ED%95%99%EA%B8%B0-%ED%8F%89%EC%96%91%EC%88%AD%EC%8B%A4%EC%9E%AC%EA%B1%B4%EC%B6%94%EC%A7%84%EC%82%AC%EC%97%85%ED%8C%80%EC%B4%9D%EB%8F%99%EB%AC%B8%ED%9A%8C-%EA%B5%90%EC%9C%A1%EC%97%B0%EA%B5%AC&keyword',
     '2025-12-04 00:00:00',
     '진행',
     '2025-12-04 21:30:47'
 );

 -- 3. 채용 2026-1학기 대외협력팀 교육연구조교 모집 안내
 INSERT INTO announcement (
     id, source, category_id, department_name, title, content, summary, url, posted_at, status, created_at
 ) VALUES (
     3,
     NULL,
     'anc_5',
     '대외협력팀',
     '채용 2026-1학기 대외협력팀 교육연구조교 모집 안내',
     '대외협력팀에서 2026학년도 1학기 교육연구조교를 다음과 같이 모집하니 관심 있는 분들의 많은 지원 바랍니다.\n  1. 모집 요건\n가. 지원 자격 : 현재 본교 대학원 석·박사과정 재학생 및 입학예정자(2026학년도 전기 기준 정시 신입생 및 재학생)\n나. 채용 인원 : 2명 \n  2. 제출서류\n가. 지원서 1부(붙임1 양식 활용)\n나. 대학원 합격통지서(입학예정자의 경우만)  1부\n  3. 채용 일정\n가. 서류제출 기간 : 12월 4일(목)~12월 15일(월)\n나. 서류제출 방법 : fund@ssu.ac.kr 로 이메일 제출 / 이메일 및 파일 제목: ‘대외협력팀 교육연구조교 지원_성명’\n다. 면접 일정 : 12/16(화)~12/17(수) 중 서류전형 합격자에 한하여 개별 통보 예정 / 장소: 베어드홀 502호 대외협력팀 사무실\n  4. 임용 기간 : 2026.03.01. ~ 2026.08.31. (연장 가능)\n  5. 근무 시간 : 주 14시간 (9시~17시30분 내에서 근무 요일 및 시간은 조율 가능)\n※타 부서에서 교육연구조교로 임용된 경우 중복 임용이 불가능함.(주당 최대 14시간 근무 가능)\n  6. 담당 업무 : 대외협력팀 부서 업무 보조\n  7. 급여조건: 장학금 3,640,000원(사전감면, 세부요건은 본교 교육연구조교 급여조건을 따름)\n  8. 문의 : 대외협력팀 (02-820-0309)\n  붙임  1. 조교 이력서 서식 1부.',
     '2026-1학기 대외협력팀 교육연구조교 모집 공고. 지원 자격은 대학원 석·박사과정 재학생 및 입학예정자이며, 제출서류로는 지원서와 합격통지서가 필요합니다. 서류제출 기간은 12/4~12/15이며, 면접 일정은 12/16~12/17입니다. 임용 기간은 2026년 3월 1일부터 8월 31일까지입니다.',
     'https://scatch.ssu.ac.kr/%ea%b3%b5%ec%a7%80%ec%82%ac%ed%95%ad/?f&category&paged=1&slug=2026-1%ED%95%99%EA%B8%B0-%EB%8C%80%EC%99%B8%ED%98%91%EB%A0%A5%ED%8C%80-%EA%B5%90%EC%9C%A5%EC%97%B0%EA%B5%AC%EC%A1%B0%EA%B5%90-%EB%AA%A8%EC%A7%91-%EC%95%88%EB%82%B4&keyword',
     '2025-12-04 00:00:00',
     '진행',
     '2025-12-04 21:31:05'
 );

 -- 4. 비교과·행사 숭실대학교 학생기자단 프레슈 16기 모집(~12/18(수)까지)
 INSERT INTO announcement (
     id, source, category_id, department_name, title, content, summary, url, posted_at, status, created_at
 ) VALUES (
     4,
     NULL,
     'anc_8',
     '웹마스터',
     '비교과·행사 숭실대학교 학생기자단 프레슈 16기 모집(~12/18(수)까지)',
     '숭실대학교 학생기자단 프레슈 16기를 모집합니다. 아래 공고 내용을 확인하시고, 많은 관심과 지원 부탁드립니다.\n1. 활동 기간: 2026년 2월 1일 ~ 2026년 1월 31일 (12개월 간)\n2. 세부사항\n1) 서류접수: 2025.12.4.(목)~12.15.(월) 23:59까지\n2) 지원방법: 슈패스 접수(슈패스 게시글 제목: 숭실대학교 학생기자단 프레슈 16기 모집) → 바로가기\n■ 필수 제출 서류\n① 지원서\n② 개인정보수집이용동의서\n③ 본인이 썼던 글(레포트, 독후감 등 자유)\n④ 포트폴리오(사진, 영상, 디자인 파일 등)\n* 서류합격 시, 필기시험 및 면접에 응시해야 합니다.\n3) 서류발표: 2025.12.17.(수) 18:00 예정\n4) 필기 및 면접(약 1시간 소요): 2025.12.22.(월)~12.23.(화) 중 하루 예정\n5) 선발인원: 총 00명\n※ 취재와 제작 분야를 나누지 않고, 기획부터 취재 및 제작까지 진행\n① 취재: 기획기사, 숭실피플(슈피플) 및 인터뷰, 행사 취재 등\n② 제작: 사진·영상 촬영 및 편집, 디자인(포토샵, 일러스트 등)\n6) 지원자격: 2026년 1~2학기 재학 예정인 1~4학년 학생(**휴학/휴학예정자 지원 불가**)\n7) 선발기준\n① 취재, 기사작성 등에 경험이 있거나 관심이 있는 학생\n② 포토샵, 일러스트레이터, 캘리그라피, 사진 촬영, 영상 편집(프리미어, 파이널컷, 베가스 등)이 가능한 학생\n③ 온라인 채널(인스타그램, 페이스북, 블로그 등)을 현재 사용 중인 학생\n④ 블로거 또는 유튜버\n⑤ 숭실인으로서 자부심을 가진 학생\n3. 활동 내용\n1) 월 1~2회 정기회의, 연 2회 워크숍\n2) 학교 행사 취재 및 다양한 홍보 콘텐츠 (카드뉴스, 영상 등) 제작\n3) 학교 홍보 모델 활동, 언론사 인터뷰 등\n4. 혜택 사항\n1) 활동장학금 지급(등록금 초과 수혜 가능)\n2) 숭실대 총장 명의 임명장 및 수료증 발급\n5. 기타\n1) 2026.1.16.(금) 또는 2026.1.23.(금) 멘토링데이 예정\n2) 2026.1.30.(금) 발령장 수여식 예정\n3) 2026년 2월 말 동계 워크숍 예정\n※ 멘토링데이, 발령장 수여식 불참자는 선발 취소됨\n(발령장 수여식 일정은 변경될 수 있음)',
     '숭실대학교 학생기자단 프레슈 16기를 모집합니다. 서류접수는 2025년 12월 4일부터 12월 15일까지이며, 지원자격은 2026년 1~2학기 재학 예정인 1~4학년 학생입니다.',
     'https://scatch.ssu.ac.kr/%ea%b3%b5%ec%a7%80%ec%82%ac%ed%95%ad/?f&category&paged=1&slug=%EC%88%AD%EC%8B%A4%EB%8C%80%ED%95%99%EA%B5%90-%ED%95%99%EC%83%9D%EA%B8%B0%EC%9E%90%EB%8B%A8-%ED%94%84%EB%A0%88%EC%8A%88-16%EA%B8%B0-%EB%AA%A8%EC%A7%9112-18%EC%88%98%EA%B9%8C%EC%A7%80&keyword',
     '2025-12-04 00:00:00',
     '일반',
     '2025-12-04 21:34:08'
 );

 -- 5. 학사 AI전문대학원 학·석사 연계과정 접수 안내(2025.12.3.(수)~12.16.(화))
 INSERT INTO announcement (
     id, source, category_id, department_name, title, content, summary, url, posted_at, status, created_at
 ) VALUES (
     5,
     NULL,
     'anc_1',
     'AI전문대학원',
     '학사 AI전문대학원 학·석사 연계과정 접수 안내(2025.12.3.(수)~12.16.(화))',
     'AI전문대학원 학·석사 연계과정 접수 안내(2025.12.3.(수)~12.16.(화)) 2025년 12월 3일 510 AI전문대학원-학석사-연계과정-안내v.3-20251203.hwp',
     'AI전문대학원에서 학·석사 연계과정 접수를 안내합니다.',
     'https://scatch.ssu.ac.kr/%ea%b3%b5%ec%a7%80%ec%82%ac%ed%95%ad/?f&category&paged=1&slug=ai%EC%A0%84%EB%AC%B8%EB%8C%80%ED%95%99%EC%9B%90-%ED%95%99%C2%B7%EC%84%9D%EC%82%AC-%EC%97%B0%EA%B3%84%EA%B3%BC%EC%A0%95-%EC%A0%91%EC%88%98-%EC%95%88%EB%82%B42025-12-3-%EC%88%9812-16-%ED%99%94&keyword',
     '2025-12-03 00:00:00',
     '진행',
     '2025-12-04 21:34:16'
 );

 -- 6. [한국어교육원] 외국인 유학생 도우미 프로그램 61기 모집 안내
 INSERT INTO announcement (
     id, source, category_id, department_name, title, content, summary, url, posted_at, status, created_at
 ) VALUES (
     6,
     NULL,
     'anc_8',
     '국제팀',
     '[한국어교육원] 외국인 유학생 도우미 프로그램 61기 모집 안내',
     '비교과·행사\n[한국어교육원] 외국인 유학생 도우미 프로그램 61기 모집 안내\n2025년 12월 3일\n855\n1.유학생 도우미란?\n숭실대학교 국제팀 한국어교육원에서 한국어를 공부 중인 외국인유학생과 재학생과의 매칭을 통해 외국인유학생들에게 학교생활 적응과 한국문화 습득을 돕는 제도입니다. 도우미는 외국인유학생이 처음으로 사귀는 한국인 친구이자, 한국문화를 보다 더 가까이서 소개할 수 있기에 문화홍보대사 역할도 합니다.\n외국인이라는 편견 없이 사람에 대한 애정을 갖고, 성실히 활동하실 숭실대 재학생들의 많은 관심과 지원 부탁드립니다.\n2.매칭방식 및 활동내용\nStep 1. 숭실대 재학생(도우미) : 외국인 유학생 = 1:1~3 매칭 → 1쌍\nStep 2. 총 8주 동안 8번 외국인 친구와의 만남 후 간단한 보고서 제출\n– 캠퍼스투어, 은행 및 도서관 방문 보조, USIM구입 등 생활 보조\n– 언어교환\n– 서울명소투어, 맛집탐방\n※ 유학생과 의논하여 위 활동을 자유롭게 선택하여 활동하면 됩니다.\n※ 기타 상황에 따라 대면활동 및 비대면 활동 병행 가능\n3.선발인원및일정\n– 선발인원: 100명(선발인원은 외국유학생들의 신청수요에 따라 변동될 수 있음)\n– 원서접수: 11월 10일(월) ~ 12월 7일(일) 23:59까지\n– 합격자 및 매칭결과 발표: 12월 17일(수) 14:00\n– 오리엔테이션: 12월 19일(금) 15:00 / Zoom으로 진행 (필참)\n– 매칭행사: 12월 22일(월) 18:00 / 전산관 다솜홀에서 진행 (필참)\n(매칭행사도 1주차 활동시간으로 인정해드립니다. 매칭행사 이후에 각자 활동을 이어서 진행하셔도 됩니다.)\n– 프로그램 운영: 2025년 12월 22일(월)~2026년2월 15일(일) / 총 8주\n※ 숭실대학교 어학원의 외국 학생들은 주로 일본, 베트남, 중국 등 아시아권 학생들입니다. 미국 등 서양권 학생과의 매칭만을 바라고 지원할 경우, 원하는 문화권 학생과 매칭 되지 않을 수도 있다는 점 미리 공지 드립니다.\n※ 또한 이 프로그램은 활동비가 지급되지 않습니다. 도우미 프로그램은 유학생과 한국학생이 만날 수 있는 플랫폼을 제공하는 프로그램입니다. 프로그램을 어떻게 활용하는지는 학생들의 자율성에 달려있습니다. 다만, 이수 조건을 충족한 도우미 학생에게는 10만원의 장학금이 지급됩니다.\n4.지원자격\n– 숭실대학교 한국인 재학생 (학부생)\n– 외국어가능자 우대 (일본어, 베트남어, 중국어, 영어)\n※ 한국인 도우미의 어학실력이 매칭 1순위 조건이므로 정확히 본인의 어학 실력을 작성해 주시기 바랍니다.\n– 성실하게 활동하실 분\n5.신청방법\n– 슈패스 신청: “2025 겨울학기 한국어과정 외국인유학생 도우미 61기” 신청\n– 신청방법 : https://path.ssu.ac.kr 사이트에서 “도우미” 검색 후 신청\n6.도우미 혜택\n– 프로그램 참여자 전원: 이수증 및 마일리지 & 총장명의 봉사활동증명서 (숭실대 증명서시스템 조회가능/VMS,1365불가)\n– 프로그램 수료 조건 충족자: 우수도우미 장학금 10만원 (수료기준: 7회 이상 활동, 21시간 이상 활동자)\n7.문의사항\nssulanguage@ssu.ac.kr',
     '숭실대학교에서 외국인 유학생과 재학생을 매칭하여 문화 교류 및 학교 생활 적응을 돕는 도우미 프로그램을 모집합니다.',
     'https://scatch.ssu.ac.kr/%ea%b3%b5%ec%a7%80%ec%82%ac%ed%95%ad/?f&category&paged=1&slug=%ED%95%9C%EA%B5%AD%EC%96%B4%EA%B5%90%EC%9C%A1%EC%9B%90-%EC%99%B8%EA%B5%AD%EC%9D%B8-%EC%9C%A0%ED%95%99%EC%83%9D-%EB%8F%84%EC%9A%B0%EB%AF%B8-%ED%94%84%EB%A1%9C%EA%B7%B8%EB%9E%A8-61%EA%B8%B0-%EB%AA%A8&keyword',
     '2025-12-03 00:00:00',
     '일반',
     '2025-12-04 21:34:44'
 );

 -- 7. 학사 2025 겨울방학 학사경고자 및 학사경고위험군 대상 상담 프로그램 안내
 INSERT INTO announcement (
     id, source, category_id, department_name, title, content, summary, url, posted_at, status, created_at
 ) VALUES (
     7,
     NULL,
     'anc_1',
     '학사팀',
     '학사 2025 겨울방학 학사경고자 및 학사경고위험군 대상 상담 프로그램 안내',
     '2025 겨울방학 학사경고자 및 학사경고위험군 대상 상담 프로그램 안내',
     '학사경고자 및 학사경고위험군을 위한 상담 프로그램에 대한 안내입니다.',
     'https://scatch.ssu.ac.kr/%ea%b3%b5%ec%a7%80%ec%82%ac%ed%95%ad/?f&category&paged=1&slug=2025-%EA%B2%A8%EC%9A%B8%EB%B0%A9%ED%95%99-%ED%95%99%EC%82%AC%EA%B2%BD%EA%B3%A0%EC%9E%90-%EB%B0%8F-%ED%95%99%EC%82%AC%EA%B2%BD%EA%B3%A0%EC%9C%84%ED%97%98%EA%B5%B0-%EB%8C%80%EC%83%81-%EC%83%81%EB%8B%B4&keyword',
     '2025-12-03 00:00:00',
     '진행',
     '2025-12-04 21:34:52'
 );

 -- 8. 교직 2026년 2월 졸업예정자 교원자격 무시험검정원 제출 안내
 INSERT INTO announcement (
     id, source, category_id, department_name, title, content, summary, url, posted_at, status, created_at
 ) VALUES (
     8,
     NULL,
     'anc_9',
     '학사팀',
     '교직 2026년 2월 졸업예정자 교원자격 무시험검정원 제출 안내',
     '교직\n2026년 2월 졸업예정자 교원자격 무시험검정원 제출 안내\n2025년 12월 3일\n131\n붙임-1.-교원자격무시험검정원서.pdf\n붙임-2.-교원자격무시험검정표_학과_학번_성명.xls\n붙임-3.-교직과정-이수안내-책자.pdf\n붙임-4.-검사결과통보서-예시-양식.hwp',
     '2026년 2월 졸업예정자를 위한 교원자격 무시험검정원 제출 안내.',
     'https://scatch.ssu.ac.kr/%ea%b3%b5%ec%a7%80%ec%82%ac%ed%95%ad/?f&category&paged=1&slug=2026%EB%85%84-2%EC%9B%94-%EC%A1%B8%EC%97%85%EC%98%88%EC%A0%95%EC%9E%90-%EA%B5%90%EC%9B%90%EC%9E%90%EA%B2%A9-%EB%AC%B4%EC%8B%9C%ED%97%98%EA%B2%80%EC%A0%95%EC%9B%90-%EC%A0%9C%EC%B6%9C-%EC%95%88%EB%82%B4&keyword',
     '2025-12-03 00:00:00',
     '진행',
     '2025-12-04 21:34:59'
 );

 -- 9. 학사 2025학년도 겨울계절제 졸업예정자 대상 조기 취업자의 출석 대체 인정 제도 안내(학사과정)
 INSERT INTO announcement (
     id, source, category_id, department_name, title, content, summary, url, posted_at, status, created_at
 ) VALUES (
     9,
     NULL,
     'anc_1',
     '학사팀',
     '학사 2025학년도 겨울계절제 졸업예정자 대상 조기 취업자의 출석 대체 인정 제도 안내(학사과정)',
     '2025년 12월 3일\n324\n붙임1.-조기취업자-출석-대체-인정-제도-시스템-매뉴얼.pdf\n붙임2.-청원서-양식필요시.hwp\n붙임3.-조기취업자-과제물-대체-출석인정-신청서-및-조기취업-확인서양식.hwp',
     '2025학년도 겨울계절제 졸업예정자 대상으로 조기 취업자의 출석 대체 인정 제도에 대한 안내.',
     'https://scatch.ssu.ac.kr/%ea%b3%b5%ec%a7%80%ec%82%ac%ed%95%ad/?f&category&paged=1&slug=2025%ED%95%99%EB%85%84%EB%8F%84-%EA%B2%A8%EC%9A%B8%EA%B3%84%EC%A0%88%EC%A0%9C-%EC%A1%B8%EC%97%85%EC%98%88%EC%A0%95%EC%9E%90-%EB%8C%80%EC%83%81-%EC%A1%B0%EA%B8%B0-%EC%B7%A8%EC%97%85%EC%9E%90%EC%9D%98&keyword',
     '2025-12-03 00:00:00',
     '진행',
     '2025-12-04 21:35:06'
 );