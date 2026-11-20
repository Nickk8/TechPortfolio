--
-- PostgreSQL database dump
--

\restrict wabt1eZvd6bpOQfT3MM7etV3mpByMacH9sTOCxqNeWQu8kX0icTsq4UkMolmL46

-- Dumped from database version 16.15 (Ubuntu 16.15-0ubuntu0.24.04.1)
-- Dumped by pg_dump version 16.15 (Ubuntu 16.15-0ubuntu0.24.04.1)

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: aluno; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.aluno (
    id integer NOT NULL,
    nome character varying(150) NOT NULL,
    login character varying(80) NOT NULL,
    senha_hash character varying(255) NOT NULL,
    idade smallint,
    instituicao_ensino character varying(150),
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.aluno OWNER TO postgres;

--
-- Name: aluno_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.aluno_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.aluno_id_seq OWNER TO postgres;

--
-- Name: aluno_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.aluno_id_seq OWNED BY public.aluno.id;


--
-- Name: arquivo; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.arquivo (
    id integer NOT NULL,
    aluno_id integer NOT NULL,
    nome_original character varying(255) NOT NULL,
    tipo_arquivo character varying(10) NOT NULL,
    tamanho_bytes bigint NOT NULL,
    url_armazenamento character varying(255) NOT NULL,
    data_upload timestamp without time zone DEFAULT now() NOT NULL,
    CONSTRAINT arquivo_tipo_arquivo_check CHECK (((tipo_arquivo)::text = ANY ((ARRAY['pdf'::character varying, 'doc'::character varying, 'docx'::character varying, 'jpg'::character varying, 'png'::character varying])::text[])))
);


ALTER TABLE public.arquivo OWNER TO postgres;

--
-- Name: arquivo_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.arquivo_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.arquivo_id_seq OWNER TO postgres;

--
-- Name: arquivo_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.arquivo_id_seq OWNED BY public.arquivo.id;


--
-- Name: atividade; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.atividade (
    id integer NOT NULL,
    aluno_id integer NOT NULL,
    tipo character varying(20) NOT NULL,
    nome character varying(100) NOT NULL,
    nivel character varying(50),
    descricao text,
    CONSTRAINT atividade_tipo_check CHECK (((tipo)::text = ANY ((ARRAY['esporte'::character varying, 'cultural'::character varying, 'hobby'::character varying])::text[])))
);


ALTER TABLE public.atividade OWNER TO postgres;

--
-- Name: atividade_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.atividade_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.atividade_id_seq OWNER TO postgres;

--
-- Name: atividade_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.atividade_id_seq OWNED BY public.atividade.id;


--
-- Name: configuracao; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.configuracao (
    aluno_id integer NOT NULL,
    tema character varying(10) DEFAULT 'claro'::character varying NOT NULL,
    versao_sistema character varying(20) DEFAULT 'BETA'::character varying NOT NULL,
    CONSTRAINT configuracao_tema_check CHECK (((tema)::text = ANY ((ARRAY['claro'::character varying, 'escuro'::character varying])::text[])))
);


ALTER TABLE public.configuracao OWNER TO postgres;

--
-- Name: conquista; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.conquista (
    id integer NOT NULL,
    aluno_id integer NOT NULL,
    nome character varying(100) NOT NULL,
    ano smallint,
    posicao character varying(50)
);


ALTER TABLE public.conquista OWNER TO postgres;

--
-- Name: conquista_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.conquista_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.conquista_id_seq OWNER TO postgres;

--
-- Name: conquista_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.conquista_id_seq OWNED BY public.conquista.id;


--
-- Name: curso; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.curso (
    id integer NOT NULL,
    aluno_id integer NOT NULL,
    nome_curso character varying(150) NOT NULL,
    instituicao character varying(150),
    data_inicio date,
    data_fim date
);


ALTER TABLE public.curso OWNER TO postgres;

--
-- Name: curso_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.curso_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.curso_id_seq OWNER TO postgres;

--
-- Name: curso_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.curso_id_seq OWNED BY public.curso.id;


--
-- Name: idioma; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.idioma (
    id integer NOT NULL,
    aluno_id integer NOT NULL,
    nome character varying(60) NOT NULL,
    nivel_proficiencia character varying(30)
);


ALTER TABLE public.idioma OWNER TO postgres;

--
-- Name: idioma_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.idioma_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.idioma_id_seq OWNER TO postgres;

--
-- Name: idioma_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.idioma_id_seq OWNED BY public.idioma.id;


--
-- Name: modelo_layout; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.modelo_layout (
    id integer NOT NULL,
    nome character varying(100) NOT NULL,
    categoria character varying(20) NOT NULL,
    thumbnail_url character varying(255),
    ordem_exibicao smallint,
    CONSTRAINT modelo_layout_categoria_check CHECK (((categoria)::text = ANY ((ARRAY['profissional'::character varying, 'criativa'::character varying])::text[])))
);


ALTER TABLE public.modelo_layout OWNER TO postgres;

--
-- Name: modelo_layout_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.modelo_layout_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.modelo_layout_id_seq OWNER TO postgres;

--
-- Name: modelo_layout_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.modelo_layout_id_seq OWNED BY public.modelo_layout.id;


--
-- Name: nota; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.nota (
    id integer NOT NULL,
    aluno_id integer NOT NULL,
    disciplina character varying(100) NOT NULL,
    valor numeric(4,2),
    periodo character varying(20)
);


ALTER TABLE public.nota OWNER TO postgres;

--
-- Name: nota_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.nota_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.nota_id_seq OWNER TO postgres;

--
-- Name: nota_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.nota_id_seq OWNED BY public.nota.id;


--
-- Name: portfolio; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.portfolio (
    id integer NOT NULL,
    aluno_id integer NOT NULL,
    modelo_layout_id integer NOT NULL,
    nome character varying(150),
    link_unico character varying(255) NOT NULL,
    status character varying(20) DEFAULT 'processando'::character varying NOT NULL,
    data_criacao timestamp without time zone DEFAULT now() NOT NULL,
    data_atualizacao timestamp without time zone DEFAULT now() NOT NULL,
    CONSTRAINT portfolio_status_check CHECK (((status)::text = ANY ((ARRAY['processando'::character varying, 'concluido'::character varying, 'erro'::character varying])::text[])))
);


ALTER TABLE public.portfolio OWNER TO postgres;

--
-- Name: portfolio_arquivo; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.portfolio_arquivo (
    portfolio_id integer NOT NULL,
    arquivo_id integer NOT NULL
);


ALTER TABLE public.portfolio_arquivo OWNER TO postgres;

--
-- Name: portfolio_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.portfolio_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.portfolio_id_seq OWNER TO postgres;

--
-- Name: portfolio_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.portfolio_id_seq OWNED BY public.portfolio.id;


--
-- Name: projeto; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.projeto (
    id integer NOT NULL,
    aluno_id integer NOT NULL,
    titulo character varying(150) NOT NULL,
    descricao text,
    data date
);


ALTER TABLE public.projeto OWNER TO postgres;

--
-- Name: projeto_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.projeto_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.projeto_id_seq OWNER TO postgres;

--
-- Name: projeto_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.projeto_id_seq OWNED BY public.projeto.id;


--
-- Name: aluno id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.aluno ALTER COLUMN id SET DEFAULT nextval('public.aluno_id_seq'::regclass);


--
-- Name: arquivo id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.arquivo ALTER COLUMN id SET DEFAULT nextval('public.arquivo_id_seq'::regclass);


--
-- Name: atividade id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.atividade ALTER COLUMN id SET DEFAULT nextval('public.atividade_id_seq'::regclass);


--
-- Name: conquista id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.conquista ALTER COLUMN id SET DEFAULT nextval('public.conquista_id_seq'::regclass);


--
-- Name: curso id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.curso ALTER COLUMN id SET DEFAULT nextval('public.curso_id_seq'::regclass);


--
-- Name: idioma id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.idioma ALTER COLUMN id SET DEFAULT nextval('public.idioma_id_seq'::regclass);


--
-- Name: modelo_layout id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.modelo_layout ALTER COLUMN id SET DEFAULT nextval('public.modelo_layout_id_seq'::regclass);


--
-- Name: nota id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nota ALTER COLUMN id SET DEFAULT nextval('public.nota_id_seq'::regclass);


--
-- Name: portfolio id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.portfolio ALTER COLUMN id SET DEFAULT nextval('public.portfolio_id_seq'::regclass);


--
-- Name: projeto id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.projeto ALTER COLUMN id SET DEFAULT nextval('public.projeto_id_seq'::regclass);


--
-- Name: aluno aluno_login_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.aluno
    ADD CONSTRAINT aluno_login_key UNIQUE (login);


--
-- Name: aluno aluno_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.aluno
    ADD CONSTRAINT aluno_pkey PRIMARY KEY (id);


--
-- Name: arquivo arquivo_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.arquivo
    ADD CONSTRAINT arquivo_pkey PRIMARY KEY (id);


--
-- Name: atividade atividade_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.atividade
    ADD CONSTRAINT atividade_pkey PRIMARY KEY (id);


--
-- Name: configuracao configuracao_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.configuracao
    ADD CONSTRAINT configuracao_pkey PRIMARY KEY (aluno_id);


--
-- Name: conquista conquista_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.conquista
    ADD CONSTRAINT conquista_pkey PRIMARY KEY (id);


--
-- Name: curso curso_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.curso
    ADD CONSTRAINT curso_pkey PRIMARY KEY (id);


--
-- Name: idioma idioma_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.idioma
    ADD CONSTRAINT idioma_pkey PRIMARY KEY (id);


--
-- Name: modelo_layout modelo_layout_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.modelo_layout
    ADD CONSTRAINT modelo_layout_pkey PRIMARY KEY (id);


--
-- Name: nota nota_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nota
    ADD CONSTRAINT nota_pkey PRIMARY KEY (id);


--
-- Name: portfolio_arquivo portfolio_arquivo_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.portfolio_arquivo
    ADD CONSTRAINT portfolio_arquivo_pkey PRIMARY KEY (portfolio_id, arquivo_id);


--
-- Name: portfolio portfolio_link_unico_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.portfolio
    ADD CONSTRAINT portfolio_link_unico_key UNIQUE (link_unico);


--
-- Name: portfolio portfolio_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.portfolio
    ADD CONSTRAINT portfolio_pkey PRIMARY KEY (id);


--
-- Name: projeto projeto_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.projeto
    ADD CONSTRAINT projeto_pkey PRIMARY KEY (id);


--
-- Name: idx_arquivo_aluno_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_arquivo_aluno_id ON public.arquivo USING btree (aluno_id);


--
-- Name: idx_modelo_layout_categoria; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_modelo_layout_categoria ON public.modelo_layout USING btree (categoria);


--
-- Name: idx_portfolio_aluno_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_portfolio_aluno_id ON public.portfolio USING btree (aluno_id);


--
-- Name: idx_portfolio_link_unico; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_portfolio_link_unico ON public.portfolio USING btree (link_unico);


--
-- Name: arquivo arquivo_aluno_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.arquivo
    ADD CONSTRAINT arquivo_aluno_id_fkey FOREIGN KEY (aluno_id) REFERENCES public.aluno(id) ON DELETE CASCADE;


--
-- Name: atividade atividade_aluno_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.atividade
    ADD CONSTRAINT atividade_aluno_id_fkey FOREIGN KEY (aluno_id) REFERENCES public.aluno(id) ON DELETE CASCADE;


--
-- Name: configuracao configuracao_aluno_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.configuracao
    ADD CONSTRAINT configuracao_aluno_id_fkey FOREIGN KEY (aluno_id) REFERENCES public.aluno(id) ON DELETE CASCADE;


--
-- Name: conquista conquista_aluno_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.conquista
    ADD CONSTRAINT conquista_aluno_id_fkey FOREIGN KEY (aluno_id) REFERENCES public.aluno(id) ON DELETE CASCADE;


--
-- Name: curso curso_aluno_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.curso
    ADD CONSTRAINT curso_aluno_id_fkey FOREIGN KEY (aluno_id) REFERENCES public.aluno(id) ON DELETE CASCADE;


--
-- Name: idioma idioma_aluno_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.idioma
    ADD CONSTRAINT idioma_aluno_id_fkey FOREIGN KEY (aluno_id) REFERENCES public.aluno(id) ON DELETE CASCADE;


--
-- Name: nota nota_aluno_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nota
    ADD CONSTRAINT nota_aluno_id_fkey FOREIGN KEY (aluno_id) REFERENCES public.aluno(id) ON DELETE CASCADE;


--
-- Name: portfolio portfolio_aluno_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.portfolio
    ADD CONSTRAINT portfolio_aluno_id_fkey FOREIGN KEY (aluno_id) REFERENCES public.aluno(id) ON DELETE CASCADE;


--
-- Name: portfolio_arquivo portfolio_arquivo_arquivo_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.portfolio_arquivo
    ADD CONSTRAINT portfolio_arquivo_arquivo_id_fkey FOREIGN KEY (arquivo_id) REFERENCES public.arquivo(id) ON DELETE CASCADE;


--
-- Name: portfolio_arquivo portfolio_arquivo_portfolio_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.portfolio_arquivo
    ADD CONSTRAINT portfolio_arquivo_portfolio_id_fkey FOREIGN KEY (portfolio_id) REFERENCES public.portfolio(id) ON DELETE CASCADE;


--
-- Name: portfolio portfolio_modelo_layout_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.portfolio
    ADD CONSTRAINT portfolio_modelo_layout_id_fkey FOREIGN KEY (modelo_layout_id) REFERENCES public.modelo_layout(id);


--
-- Name: projeto projeto_aluno_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.projeto
    ADD CONSTRAINT projeto_aluno_id_fkey FOREIGN KEY (aluno_id) REFERENCES public.aluno(id) ON DELETE CASCADE;

ALTER TABLE public.aluno
  ADD COLUMN IF NOT EXISTS email character varying(255) UNIQUE;

  SELECT current_user;
  ALTER USER postgres WITH PASSWORD '25022025';
  SELECT id, nome, login, email, created_at
FROM public.aluno
ORDER BY id;
--
-- PostgreSQL database dump complete
--

\unrestrict wabt1eZvd6bpOQfT3MM7etV3mpByMacH9sTOCxqNeWQu8kX0icTsq4UkMolmL46