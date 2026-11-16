-- 서버(secret key = service_role)가 족보 비밀번호를 확인할 수 있게 한다.
-- 새 Supabase 프로젝트는 함수 실행 권한을 service_role에 자동으로 주지 않아, 맞는 비밀번호도 모두 거부됐다.
grant execute on function public.verify_practice_password(uuid, text) to service_role;
