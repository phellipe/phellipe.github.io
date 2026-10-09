// =============================================================================
// phellipe.eti.br — ÚNICA FONTE DE CONTEÚDO DO SITE (PT e EN lado a lado)
//
// Edite este arquivo (ou styles.css) e rode:   node tools/build.mjs
// O build gera index.html (pt-BR), en/index.html (en), 404.html, sitemap.xml,
// site.webmanifest e o arquivo de chave do IndexNow. Não edite esses arquivos à
// mão: eles são sobrescritos a cada build.
//
// Regras de conteúdo: todo fato precisa ter fonte verificável; clientes sob NDA
// não são nomeados. Strings podem conter HTML simples (<a>, <strong>, <cite>).
// Todo item com { pt, en } precisa das duas línguas: o build falha se faltar.
// =============================================================================

export const SITE = {
  origin: 'https://phellipe.eti.br',
  name: 'João Phellipe',
  fullName: 'João Phellipe de Freitas Pinto',
  givenName: 'João Phellipe',
  familyName: 'de Freitas Pinto',
  email: 'sr.phellipe@gmail.com',
  phone: '+5584988012224',
  whatsapp: 'https://wa.me/5584988012224',
  year: 2026,
  // Datas em ISO 8601. `updated` vai para o <lastmod> do sitemap e para o
  // dateModified do JSON-LD: atualize quando o conteúdo principal mudar.
  created: { pt: '2026-05-18', en: '2026-10-09' },
  updated: '2026-10-09',
  // Chave do IndexNow (Bing, Yandex, Seznam, Naver...). O build publica /<chave>.txt.
  indexNowKey: '259bd19e10d2ef81c4bec002e163d031',
  photo: { jpg: '/assets/joao-phellipe-640.jpg', width: 640, height: 640 },
};

// -----------------------------------------------------------------------------
// PERFIS (sameAs do JSON-LD e links de contato). Só entram os que existem.
// >>> ESPAÇO RESERVADO: preencha LinkedIn / Instagram / YouTube (e ORCID) quando
// >>> os perfis existirem e rode o build. Vazio = não aparece em lugar nenhum.
// -----------------------------------------------------------------------------
export const PROFILES = {
  github: 'https://github.com/phellipe',
  lattes: 'http://lattes.cnpq.br/9597994805591709',
  linkedin: '', // ex.: 'https://www.linkedin.com/in/<usuario>/'
  instagram: '', // ex.: 'https://www.instagram.com/<usuario>/'
  youtube: '', // ex.: 'https://www.youtube.com/@<canal>'
  orcid: '', // ex.: 'https://orcid.org/0000-0000-0000-0000'
};

// =============================================================================
// >>> PLACEHOLDERS DO VÍDEO — o ÚNICO lugar a preencher depois do render <<<
//   duration:   duração do vídeo PT em ISO 8601, ex.: 'PT1M39S'
//   uploadDate: data/hora de publicação com fuso, ex.: '2026-10-20T09:00:00-03:00'
//   durationEn: duração do vídeo EN, se for outra (null = igual ao PT)
// Enquanto um placeholder estiver aqui OU o MP4 da língua não existir em
// assets/video/, o build NÃO publica o VideoObject nem o link de download
// daquela página (assim nada sai inválido nem aponta para 404). Preencha,
// copie os MP4 e rode `node tools/build.mjs`: os dois voltam sozinhos.
// =============================================================================
export const VIDEO = {
  duration: 'PT1M39S',
  uploadDate: '2026-10-09T16:22:36-03:00',
  durationEn: 'PT1M37S',
  files: {
    pt: { mp4: '/assets/video/joao-phellipe-pt.mp4', vtt: '/assets/video/joao-phellipe-pt.vtt', poster: '/assets/video/poster-pt.jpg' },
    en: { mp4: '/assets/video/joao-phellipe-en.mp4', vtt: '/assets/video/joao-phellipe-en.vtt', poster: '/assets/video/poster-en.jpg' },
  },
  name: {
    pt: 'Conheça João Phellipe, engenheiro de software sênior',
    en: 'Meet João Phellipe, senior software engineer',
  },
  description: {
    pt: 'João Phellipe, engenheiro de software sênior, mostra 13 sistemas que criou, modernizou ou ajudou a construir para saúde, gestão, indústria, educação e setor público, além da carreira na TI da UFERSA, onde foi Superintendente de TIC de 2020 a 2024. O vídeo foi feito em código; vozes, trilha e avatar foram gerados com IA. Narração em português, com legendas e transcrição.',
    en: 'Senior software engineer João Phellipe shows 13 systems he built, modernized or helped build for health, business, industry, education and the public sector, plus his IT career at UFERSA, a Brazilian federal university, where he was Superintendent of ICT from 2020 to 2024. The film was built in code; voices, music and avatar were generated with AI. English narration, with captions and a transcript.',
  },
};

// ------------------------------------------------------------------ <head> ----
export const META = {
  title: {
    pt: 'João Phellipe — Engenheiro de Software Sênior em Mossoró (RN)',
    en: 'João Phellipe — Senior Software Engineer in Brazil (Remote)',
  },
  // até ~155 caracteres, para o snippet não ser cortado
  description: {
    pt: 'Engenheiro de software sênior em Mossoró (RN). Analista de TI da UFERSA desde 2012 e Superintendente de TIC (2020–2024). Cria SaaS e sistemas sob medida.',
    en: 'Remote senior software engineer in Brazil. IT Analyst at UFERSA, a federal university, since 2012; head of IT (2020–2024). Builds SaaS and custom software.',
  },
  ogImage: { pt: '/assets/social/og-pt-1200x630.jpg', en: '/assets/social/og-en-1200x630.jpg' },
  // descreve o texto que está na imagem (docs/seo-rebuild/og/og.html)
  ogImageAlt: {
    pt: 'João Phellipe, engenheiro de software sênior: 14+ anos em TI, ex-Superintendente de TIC da UFERSA e Mestre em Ciência da Computação',
    en: 'João Phellipe, senior software engineer: 14+ years in IT, head of IT at UFERSA from 2020 to 2024 and M.Sc. in Computer Science',
  },
  ogLocale: { pt: 'pt_BR', en: 'en_US' },
  personDescription: {
    pt: 'Engenheiro de software sênior em Mossoró (RN). É Analista de TI da UFERSA desde 2012 e foi Superintendente de TIC da universidade de 2020 a 2024. Cria produtos SaaS e sistemas para saúde, finanças, educação e direito.',
    en: 'Senior software engineer based in Mossoró, Brazil. IT Analyst at UFERSA, a Brazilian federal university, since 2012 and its Superintendent of ICT (head of IT) from 2020 to 2024. Builds SaaS products and custom software for healthcare, finance, education and law.',
  },
  jobTitle: {
    pt: ['Engenheiro de software sênior', 'Analista de Tecnologia da Informação na UFERSA'],
    en: ['Senior software engineer', 'Information Technology Analyst at UFERSA'],
  },
  knowsAbout: {
    pt: ['Engenharia de software', 'Desenvolvimento full-stack', 'TypeScript', 'React', 'React Native', 'Node.js', 'PostgreSQL', 'Row-Level Security', 'Assinatura digital ICP-Brasil', 'WebRTC', 'Agentes de IA', 'LGPD', 'Governança de TI', 'Java'],
    en: ['Software engineering', 'Full-stack development', 'TypeScript', 'React', 'React Native', 'Node.js', 'PostgreSQL', 'Row-Level Security', 'ICP-Brasil digital signatures', 'WebRTC', 'AI agents', 'LGPD (Brazilian data protection law)', 'IT governance', 'Java'],
  },
  credentials: [
    { pt: 'Bacharelado em Ciência da Computação (UFERSA, 2010)', en: 'B.Sc. in Computer Science (UFERSA, 2010)' },
    { pt: 'Mestrado em Ciência da Computação (PPGCC UERN/UFERSA, 2013)', en: 'M.Sc. in Computer Science (PPGCC UERN/UFERSA, 2013)', url: 'https://ppgcc.ufersa.edu.br/dissertacoes-defendidas/' },
  ],
};

