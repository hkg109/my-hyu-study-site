-- 관리자 모드 보조 설정 테스트: 잠긴 key, 자동 저장 기록 묶기
-- 실행: npx supabase test db
-- 모든 계정과 문서는 가짜다. 트랜잭션 끝에 rollback되어 DB에 남지 않는다.
begin;
select plan(5);

insert into auth.users (id, aud, role, email, email_confirmed_at, raw_app_meta_data, raw_user_meta_data)
values ('a1000000-0000-0000-0000-000000000001', 'authenticated', 'authenticated', 'test.admin2@example.com', now(), '{}', '{}');
insert into public.admins (user_id) values ('a1000000-0000-0000-0000-000000000001');

insert into public.grades (id, name) values ('grade-w', '학년');
insert into public.semesters (grade_id, id, name) values ('grade-w', 'semester-w', '학기');
insert into public.subjects (grade_id, semester_id, id, name) values ('grade-w', 'semester-w', 'subject-w', '과목');
insert into public.practice_keys (key, password_hash, locked) values ('new-key', extensions.crypt('unknown', extensions.gen_salt('bf')), true);
insert into public.documents (id, kind, grade_id, semester_id, subject_id, slug, title, sort, published, access_key)
values
  ('d1000000-0000-0000-0000-000000000001', 'lectures', 'grade-w', 'semester-w', 'subject-w', 'lecture-01', '강의', 1, true, null),
  ('d1000000-0000-0000-0000-000000000002', 'practice', 'grade-w', 'semester-w', 'subject-w', 'exam-01', '족보', 1, true, 'new-key');
insert into public.document_bodies (document_id, body) values ('d1000000-0000-0000-0000-000000000001', '처음');

set local role authenticated;
set local request.jwt.claims = '{"sub":"a1000000-0000-0000-0000-000000000001","role":"authenticated"}';

-- practice_keys는 관리자도 직접 읽지 못하므로(함수로만) 확인은 소유자 권한으로 한다
reset role;
select ok((select locked from public.practice_keys where key = 'new-key'), '비밀번호를 정하지 않은 key는 / 잠김으로 / 표시된다');
set local role authenticated;
select public.set_practice_password('new-key', 'fresh-pass');
reset role;
select ok(not (select locked from public.practice_keys where key = 'new-key'), '비밀번호를 정하면 / 잠김이 / 풀린다');
set local role authenticated;
select ok(public.verify_practice_password('d1000000-0000-0000-0000-000000000002', 'fresh-pass'), '정한 비밀번호로 / 족보가 / 열린다');

-- 자동 저장처럼 여러 번 고쳐도 10분 안에는 기록이 하나만 남는다
update public.document_bodies set body = '둘째' where document_id = 'd1000000-0000-0000-0000-000000000001';
update public.document_bodies set body = '셋째' where document_id = 'd1000000-0000-0000-0000-000000000001';
update public.document_bodies set body = '넷째' where document_id = 'd1000000-0000-0000-0000-000000000001';
select is((select count(*)::int from public.document_revisions where document_id = 'd1000000-0000-0000-0000-000000000001'), 1, '10분 안의 연속 저장은 / 기록을 / 하나만 남긴다');
select is((select body from public.document_revisions where document_id = 'd1000000-0000-0000-0000-000000000001'), '처음', '남은 기록은 / 고치기 전 / 처음 본문이다');

select * from finish();
rollback;
