--
-- PostgreSQL database dump
--

\restrict jlrt2dv415NFNQvxGT3urc2Znjfk5jnI6mgoa80ZpMXMfXZgeodwaSdGq7c6JFQ

-- Dumped from database version 16.10
-- Dumped by pg_dump version 16.10

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

DROP INDEX IF EXISTS public."IDX_session_expire";
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_pkey;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_email_unique;
ALTER TABLE IF EXISTS ONLY public.study_spots DROP CONSTRAINT IF EXISTS study_spots_pkey;
ALTER TABLE IF EXISTS ONLY public.spot_images DROP CONSTRAINT IF EXISTS spot_images_pkey;
ALTER TABLE IF EXISTS ONLY public.sessions DROP CONSTRAINT IF EXISTS sessions_pkey;
ALTER TABLE IF EXISTS ONLY public.saved_spots DROP CONSTRAINT IF EXISTS saved_spots_pkey;
ALTER TABLE IF EXISTS ONLY public.reviews DROP CONSTRAINT IF EXISTS reviews_pkey;
ALTER TABLE IF EXISTS ONLY public.check_ins DROP CONSTRAINT IF EXISTS check_ins_pkey;
ALTER TABLE IF EXISTS public.study_spots ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.spot_images ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.saved_spots ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.reviews ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.check_ins ALTER COLUMN id DROP DEFAULT;
DROP TABLE IF EXISTS public.users;
DROP SEQUENCE IF EXISTS public.study_spots_id_seq;
DROP TABLE IF EXISTS public.study_spots;
DROP SEQUENCE IF EXISTS public.spot_images_id_seq;
DROP TABLE IF EXISTS public.spot_images;
DROP TABLE IF EXISTS public.sessions;
DROP SEQUENCE IF EXISTS public.saved_spots_id_seq;
DROP TABLE IF EXISTS public.saved_spots;
DROP SEQUENCE IF EXISTS public.reviews_id_seq;
DROP TABLE IF EXISTS public.reviews;
DROP SEQUENCE IF EXISTS public.check_ins_id_seq;
DROP TABLE IF EXISTS public.check_ins;
DROP SCHEMA IF EXISTS public;
--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA public;