// --------------------------------------------------------------- interface ----
export const UI = {
  skip: { pt: 'Pular para o conteúdo', en: 'Skip to content' },
  navLabel: { pt: 'Principal', en: 'Primary' },
  menuOpen: { pt: 'Abrir menu', en: 'Open menu' },
  nav: [
    { href: '#sobre', pt: 'Sobre', en: 'About' },
    { href: '#servicos', pt: 'Serviços', en: 'Services' },
    { href: '#trabalhos', pt: 'Trabalhos', en: 'Work' },
    { href: '#trajetoria', pt: 'Trajetória', en: 'Career' },
    { href: '#documentos', pt: 'Documentos', en: 'Records' },
    { href: '#contato', pt: 'Contato', en: 'Contact' },
  ],
  // link para a OUTRA língua
  langSwitch: {
    pt: { href: '/en/', hreflang: 'en', lang: 'en', label: 'EN', aria: 'EN — English version', footer: 'English version' },
    en: { href: '/', hreflang: 'pt-BR', lang: 'pt-BR', label: 'PT', aria: 'PT — versão em português', footer: 'Versão em português' },
  },
  external: { pt: '(abre em nova aba)', en: '(opens in a new tab)' },
  inPortuguese: { pt: '', en: ' (in Portuguese)' },
};

// -------------------------------------------------------------------- hero ----
export const HERO = {
  role: { pt: 'engenheiro de software sênior', en: 'senior software engineer' },
  statement: {
    pt: 'Construo o produto inteiro, do banco de dados ao app na mão do usuário.',
    en: 'I build the whole product, from the database to the app in your users’ hands.',
  },
  focus: { pt: 'foco', en: 'focus' },
  typed: {
    pt: ['saúde', 'SaaS', 'finanças', 'agentes de IA', 'educação', 'setor público'],
    en: ['healthcare', 'SaaS', 'finance', 'AI agents', 'education', 'public sector'],
  },
  sub: {
    pt: 'Sou Analista de TI da UFERSA desde 2012 e fui Superintendente de TIC da universidade de 2020 a 2024. Em paralelo, crio produtos SaaS e desenvolvo sistemas sob medida para empresas.',
    en: 'I’ve been an IT Analyst at UFERSA, a Brazilian federal university, since 2012, and I was its Superintendent of ICT (head of IT) from 2020 to 2024. Alongside that, I build SaaS products and custom software for companies.',
  },
  ctaWork: { pt: 'Ver trabalhos', en: 'View work' },
  ctaContact: { pt: 'Falar comigo', en: 'Get in touch' },
  portraitAlt: {
    pt: 'João Phellipe, engenheiro de software, de óculos e blazer preto, sorrindo em retrato de estúdio',
    en: 'João Phellipe, software engineer, wearing glasses and a black blazer, smiling in a studio portrait',
  },
  available: { pt: 'disponível para projetos', en: 'available for projects' },
  statsLabel: { pt: 'Resumo', en: 'Summary' },
  // `num` pode ser uma string comum ou { pt, en }
  stats: [
    { num: '14', plus: true, pt: 'anos em TI', en: 'years in IT' },
    { num: '2020–24', pt: 'Superintendente de TIC da UFERSA', en: 'Head of IT at UFERSA' },
    { num: { pt: 'Mestre', en: 'M.Sc.' }, pt: 'em Ciência da Computação', en: 'in Computer Science' },
  ],
};

// ----------------------------------------------------------- títulos (H2) ----
export const SECTIONS = {
  video: { id: 'video', num: '00', kicker: { pt: 'Vídeo', en: 'Video' }, title: { pt: 'Meu trabalho em vídeo.', en: 'My work in a short video.' } },
  // .nowrap: evita a quebra depois de "ex-" (o CSS a libera em telas estreitas)
  about: { id: 'sobre', num: '01', kicker: { pt: 'Sobre', en: 'About' }, title: { pt: 'Engenheiro full-stack, <span class="nowrap">ex-Superintendente</span> de&nbsp;TIC.', en: 'Full-stack engineer, former head of&nbsp;IT.' } },
  services: { id: 'servicos', num: '02', kicker: { pt: 'Serviços', en: 'Services' }, title: { pt: 'O que eu faço.', en: 'What I do.' } },
  stack: { id: 'stack', num: '03', kicker: { pt: 'Stack', en: 'Stack' }, title: { pt: 'O que eu uso para construir.', en: 'What I build with.' } },
  work: { id: 'trabalhos', num: '04', kicker: { pt: 'Trabalhos', en: 'Work' }, title: { pt: 'Produtos, clientes e setor público.', en: 'Products, clients and the public sector.' } },
  path: { id: 'trajetoria', num: '05', kicker: { pt: 'Trajetória', en: 'Career' }, title: { pt: 'Desde 2012, entre código e gestão.', en: 'Code and management, since 2012.' } },
  docs: { id: 'documentos', num: '06', kicker: { pt: 'Documentos', en: 'Records' }, title: { pt: 'Documentos públicos.', en: 'Public records.' } },
  pubs: { id: 'publicacoes', num: '07', kicker: { pt: 'Publicações', en: 'Publications' }, title: { pt: 'Publicações e pesquisa.', en: 'Publications and research.' } },
  faq: { id: 'perguntas', num: '08', kicker: { pt: 'Perguntas', en: 'FAQ' }, title: { pt: 'Perguntas frequentes.', en: 'Frequently asked questions.' } },
  contact: { id: 'contato', num: '09', kicker: { pt: 'Contato', en: 'Contact' }, title: { pt: 'Tem um sistema para tirar do papel?', en: 'Need something built?' } },
};

// ------------------------------------------------------------------- vídeo ----
export const VIDEO_UI = {
  note: {
    pt: 'Uma apresentação curta da minha trajetória na UFERSA e dos sistemas que criei, modernizei ou ajudei a construir. Narração em português, com legendas e transcrição.',
    en: 'A short introduction to my career at UFERSA and to the systems I built, modernized or helped build. English narration, with captions and a transcript.',
  },
  trackLabel: { pt: 'Português', en: 'English' },
  download: { pt: 'Baixar o vídeo de apresentação (MP4)', en: 'Download the introduction video (MP4)' },
  noVideo: { pt: 'Seu navegador não reproduz vídeo.', en: 'Your browser does not play video.' },
  // aviso mostrado se o MP4 não carregar (vale antes e depois da publicação)
  fallback: {
    pt: 'Não foi possível carregar o vídeo. A transcrição completa está logo abaixo.',
    en: 'The video couldn’t be loaded. The full transcript is right below.',
  },
  // legenda sob o player: só aparece quando VIDEO.duration estiver preenchido ({d} = "1 min 39 s")
  caption: { pt: '{d} · legendas em português', en: '{d} · English captions' },
  transcript: { pt: 'Transcrição do vídeo', en: 'Video transcript' },
};

// ------------------------------------------------- páginas do vídeo (watch pages) ----
// /video/ (pt-BR) e /en/video/ (en): o vídeo é o conteúdo principal da página,
// condição para o Google dar recursos de vídeo (miniatura, momentos-chave).
// Capítulos: t = segundo em que começa. O fim de cada um é o início do próximo; o
// do último é a duração do vídeo (VIDEO.duration). Ajuste os tempos ao render final.
export const VIDEO_PAGE = {
  title: {
    pt: 'Vídeo: João Phellipe, engenheiro de software sênior',
    en: 'Video: João Phellipe, senior software engineer',
  },
  description: {
    pt: 'João Phellipe mostra, em menos de 2 minutos, 13 sistemas que construiu ou ajudou a construir para saúde, gestão, indústria, educação e setor público.',
    en: 'In under two minutes, João Phellipe shows 13 systems he built or helped build for health, business, industry, education and the public sector.',
  },
  intro: {
    pt: 'Em menos de dois minutos, os sistemas que construí ou ajudei a construir: produtos próprios, projetos para clientes e sistemas da UFERSA. Todas as telas usam dados fictícios e, nos sistemas de clientes, as marcas foram ocultadas. O vídeo foi feito em código, com React, Remotion e Three.js. Vozes, trilha e avatar foram gerados com IA.',
    en: 'Under two minutes with the systems I built or helped build: my own products, client projects and systems at UFERSA, a Brazilian federal university. All screens use mock data, and client brands are hidden. The film was built in code with React, Remotion and Three.js. Voices, music and avatar were generated with AI.',
  },
  posterAlt: {
    pt: 'Pôster do vídeo: retrato de João Phellipe na tela de um celular, entre telas de sistemas, com o texto "Engenheiro de software sênior" e "Vídeo de apresentação"',
    en: 'Video poster: a portrait of João Phellipe on a phone screen, among system screens, with the text "Senior software engineer" and "Introduction video"',
  },
  chapters: {
    pt: [
      { t: 0, name: 'Quem é João Phellipe' },
      { t: 20, name: 'Saúde: Maintenance e telemedicina' },
      { t: 35, name: 'Gestão: agente de IA e Quanto Sobra' },
      { t: 46, name: 'Indústria e educação' },
      { t: 58, name: 'Setor público e os 13 sistemas' },
      { t: 73, name: 'Credenciais e mais uma coisa' },
      { t: 88, name: 'Vamos construir o seu?' },
    ],
    en: [
      { t: 0, name: 'Meet João Phellipe' },
      { t: 19, name: 'Health: Maintenance and telemedicine' },
      { t: 35, name: 'Business: AI sales agent and Quanto Sobra' },
      { t: 46, name: 'Industry and education' },
      { t: 58, name: 'Public sector and 13 systems' },
      { t: 70, name: 'Credentials and one more thing' },
      { t: 86, name: 'Let’s build yours' },
    ],
  },
  chaptersLabel: { pt: 'Capítulos', en: 'Chapters' },
  transcriptLabel: { pt: 'Transcrição', en: 'Transcript' },
  download: { pt: 'Baixar o vídeo (MP4)', en: 'Download the video (MP4)' },
  back: { pt: 'Voltar ao portfólio', en: 'Back to the portfolio' },
  breadcrumbHome: { pt: 'Início', en: 'Home' },
  breadcrumbVideo: { pt: 'Vídeo', en: 'Video' },
  // link na seção #video das homes
  homeLink: { pt: 'Abrir a página do vídeo, com capítulos', en: 'Open the video page, with chapters' },
};

