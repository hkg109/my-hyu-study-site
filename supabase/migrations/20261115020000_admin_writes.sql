-- 관리자 모드(배포 환경)에서 쓰는 보조 설정.

-- 1) 비밀번호를 아직 정하지 않은 족보 key: 문서가 key를 참조해야 해서 아무도 모르는 무작위 해시로 만들어 두고,
--    관리자 화면에는 '비밀번호 없음'으로 보이게 표시한다. set_practice_password로 정하면 풀린다.
alter table public.practice_keys add column locked boolean not null default false;

create or replace function public.set_practice_password(p_key text, p_password text)
returns void
language plpgsql
volatile
security definer
set search_path = ''
as $$
begin
  -- 가져오기 스크립트와 서버(관리자 확인 후)는 secret key(service_role)로 부른다
  if not (private.is_admin() or (select auth.role()) = 'service_role') then
    raise exception '관리자만 족보 비밀번호를 바꿀 수 있습니다.' using errcode = '42501';
  end if;
  if p_password is null or length(p_password) < 4 or length(p_password) > 100 then
    raise exception '비밀번호는 4~100자로 입력해 주세요.' using errcode = '22023';
  end if;
  insert into public.practice_keys (key, password_hash, locked)
  values (p_key, extensions.crypt(p_password, extensions.gen_salt('bf')), false)
  on conflict (key) do update set password_hash = excluded.password_hash, locked = false, updated_at = now();
end;
$$;

-- 2) 관리자가 자동 저장할 때마다 기록이 쌓이지 않게: 같은 문서의 마지막 기록이 10분 안이면 새로 남기지 않는다.
create or replace function private.keep_revision()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if old.body is distinct from new.body then
    if not exists (
      select 1 from public.document_revisions r
      where r.document_id = old.document_id and r.saved_at > now() - interval '10 minutes'
    ) then
      insert into public.document_revisions (document_id, title, body, saved_by)
      select old.document_id, d.title, old.body, (select auth.uid())
      from public.documents d where d.id = old.document_id;
    end if;
    update public.documents set updated_at = now() where id = old.document_id;
  end if;
  return new;
end;
$$;
