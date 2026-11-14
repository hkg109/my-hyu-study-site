-- 강의 자료 권한 테스트
-- 실행: npx supabase test db
-- 모든 계정과 문서는 가짜다. 트랜잭션 끝에 rollback되어 DB에 남지 않는다.
begin;
select plan(16);

-- A: 관리자 / U: 로그인만 한 일반 사용자
insert into auth.users (id, aud, role, email, email_confirmed_at, raw_app_meta_data, raw_user_meta_data)
values
  ('a0000000-0000-0000-0000-000000000001', 'authenticated', 'authenticated', 'test.admin@example.com', now(), '{}', '{}'),
  ('b0000000-0000-0000-0000-000000000001', 'authenticated', 'authenticated', 'test.user@example.com', now(), '{}', '{}');
insert into public.admins (user_id) values ('a0000000-0000-0000-0000-000000000001');

insert into public.grades (id, name, sort) values ('grade-t', '테스트 학년', 1);
insert into public.semesters (grade_id, id, name, sort) values ('grade-t', 'semester-t', '테스트 학기', 1);
insert into public.subjects (grade_id, semester_id, id, name, sort) values ('grade-t', 'semester-t', 'subject-t', '테스트 과목', 1);
insert into public.practice_keys (key, password_hash) values ('default', extensions.crypt('pw-default', extensions.gen_salt('bf')));

insert into public.documents (id, kind, grade_id, semester_id, subject_id, slug, title, sort, published)
values
  ('d0000000-0000-0000-0000-000000000001', 'lectures', 'grade-t', 'semester-t', 'subject-t', 'lecture-01', '공개 강의', 1, true),
  ('d0000000-0000-0000-0000-000000000002', 'lectures', 'grade-t', 'semester-t', 'subject-t', 'lecture-02', '임시 강의', 2, false),
  ('d0000000-0000-0000-0000-000000000003', 'practice', 'grade-t', 'semester-t', 'subject-t', 'exam-01', '공개 족보', 1, true);
insert into public.document_bodies (document_id, body) values
  ('d0000000-0000-0000-0000-000000000001', '공개 본문'),
  ('d0000000-0000-0000-0000-000000000002', '임시 본문'),
  ('d0000000-0000-0000-0000-000000000003', '족보 본문');

-- 로그인 전
set local role anon;
select is((select count(*)::int from public.subjects where id = 'subject-t'), 1, '로그인 전에도 / 과목 목록을 / 본다');
select is((select count(*)::int from public.documents where subject_id = 'subject-t'), 2, '로그인 전에는 / 공개된 문서만 / 목록에 보인다');
select is((select body from public.document_bodies where document_id = 'd0000000-0000-0000-0000-000000000001'), '공개 본문', '공개 강의 본문은 / 누구나 / 읽는다');
select is((select count(*)::int from public.document_bodies where document_id = 'd0000000-0000-0000-0000-000000000002'), 0, '임시 강의 본문은 / 로그인 전에 / 읽지 못한다');
select is((select count(*)::int from public.document_bodies where document_id = 'd0000000-0000-0000-0000-000000000003'), 0, '족보 본문은 / 공개되어 있어도 / 직접 읽지 못한다');
select is((select count(*)::int from public.practice_keys), 0, '비밀번호 해시 표는 / 로그인 전에 / 읽지 못한다');
select ok(public.verify_practice_password('d0000000-0000-0000-0000-000000000003', 'pw-default'), '맞는 비밀번호는 / 족보 확인을 / 통과한다');
select ok(not public.verify_practice_password('d0000000-0000-0000-0000-000000000003', 'wrong'), '틀린 비밀번호는 / 족보 확인을 / 통과하지 못한다');
select throws_ok(
  $$ insert into public.grades (id, name) values ('grade-x', '몰래') $$,
  '42501', null, '로그인 전에는 / 분류를 / 추가하지 못한다'
);
reset role;

-- 로그인한 일반 사용자
set local role authenticated;
set local request.jwt.claims = '{"sub":"b0000000-0000-0000-0000-000000000001","role":"authenticated"}';
with x as (
  update public.document_bodies set body = '바꿈' where document_id = 'd0000000-0000-0000-0000-000000000001' returning 1
)
select is(count(*)::int, 0, '관리자가 아니면 / 본문을 / 고치지 못한다') from x;
select throws_ok($$ select public.set_practice_password('default', 'new-pass') $$, '42501', null, '관리자가 아니면 / 족보 비밀번호를 / 바꾸지 못한다');

-- 관리자
set local request.jwt.claims = '{"sub":"a0000000-0000-0000-0000-000000000001","role":"authenticated"}';
select is((select count(*)::int from public.document_bodies where document_id in ('d0000000-0000-0000-0000-000000000002', 'd0000000-0000-0000-0000-000000000003')), 2, '관리자는 / 임시 문서와 족보 본문을 / 읽는다');
update public.document_bodies set body = '고친 본문' where document_id = 'd0000000-0000-0000-0000-000000000001';
select is((select body from public.document_bodies where document_id = 'd0000000-0000-0000-0000-000000000001'), '고친 본문', '관리자는 / 본문을 / 고친다');
select is(
  (select body from public.document_revisions where document_id = 'd0000000-0000-0000-0000-000000000001' order by id desc limit 1),
  '공개 본문', '본문을 고치면 / 이전 본문이 / 기록에 남는다'
);
select lives_ok($$ select public.set_practice_password('default', 'new-pass') $$, '관리자는 / 족보 비밀번호를 / 바꾼다');
select ok(public.verify_practice_password('d0000000-0000-0000-0000-000000000003', 'new-pass'), '바꾼 비밀번호로 / 족보 확인을 / 통과한다');

select * from finish();
rollback;
