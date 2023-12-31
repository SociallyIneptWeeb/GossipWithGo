--
-- PostgreSQL database dump
--

-- Dumped from database version 14.10
-- Dumped by pg_dump version 14.10

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
-- Name: categories; Type: TABLE; Schema: public; Owner: user
--

CREATE TABLE public.categories (
    id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    name text
);


ALTER TABLE public.categories OWNER TO "user";

--
-- Name: categories_id_seq; Type: SEQUENCE; Schema: public; Owner: user
--

CREATE SEQUENCE public.categories_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.categories_id_seq OWNER TO "user";

--
-- Name: categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: user
--

ALTER SEQUENCE public.categories_id_seq OWNED BY public.categories.id;


--
-- Name: comments; Type: TABLE; Schema: public; Owner: user
--

CREATE TABLE public.comments (
    id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    content text,
    user_id bigint,
    thread_id bigint
);


ALTER TABLE public.comments OWNER TO "user";

--
-- Name: comments_id_seq; Type: SEQUENCE; Schema: public; Owner: user
--

CREATE SEQUENCE public.comments_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.comments_id_seq OWNER TO "user";

--
-- Name: comments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: user
--

ALTER SEQUENCE public.comments_id_seq OWNED BY public.comments.id;


--
-- Name: threads; Type: TABLE; Schema: public; Owner: user
--