// ------------------------------------------------------------------- sobre ----
export const ABOUT = [
  {
    pt: 'Sou João Phellipe de Freitas Pinto, engenheiro de software e desenvolvedor full-stack em Mossoró (RN), bacharel em Ciência da Computação pela UFERSA (2010) e mestre em Ciência da Computação pelo programa associado UERN/UFERSA (2013). Hoje sou doutorando em Educação e pesquiso a interface entre inteligência artificial, tecnologias digitais e educação.',
    en: 'I’m João Phellipe de Freitas Pinto, a software engineer and full-stack developer based in Mossoró, in the state of Rio Grande do Norte, Brazil. I hold a B.Sc. in Computer Science from UFERSA (2010) and an M.Sc. in Computer Science from the joint UERN/UFERSA graduate program (2013). I’m currently a doctoral student in Education, researching the interface between artificial intelligence, digital technologies and education.',
  },
  {
    pt: 'Entrei na UFERSA por concurso público em 2012, como Analista de Tecnologia da Informação. Na Divisão de Sistemas Computacionais da SUTIC, trabalho com os sistemas integrados de gestão da universidade, como o SIGAA e o SIPAC: código Java legado que mantenho e evoluo com a equipe. De 2020 a 2024, como Superintendente de TIC, respondi pela TI dos quatro campi: infraestrutura, sistemas, governança, segurança da informação e equipes.',
    en: 'I joined UFERSA in 2012 as an Information Technology Analyst, through a competitive civil-service exam. In SUTIC’s Computer Systems Division (SUTIC is the university’s IT department), I work on UFERSA’s integrated management systems, such as SIGAA and SIPAC: legacy Java code that I maintain and extend with the team. From 2020 to 2024, as Superintendent of ICT, I was responsible for IT across the university’s four campuses: infrastructure, systems, governance, information security and staff.',
  },
  {
    pt: 'É essa bagagem de arquitetura e gestão que levo para produtos full-stack em monorepos TypeScript: React e React Native na interface, Node.js e PostgreSQL por trás, Docker e CI/CD para colocar tudo em produção. Já resolvi o que costuma travar equipes: vídeo em tempo real com WebRTC e Jitsi em infraestrutura própria, assinatura digital ICP-Brasil, sistemas multi-tenant isolados com Row-Level Security no PostgreSQL, apps offline-first e um agente de IA atendendo clientes reais no WhatsApp.',
    en: 'That architecture and management background is what I bring to full-stack products in TypeScript monorepos: React and React Native on the front end, Node.js and PostgreSQL on the back end, Docker and CI/CD to ship it. I’ve solved the problems that tend to stall teams: real-time video with WebRTC and Jitsi on self-hosted infrastructure, ICP-Brasil digital signatures (Brazil’s national public-key infrastructure), multi-tenant systems isolated with PostgreSQL Row-Level Security, offline-first apps and an AI agent serving real customers on WhatsApp.',
  },
  {
    pt: 'Nas horas vagas, mantenho o River Assault, um shooter vertical inspirado no clássico River Raid, escrito em C99 com SDL2, com rio procedural, cinco biomas e mixer de áudio próprio.',
    en: 'In my spare time, I work on River Assault, a vertical shooter inspired by the classic River Raid. It’s written in C99 with SDL2 and features a procedurally generated river, five biomes and a custom audio mixer.',
  },
];

// ---------------------------------------------------------------- serviços ----
export const SERVICES = {
  intro: {
    pt: 'Projeto, desenvolvo e coloco em produção sistemas sob medida, do banco de dados ao app no celular. Moro em Mossoró (RN) e trabalho remotamente com empresas de qualquer lugar do Brasil.',
    en: 'I design, build and ship custom software, from the database to the app on your phone. I live in Mossoró, Brazil, and work remotely.',
  },
  items: [
    {
      title: { pt: 'Sistemas para clínicas, hospitais e laboratórios', en: 'Systems for clinics, hospitals and labs' },
      text: {
        pt: 'Gestão da manutenção de equipamentos com chamado por QR code (o <a href="#maintenance">Maintenance</a>, meu SaaS, em produção num hospital-piloto), prontuário eletrônico veterinário (o <a href="#prontvet">ProntVet</a>), receitas e atestados com assinatura digital ICP-Brasil, videoconsulta e adequação à LGPD.',
        en: 'Equipment maintenance management with QR-code tickets (<a href="#maintenance">Maintenance</a>, my SaaS, live at a pilot hospital), veterinary electronic health records (<a href="#prontvet">ProntVet</a>), prescriptions and medical certificates with ICP-Brasil digital signatures, video consultations and LGPD (Brazil’s data protection law) compliance.',
      },
    },
    {
      title: { pt: 'SaaS e sistemas de gestão', en: 'SaaS and management systems' },
      text: {
        pt: '<a href="#razao">ERP financeiro</a>, <a href="#factoring">factoring</a>, <a href="#juridico">escritórios de advocacia</a> e <a href="#industria">indústria</a>, com isolamento de cada empresa por Row-Level Security no PostgreSQL (no ERP e no factoring), permissões granulares e trilha de auditoria.',
        en: '<a href="#razao">Financial ERP</a>, <a href="#factoring">factoring</a>, <a href="#juridico">law firm management</a> and <a href="#industria">manufacturing</a> systems, with per-company data isolation through PostgreSQL Row-Level Security (in the ERP and the factoring platform), granular permissions and audit trails.',
      },
    },
    {
      title: { pt: 'Agentes de IA no WhatsApp', en: 'AI agents on WhatsApp' },
      text: {
        pt: 'Um <a href="#agente-ia">agente de IA</a> atende e qualifica leads no WhatsApp e passa o cliente pronto ao vendedor, com controle do custo de IA.',
        en: 'An <a href="#agente-ia">AI agent</a> talks to leads on WhatsApp, qualifies them and hands sales-ready customers over to a salesperson, with AI costs tracked per salesperson.',
      },
    },
    {
      title: { pt: 'Apps que funcionam sem internet', en: 'Apps that work offline' },
      text: {
        pt: 'Apps em React Native e PWAs que guardam os dados no aparelho e sincronizam quando há conexão, como o <a href="#quanto-sobra">Quanto Sobra</a>, publicado no Google Play, e a ordem de serviço do técnico no Maintenance (PWA).',
        en: 'React Native apps and PWAs that keep data on the device and sync when a connection is available, like <a href="#quanto-sobra">Quanto Sobra</a>, published on Google Play, and the technician’s work orders in Maintenance (a PWA).',
      },
    },
    {
      title: { pt: 'Modernização e integrações', en: 'Modernization and integrations' },
      text: {
        pt: 'Java legado (Struts, JSF, Hibernate e JBoss), <a href="#telegram">outbox transacional no PostgreSQL</a> e reescrita de app desktop de Electron para Rust.',
        en: 'Legacy Java (Struts, JSF, Hibernate and JBoss), a <a href="#telegram">transactional outbox in PostgreSQL</a> and a desktop app rewritten from Electron to Rust.',
      },
    },
    {
      title: { pt: 'Arquitetura, segurança e LGPD', en: 'Architecture, security and LGPD' },
      text: {
        pt: 'Levo para o desenho de cada sistema a experiência de quase quatro anos à frente da TI de uma universidade federal: governança digital, segurança da informação e contratações de TIC, <a href="#documentos">com registro em documentos públicos</a>.',
        en: 'I bring nearly four years as head of IT at a federal university to the design of every system: digital governance, information security and IT procurement, all <a href="#documentos">on public record</a>.',
      },
    },
  ],
};

