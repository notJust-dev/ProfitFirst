
SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA "pgsodium";

COMMENT ON SCHEMA "public" IS 'standard public schema';

CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";

CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";

CREATE OR REPLACE FUNCTION "public"."create_account"("_id" "uuid", "_user_id" "uuid", "_name" "text", "_cap" real, "_tap" real, "_created_at" timestamp with time zone, "_updated_at" timestamp with time zone) RETURNS "uuid"
    LANGUAGE "plpgsql"
    AS $$DECLARE new_id uuid;

begin 
insert into 
  accounts (
    id,
    user_id,
    name,
    cap,
    tap,
    created_at,
    updated_at
  )
  values (
    _id,
    _user_id,
    _name,
    _cap,
    _tap,
    _created_at,
    _updated_at
  )
  returning id into new_id;

RETURN new_id;
end;$$;

ALTER FUNCTION "public"."create_account"("_id" "uuid", "_user_id" "uuid", "_name" "text", "_cap" real, "_tap" real, "_created_at" timestamp with time zone, "_updated_at" timestamp with time zone) OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."epoch_to_timestamp"("epoch" "text") RETURNS timestamp with time zone
    LANGUAGE "plpgsql"
    AS $$ begin return timestamp with time zone 'epoch' + ((epoch::bigint) / 1000) * interval '1 second';
end;
$$;

ALTER FUNCTION "public"."epoch_to_timestamp"("epoch" "text") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."pull"("last_pulled_at" bigint, "schemaversion" integer, "migration" "jsonb") RETURNS "jsonb"
    LANGUAGE "plpgsql"
    AS $$DECLARE _ts timestamp with time zone;
_accounts jsonb;

BEGIN

_ts := to_timestamp(last_pulled_at / 1000);

select jsonb_build_object(
  'created',
  '[]'::jsonb,
  'updated',
  coalesce(
      jsonb_agg(
          jsonb_build_object(
              'id',
              acc.id,
              'name',
              acc.name,
              'cap',
              acc.cap,
              'tap',
              acc.cap,
              'user_id',
              acc.user_id,
              'created_at',
              timestamp_to_epoch(acc.created_at),
              'updated_at',
              timestamp_to_epoch(acc.updated_at)
          )
      ) filter (
          where acc.deleted_at is null
              and acc.updated_at > _ts
      ),
      '[]'::jsonb
  ),
  'deleted',
  coalesce(
      jsonb_agg(to_jsonb(acc.id)) filter (
          where acc.deleted_at is not null
              and acc.updated_at > _ts
      ),
      '[]'::jsonb
  )
) into _accounts
from accounts acc;

return jsonb_build_object(
    'changes',
    jsonb_build_object(
        'accounts',
        _accounts
    ),
    'timestamp',
    timestamp_to_epoch(now())
);

END;$$;

ALTER FUNCTION "public"."pull"("last_pulled_at" bigint, "schemaversion" integer, "migration" "jsonb") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."push"("changes" "jsonb") RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$declare new_account jsonb;

BEGIN
for new_account in
select jsonb_array_elements((changes->'accounts'->'created')) loop perform create_account(
        (new_account->>'id')::uuid,
        (new_account->>'user_id')::uuid,
        (new_account->>'name'),
        (new_account->>'cap')::float4,
        (new_account->>'tap')::float4,
        epoch_to_timestamp(new_account->>'created_at'),
        epoch_to_timestamp(new_account->>'updated_at')
    );
end loop;

with changes_data as (
    select jsonb_array_elements_text(changes->'accounts'->'deleted')::uuid as deleted
)
UPDATE accounts
set deleted_at = now(),
    updated_at = now()
from changes_data
where accounts.id = changes_data.deleted;

END;$$;

ALTER FUNCTION "public"."push"("changes" "jsonb") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."timestamp_to_epoch"("ts" timestamp with time zone) RETURNS bigint
    LANGUAGE "plpgsql"
    AS $$ begin return (
        extract(
            epoch
            from ts
        ) * 1000
    )::bigint;
end;
$$;

ALTER FUNCTION "public"."timestamp_to_epoch"("ts" timestamp with time zone) OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";

CREATE TABLE IF NOT EXISTS "public"."account_allocations" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "amount" double precision DEFAULT '0'::double precision NOT NULL,
    "cap" real DEFAULT '0'::real NOT NULL,
    "account_id" "uuid" NOT NULL,
    "allocation_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL
);

ALTER TABLE "public"."account_allocations" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."accounts" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "name" "text" NOT NULL,
    "cap" real DEFAULT '0'::real NOT NULL,
    "tap" real DEFAULT '0'::real NOT NULL,
    "user_id" "uuid" NOT NULL,
    "deleted_at" timestamp with time zone
);

