
SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '"public", "extensions"', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA "pgsodium";

CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";

CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";

SET default_tablespace = '';

SET default_table_access_method = "heap";

CREATE TABLE IF NOT EXISTS "public"."categoria" (
    "id" character varying NOT NULL,
    "id_usuario" character varying NOT NULL,
    "nome" character varying NOT NULL,
    "descricao" character varying
);

ALTER TABLE "public"."categoria" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."marco" (
    "id" character varying NOT NULL,
    "id_meta" character varying NOT NULL,
    "data" date NOT NULL,
    "valor_obtido" double precision NOT NULL
);

ALTER TABLE "public"."marco" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."meta" (
    "id" character varying NOT NULL,
    "id_usuario" character varying NOT NULL,
    "valor_desejado" double precision NOT NULL,
    "datafinal" date,
    "progresso" integer DEFAULT 0 NOT NULL,
    "valor_obtido" double precision DEFAULT '0'::double precision NOT NULL
);

ALTER TABLE "public"."meta" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."orcamento" (
    "id" character varying NOT NULL,
    "id_usuario" character varying NOT NULL,
    "id_categoria" character varying NOT NULL,
    "limite" double precision NOT NULL
);

ALTER TABLE "public"."orcamento" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."submeta" (
    "id" integer NOT NULL,
    "id_meta" character varying NOT NULL,
    "nome" character varying NOT NULL,
    "descricao" character varying,
    "valor_desejavel" double precision NOT NULL,
    "valor_obtido" double precision DEFAULT '0'::double precision NOT NULL
);

ALTER TABLE "public"."submeta" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."transacao" (
    "id" character varying NOT NULL,
    "id_usuario" character varying NOT NULL,
    "id_categoria" character varying NOT NULL,
    "tipo" character varying NOT NULL,
    "valor" double precision NOT NULL,
    "titulo" character varying NOT NULL,
    "descricao" character varying,
    "data" date NOT NULL
);

ALTER TABLE "public"."transacao" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."usuario" (
    "id" character varying NOT NULL,
    "nome" character varying NOT NULL,
    "saldo" double precision DEFAULT '0'::double precision NOT NULL,
    "email" character varying NOT NULL,
    "senha" character varying NOT NULL
);

ALTER TABLE "public"."usuario" OWNER TO "postgres";

ALTER TABLE ONLY "public"."categoria"
    ADD CONSTRAINT "categoria_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."marco"
    ADD CONSTRAINT "marco_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."meta"
    ADD CONSTRAINT "meta_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."orcamento"
    ADD CONSTRAINT "orcamento_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."submeta"
    ADD CONSTRAINT "submeta_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."transacao"
    ADD CONSTRAINT "transacao_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."usuario"
    ADD CONSTRAINT "usuario_email_key" UNIQUE ("email");

ALTER TABLE ONLY "public"."usuario"
    ADD CONSTRAINT "usuario_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."orcamento"
    ADD CONSTRAINT "fk_categoria" FOREIGN KEY (id_categoria) REFERENCES categoria(id);

ALTER TABLE ONLY "public"."transacao"
    ADD CONSTRAINT "fk_categoria" FOREIGN KEY (id_categoria) REFERENCES categoria(id);

ALTER TABLE ONLY "public"."marco"
    ADD CONSTRAINT "fk_meta" FOREIGN KEY (id_meta) REFERENCES meta(id);

ALTER TABLE ONLY "public"."submeta"
    ADD CONSTRAINT "fk_meta" FOREIGN KEY (id_meta) REFERENCES meta(id);

ALTER TABLE ONLY "public"."categoria"
    ADD CONSTRAINT "fk_usuario" FOREIGN KEY (id_usuario) REFERENCES usuario(id);

ALTER TABLE ONLY "public"."orcamento"
    ADD CONSTRAINT "fk_usuario" FOREIGN KEY (id_usuario) REFERENCES usuario(id);

ALTER TABLE ONLY "public"."transacao"
    ADD CONSTRAINT "fk_usuario" FOREIGN KEY (id_usuario) REFERENCES usuario(id);

ALTER TABLE ONLY "public"."meta"
    ADD CONSTRAINT "fk_usuario" FOREIGN KEY (id_usuario) REFERENCES usuario(id);

GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

GRANT ALL ON TABLE "public"."categoria" TO "anon";
GRANT ALL ON TABLE "public"."categoria" TO "authenticated";
GRANT ALL ON TABLE "public"."categoria" TO "service_role";

GRANT ALL ON TABLE "public"."marco" TO "anon";
GRANT ALL ON TABLE "public"."marco" TO "authenticated";
GRANT ALL ON TABLE "public"."marco" TO "service_role";

GRANT ALL ON TABLE "public"."meta" TO "anon";
GRANT ALL ON TABLE "public"."meta" TO "authenticated";
GRANT ALL ON TABLE "public"."meta" TO "service_role";

GRANT ALL ON TABLE "public"."orcamento" TO "anon";
GRANT ALL ON TABLE "public"."orcamento" TO "authenticated";
GRANT ALL ON TABLE "public"."orcamento" TO "service_role";

GRANT ALL ON TABLE "public"."submeta" TO "anon";
GRANT ALL ON TABLE "public"."submeta" TO "authenticated";
GRANT ALL ON TABLE "public"."submeta" TO "service_role";

GRANT ALL ON TABLE "public"."transacao" TO "anon";
GRANT ALL ON TABLE "public"."transacao" TO "authenticated";
GRANT ALL ON TABLE "public"."transacao" TO "service_role";

GRANT ALL ON TABLE "public"."usuario" TO "anon";
GRANT ALL ON TABLE "public"."usuario" TO "authenticated";
GRANT ALL ON TABLE "public"."usuario" TO "service_role";

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