// ------------------------------------------------------------------- stack ----
export const STACK = [
  { label: { pt: 'Linguagens', en: 'Languages' }, tags: ['TypeScript', 'JavaScript', 'Java', 'Rust', 'SQL', 'C'] },
  { label: { pt: 'Frontend', en: 'Frontend' }, tags: ['React', 'React Native', 'Expo', 'Next.js', 'Astro', 'Vite', 'Tailwind CSS', 'shadcn/ui'] },
  { label: { pt: 'Backend', en: 'Backend' }, tags: ['Node.js', 'NestJS', 'Fastify', 'Express', 'Hono', 'tRPC', 'REST', 'Spring', 'Hibernate', 'Struts', 'JSF', 'JBoss'] },
  { label: { pt: 'Dados', en: 'Data' }, tags: ['PostgreSQL', 'Drizzle', 'Prisma', 'Redis', 'SQLite', 'Supabase'] },
  { label: { pt: 'Infra &amp; DevOps', en: 'Infra &amp; DevOps' }, tags: ['Docker', 'CI/CD', 'Nginx', 'Traefik', 'MinIO', 'Maven', 'Turborepo'] },
  { label: { pt: 'Especialidades', en: 'Specialties' }, tags: ['WebRTC', 'ICP-Brasil', 'Multi-tenant / RLS', 'Offline-first', 'Stripe', { pt: 'IA (Claude / OpenAI)', en: 'AI (Claude / OpenAI)' }, { pt: 'Redes (CCNAv7)', en: 'Networking (CCNAv7)' }] },
  { label: { pt: 'Governança &amp; Gestão', en: 'Governance &amp; Management' }, tags: ['ITIL', 'LGPD', { pt: 'Segurança da Informação', en: 'Information Security' }, { pt: 'Governança de TI', en: 'IT Governance' }] },
];