ALTER TABLE "public"."accounts" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."allocations" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "income" double precision DEFAULT '0'::double precision NOT NULL,
    "user_id" "uuid" NOT NULL
);

ALTER TABLE "public"."allocations" OWNER TO "postgres";

ALTER TABLE ONLY "public"."account_allocations"
    ADD CONSTRAINT "account_allocations_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."accounts"
    ADD CONSTRAINT "accounts_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."allocations"
    ADD CONSTRAINT "allocations_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."account_allocations"
    ADD CONSTRAINT "account_allocations_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("id");

ALTER TABLE ONLY "public"."account_allocations"
    ADD CONSTRAINT "account_allocations_allocation_id_fkey" FOREIGN KEY ("allocation_id") REFERENCES "public"."allocations"("id");

ALTER TABLE ONLY "public"."account_allocations"
    ADD CONSTRAINT "account_allocations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");

ALTER TABLE ONLY "public"."accounts"
    ADD CONSTRAINT "accounts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");

ALTER TABLE ONLY "public"."allocations"
    ADD CONSTRAINT "allocations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");

CREATE POLICY "ALL PUBLIC" ON "public"."accounts" USING (true);

CREATE POLICY "Enable delete for users based on user_id" ON "public"."accounts" FOR DELETE USING ((( SELECT "auth"."uid"() AS "uid") = "user_id"));

CREATE POLICY "Enable insert for ANYONE (delete me later)" ON "public"."accounts" FOR INSERT TO "authenticated", "anon", "postgres" WITH CHECK (true);

CREATE POLICY "Enable insert for authenticated users only" ON "public"."accounts" FOR INSERT TO "authenticated" WITH CHECK (true);

CREATE POLICY "Enable update for users based on id" ON "public"."accounts" FOR UPDATE USING ((( SELECT "auth"."uid"() AS "uid") = "user_id")) WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "user_id"));

ALTER TABLE "public"."account_allocations" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."accounts" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."allocations" ENABLE ROW LEVEL SECURITY;

ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";

GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

GRANT ALL ON FUNCTION "public"."create_account"("_id" "uuid", "_user_id" "uuid", "_name" "text", "_cap" real, "_tap" real, "_created_at" timestamp with time zone, "_updated_at" timestamp with time zone) TO "anon";
GRANT ALL ON FUNCTION "public"."create_account"("_id" "uuid", "_user_id" "uuid", "_name" "text", "_cap" real, "_tap" real, "_created_at" timestamp with time zone, "_updated_at" timestamp with time zone) TO "authenticated";
GRANT ALL ON FUNCTION "public"."create_account"("_id" "uuid", "_user_id" "uuid", "_name" "text", "_cap" real, "_tap" real, "_created_at" timestamp with time zone, "_updated_at" timestamp with time zone) TO "service_role";

GRANT ALL ON FUNCTION "public"."epoch_to_timestamp"("epoch" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."epoch_to_timestamp"("epoch" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."epoch_to_timestamp"("epoch" "text") TO "service_role";

GRANT ALL ON FUNCTION "public"."pull"("last_pulled_at" bigint, "schemaversion" integer, "migration" "jsonb") TO "anon";
GRANT ALL ON FUNCTION "public"."pull"("last_pulled_at" bigint, "schemaversion" integer, "migration" "jsonb") TO "authenticated";
GRANT ALL ON FUNCTION "public"."pull"("last_pulled_at" bigint, "schemaversion" integer, "migration" "jsonb") TO "service_role";

GRANT ALL ON FUNCTION "public"."push"("changes" "jsonb") TO "anon";
GRANT ALL ON FUNCTION "public"."push"("changes" "jsonb") TO "authenticated";
GRANT ALL ON FUNCTION "public"."push"("changes" "jsonb") TO "service_role";

GRANT ALL ON FUNCTION "public"."timestamp_to_epoch"("ts" timestamp with time zone) TO "anon";
GRANT ALL ON FUNCTION "public"."timestamp_to_epoch"("ts" timestamp with time zone) TO "authenticated";
GRANT ALL ON FUNCTION "public"."timestamp_to_epoch"("ts" timestamp with time zone) TO "service_role";

GRANT ALL ON TABLE "public"."account_allocations" TO "anon";
GRANT ALL ON TABLE "public"."account_allocations" TO "authenticated";
GRANT ALL ON TABLE "public"."account_allocations" TO "service_role";

GRANT ALL ON TABLE "public"."accounts" TO "anon";
GRANT ALL ON TABLE "public"."accounts" TO "authenticated";
GRANT ALL ON TABLE "public"."accounts" TO "service_role";

GRANT ALL ON TABLE "public"."allocations" TO "anon";
GRANT ALL ON TABLE "public"."allocations" TO "authenticated";
GRANT ALL ON TABLE "public"."allocations" TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";

RESET ALL;
