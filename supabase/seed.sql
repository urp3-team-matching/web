-- Auto-run by `supabase db reset` (config.toml [db.seed].sql_paths).
-- Local dev fixtures only — never applied to staging/prod.

-- Storage bucket for local dev. Matches lib/supabaseStorage.ts NODE_ENV=development branch.
insert into storage.buckets (id, name, public)
values ('web-development', 'web-development', true)
on conflict (id) do nothing;

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