// --------------------------------------------------------------- trabalhos ----
// ld.role: 'creator' (produto dele) | 'contributor' (cliente / coautoria institucional)
// ld.sentences: quantas frases do texto do card vão para a description do JSON-LD (padrão 1)
export const WORK = {
  note: {
    pt: 'Produtos que criei, sistemas que desenvolvi ou modernizei para clientes e sistemas institucionais em que atuei. Os sistemas de clientes estão sob NDA: descrevo o trabalho pelo setor, sem citar marcas.',
    en: 'Products I created, systems I built or modernized for clients, and institutional systems I worked on. Client systems are under NDA, so I describe the work by industry, without naming brands.',
  },
  listName: { pt: 'Trabalhos de João Phellipe', en: 'Work by João Phellipe' },
  groups: [
    {
      id: 'produtos',
      title: { pt: 'Produtos próprios', en: 'My own products' },
      items: [
        {
          id: 'maintenance',
          featured: true,
          title: { pt: 'Maintenance — manutenção de equipamentos de saúde', en: 'Maintenance — healthcare equipment maintenance' },
          badge: { pt: 'Produto próprio · em produção', en: 'Own product · in production' },
          text: {
            pt: 'SaaS que criei e opero para a manutenção de equipamentos hospitalares, clínicos e de diagnóstico por imagem. Qualquer pessoa da equipe abre um chamado apontando o celular para o QR code do aparelho, sem login e sem instalar app. O técnico registra a ordem de serviço no celular, mesmo sem internet, com checklist, fotos e assinatura. O gestor acompanha SLA, preventivas e calibrações, com painel para TV e relatórios em PDF e Excel. Está em produção num hospital-piloto e é multi-cliente: cada instituição vê só os próprios dados.',
            en: 'A SaaS I built and run for maintaining hospital, clinical and diagnostic imaging equipment. Any staff member opens a ticket by scanning the device’s QR code with their phone, with no login and no app to install. The technician records the work order on the phone, even offline, with a checklist, photos and a signature. Managers track SLAs, preventive maintenance and calibrations, with a TV dashboard and PDF and Excel reports. It is live at a pilot hospital and is multi-tenant: each institution sees only its own data.',
          },
          tags: ['React (PWA)', 'Node.js', 'PostgreSQL', 'Docker', 'Service Worker'],
          links: [{ href: 'https://maintenance.app.br/', pt: 'Conheça o Maintenance (maintenance.app.br)', en: 'Learn about Maintenance (maintenance.app.br, in Portuguese)', hreflang: 'pt-BR' }],
          ld: { role: 'creator', url: 'https://maintenance.app.br/' },
        },
        {
          id: 'quanto-sobra',
          title: { pt: 'Quanto Sobra — finanças pessoais', en: 'Quanto Sobra — personal finance' },
          badge: { pt: 'Produto próprio · Google Play', en: 'Own product · Google Play' },
          text: {
            pt: 'App de finanças pessoais que responde a uma pergunta só: quanto sobra no fim do mês? Funciona sem internet: os dados ficam em SQLite no celular e sincronizam com o servidor. A lógica de negócio está num pacote TypeScript puro, com 311 testes automatizados.',
            en: 'A personal finance app that answers one question: how much is left at the end of the month? It works offline: data is stored in SQLite on the phone and syncs with the server. The business logic lives in a pure TypeScript package with 311 automated tests.',
          },
          tags: ['React Native', 'Expo', 'SQLite', 'Drizzle', 'TypeScript'],
          links: [
            { href: 'https://play.google.com/store/apps/details?id=com.quantosobra', pt: 'Quanto Sobra no Google Play', en: 'Quanto Sobra on Google Play' },
            { href: 'https://quantosobra.app.br/', pt: 'Site do Quanto Sobra', en: 'Quanto Sobra website (in Portuguese)', hreflang: 'pt-BR' },
          ],
          ld: { role: 'creator', url: 'https://quantosobra.app.br/', sameAs: 'https://play.google.com/store/apps/details?id=com.quantosobra' },
        },
        {
          id: 'razao',
          title: { pt: 'Razão — ERP financeiro', en: 'Razão — financial ERP' },
          badge: { pt: 'Produto próprio', en: 'Own product' },
          text: {
            pt: 'ERP financeiro para pequenas e médias empresas: plano de contas, DRE, fluxo de caixa, vendas, comissões e estoque. É multiempresa, com isolamento por Row-Level Security no PostgreSQL. Tem SDK TypeScript gerado a partir do OpenAPI e importação de extratos que identifica o layout de dez bancos pelo cabeçalho do arquivo.',
            en: 'A financial ERP for small and mid-sized businesses: chart of accounts, income statement, cash flow, sales, commissions and inventory. It is multi-company, with data isolated by PostgreSQL Row-Level Security. It has a TypeScript SDK generated from the OpenAPI spec and a bank-statement import that detects ten banks’ layouts from the file header.',
          },
          tags: ['Next.js', 'NestJS', 'Drizzle', 'PostgreSQL (RLS)'],
          ld: { role: 'creator' },
        },
        {
          id: 'extrajobs',
          title: { pt: 'Extrajobs — marketplace de serviços', en: 'Extrajobs — services marketplace' },
          badge: { pt: 'Produto próprio', en: 'Own product' },
          text: {
            pt: 'Conecta clientes a prestadores de serviço, com publicação de jobs, propostas, contratação, avaliações nos dois sentidos e chat em tempo real com Socket.io. Tem API, site e app mobile, e o backend tem mais de 130 testes automatizados.',
            en: 'Connects clients with service providers: job posts, proposals, hiring, two-way reviews and real-time chat over Socket.io. It has an API, a website and a mobile app, and the backend has more than 130 automated tests.',
          },
          tags: ['React', 'React Native', 'Express', 'Prisma', 'Socket.io'],
          ld: { role: 'creator' },
        },
        {
          id: 'prontvet',
          title: { pt: 'ProntVet — prontuário eletrônico veterinário', en: 'ProntVet — veterinary electronic health record' },
          badge: { pt: 'Produto próprio', en: 'Own product' },
          text: {
            pt: 'Prontuário eletrônico para clínicas e hospitais veterinários: agenda, evolução clínica no formato SOAP com sinais vitais, exames estruturados com faixas de referência e alerta de valores alterados, assinatura do prontuário com hash SHA-256 verificável publicamente, exportação em PDF e DOCX e portal do tutor com links que expiram (30 dias por padrão).',
            en: 'An electronic health record for veterinary clinics and hospitals: scheduling, SOAP clinical notes with vital signs, structured lab results with reference ranges and alerts for abnormal values, record signing with a publicly verifiable SHA-256 hash, PDF and DOCX export and a pet-owner portal with expiring links (30 days by default).',
          },
          tags: ['React', 'Node.js', 'PostgreSQL', 'Docker'],
          ld: { role: 'creator' },
        },
      ],
    },
    {
      id: 'clientes',
      title: { pt: 'Para clientes', en: 'For clients' },
      items: [
        {
          id: 'telemedicina',
          title: { pt: 'Plataforma de telemedicina (modernização)', en: 'Telehealth platform (modernization)' },
          badge: { pt: 'Cliente · modernização', en: 'Client · modernization' },
          text: {
            pt: 'Modernizei e estendi uma plataforma de telemedicina já em uso: assinatura digital ICP-Brasil de receitas e atestados (certificado A1, A3 em token e A3 em nuvem) com carimbo do tempo, videoconsulta com Jitsi e servidor TURN próprios, um app desktop de assinatura A3 que reescrevi de Electron para Rust e adequação à LGPD (consentimento versionado, trilha de auditoria e criptografia de dados sensíveis).',
            en: 'I modernized and extended a telehealth platform already in use: ICP-Brasil digital signatures for prescriptions and medical certificates (A1 certificate, A3 on a token and A3 in the cloud) with timestamping, video consultations on self-hosted Jitsi and TURN servers, a desktop A3 signing app I rewrote from Electron to Rust, and LGPD compliance (versioned consent, audit trail and encryption of sensitive data).',
          },
          tags: ['React', 'Node.js', 'PostgreSQL', 'WebRTC / Jitsi', 'Rust', 'ICP-Brasil'],
          ld: { role: 'contributor' },
        },
        {
          id: 'agente-ia',
          title: { pt: 'Agente de IA para vendas no WhatsApp', en: 'AI sales agent on WhatsApp' },
          badge: { pt: 'Cliente · em produção', en: 'Client · in production' },
          text: {
            pt: 'Reconstruí em código, como aplicação sob medida, um SaaS que antes rodava em ferramentas no-code. Nele, um agente de IA atende leads no WhatsApp, qualifica a conversa e passa o cliente pronto ao vendedor humano. O sistema tem painel do vendedor, carteira em Kanban, planos e controle do custo de IA por vendedor, e está em produção no cliente.',
            en: 'I rebuilt a SaaS that used to run on no-code tools as a custom-coded application. An AI agent talks to leads on WhatsApp, qualifies them and hands sales-ready customers over to a human salesperson. The system has a salesperson dashboard, a Kanban pipeline, plans and per-salesperson AI cost tracking, and it is in production at the client.',
          },
          tags: ['NestJS', 'Next.js', 'PostgreSQL', 'OpenAI', 'WhatsApp'],
          // 2 frases: a 1ª sozinha não diz que é um agente de IA no WhatsApp
          ld: { role: 'contributor', sentences: 2 },
        },
        {
          id: 'juridico',
          title: { pt: 'Gestão para escritórios de advocacia', en: 'Management for law firms' },
          badge: { pt: 'Cliente · em uso', en: 'Client · in use' },
          text: {
            pt: 'Desenvolvi um sistema de gestão para escritórios de advocacia, hoje em uso, com processos, demandas em Kanban, audiências e clientes. A calculadora de prazos distingue CPC e CPP, permite contar em dobro os prazos da Fazenda Pública, desconta feriados nacionais (via BrasilAPI) e o recesso forense e valida o formato do número CNJ. Tem permissões granulares e auditoria de cada operação.',
            en: 'I built a management system for law firms, now in use, with cases, Kanban task boards, hearings and clients. The deadline calculator tells civil (CPC) from criminal (CPP) procedure, can double deadlines for public-sector parties, skips national holidays (from BrasilAPI) and the court recess, and validates the format of CNJ case numbers. It has granular permissions and an audit trail for every operation.',
          },
          tags: ['React', 'tRPC', 'Drizzle', 'PostgreSQL'],
          ld: { role: 'contributor' },
        },
        {
          id: 'factoring',
          title: { pt: 'Plataforma SaaS de factoring', en: 'Factoring SaaS platform' },
          badge: { pt: 'Cliente · NDA', en: 'Client · NDA' },
          text: {
            pt: 'Desenvolvi para um cliente uma plataforma SaaS multiempresa de factoring: cessão de títulos com deságio calculado título a título e carteira de recebíveis com juros de mora. Inclui esteira de cedentes com KYC e limite de crédito, régua de cobrança e faturamento do próprio SaaS por uso, com isolamento por Row-Level Security e deploy em Docker.',
            en: 'I built a multi-company factoring SaaS platform for a client: assignment of receivables with the discount calculated receivable by receivable, and a receivables portfolio with late-payment interest. It includes a seller onboarding pipeline with KYC and credit limits, a dunning workflow and usage-based billing for the SaaS itself, with Row-Level Security isolation and Docker deployment.',
          },
          tags: ['NestJS', 'Next.js', 'Prisma', 'PostgreSQL (RLS)'],
          ld: { role: 'contributor' },
        },
        {
          id: 'industria',
          title: { pt: 'Ecossistema digital para indústria de alimentos', en: 'Digital ecosystem for a food manufacturer' },
          badge: { pt: 'Cliente · NDA', en: 'Client · NDA' },
          text: {
            pt: 'Para uma indústria de alimentos, construí um ecossistema digital num monorepo: site institucional em português, inglês e espanhol, painel de gestão, portal B2B e API central. O sistema cobre pedidos B2B do início ao fim, pipeline comercial e geração de catálogos e documentos em PDF.',
            en: 'For a food manufacturer, I built a digital ecosystem in a monorepo: a corporate website in Portuguese, English and Spanish, a management dashboard, a B2B portal and a central API. It covers B2B orders end to end, the sales pipeline and PDF catalogs and documents.',
          },
          tags: ['Next.js', 'Astro', 'Hono', 'PostgreSQL', 'Redis'],
          ld: { role: 'contributor' },
        },
        {
          id: 'educacional',
          title: { pt: 'Plataforma educacional (web e mobile)', en: 'Education platform (web and mobile)' },
          badge: { pt: 'Cliente · NDA', en: 'Client · NDA' },
          text: {
            pt: 'Desenvolvi para um cliente uma plataforma educacional web e mobile com gestão escolar, percursos formativos gerados com IA, trilhas gamificadas e comunicação entre escola e família. Tem mais de dez perfis de usuário e mais de 200 tabelas, além de tutor de IA, alinhamento à BNCC e consentimento LGPD por finalidade.',
            en: 'I built a web and mobile education platform for a client, with school management, AI-generated learning paths, gamified tracks and school-to-family messaging. It has more than ten user roles and more than 200 database tables, plus an AI tutor, alignment with Brazil’s national curriculum (BNCC) and purpose-based LGPD consent.',
          },
          tags: ['React', 'React Native', 'Fastify', 'tRPC', 'Drizzle'],
          ld: { role: 'contributor' },
        },
      ],
    },
    {
      id: 'ufersa',
      title: { pt: 'Na UFERSA', en: 'At UFERSA' },
      items: [
        {
          id: 'rsc',
          title: { pt: 'Sistema RSC-PCCTAE (UFERSA)', en: 'RSC-PCCTAE system (UFERSA)' },
          // selos curtos: cabem numa linha a partir de 320 px (a UFERSA já está no título do grupo)
          badge: { pt: 'Institucional · coautoria', en: 'Institutional · co-developed' },
          text: {
            pt: 'Na SUTIC, atuei no sistema em que os servidores técnico-administrativos da UFERSA pedem o Reconhecimento de Saberes e Competências: regras de pontuação configuráveis, análise por comissão e nota calculada automaticamente. É um sistema institucional, desenvolvido pela SUTIC em coautoria, e está em produção. Redigi o Manual Operacional e o Manual do Administrador (julho de 2026).',
            en: 'At SUTIC, I worked on the system UFERSA’s technical-administrative staff use to apply for Recognition of Knowledge and Skills (RSC): configurable scoring rules, committee review and automatically calculated scores. It is an institutional system, co-developed at SUTIC, and it is in production. I wrote its Operations Manual and Administrator Manual (July 2026).',
          },
          tags: ['NestJS', 'Next.js', 'Prisma', 'PostgreSQL'],
          links: [{ href: 'https://rsc.ufersa.edu.br/', pt: 'Portal do RSC-TAE da UFERSA', en: 'UFERSA RSC-TAE portal (in Portuguese)', hreflang: 'pt-BR' }],
          ld: { role: 'contributor', copyrightHolder: 'UFERSA' },
        },
        {
          id: 'edudash',
          title: { pt: 'EduDash — painel de indicadores educacionais', en: 'EduDash — education indicators dashboard' },
          badge: { pt: 'Registro no INPI · coautoria', en: 'INPI-registered · co-created' },
          text: {
            pt: 'Sou um dos três criadores do EduDash, painel de indicadores para secretarias municipais de educação, com séries históricas, projeção de metas, planos de ação com semáforo de custo, prazo e escopo e benchmarking entre escolas. O programa tem registro no INPI (<span class="nowrap">BR 51 2025 002189-5</span>), com a UFERSA como titular.',
            en: 'I’m one of the three creators of EduDash, an indicators dashboard for municipal education departments, with historical time series, goal projections, action plans with traffic-light status for cost, schedule and scope, and benchmarking across schools. The software is registered with INPI, Brazil’s industrial property office (<span class="nowrap">BR 51 2025 002189-5</span>), with UFERSA as the rights holder.',
          },
          tags: ['React', 'Express', 'Sequelize', 'Recharts'],
          ld: { role: 'contributor', copyrightHolder: 'UFERSA' },
        },
        {
          id: 'telegram',
          title: { pt: 'Notificações via Telegram (UFERSA)', en: 'Telegram notifications (UFERSA)' },
          badge: { pt: 'Institucional · em produção', en: 'Institutional · in production' },
          text: {
            pt: 'Desenvolvi o serviço de notificações via Telegram da UFERSA, em Node.js e TypeScript, com outbox transacional no PostgreSQL (LISTEN/NOTIFY) e consentimento LGPD. Está em produção desde julho de 2026 e já envia os avisos do Sistema RSC-PCCTAE. A integração com SIGAA, SIGRH e SIPAC foi validada em desenvolvimento e ainda aguarda implantação.',
            en: 'I built UFERSA’s Telegram notification service in Node.js and TypeScript, with a transactional outbox in PostgreSQL (LISTEN/NOTIFY) and LGPD consent checks. It has been in production since July 2026 and already delivers the RSC-PCCTAE system’s notifications. The integration with SIGAA, SIGRH and SIPAC has been validated in a development environment and is awaiting rollout.',
          },
          tags: ['Node.js', 'TypeScript', 'PostgreSQL', 'Telegram'],
          ld: { role: 'creator', copyrightHolder: 'UFERSA' },
        },
      ],
    },
  ],
};

