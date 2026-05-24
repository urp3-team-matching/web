-- Auto-run by `supabase db reset` (config.toml [db.seed].sql_paths).
-- Local dev fixtures only — never applied to staging/prod.

-- Storage bucket for local dev. Matches lib/supabaseStorage.ts NODE_ENV=development branch.
insert into storage.buckets (id, name, public)
values ('web-development', 'web-development', true)
on conflict (id) do nothing;

-- RLS policies for local dev bucket — allow anon CRUD on web-development.
-- prisma/seed.ts uploads via anon key (NEXT_PUBLIC_SUPABASE_ANON_KEY); without
-- these policies storage.objects RLS rejects with "new row violates RLS".
-- Local-only: prod's web-production bucket should keep stricter policies
-- (use service_role for admin uploads instead).
drop policy if exists "anon insert web-development" on storage.objects;
drop policy if exists "anon select web-development" on storage.objects;
drop policy if exists "anon update web-development" on storage.objects;
drop policy if exists "anon delete web-development" on storage.objects;

create policy "anon insert web-development"
  on storage.objects for insert to anon
  with check (bucket_id = 'web-development');

create policy "anon select web-development"
  on storage.objects for select to anon
  using (bucket_id = 'web-development');

create policy "anon update web-development"
  on storage.objects for update to anon
  using (bucket_id = 'web-development')
  with check (bucket_id = 'web-development');

create policy "anon delete web-development"
  on storage.objects for delete to anon
  using (bucket_id = 'web-development');

-- Local dev admin account. Email: admin@local.test / Password: dev1234
-- /login uses supabase.auth.signInWithPassword (actions/auth.ts).
do $$
declare
  v_user_id uuid := gen_random_uuid();
begin
  if not exists (select 1 from auth.users where email = 'admin@local.test') then
    insert into auth.users (
      instance_id, id, aud, role, email,
      encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data,
      created_at, updated_at,
      confirmation_token, email_change, email_change_token_new, recovery_token
    ) values (
      '00000000-0000-0000-0000-000000000000',
      v_user_id, 'authenticated', 'authenticated', 'admin@local.test',
      crypt('dev1234', gen_salt('bf')), now(),
      '{"provider":"email","providers":["email"]}', '{}',
      now(), now(),
      '', '', '', ''
    );

    insert into auth.identities (
      provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) values (
      v_user_id::text, v_user_id,
      jsonb_build_object('sub', v_user_id::text, 'email', 'admin@local.test'),
      'email', now(), now(), now()
    );
  end if;
end $$;