CREATE TABLE public.threads (
    id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    title text,
    description text,
    category_id bigint,
    user_id bigint,
    edited_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.threads OWNER TO "user";

--
-- Name: threads_id_seq; Type: SEQUENCE; Schema: public; Owner: user
--

CREATE SEQUENCE public.threads_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.threads_id_seq OWNER TO "user";

--
-- Name: threads_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: user
--

ALTER SEQUENCE public.threads_id_seq OWNED BY public.threads.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: user
--

CREATE TABLE public.users (
    id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    username text,
    password bytea
);


ALTER TABLE public.users OWNER TO "user";

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: user
--

CREATE SEQUENCE public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO "user";

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: user
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: categories id; Type: DEFAULT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.categories ALTER COLUMN id SET DEFAULT nextval('public.categories_id_seq'::regclass);


--
-- Name: comments id; Type: DEFAULT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.comments ALTER COLUMN id SET DEFAULT nextval('public.comments_id_seq'::regclass);


--
-- Name: threads id; Type: DEFAULT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.threads ALTER COLUMN id SET DEFAULT nextval('public.threads_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public.categories (id, created_at, updated_at, name) FROM stdin;
1	2023-12-24 07:22:57.310156+00	2023-12-24 07:22:57.310156+00	General
2	2023-12-24 07:22:57.310156+00	2023-12-24 07:22:57.310156+00	Fight me
3	2023-12-24 07:22:57.310156+00	2023-12-24 07:22:57.310156+00	Just curious
\.


--
-- Data for Name: comments; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public.comments (id, created_at, updated_at, content, user_id, thread_id) FROM stdin;
1	2023-12-24 09:47:50.598438+00	2023-12-24 09:47:50.598438+00	More than hell's paradise, about the same as Jujutsu Kaisen	2	1
2	2023-12-24 09:48:57.91919+00	2023-12-24 09:48:57.91919+00	Can definitely have more gore than the both of them. JJK doesn't even come close and neither does hells paradise.	3	1
3	2023-12-24 09:50:37.297365+00	2023-12-24 09:50:37.297365+00	Perfect cast easily	1	2
4	2023-12-24 10:21:20.350586+00	2023-12-24 10:21:20.350586+00	Guess you haven't seen Fate...	2	2
5	2023-12-24 10:27:28.332989+00	2023-12-24 10:27:28.332989+00	Bond finally getting more love and screen time. But seriously, this episode truly gave him the chance to shine both in action and personality. He's also got some underrated chemistry with Loid this episode.	1	3
6	2023-12-24 10:29:12.374052+00	2023-12-24 10:29:12.374052+00	All in all, I definitely enjoyed this cour more than the previous. Yor-san's highlight arc in the middle of this cour was spot-on too and the usual business is always good~	3	3
7	2023-12-25 07:36:58.836935+00	2023-12-25 07:36:58.836935+00	Nah Spy x Family is so much better	4	2
8	2023-12-25 07:41:55.649214+00	2023-12-25 07:41:55.649214+00	He has no romantic or sexual interests, at least haven't showed any so far. He has all female characters simping HARD over him and he doesn't rly care, he recognizes they are all hot but he just rly wants to do his chuunibyo stuff.	2	4
9	2023-12-25 07:42:54.01269+00	2023-12-25 07:42:54.01269+00	Romance isn't very Eminence in Shadow-y. Would go against his roleplay.	3	4
10	2023-12-25 07:43:40.677722+00	2023-12-25 07:43:40.677722+00	Bro is the epitome of Japan's ~1.2 Total fertility rate he does not want to mate	1	4
13	2023-12-25 07:57:43.087791+00	2023-12-25 07:57:43.087791+00	this is a test	1	2
20	2023-12-26 06:14:56.04265+00	2023-12-26 06:14:56.04265+00	Well I didn't knew about the voice actor but, I follow your emotion. What happened was tragedy both in anime and real life.	4	5
21	2023-12-26 06:15:31.692589+00	2023-12-26 06:15:31.692589+00	It's a shame we lost such a great talent so early. My deepest regards to her family and friends and rest in peace.	2	5
22	2023-12-26 06:16:17.668711+00	2023-12-26 06:16:17.668711+00	Agreed. Still sad about her passing, her music, especially in this movie was so good.	1	5
23	2023-12-29 03:34:21.881845+00	2023-12-29 03:34:21.881845+00	Battle shounen have never been good at characterization.	2	6
24	2023-12-29 03:34:43.756451+00	2023-12-29 03:34:43.756451+00	Chainsaw Man's real selling point, beneath the chainsaws and the action, is exactly the issue you're addressing. At least that's what it tries to do, whether it succeeds or not depends on you, everyone's taste is different. Some of it can already be seen in what was adapted so far, but CSM would have really benefitted from a 24 episodes first season like its competitors.	3	6
25	2023-12-29 03:35:03.380222+00	2023-12-29 03:35:03.380222+00	I think it's just a matter of personal taste and how tolerant you are of certain characterizations over time. I mean, even when you look at older shounen series like DB, Saint Seiya, Yu Yu Hakusho, and Hunter x Hunter, a lot of the characterizations aren't too different from today's anime. Of course, if you grew up with those series, the characterizations may seem more original back then than what is out now. But from the standpoint of a modern shounen watcher, there may not be much of a difference.	4	6
26	2023-12-29 03:35:27.773131+00	2023-12-29 03:35:27.773131+00	It's honestly all relative. I disagree with you on Demon Slayer; it's fast-paced during many of the battle segments, but in my opinion it does a fine job in between of exploring each character and building attachment to them.\n\nI'd say modern battle shonen are no worse at it than classic series. If anything, there are more attempts in modern series than there used to be to slow things down and take a character-driven approach. But again, two people could have entirely different opinions for the same series about this.	5	6
27	2024-01-01 05:19:01.260292+00	2024-01-01 05:19:01.260292+00	Most 1's are from people who are overly biased idiots that try to mask the good qualities of a manga/anime just because they got mad at some of the flaws of it.	3	7
28	2024-01-01 05:19:21.494313+00	2024-01-01 05:19:21.494313+00	I personally don't give a 1 to any anime apart from anime like "Mars of destruction". They are the lowest effort trash and worthless anime. Otherwise I don't see any reason to give a popular and well loved anime a 1 rating even if I hated it.	4	7
29	2024-01-01 05:19:39.614754+00	2024-01-01 05:19:39.614754+00	I don't get offended by anime. For me, a 1 just means that it was criminally boring.	5	7
30	2024-01-01 05:20:07.00344+00	2024-01-01 05:20:07.00344+00	I almost never rate anime one or ten in recent years, because I believe that 99% of such ratings are dictated by pure emotion, not reason.	1	7
31	2024-01-01 07:20:55.106348+00	2024-01-01 07:20:55.106348+00	K-On!! 8.17	4	8
32	2024-01-01 07:21:11.499914+00	2024-01-01 07:21:11.499914+00	the most correctly Hajime no Ippo	5	8
33	2024-01-01 07:21:31.475568+00	2024-01-01 07:21:31.475568+00	even though I gave it a 10, with the amount of contrarians in the anime community, it's a testament to how good Steins Gate actually is that it's maintained a 9 rating for so many years.	3	8
34	2024-01-01 07:21:50.228122+00	2024-01-01 07:21:50.228122+00	I would say Hunter x Hunter (2011) with 9,04 and 1.7mio ratings is the rating truly correctly.	2	8
\.


--
-- Data for Name: threads; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public.threads (id, created_at, updated_at, title, description, category_id, user_id, edited_at) FROM stdin;
1	2023-12-24 09:46:52.139592+00	2023-12-24 09:46:52.139592+00	About Chainsaw man...	 Does Chainsaw Man have more gore than JJK and hell's paradise?	3	1	2023-12-24 09:46:52.139592+00
2	2023-12-24 09:50:11.432791+00	2023-12-24 09:50:11.432791+00	Monogatari Series has the best cast of characters	Do you think Monogatari has the most interesting and likable case of characters out of all the anime?	2	3	2023-12-24 09:50:11.432791+00
3	2023-12-24 10:26:17.28436+00	2023-12-24 10:26:17.28436+00	Spy x Family Season 2 Episode 12 is OUT!	Did you guys enjoy the latest episode of Spy x Family S2???	1	2	2023-12-24 10:26:17.28436+00
4	2023-12-25 07:38:22.513465+00	2023-12-25 07:38:22.513465+00	Cid from the Eminence in Shadow Love interest	I am 10 episodes in but I'm wondering if Cid is going to end up with a girl at the start I thought he was going to end up with Alexia but the more I watch I think he's just going to jump from girl to girl.	3	4	2023-12-25 07:38:22.513465+00
5	2023-12-26 06:14:14.586228+00	2023-12-26 06:14:14.586228+00	Feel sorry for Yuna	Just rewatching this reminded me of Kanda Sayaka, the Japanese voice actor of Yuna, the anniversary of whose death has just passed a few days ago. When I saw Yuna in the movie, I can't help feeling sorry for both her and Kanda. It somehow made the movie a more emotional one.	1	5	2023-12-26 06:14:14.586228+00
6	2023-12-29 03:33:45.957473+00	2023-12-29 03:33:45.957473+00	Modern battle shonen are bad at characterization	I just finished JJK season 2, despite, consisting of many high-stake cool fights that give edge-to-seat experience. I do not feel any emotional attachment to the characters and even their supposed final moments fail to bring any sort of emotion out of me.\n\nIt's not just female characters that are poorly treated but male characters as well. A recent look into the way these battle shonen like Demon slayer and Jujutsu kaisen. They are super-fast paced shows that are focused on providing instant gratification and fail to explore characters and inner world in a meaningful way.	2	1	2023-12-29 03:33:45.957473+00
7	2024-01-01 05:18:40.954996+00	2024-01-01 05:18:40.954996+00	How often does a score of 1 mean that you were offended?	In other words, would an anime have to basically make you triggered in order for you to give it a score of 1?\n\nJust wanted to know a bit more about the thought process behind people's scores	3	2	2024-01-01 05:18:40.954996+00
8	2024-01-01 07:20:36.555479+00	2024-01-01 07:20:36.555479+00	The most correctly rated anime	Which anime do you think is the most correctly rated?	1	1	2024-01-01 07:20:36.555479+00
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public.users (id, created_at, updated_at, username, password) FROM stdin;
1	2023-12-20 04:59:24.554961+00	2023-12-20 04:59:24.554961+00	John	\\x243261243134245533434f5538707a3134394a51786250674b6632552e6c325a6a35614877326a4847745a39326d67557769454f39744444642e644f
2	2023-12-20 04:59:36.809123+00	2023-12-20 04:59:36.809123+00	Michael	\\x2432612431342446735177464534494233336e754f644a4f577076697575562f304d6264713830434a51354c3449703646503841683648454f2f3961
3	2023-12-20 05:54:44.375074+00	2023-12-20 05:54:44.375074+00	Adam	\\x24326124313424746746487a6e5346366964374576714a6b4b7a756d2e466c4259592f78573877425261434e376a7433416379376362534b67386361
4	2023-12-25 07:35:04.737505+00	2023-12-25 07:35:04.737505+00	Ronald Duck	\\x243261243134242e543748595750326d344b6d732e2e6d38564957764f526964326350356a614f4b6746746a59383846683738454d566a6c66363336
5	2023-12-26 06:09:22.134899+00	2023-12-26 06:09:22.134899+00	James Bond	\\x243261243134244f72715956327743766b484a3555794c6d367648714f71455344366b464a51436b544f5344646c434d746d6c6f625a376141704332
\.


--
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: user
--

SELECT pg_catalog.setval('public.categories_id_seq', 3, true);


--
-- Name: comments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: user
--

SELECT pg_catalog.setval('public.comments_id_seq', 34, true);


--
-- Name: threads_id_seq; Type: SEQUENCE SET; Schema: public; Owner: user
--

SELECT pg_catalog.setval('public.threads_id_seq', 8, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: user
--

SELECT pg_catalog.setval('public.users_id_seq', 5, true);


--
-- Name: categories categories_name_key; Type: CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_name_key UNIQUE (name);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- Name: comments comments_pkey; Type: CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_pkey PRIMARY KEY (id);


--
-- Name: threads threads_pkey; Type: CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.threads
    ADD CONSTRAINT threads_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: comments fk_comments_user; Type: FK CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT fk_comments_user FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: threads fk_threads_category; Type: FK CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.threads
    ADD CONSTRAINT fk_threads_category FOREIGN KEY (category_id) REFERENCES public.categories(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: comments fk_threads_comments; Type: FK CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT fk_threads_comments FOREIGN KEY (thread_id) REFERENCES public.threads(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: threads fk_threads_user; Type: FK CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.threads
    ADD CONSTRAINT fk_threads_user FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- PostgreSQL database dump complete
--