// -------------------------------------------------------------- trajetória ----
export const PATH = {
  expLabel: { pt: 'Experiência', en: 'Experience' },
  eduLabel: { pt: 'Formação', en: 'Education' },
  timeline: [
    {
      period: { pt: '2019 — hoje', en: '2019 — present' },
      role: { pt: 'Engenheiro de software · produtos próprios e projetos para clientes', en: 'Software engineer · own products and client projects' },
      text: {
        pt: 'Crio e opero produtos próprios — como o Maintenance, em produção num hospital-piloto, e o Quanto Sobra, publicado no Google Play — e desenvolvo sistemas para clientes de saúde, finanças, direito, vendas, educação e indústria.',
        en: 'I build and run my own products — such as Maintenance, live at a pilot hospital, and Quanto Sobra, published on Google Play — and develop systems for clients in healthcare, finance, law, sales, education and manufacturing.',
      },
    },
    {
      period: { pt: '2020 — 2024', en: '2020 — 2024' },
      role: { pt: 'Superintendente de Tecnologia da Informação e Comunicação · UFERSA', en: 'Superintendent of Information and Communication Technology (<span lang="pt-BR">Superintendente de TIC</span>) · UFERSA' },
      text: {
        pt: 'Função de direção <span class="nowrap">(CD-04)</span> à frente da TI da universidade e de seus quatro campi. Em novembro de 2023, fui designado autoridade máxima de TIC (IN SGD/ME nº 94/2022). Fui membro dos comitês de Governança Digital e de Segurança da Informação e gerente do Plano de Transformação Digital pactuado com a Secretaria de Governo Digital.',
        en: 'Executive position <span class="nowrap">(CD-04)</span> heading IT for the university and its four campuses. In November 2023, I was designated the university’s highest ICT authority under federal rule IN SGD/ME No. 94/2022. I was a member of the Digital Governance and Information Security committees and managed the Digital Transformation Plan agreed with Brazil’s federal Digital Government Secretariat.',
      },
    },
    {
      period: { pt: '2012 — hoje', en: '2012 — present' },
      role: { pt: 'Analista de Tecnologia da Informação · UFERSA (SUTIC)', en: 'Information Technology Analyst · UFERSA (SUTIC)' },
      text: {
        pt: 'Na Divisão de Sistemas Computacionais, mantenho e evoluo com a equipe os sistemas integrados de gestão da universidade, como o SIGAA e o SIPAC (Java legado). De 2015 a 2016, fiquei à disposição da Pró-Reitoria de Graduação para implantar os módulos do SIGAA na UFERSA. Desenvolvi o serviço de notificações via Telegram e atuei no Sistema RSC-PCCTAE.',
        en: 'In the Computer Systems Division, I maintain and extend the university’s integrated management systems, such as SIGAA and SIPAC (legacy Java), together with the team. From 2015 to 2016, I was assigned to the Office of Undergraduate Studies to roll out the SIGAA modules at UFERSA. I built the Telegram notification service and worked on the RSC-PCCTAE system.',
      },
    },
    {
      period: { pt: '2013 e 2017', en: '2013 and 2017' },
      role: { pt: 'Docência', en: 'Teaching' },
      text: {
        pt: 'Em 2013, ministrei cinco disciplinas (280 horas-aula) num curso de Sistemas de Informação em Mossoró. Em 2017, fui professor mediador no curso técnico de TI do IMD/UFRN.',
        en: 'In 2013, I taught five courses (280 class hours) in an Information Systems program in Mossoró. In 2017, I was a course facilitator (<span lang="pt-BR">professor mediador</span>) in IMD/UFRN’s technical IT program.',
      },
    },
  ],
  education: [
    { degree: { pt: 'Doutorado em Educação (em andamento)', en: 'Doctorate in Education (in progress)' }, meta: { pt: 'Pesquisa: inteligência artificial e tecnologias digitais na educação', en: 'Research: artificial intelligence and digital technologies in education' } },
    { degree: { pt: 'Especialização em Compliance e Gestão de Riscos', en: 'Postgraduate specialization in Compliance and Risk Management' }, meta: { pt: 'Faculdade i9 Educação · 2026 · 384 h', en: 'Faculdade i9 Educação · 2026 · 384 h' } },
    { degree: { pt: 'Especialização em Propriedade Intelectual e Inovação', en: 'Postgraduate specialization in Intellectual Property and Innovation' }, meta: { pt: 'Faculdade i9 Educação · 2026 · 384 h', en: 'Faculdade i9 Educação · 2026 · 384 h' } },
    { degree: { pt: 'Mestrado em Ciência da Computação', en: 'M.Sc. in Computer Science' }, meta: { pt: 'PPGCC UERN/UFERSA · 2013', en: 'PPGCC UERN/UFERSA · 2013' } },
    { degree: { pt: 'Bacharelado em Ciência da Computação', en: 'B.Sc. in Computer Science' }, meta: { pt: 'UFERSA · 2010', en: 'UFERSA · 2010' } },
    { degree: { pt: 'Credencial em nível de instrutor nos três cursos do CCNAv7', en: 'Instructor-level credential in the three CCNAv7 courses' }, meta: { pt: 'Cisco Networking Academy · 2020', en: 'Cisco Networking Academy · 2020' } },
    { degree: { pt: 'Bootcamp Full-Stack', en: 'Full-Stack Bootcamp' }, meta: { pt: 'Rocketseat · 2019', en: 'Rocketseat · 2019' } },
  ],
};

