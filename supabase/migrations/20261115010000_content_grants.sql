-- 새 Supabase 프로젝트는 새 테이블을 Data API에 자동으로 열지 않는다(권한을 주지 않는다).
-- 필요한 권한을 직접 준다. 실제로 누가 어떤 행을 읽고 쓰는지는 20261115000000_content.sql의 RLS가 정한다.

-- 읽기: 공개 목록·공개 강의 본문 (RLS가 거른다)
grant select on public.grades, public.semesters, public.subjects, public.documents, public.document_bodies
  to anon, authenticated;

-- 쓰기와 관리자 화면: 로그인한 사용자에게 주되 RLS가 관리자만 통과시킨다
grant insert, update, delete on public.grades, public.semesters, public.subjects, public.documents, public.document_bodies
  to authenticated;
grant select on public.admins, public.document_revisions to authenticated;

-- 서버(secret key)와 가져오기 스크립트. practice_keys는 여기에만 연다(anon·authenticated에는 주지 않는다)
grant select, insert, update, delete on
  public.admins, public.grades, public.semesters, public.subjects, public.practice_keys,
  public.documents, public.document_bodies, public.document_revisions
  to service_role;
grant usage, select on all sequences in schema public to service_role;
