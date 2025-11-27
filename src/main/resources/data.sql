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
('anc_4', '외국인 유학생'),
('anc_5', '채용'),
('anc_6', '봉사'),
('anc_7', '기타');

INSERT INTO program_category (id, name) VALUES
('prg_1', '상담/멘토링/코칭'),
('prg_2', '공모전/경진대회'),
('prg_3', '특강/워크숍');

INSERT INTO announcement_department (id, name) VALUES
('D001', '소프트웨어학부'),
('D002', 'AI융합학부'),
('D003', '전자정보공학부'),
('D999', '기타');

INSERT INTO college (id, name)
VALUES (1, '숭실대학교');

INSERT INTO department (id, name, college_id)
VALUES ('D001', '소프트웨어학부', 1);