// ------------------------------------------------------ documentos públicos ----
// Fontes oficiais e públicas. Links conferidos (HTTP 200) em 09/10/2026.
export const DOCS = {
  intro: {
    pt: 'Cargos, registros e trabalhos acadêmicos com fonte oficial. Os links abrem os documentos originais, nos sites de quem os publicou.',
    en: 'Positions, registrations and academic work, each with an official source. The links open the original documents, in Portuguese, on the websites of the bodies that published them.',
  },
  items: [
    {
      period: { pt: '2020–2024', en: '2020–2024' },
      title: { pt: 'Superintendente de TIC da UFERSA <span class="nowrap">(CD-04)</span>', en: 'Superintendent of ICT at UFERSA <span class="nowrap">(CD-04)</span>' },
      text: {
        pt: 'Nomeado pela Portaria nº 396/2020. Deixei a função a pedido em 31/08/2024 (Portaria nº 1.291/2024) e sigo como Analista de TI.',
        en: 'Appointed by Ordinance No. 396/2020. I stepped down from the position at my own request on 31 Aug 2024 (Ordinance No. 1,291/2024) and remain an IT Analyst.',
      },
      links: [
        { href: 'https://www.in.gov.br/web/dou/-/portarias-de-31-de-agosto-de-2020-275172348', pt: 'Portaria nº 396/2020 no Diário Oficial da União', en: 'Ordinance No. 396/2020 in the Federal Official Gazette' },
        { href: 'https://www.in.gov.br/web/dou/-/portarias-de-30-de-agosto-de-2024-581604056', pt: 'Portaria nº 1.291/2024 no Diário Oficial da União', en: 'Ordinance No. 1,291/2024 in the Federal Official Gazette' },
      ],
    },
    {
      period: { pt: '2023', en: '2023' },
      title: { pt: 'Autoridade máxima de TIC da UFERSA (IN SGD/ME nº 94/2022)', en: 'Highest ICT authority at UFERSA (IN SGD/ME No. 94/2022)' },
      text: {
        pt: 'Designação feita enquanto eu era Superintendente, nos termos da norma federal de contratações de TIC.',
        en: 'Designated while I was Superintendent, under the federal regulation on ICT procurement.',
      },
      links: [
        { href: 'https://documentos.ufersa.edu.br/wp-content/uploads/sites/79/2023/11/Portaria-n%C2%B0-2213-de-9-de-Novembro-de-2023.pdf', pt: 'Portaria UFERSA nº 2.213/2023 (PDF)', en: 'UFERSA Ordinance No. 2,213/2023 (PDF)' },
      ],
    },
    {
      period: { pt: '2021 e 2023', en: '2021 and 2023' },
      title: { pt: 'Comitê de Governança Digital e Comitê de Segurança da Informação', en: 'Digital Governance Committee and Information Security Committee' },
      text: { pt: 'Membro dos dois comitês da universidade.', en: 'Member of both university committees.' },
      links: [
        { href: 'https://documentos.ufersa.edu.br/wp-content/uploads/sites/79/2021/08/Portaria-no-469-de-11-de-Agosto-de-2021.pdf', pt: 'Portaria nº 469/2021 (PDF)', en: 'Ordinance No. 469/2021 (PDF)' },
        { href: 'https://documentos.ufersa.edu.br/wp-content/uploads/sites/79/2023/10/Portaria-n%C2%B0-1895-de-05-de-Outubro-de-2023-1.pdf', pt: 'Portaria nº 1.895/2023 (PDF)', en: 'Ordinance No. 1,895/2023 (PDF)' },
      ],
    },
    {
      period: { pt: '2022', en: '2022' },
      title: { pt: 'Relatório Integrado de Gestão da UFERSA', en: 'UFERSA Integrated Management Report' },
      text: { pt: 'Listado como Superintendente de TIC no quadro de dirigentes.', en: 'Listed as Superintendent of ICT among the university’s officers.' },
      links: [
        { href: 'https://documentos.ufersa.edu.br/wp-content/uploads/sites/79/2023/03/Relatorio-de-Gestao-2022-5.pdf', pt: 'Relatório Integrado de Gestão 2022 da UFERSA (PDF, p. 4)', en: 'UFERSA 2022 Integrated Management Report (PDF, p. 4)' },
      ],
    },
    {
      period: { pt: '2021–2025', en: '2021–2025' },
      title: { pt: 'Plano de Desenvolvimento Institucional (PDI)', en: 'Institutional Development Plan (PDI)' },
      text: {
        pt: 'Registrado como titular da SUTIC e como representante da superintendência na comissão que elaborou o plano.',
        en: 'Listed as head of SUTIC and as its representative on the committee that drafted the plan.',
      },
      links: [
        { href: 'https://documentos.ufersa.edu.br/wp-content/uploads/sites/79/2022/01/PDI-UFERSA-21-25-FINAL-20_01_2022_COM-ANEXOS.pdf', pt: 'PDI UFERSA 2021–2025 (PDF, p. 3–4)', en: 'UFERSA PDI 2021–2025 (PDF, pp. 3–4)' },
      ],
    },
    {
      period: { pt: '2015–2016', en: '2015–2016' },
      title: { pt: 'Implantação dos módulos do SIGAA', en: 'SIGAA modules rollout' },
      text: {
        pt: 'À disposição da Pró-Reitoria de Graduação para implantar na UFERSA os módulos do SIGAA, sistema desenvolvido pela UFRN.',
        en: 'Assigned to the Office of Undergraduate Studies to roll out SIGAA modules at UFERSA (SIGAA is a system developed by UFRN).',
      },
      links: [
        { href: 'https://progepe.ufersa.edu.br/wp-content/uploads/sites/62/2016/04/ORDEM-DE-SERVICO-0007.2015.pdf', pt: 'Ordem de Serviço PROGEPE nº 0007/2015 (PDF)', en: 'PROGEPE Service Order No. 0007/2015 (PDF)' },
        { href: 'https://progepe.ufersa.edu.br/wp-content/uploads/sites/62/2016/04/ORDEM-DE-SERVICO-0009.2015.pdf', pt: 'Ordem de Serviço PROGEPE nº 0009/2015 (PDF)', en: 'PROGEPE Service Order No. 0009/2015 (PDF)' },
      ],
    },
    {
      period: { pt: 'Hoje', en: 'Current' },
      title: { pt: 'Analista de TI na Divisão de Sistemas Computacionais', en: 'IT Analyst in the Computer Systems Division' },
      text: { pt: 'A página da SUTIC lista a equipe da divisão.', en: 'The SUTIC website lists the division’s team.' },
      links: [
        { href: 'https://sutic.ufersa.edu.br/dsc/', pt: 'Equipe da Divisão de Sistemas Computacionais no site da SUTIC', en: 'Computer Systems Division team on the SUTIC website' },
      ],
    },
    {
      period: { pt: '2026', en: '2026' },
      title: { pt: 'Sistema RSC-PCCTAE', en: 'RSC-PCCTAE system' },
      text: {
        pt: 'Sistema institucional em produção, desenvolvido pela SUTIC. Redigi o Manual Operacional e o Manual do Administrador (julho de 2026).',
        en: 'Institutional system in production, developed by SUTIC. I wrote its Operations Manual and Administrator Manual (July 2026).',
      },
      links: [{ href: 'https://rsc.ufersa.edu.br/', pt: 'Portal do RSC-TAE da UFERSA', en: 'UFERSA RSC-TAE portal' }],
    },
    {
      period: { pt: '2025', en: '2025' },
      title: { pt: 'Registro do EduDash no INPI (<span class="nowrap">BR 51 2025 002189-5</span>)', en: 'EduDash registration at INPI (<span class="nowrap">BR 51 2025 002189-5</span>)' },
      text: {
        pt: 'Titular: UFERSA; três criadores. O INPI grafou meu nome como “João Phelippe de Freitas Pinto”.',
        en: 'Rights holder: UFERSA; three creators. INPI spelled my name “João Phelippe de Freitas Pinto”.',
      },
      links: [
        { href: 'https://revistas.inpi.gov.br/pdf/Programa_de_computador2838.pdf', pt: 'Revista da Propriedade Industrial nº 2838 (PDF, p. 37)', en: 'Industrial Property Journal (RPI) No. 2838 (PDF, p. 37)' },
      ],
    },
    {
      period: { pt: '2013', en: '2013' },
      title: { pt: 'Dissertação de mestrado (PPGCC UERN/UFERSA)', en: 'Master’s dissertation (PPGCC UERN/UFERSA)' },
      text: {
        pt: '“Uso de Algoritmo Genético para Escalonamento de Tarefas em Grades Computacionais no Simulador GridSim”, aprovada em 31/01/2013.',
        en: '“<span lang="pt-BR">Uso de Algoritmo Genético para Escalonamento de Tarefas em Grades Computacionais no Simulador GridSim</span>” (using a genetic algorithm to schedule tasks on computational grids in the GridSim simulator), approved on 31 Jan 2013.',
      },
      links: [{ href: 'https://ppgcc.ufersa.edu.br/dissertacoes-defendidas/', pt: 'Dissertações defendidas no PPGCC UERN/UFERSA', en: 'Dissertations defended at PPGCC UERN/UFERSA' }],
    },
    {
      period: { pt: '2022', en: '2022' },
      title: { pt: 'Banca de TCC (UFERSA)', en: 'Undergraduate thesis committee (UFERSA)' },
      text: {
        pt: 'Membro examinador de um TCC sobre modelo de negócio de software para gestão de clínicas e unidades de saúde.',
        en: 'Examining committee member for an undergraduate thesis on a business model for clinic and healthcare-facility management software.',
      },
      links: [{ href: 'https://repositorio.ufersa.edu.br/handle/prefix/8748', pt: 'Registro da banca no Repositório Institucional da UFERSA', en: 'Committee record in the UFERSA Institutional Repository' }],
    },
  ],
};

