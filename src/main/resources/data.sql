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
('anc_7', '기타');

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

INSERT INTO college (id, name)
VALUES (1, '숭실대학교');

INSERT INTO department (id, name, college_id)
VALUES ('D001', '소프트웨어학부', 1);

--INSERT INTO program_organization (id, name)
--VALUES ('org_1', '소프트웨어학부');