--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON SCHEMA public IS 'standard public schema';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: check_ins; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.check_ins (
    id integer NOT NULL,
    user_id text NOT NULL,
    spot_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


--
-- Name: check_ins_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.check_ins_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: check_ins_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.check_ins_id_seq OWNED BY public.check_ins.id;


--
-- Name: reviews; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.reviews (
    id integer NOT NULL,
    user_id text NOT NULL,
    spot_id integer NOT NULL,
    rating integer NOT NULL,
    text text,
    tags jsonb,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


--
-- Name: reviews_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.reviews_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: reviews_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.reviews_id_seq OWNED BY public.reviews.id;


--
-- Name: saved_spots; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.saved_spots (
    id integer NOT NULL,
    user_id text NOT NULL,
    spot_id integer NOT NULL,
    list_type text NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


--
-- Name: saved_spots_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.saved_spots_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: saved_spots_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.saved_spots_id_seq OWNED BY public.saved_spots.id;


--
-- Name: sessions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sessions (
    sid character varying NOT NULL,
    sess jsonb NOT NULL,
    expire timestamp without time zone NOT NULL
);


--
-- Name: spot_images; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.spot_images (
    id integer NOT NULL,
    spot_id integer NOT NULL,
    url text NOT NULL,
    sort_order integer DEFAULT 0
);


--
-- Name: spot_images_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.spot_images_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: spot_images_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.spot_images_id_seq OWNED BY public.spot_images.id;


--
-- Name: study_spots; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.study_spots (
    id integer NOT NULL,
    name text NOT NULL,
    district text NOT NULL,
    address text NOT NULL,
    lat double precision,
    lng double precision,
    opening_hours jsonb,
    sunday_open boolean DEFAULT false,
    has_wifi boolean DEFAULT false,
    has_outlets boolean DEFAULT false,
    website text,
    description text NOT NULL,
    tags jsonb,
    avg_rating numeric DEFAULT '0'::numeric,
    review_count integer DEFAULT 0,
    created_by_user_id text,
    status text DEFAULT 'pending'::text,
    is_featured boolean DEFAULT false,
    is_sponsored boolean DEFAULT false,
    ranking_weight integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT now(),
    google_maps_url text
);


--
-- Name: study_spots_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.study_spots_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: study_spots_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.study_spots_id_seq OWNED BY public.study_spots.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    email character varying,
    first_name character varying,
    last_name character varying,
    profile_image_url character varying,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


--
-- Name: check_ins id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.check_ins ALTER COLUMN id SET DEFAULT nextval('public.check_ins_id_seq'::regclass);


--
-- Name: reviews id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reviews ALTER COLUMN id SET DEFAULT nextval('public.reviews_id_seq'::regclass);


--
-- Name: saved_spots id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.saved_spots ALTER COLUMN id SET DEFAULT nextval('public.saved_spots_id_seq'::regclass);


--
-- Name: spot_images id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.spot_images ALTER COLUMN id SET DEFAULT nextval('public.spot_images_id_seq'::regclass);


--
-- Name: study_spots id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.study_spots ALTER COLUMN id SET DEFAULT nextval('public.study_spots_id_seq'::regclass);


--
-- Data for Name: check_ins; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.check_ins (id, user_id, spot_id, created_at) FROM stdin;
\.


--
-- Data for Name: reviews; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.reviews (id, user_id, spot_id, rating, text, tags, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: saved_spots; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.saved_spots (id, user_id, spot_id, list_type, created_at) FROM stdin;
\.


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.sessions (sid, sess, expire) FROM stdin;
322i5c7RecaRp2kj22zgafK1GvfLDS_Q	{"cookie": {"path": "/", "secure": true, "expires": "2026-03-11T18:13:47.627Z", "httpOnly": true, "originalMaxAge": 604800000}, "replit.com": {"code_verifier": "SAkeiA8qxvyDVKHM5CdcBzvrsJ-qm6rW2n6t07C54xM"}}	2026-03-11 21:35:44
\.


--
-- Data for Name: spot_images; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.spot_images (id, spot_id, url, sort_order) FROM stdin;
34	34	https://www.das-cafe.wien/fileadmin/user_upload/dascafe/_MAR9685_Kopie.jpg	0
35	35	https://cdn.prod.website-files.com/64b6780f84d27e4bfd91f2d6/6676cfbec142b79bf6bf0b67_jonasreindlalsergrundvienna-6676bd5815d50.webp	0
36	36	https://www.area.at/assets/images/c/hornig-7-5s04bvq6f8epjv3.jpg	0
37	37	https://lokalfuehrer.stadtbekannt.at/wp-content/uploads/2016/04/Burggasse24-c-STADTBEKANNT.jpg	0
38	38	https://www.vienna.at/2015/11/siebenstern-6001.jpg	0
\.


--
-- Data for Name: study_spots; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.study_spots (id, name, district, address, lat, lng, opening_hours, sunday_open, has_wifi, has_outlets, website, description, tags, avg_rating, review_count, created_by_user_id, status, is_featured, is_sponsored, ranking_weight, created_at, google_maps_url) FROM stdin;
34	das café	7. Neubau	Burggasse 10, 1070 Wien	48.2038	16.3558	{"fri": {"open": "09:00", "close": "01:00"}, "mon": {"open": "09:00", "close": "24:00"}, "sat": {"open": "10:00", "close": "01:00"}, "sun": {"open": "10:00", "close": "23:00"}, "thu": {"open": "09:00", "close": "01:00"}, "tue": {"open": "09:00", "close": "24:00"}, "wed": {"open": "09:00", "close": "24:00"}}	t	t	t	https://www.das-cafe.wien	Bright, spacious café with lots of table space for working/studying. Solid option in the 7th district when you want a reliable longer session.	["spacious", "bright", "big-tables", "sunday-safe", "work-friendly"]	0	0	admin-id-123	approved	f	f	0	2026-02-28 17:28:30.017573	\N
35	Jonas Reindl (Währinger Straße)	9. Alsergrund	Währinger Straße 2–4, 1090 Wien	48.2149	16.3608	{"fri": {"open": "08:00", "close": "17:30"}, "mon": {"open": "08:00", "close": "17:30"}, "sat": {"open": "09:30", "close": "17:30"}, "sun": {"open": "09:30", "close": "17:30"}, "thu": {"open": "08:00", "close": "17:30"}, "tue": {"open": "08:00", "close": "17:30"}, "wed": {"open": "08:00", "close": "17:30"}}	t	t	t	https://www.jonasreindl.at	A student classic near the university area. Great coffee and lots of laptop users. Can get busy, so it’s best earlier or outside peak hours.	["near-uni", "specialty-coffee", "busy", "sunday-safe", "laptop-friendly"]	0	0	admin-id-123	approved	f	f	0	2026-02-28 17:28:30.096982	\N
36	J. Hornig Kaffeebar	7. Neubau	Siebensterngasse 29, 1070 Wien	48.2018	16.3538	{"fri": {"open": "08:00", "close": "19:00"}, "mon": {"open": "08:00", "close": "19:00"}, "sat": {"open": "09:00", "close": "19:00"}, "sun": {"open": "10:00", "close": "18:00"}, "thu": {"open": "08:00", "close": "19:00"}, "tue": {"open": "08:00", "close": "19:00"}, "wed": {"open": "08:00", "close": "19:00"}}	t	t	t	https://jhornig.com	Reliable café for getting work done in the 7th. Good default option: coffee + table + steady hours (including Sundays).	["sunday-safe", "central-1070", "good-for-2-4h", "work-friendly"]	0	0	admin-id-123	approved	f	f	0	2026-02-28 17:28:30.223638	\N
37	Burggasse24 Café	7. Neubau	Burggasse 24/8, 1070 Wien	48.2045	16.3532	{"fri": {"open": "10:00", "close": "22:00"}, "mon": {"open": "10:00", "close": "22:00"}, "sat": {"open": "10:00", "close": "22:00"}, "sun": {"open": "10:00", "close": "22:00"}, "thu": {"open": "10:00", "close": "22:00"}, "tue": {"open": "10:00", "close": "22:00"}, "wed": {"open": "10:00", "close": "22:00"}}	t	t	t	https://www.burggasse24.com	Not consistently laptop-friendly. Best if it’s not packed, ideally a couple hours before closing, and you’re doing a shorter session.	["cozy", "can-be-packed", "short-session", "best-off-peak"]	0	0	admin-id-123	approved	f	f	0	2026-02-28 17:28:30.454398	\N
38	7stern Café	7. Neubau	Siebensterngasse 31, 1070 Wien	48.2017	16.3535	{"fri": {"open": "10:00", "close": "23:00"}, "mon": {"closed": true}, "sat": {"open": "10:00", "close": "23:00"}, "sun": {"open": "10:00", "close": "18:00"}, "thu": {"open": "10:00", "close": "23:00"}, "tue": {"open": "10:00", "close": "23:00"}, "wed": {"open": "10:00", "close": "23:00"}}	t	t	t	https://www.7stern.net	Classic café option in the 7th with long hours Tue–Sat (until 23:00). Great for afternoon/evening sessions.	["late-hours", "afternoon-best", "classic-1070", "sunday-safe"]	0	0	admin-id-123	approved	f	f	0	2026-02-28 17:28:30.468993	\N
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (id, email, first_name, last_name, profile_image_url, created_at, updated_at) FROM stdin;
admin-id-123	admin@example.com	Admin	User	\N	2026-02-25 02:27:23.217277	2026-02-28 17:28:29.451
\.


--
-- Name: check_ins_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.check_ins_id_seq', 1, false);


--
-- Name: reviews_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.reviews_id_seq', 1, false);


--
-- Name: saved_spots_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.saved_spots_id_seq', 1, false);


--
-- Name: spot_images_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.spot_images_id_seq', 66, true);


--
-- Name: study_spots_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.study_spots_id_seq', 66, true);


--
-- Name: check_ins check_ins_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.check_ins
    ADD CONSTRAINT check_ins_pkey PRIMARY KEY (id);


--
-- Name: reviews reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_pkey PRIMARY KEY (id);


--
-- Name: saved_spots saved_spots_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.saved_spots
    ADD CONSTRAINT saved_spots_pkey PRIMARY KEY (id);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (sid);


--
-- Name: spot_images spot_images_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.spot_images
    ADD CONSTRAINT spot_images_pkey PRIMARY KEY (id);


--
-- Name: study_spots study_spots_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.study_spots
    ADD CONSTRAINT study_spots_pkey PRIMARY KEY (id);


--
-- Name: users users_email_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_unique UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: IDX_session_expire; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_session_expire" ON public.sessions USING btree (expire);


--
-- PostgreSQL database dump complete
--

\unrestrict jlrt2dv415NFNQvxGT3urc2Znjfk5jnI6mgoa80ZpMXMfXZgeodwaSdGq7c6JFQ