// ------------------------------------------------------------- publicações ----
// Conferidas na API da Crossref em 09/10/2026 (posição de autoria incluída).
export const PUBS = [
  {
    year: '2026',
    title: 'Da dataficação à inteligência artificial generativa: tensões epistemológicas e a plataformização do ensino superior',
    titleLang: 'pt-BR',
    meta: {
      pt: 'Capítulo em <cite>Educação em Debate</cite>, v. 5, Even3, p. 915–930 · 1º autor',
      en: 'Book chapter in <cite lang="pt-BR">Educação em Debate</cite>, vol. 5, Even3, pp. 915–930 · first author',
    },
    doi: '10.29327/5881601.1-57',
  },
  {
    year: '2015',
    title: 'Providing an Extension of the SCORM Standard to Support the Educational Contents Project for t-Learning',
    titleLang: 'en',
    meta: {
      pt: 'Artigo em <cite>Creative Education</cite>, v. 6, n. 11, p. 1201–1223 · coautor',
      en: 'Journal article, <cite>Creative Education</cite>, vol. 6, no. 11, pp. 1201–1223 · co-author',
    },
    doi: '10.4236/ce.2015.611118',
  },
  {
    year: '2014',
    title: 'T-SCORM',
    titleLang: 'en',
    meta: {
      pt: 'Capítulo (p. 94–119) do livro <cite>Technology Platform Innovations and Forthcoming Trends in Ubiquitous Learning</cite>, IGI Global (EUA) · coautor',
      en: 'Book chapter (pp. 94–119) in <cite>Technology Platform Innovations and Forthcoming Trends in Ubiquitous Learning</cite>, IGI Global (USA) · co-author',
    },
    doi: '10.4018/978-1-4666-4542-4.ch006',
  },
  {
    year: '2012',
    title: 'Um aplicativo social para localização de doadores e receptores de sangue utilizando a plataforma OpenSocial',
    titleLang: 'pt-BR',
    meta: {
      pt: 'Artigo na <cite>Revista Brasileira de Computação Aplicada</cite>, v. 4, n. 1 · coautor',
      en: 'Journal article, <cite lang="pt-BR">Revista Brasileira de Computação Aplicada</cite>, vol. 4, no. 1 · co-author',
    },
    doi: '10.5335/rbca.2012.1814',
  },
];

// --------------------------------------------------------------------- FAQ ----
// HTML comum, sem marcação FAQPage (o Google não mostra mais esse resultado).
export const FAQ = [
  {
    q: { pt: 'Você atende empresas fora de Mossoró?', en: 'Do you work with companies outside Mossoró?' },
    a: { pt: 'Sim. Moro em Mossoró (RN) e trabalho de forma remota.', en: 'Yes. I live in Mossoró, Brazil, and work remotely.' },
  },
  {
    q: { pt: 'Você desenvolve sistemas para clínicas e laboratórios?', en: 'Do you build systems for clinics and labs?' },
    a: {
      pt: 'Sim. Criei o <a href="#maintenance">Maintenance</a>, que gerencia a manutenção de equipamentos hospitalares, clínicos e de diagnóstico por imagem, e o <a href="#prontvet">ProntVet</a>, prontuário veterinário com exames estruturados e faixas de referência. Também modernizei uma plataforma de telemedicina, à qual acrescentei a assinatura digital ICP-Brasil de receitas e atestados.',
      en: 'Yes. I created <a href="#maintenance">Maintenance</a>, which manages the maintenance of hospital, clinical and diagnostic imaging equipment, and <a href="#prontvet">ProntVet</a>, a veterinary health record with structured lab results and reference ranges. I also modernized a telehealth platform, adding ICP-Brasil digital signatures for prescriptions and medical certificates.',
    },
  },
  {
    q: { pt: 'Posso ver os sistemas funcionando?', en: 'Can I see the systems running?' },
    a: {
      pt: 'Não há demonstrações públicas: os sistemas de clientes estão sob NDA. O <a href="#quanto-sobra">Quanto Sobra</a> está publicado no Google Play.',
      en: 'There are no public demos: client systems are under NDA. <a href="#quanto-sobra">Quanto Sobra</a> is published on Google Play.',
    },
  },
  {
    q: { pt: 'Como começamos um projeto?', en: 'How do we start a project?' },
    a: {
      pt: 'Me chame no WhatsApp ou mande um e-mail contando o problema que você quer resolver.',
      en: 'Message me on WhatsApp or send an email describing the problem you want to solve.',
    },
  },
];

// ----------------------------------------------------------------- contato ----
export const CONTACT = {
  note: {
    pt: 'Estou disponível para novos projetos e consultoria. Me chame no WhatsApp ou mande um e-mail; costumo responder no mesmo dia.',
    en: 'I’m available for new projects and consulting. Message me on WhatsApp or send an email; I usually reply the same day.',
  },
  whatsapp: { pt: 'Chamar no WhatsApp', en: 'Message me on WhatsApp' },
  // número visível no cartão de contato (o JSON-LD declara o mesmo telefone)
  phone: { label: { pt: 'WhatsApp', en: 'WhatsApp' }, display: '+55 84 98801-2224' },
  qr: { pt: '/assets/contact-qr-pt.svg', en: '/assets/contact-qr-en.svg' },
  qrAlt: { pt: 'QR code com os dados de contato de João Phellipe', en: 'QR code with João Phellipe’s contact details' },
  qrCaption: { pt: '// escaneie para salvar meu contato', en: '// scan to save my contact info' },
  vcf: { pt: '/contact-pt.vcf', en: '/contact-en.vcf' },
  saveContact: { pt: 'Salvar contato', en: 'Save contact' },
  // rótulos dos perfis (só aparecem os que têm URL em PROFILES)
  profiles: {
    github: { label: 'GitHub', value: { pt: '@phellipe', en: '@phellipe' } },
    lattes: { label: 'Lattes', value: { pt: 'Currículo acadêmico', en: 'Academic CV (in Portuguese)' } },
    linkedin: { label: 'LinkedIn', value: { pt: 'Perfil profissional', en: 'Professional profile' } },
    instagram: { label: 'Instagram', value: { pt: 'Perfil', en: 'Profile' } },
    youtube: { label: 'YouTube', value: { pt: 'Canal', en: 'Channel' } },
    orcid: { label: 'ORCID', value: { pt: 'Registro de pesquisador', en: 'Researcher ID' } },
  },
  location: { pt: 'Mossoró (RN) · Brasil · trabalho remoto', en: 'Mossoró, Brazil · remote work' },
};

export const FOOTER = {
  craft: { pt: 'Feito com HTML, CSS e JavaScript puros, sem frameworks.', en: 'Built with plain HTML, CSS and JavaScript, no frameworks.' },
  top: { pt: 'Voltar ao topo ↑', en: 'Back to top ↑' },
  video: { pt: 'Vídeo de apresentação', en: 'Introduction video' },
};

// ---------------------------------------------------------------------- 404 ----
export const NOT_FOUND = {
  title: 'Página não encontrada — João Phellipe',
  description: 'A página que você procurou não existe. Veja o portfólio de João Phellipe, engenheiro de software sênior em Mossoró (RN).',
  h1: 'Página não encontrada',
  text: 'A página que você procurou não existe ou mudou de endereço.',
  textEn: 'Page not found: the page you are looking for doesn’t exist or has moved.',
  home: 'Ir para o portfólio em português',
  homeEn: 'Go to the English version',
  video: 'Assistir ao vídeo de apresentação',
};
