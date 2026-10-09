#!/usr/bin/env node
// =============================================================================
// phellipe.eti.br — gerador das páginas estáticas
//
//   node tools/build.mjs
//
// Lê src/content.mjs (texto PT/EN, dados estruturados, placeholders do vídeo),
// styles.css (CSS, embutido em cada página) e assets/video/*.vtt (a transcrição
// do vídeo é gerada a partir das legendas) e escreve:
//   index.html (pt-BR) · en/index.html (en) · video/index.html (pt-BR) ·
//   en/video/index.html (en) · 404.html · sitemap.xml · site.webmanifest ·
//   <chave-indexnow>.txt
// Sem dependências: só Node.js 18+. O site publicado continua 100% estático.
// =============================================================================
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as C from '../src/content.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const ORIGIN = C.SITE.origin;
const LANGS = ['pt', 'en'];
const HTML_LANG = { pt: 'pt-BR', en: 'en' };
const PAGE_PATH = { pt: '/', en: '/en/' };
// páginas de exibição do vídeo (watch pages): o vídeo é o conteúdo principal
const VIDEO_PATH = { pt: '/video/', en: '/en/video/' };
const warnings = [];

// hreflang das duas páginas: a MESMA lista vai para o <head> e para o sitemap.
// Para usar o português como padrão, troque X_DEFAULT para 'pt' (um só lugar).
const X_DEFAULT = 'en';
const ALTERNATES = [['pt-BR', 'pt'], ['pt', 'pt'], ['en', 'en'], ['x-default', X_DEFAULT]];

// ----------------------------------------------------------------- helpers ----
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const pageUrl = (lang) => ORIGIN + PAGE_PATH[lang];
const videoPageUrl = (lang) => ORIGIN + VIDEO_PATH[lang];
const abs = (path) => (path.startsWith('http') ? path : ORIGIN + path);

/** Espaço inseparável entre abreviação e número ("nº 94/2022", "p. 915–930", "No. 396"). */
const typo = (html) => String(html).replace(/(^|[\s(>])(nº|No\.|no\.|n\.|v\.|vol\.|pp?\.)[ ](?=\d)/g, '$1$2&nbsp;');

/** Escolhe a língua de um valor { pt, en } (ou devolve a string comum). Falha se faltar tradução. */
function L(value, lang, where = '') {
  if (value == null) throw new Error(`Conteúdo ausente em ${where || '(?)'}`);
  if (typeof value === 'string' || Array.isArray(value)) return value;
  if (typeof value === 'object' && ('pt' in value || 'en' in value)) {
    for (const l of LANGS) {
      if (value[l] == null || value[l] === '') throw new Error(`Falta a versão "${l}" em ${where || JSON.stringify(value).slice(0, 80)}`);
    }
    return value[lang];
  }
  throw new Error(`Valor inesperado em ${where}: ${JSON.stringify(value).slice(0, 80)}`);
}

const stripTags = (html) =>
  String(html)
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();

/** As n primeiras frases de um texto (HTML removido). */
const firstSentences = (text, n = 1) => {
  const plain = stripTags(text);
  const m = plain.match(new RegExp(`^(?:.*?[.!?](?=\\s|$)\\s*){1,${n}}`));
  return m ? m[0].trim() : plain;
};

function minifyCss(css) {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s+/g, ' ')
    .replace(/\s*([{};:,>])\s*/g, '$1')
    .replace(/;}/g, '}')
    .trim();
}

// Seta "abre em nova aba" desenhada em SVG (nenhuma das fontes do site tem o
// glifo ↗), com a cor do texto em volta (respeita alto contraste do sistema).
const EXT_ICON = '<svg class="ext" aria-hidden="true" focusable="false" viewBox="0 0 24 24" width="12" height="12"><path d="M7 17 17 7M7 7h10v10"/></svg>';

/**
 * Fim de um link externo: a última palavra, o aviso para leitor de tela e a
 * seta ficam juntos numa caixa que não quebra (o Chrome quebra linha entre um
 * espaço inseparável e um SVG), para a seta nunca ficar sozinha no começo de
 * uma linha. Numa "palavra" longa (DOI), só o último trecho fica preso à seta.
 */
function extTail(label, lang) {
  // typo() antes: "p.&nbsp;4)" vira uma "palavra" só e não separa número e abreviação
  const m = typo(label).match(/^([\s\S]*?)(\S+)$/);
  let head = m ? m[1] : '';
  let last = m ? m[2] : String(label);
  if (last.length > 18) {
    const cut = Math.max(last.lastIndexOf('-'), last.lastIndexOf('/')) + 1;
    if (cut > 0 && cut < last.length) { head += last.slice(0, cut); last = last.slice(cut); }
  }
  return `${head}<span class="ext-tail">${last}<span class="visually-hidden"> ${L(C.UI.external, lang)}</span>&nbsp;${EXT_ICON}</span>`;
}

/** Link externo: nova aba, aviso para leitor de tela e (no EN) "(in Portuguese)" quando o destino é em português. */
function extLink(href, text, lang, { hreflang, cls } = {}) {
  let label = text;
  if (lang === 'en' && hreflang === 'pt-BR' && !/portuguese/i.test(label)) {
    label = /\((PDF[^)]*)\)$/.test(label) ? label.replace(/\)$/, ', in Portuguese)') : `${label} (in Portuguese)`;
  }
  return `<a href="${esc(href)}" target="_blank" rel="noopener noreferrer"${hreflang ? ` hreflang="${hreflang}"` : ''}${cls ? ` class="${cls}"` : ''}>${extTail(label, lang)}</a>`;
}

// ------------------------------------------------------- vídeo / legendas ----
const toSec = (t) => {
  const p = t.split(':').map(Number);
  return p.length === 3 ? p[0] * 3600 + p[1] * 60 + p[2] : p[0] * 60 + p[1];
};

// Pausa (em s) entre duas legendas a partir da qual a transcrição abre um novo
// parágrafo. Na narração do vídeo, ~1,5 s ou mais separa os blocos (setores, créditos).
const PARAGRAPH_GAP = 1.5;

/** Lê um WebVTT e devolve parágrafos de texto (quebra quando há pausa >= PARAGRAPH_GAP entre falas). */
function transcriptFromVtt(lang) {
  const rel = C.VIDEO.files[lang].vtt;
  const file = join(ROOT, rel);
  if (!existsSync(file)) {
    warnings.push(`Legenda ausente: ${rel} (a transcrição ficará vazia).`);
    return { paragraphs: [], provisional: true };
  }
  const raw = readFileSync(file, 'utf8').replace(/^﻿/, '').replace(/\r/g, '');
  const provisional = /^NOTE\s+PROVIS/im.test(raw);
  const cues = [];
  for (const block of raw.split(/\n{2,}/)) {
    const lines = block.split('\n');
    const i = lines.findIndex((l) => l.includes('-->'));
    if (i < 0) continue; // cabeçalho, NOTE, STYLE, REGION
    const [s, e] = lines[i].split('-->').map((x) => toSec(x.trim().split(/\s+/)[0]));
    const body = lines.slice(i + 1).join(' ');
    // <v João Phellipe> marca a fala do próprio João; as demais vozes são narração
    const voice = (body.match(/<v(?:\.[^\s>]*)?\s+([^>]+)>/) || [])[1] || '';
    const joao = /jo[aã]o/i.test(voice);
    // apóstrofo tipográfico (’), como no resto do site
    const text = stripTags(body).replace(/(\S)'/g, '$1’');
    if (text) cues.push({ s, e, text, joao });
  }
  const paragraphs = [];
  let current = [];
  let prev = null;
  const flush = () => {
    if (current.length) paragraphs.push((prev && prev.joao ? 'João: ' : '') + current.join(' '));
    current = [];
  };
  for (const cue of cues) {
    if (prev && cue.text === prev.text) { prev = cue; continue; } // legenda "rolante" repetida
    if (prev && (cue.s - prev.e >= PARAGRAPH_GAP || cue.joao !== prev.joao)) flush();
    current.push(cue.text);
    prev = cue;
  }
  flush();
  if (provisional) warnings.push(`${rel} é PROVISÓRIO (gerado da narração antes do render). Troque pelo VTT do render final e rode o build de novo.`);
  return { paragraphs, provisional };
}

const PLACEHOLDER = /\{\{[A-Z_]+\}\}/;
function videoPlaceholdersPending() {
  return [C.VIDEO.duration, C.VIDEO.uploadDate].some((v) => PLACEHOLDER.test(String(v)));
}

/**
 * O vídeo daquela língua está pronto para ser anunciado? (datas preenchidas E
 * o MP4 existe em disco). Enquanto não estiver, a página não publica o
 * VideoObject nem o link de download, para nada sair inválido ou dar 404.
 */
const videoReady = (lang) => !videoPlaceholdersPending() && existsSync(join(ROOT, C.VIDEO.files[lang].mp4));

const videoDuration = (lang) => (lang === 'en' && C.VIDEO.durationEn ? C.VIDEO.durationEn : C.VIDEO.duration);

/** Duração ISO 8601 ("PT1M39S") em segundos inteiros; null se ainda for placeholder ou inválida. */
function isoSeconds(iso) {
  const m = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+(?:\.\d+)?)S)?$/.exec(String(iso));
  if (!m || PLACEHOLDER.test(String(iso)) || !(m[1] || m[2] || m[3])) return null;
  return Math.round(Number(m[1] || 0) * 3600 + Number(m[2] || 0) * 60 + Number(m[3] || 0));
}

/** 99 -> "1:39" */
const clock = (t) => `${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')}`;

/** "PT1M39S" -> "1 min 39 s" (pt) / "1 min 39 sec" (en); null se ainda for placeholder ou inválido. */
function durationLabel(lang) {
  const m = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+(?:\.\d+)?)S)?$/.exec(String(videoDuration(lang)));
  if (!m || PLACEHOLDER.test(String(videoDuration(lang)))) return null;
  const [, h, min, s] = m;
  const parts = [];
  if (h) parts.push(`${Number(h)} h`);
  if (min) parts.push(`${Number(min)} min`);
  if (s) parts.push(`${Math.round(Number(s))} ${lang === 'en' ? 'sec' : 's'}`);
  return parts.length ? parts.join(' ') : null;
}

// -------------------------------------------------------------- JSON-LD -------
function person(lang) {
  const sameAs = Object.values(C.PROFILES).filter(Boolean);
  return {
    '@type': 'Person',
    '@id': `${ORIGIN}/#joao`,
    name: C.SITE.name,
    alternateName: [
      C.SITE.fullName,
      'Joao Phellipe',
      'Joao Phellipe de Freitas Pinto',
      'João Phellipe de Freitas',
      'João Phellipe Freitas Pinto',
      'João Phelippe de Freitas Pinto',
    ],
    givenName: C.SITE.givenName,
    familyName: C.SITE.familyName,
    jobTitle: L(C.META.jobTitle, lang),
    description: L(C.META.personDescription, lang),
    url: `${ORIGIN}/`,
    image: {
      '@type': 'ImageObject',
      '@id': `${ORIGIN}/#foto`,
      url: abs(C.SITE.photo.jpg),
      contentUrl: abs(C.SITE.photo.jpg),
      width: C.SITE.photo.width,
      height: C.SITE.photo.height,
      caption: C.SITE.fullName,
    },
    email: `mailto:${C.SITE.email}`,
    telephone: C.SITE.phone,
    address: { '@type': 'PostalAddress', addressLocality: 'Mossoró', addressRegion: 'RN', addressCountry: 'BR' },
    homeLocation: { '@type': 'City', name: 'Mossoró', sameAs: 'https://www.wikidata.org/wiki/Q694845' },
    worksFor: {
      '@type': 'CollegeOrUniversity',
      name: 'Universidade Federal Rural do Semi-Árido',
      alternateName: 'UFERSA',
      url: 'https://ufersa.edu.br/',
      sameAs: 'https://www.wikidata.org/wiki/Q7894369',
    },
    alumniOf: {
      '@type': 'CollegeOrUniversity',
      name: 'Universidade Federal Rural do Semi-Árido',
      alternateName: 'UFERSA',
      sameAs: 'https://www.wikidata.org/wiki/Q7894369',
    },
    hasCredential: C.META.credentials.map((c) => ({
      '@type': 'EducationalOccupationalCredential',
      credentialCategory: 'degree',
      name: L(c, lang),
      ...(c.url ? { url: c.url } : {}),
    })),
    knowsAbout: L(C.META.knowsAbout, lang),
    knowsLanguage: ['pt-BR', 'en'],
    sameAs,
  };
}

function itemList(lang) {
  const url = pageUrl(lang);
  const items = [];
  for (const group of C.WORK.groups) {
    for (const w of group.items) {
      const node = {
        '@type': 'CreativeWork',
        '@id': `${url}#${w.id}`,
        name: stripTags(L(w.title, lang)),
        description: firstSentences(L(w.text, lang), w.ld.sentences || 1),
        url: `${url}#${w.id}`,
      };
      if (w.ld.url) node.url = w.ld.url;
      if (w.ld.sameAs) node.sameAs = w.ld.sameAs;
      node[w.ld.role === 'creator' ? 'creator' : 'contributor'] = { '@id': `${ORIGIN}/#joao` };
      if (w.ld.copyrightHolder === 'UFERSA') {
        node.copyrightHolder = { '@type': 'CollegeOrUniversity', name: 'Universidade Federal Rural do Semi-Árido', alternateName: 'UFERSA' };
      }
      items.push({ '@type': 'ListItem', position: items.length + 1, item: node });
    }
  }
  return {
    '@type': 'ItemList',
    '@id': `${url}#trabalhos`,
    name: L(C.WORK.listName, lang),
    itemListOrder: 'https://schema.org/ItemListUnordered',
    numberOfItems: items.length,
    itemListElement: items,
  };
}

const chaptersOf = (lang) => L(C.VIDEO_PAGE.chapters, lang, 'VIDEO_PAGE.chapters');

/**
 * Um Clip por capítulo: começa no tempo do capítulo e termina onde o próximo
 * começa; o último termina na duração do vídeo. Se os tempos não forem
 * consistentes com a duração (render mudou), não publica os Clips e avisa.
 */
function clipsOf(lang, total) {
  const ch = chaptersOf(lang);
  const ok = ch.every((c, i) => Number.isInteger(c.t) && c.t >= 0 && (i === 0 || c.t > ch[i - 1].t)) && ch[ch.length - 1].t < total;
  if (!ok) {
    warnings.push(`${VIDEO_PATH[lang]}: os capítulos (VIDEO_PAGE.chapters) não cabem na duração de ${total} s; o VideoObject sai sem hasPart/Clip. Ajuste os tempos.`);
    return null;
  }
  return ch.map((c, i) => ({
    '@type': 'Clip',
    name: c.name,
    startOffset: c.t,
    endOffset: i + 1 < ch.length ? ch[i + 1].t : total,
    url: `${videoPageUrl(lang)}?t=${c.t}`,
  }));
}

function videoObject(lang, transcript) {
  const f = C.VIDEO.files[lang];
  const url = videoPageUrl(lang);
  const clips = clipsOf(lang, isoSeconds(videoDuration(lang)));
  return {
    '@type': 'VideoObject',
    '@id': `${url}#video`,
    name: L(C.VIDEO.name, lang),
    description: L(C.VIDEO.description, lang),
    thumbnailUrl: [abs(f.poster)],
    uploadDate: C.VIDEO.uploadDate,
    duration: videoDuration(lang),
    contentUrl: abs(f.mp4),
    encodingFormat: 'video/mp4',
    inLanguage: HTML_LANG[lang],
    isFamilyFriendly: true,
    author: { '@id': `${ORIGIN}/#joao` },
    about: { '@id': `${ORIGIN}/#joao` },
    caption: { '@type': 'MediaObject', contentUrl: abs(f.vtt), encodingFormat: 'text/vtt', inLanguage: HTML_LANG[lang] },
    ...(transcript.paragraphs.length ? { transcript: transcript.paragraphs.join('\n\n') } : {}),
    ...(clips ? { hasPart: clips } : {}),
  };
}

/** JSON-LD da página do vídeo: tudo que é referenciado por @id está no próprio grafo. */
function videoJsonLd(lang, transcript) {
  const t = (v, w) => L(v, lang, w);
  const url = videoPageUrl(lang);
  const f = C.VIDEO.files[lang];
  const joao = { '@id': `${ORIGIN}/#joao` };
  const poster = {
    '@type': 'ImageObject',
    '@id': `${url}#poster`,
    url: abs(f.poster),
    contentUrl: abs(f.poster),
    width: 1280,
    height: 720,
  };
  const ready = videoReady(lang);
  const webpage = {
    '@type': 'WebPage',
    '@id': `${url}#webpage`,
    url,
    name: t(C.VIDEO_PAGE.title),
    description: t(C.VIDEO_PAGE.description),
    inLanguage: HTML_LANG[lang],
    isPartOf: { '@id': `${ORIGIN}/#website` },
    primaryImageOfPage: poster,
    breadcrumb: { '@id': `${url}#breadcrumb` },
    ...(ready ? { mainEntity: { '@id': `${url}#video` } } : {}),
  };
  const graph = [
    { '@type': 'WebSite', '@id': `${ORIGIN}/#website`, url: `${ORIGIN}/`, name: C.SITE.name, publisher: joao },
    webpage,
    {
      '@type': 'BreadcrumbList',
      '@id': `${url}#breadcrumb`,
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: t(C.VIDEO_PAGE.breadcrumbHome), item: pageUrl(lang) },
        { '@type': 'ListItem', position: 2, name: t(C.VIDEO_PAGE.breadcrumbVideo), item: url },
      ],
    },
    { '@type': 'Person', '@id': `${ORIGIN}/#joao`, name: C.SITE.name, url: `${ORIGIN}/` },
    ...(ready ? [videoObject(lang, transcript)] : []),
  ];
  const json = JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(/<\//g, '<\\/');
  const note = ready ? '' : '  <!-- VideoObject: ainda não publicado. Depois do render, copie o MP4 para assets/video/, preencha VIDEO (duração e data) em src/content.mjs e rode: node tools/build.mjs -->\n';
  if (!ready) warnings.push(`${VIDEO_PATH[lang]}: sem VideoObject, sem og:video e sem entrada de vídeo no sitemap (falta o MP4 ou VIDEO.duration/uploadDate ainda são placeholders).`);
  return `${note}  <script type="application/ld+json">${json}</script>`;
}

function jsonLd(lang) {
  const url = pageUrl(lang);
  const website = {
    '@type': 'WebSite',
    '@id': `${ORIGIN}/#website`,
    url: `${ORIGIN}/`,
    name: C.SITE.name,
    alternateName: ['phellipe.eti.br', C.SITE.fullName],
    inLanguage: ['pt-BR', 'en'],
    publisher: { '@id': `${ORIGIN}/#joao` },
  };
  const profile = {
    '@type': 'ProfilePage',
    '@id': `${url}#perfil`,
    url,
    name: L(C.META.title, lang),
    inLanguage: HTML_LANG[lang],
    isPartOf: lang === 'pt' ? { '@id': `${ORIGIN}/#website` } : { '@type': 'WebSite', '@id': `${ORIGIN}/#website`, url: `${ORIGIN}/`, name: C.SITE.name },
    dateCreated: C.SITE.created[lang],
    dateModified: C.SITE.updated,
    mainEntity: { '@id': `${ORIGIN}/#joao` },
    primaryImageOfPage: { '@id': `${ORIGIN}/#foto` },
  };
  // O VideoObject mora nas páginas do vídeo (/video/, /en/video/), não nas homes.
  const graph = [...(lang === 'pt' ? [website] : []), profile, person(lang), itemList(lang)];
  const json = JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(/<\//g, '<\\/');
  const notes = [];
  const missing = ['linkedin', 'instagram', 'youtube'].filter((k) => !C.PROFILES[k]);
  if (missing.length) notes.push(`<!-- sameAs: ${missing.join(', ')} ainda não existem. Quando existirem, preencha PROFILES em src/content.mjs e rode: node tools/build.mjs -->`);
  return `${notes.map((n) => `  ${n}\n`).join('')}  <script type="application/ld+json">${json}</script>`;
}

// ------------------------------------------------------------------ <head> ----
const CSS = minifyCss(readFileSync(join(ROOT, 'styles.css'), 'utf8'));
// Retrato (LCP no celular): o mesmo srcset/sizes no <picture> e no preload do <head>.
const PORTRAIT_SIZES = '(max-width: 880px) 218px, 318px';
const PORTRAIT_SRCSET = (ext) => [320, 480, 640].map((w) => `/assets/joao-phellipe-${w}.${ext} ${w}w`).join(', ');

function head(lang) {
  const t = (v, w) => L(v, lang, w);
  const url = pageUrl(lang);
  const other = lang === 'pt' ? 'en' : 'pt';
  const title = t(C.META.title);
  const desc = t(C.META.description);
  const img = abs(t(C.META.ogImage));
  const imgAlt = t(C.META.ogImageAlt);
  return `<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <script>(function(d){d.classList.add('js');if(location.hash.length>1)d.classList.add('cv-off')})(document.documentElement)</script>
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(desc)}">
  <link rel="canonical" href="${url}">
${ALTERNATES.map(([hl, l]) => `  <link rel="alternate" hreflang="${hl}" href="${pageUrl(l)}">`).join('\n')}
  <meta name="robots" content="max-image-preview:large">
  <meta name="author" content="${esc(C.SITE.fullName)}">
  <meta name="theme-color" content="#0A0B0E">
  <meta name="color-scheme" content="dark">

  <meta property="og:type" content="profile">
  <meta property="og:url" content="${url}">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(desc)}">
  <meta property="og:image" content="${img}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:type" content="image/jpeg">
  <meta property="og:image:alt" content="${esc(imgAlt)}">
  <meta property="og:locale" content="${C.META.ogLocale[lang]}">
  <meta property="og:locale:alternate" content="${C.META.ogLocale[other]}">
  <meta property="og:site_name" content="${esc(C.SITE.name)}">
  <meta property="profile:first_name" content="${esc(C.SITE.givenName)}">
  <meta property="profile:last_name" content="${esc(C.SITE.familyName)}">

  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(title)}">
  <meta name="twitter:description" content="${esc(desc)}">
  <meta name="twitter:image" content="${img}">
  <meta name="twitter:image:alt" content="${esc(imgAlt)}">

  <link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
  <link rel="icon" href="/assets/favicon-32.png" sizes="32x32" type="image/png">
  <link rel="apple-touch-icon" href="/assets/apple-touch-icon.png">
  <link rel="manifest" href="/site.webmanifest">

  <link rel="preload" as="image" type="image/avif" fetchpriority="high" imagesrcset="${PORTRAIT_SRCSET('avif')}" imagesizes="${PORTRAIT_SIZES}">
  <link rel="preload" href="/assets/fonts/bricolage-grotesque-latin-800-normal.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="/assets/fonts/bricolage-grotesque-latin-600-normal.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="/assets/fonts/hanken-grotesk-latin-400-normal.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="/assets/fonts/jetbrains-mono-latin-400-normal.woff2" as="font" type="font/woff2" crossorigin>

  <style>${CSS}</style>
</head>`;
}

/** <head> da página do vídeo: mesmo padrão da home, com title/description/OG próprios. */
function videoHead(lang) {
  const t = (v, w) => L(v, lang, w);
  const url = videoPageUrl(lang);
  const other = lang === 'pt' ? 'en' : 'pt';
  const title = t(C.VIDEO_PAGE.title);
  const desc = t(C.VIDEO_PAGE.description);
  const f = C.VIDEO.files[lang];
  const poster = abs(f.poster);
  const posterAlt = t(C.VIDEO_PAGE.posterAlt);
  const ready = videoReady(lang);
  return `<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <script>(function(d){d.classList.add('js');if(location.hash.length>1)d.classList.add('cv-off')})(document.documentElement)</script>
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(desc)}">
  <link rel="canonical" href="${url}">
${ALTERNATES.map(([hl, l]) => `  <link rel="alternate" hreflang="${hl}" href="${videoPageUrl(l)}">`).join('\n')}
  <meta name="robots" content="max-image-preview:large">
  <meta name="author" content="${esc(C.SITE.fullName)}">
  <meta name="theme-color" content="#0A0B0E">
  <meta name="color-scheme" content="dark">

  <meta property="og:type" content="video.other">
  <meta property="og:url" content="${url}">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(desc)}">
  <meta property="og:image" content="${poster}">
  <meta property="og:image:width" content="1280">
  <meta property="og:image:height" content="720">
  <meta property="og:image:type" content="image/jpeg">
  <meta property="og:image:alt" content="${esc(posterAlt)}">${ready ? `
  <meta property="og:video" content="${abs(f.mp4)}">
  <meta property="og:video:type" content="video/mp4">
  <meta property="og:video:width" content="1280">
  <meta property="og:video:height" content="720">` : ''}
  <meta property="og:locale" content="${C.META.ogLocale[lang]}">
  <meta property="og:locale:alternate" content="${C.META.ogLocale[other]}">
  <meta property="og:site_name" content="${esc(C.SITE.name)}">

  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(title)}">
  <meta name="twitter:description" content="${esc(desc)}">
  <meta name="twitter:image" content="${poster}">
  <meta name="twitter:image:alt" content="${esc(posterAlt)}">

  <link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
  <link rel="icon" href="/assets/favicon-32.png" sizes="32x32" type="image/png">
  <link rel="apple-touch-icon" href="/assets/apple-touch-icon.png">
  <link rel="manifest" href="/site.webmanifest">

  <link rel="preload" as="image" href="${f.poster}" fetchpriority="high">
  <link rel="preload" href="/assets/fonts/bricolage-grotesque-latin-600-normal.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="/assets/fonts/hanken-grotesk-latin-400-normal.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="/assets/fonts/jetbrains-mono-latin-400-normal.woff2" as="font" type="font/woff2" crossorigin>

  <style>${CSS}</style>
</head>`;
}

// ------------------------------------------------------------------ blocos ----
function sectionHead(lang, s, { note, noteId } = {}) {
  return `<header class="section-head" data-reveal>
        <p class="kicker mono"><span class="kicker-num">${s.num}</span><span>${L(s.kicker, lang)}</span></p>
        <h2 class="section-title" id="${s.id}-title">${L(s.title, lang)}</h2>${note ? `\n        <p class="section-note"${noteId ? ` id="${noteId}"` : ''}>${note}</p>` : ''}
      </header>`;
}

/** Link para a OUTRA língua: na home leva à home dela; na página do vídeo, à página do vídeo dela. */
function langSwitch(lang, mode) {
  const sw = C.UI.langSwitch[lang];
  return mode === 'video' ? { ...sw, href: VIDEO_PATH[lang === 'pt' ? 'en' : 'pt'] } : sw;
}

function siteHeader(lang, mode = 'home') {
  const sw = langSwitch(lang, mode);
  // na página do vídeo, a marca e o menu levam à home da mesma língua
  const base = mode === 'video' ? PAGE_PATH[lang] : '';
  const links = C.UI.nav.map((n) => `          <li><a href="${base}${n.href}">${L(n, lang, 'nav')}</a></li>`).join('\n');
  return `  <a class="skip-link" href="#conteudo">${L(C.UI.skip, lang)}</a>

  <header class="site-header" id="site-header">
    <nav class="nav" aria-label="${L(C.UI.navLabel, lang)}">
      <a class="brand" href="${mode === 'video' ? PAGE_PATH[lang] : '#topo'}">phellipe<span class="brand-accent">.eti.br</span></a>

      <button class="nav-toggle" type="button" data-menu-toggle aria-label="${L(C.UI.menuOpen, lang)}" aria-expanded="false" aria-controls="nav-menu">
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </button>

      <div class="nav-menu" id="nav-menu">
        <ul class="nav-links">
${links}
        </ul>
      </div>

      <!-- fora do menu: no celular a troca de idioma fica visível ao lado do botão -->
      <a class="lang-toggle" href="${sw.href}" hreflang="${sw.hreflang}" lang="${sw.lang}" aria-label="${sw.aria}">${sw.label}</a>
    </nav>
  </header>`;
}

function hero(lang) {
  const H = C.HERO;
  const t = (v, w) => L(v, lang, w);
  const sizes = PORTRAIT_SIZES;
  const set = PORTRAIT_SRCSET;
  const stats = H.stats
    .map((s) => `
        <li>
          <span class="stat-num">${t(s.num, 'stats.num')}${s.plus ? '<span class="stat-plus">+</span>' : ''}</span>
          <span class="stat-label mono">${t(s, 'stats')}</span>
        </li>`)
    .join('');
  const words = t(H.typed);
  // A palavra digitada muda sozinha: fica oculta para leitores de tela, que
  // recebem (como os buscadores) a lista completa num texto visualmente oculto.
  return `
    <!-- ============ HERO ============ -->
    <section class="hero" id="topo" aria-labelledby="hero-title">
      <div class="hero-grid">
        <div class="hero-main">
          <h1 class="hero-title" id="hero-title">
            <span class="hero-name">${C.SITE.name}</span>
            <span class="hero-role"><span class="visually-hidden">— </span>${t(H.role)}</span>
          </h1>
          <p class="hero-statement">${t(H.statement)}</p>
          <p class="hero-focus mono">
            <span class="prompt" aria-hidden="true">~$</span>
            <span>${t(H.focus)}</span><span class="visually-hidden">: ${words.join(', ')}.</span>
            <span class="typed" aria-hidden="true" data-typed data-typed-words="${esc(words.join('|'))}">${words[0]}</span><span class="caret" aria-hidden="true"></span>
          </p>
          <p class="hero-sub">${t(H.sub)}</p>
          <div class="hero-cta">
            <a class="btn btn-primary" href="#trabalhos">${t(H.ctaWork)}</a>
            <a class="btn btn-ghost" href="#contato">${t(H.ctaContact)}</a>
          </div>
        </div>

        <div class="hero-aside">
          <figure class="portrait">
            <picture>
              <source type="image/avif" srcset="${set('avif')}" sizes="${sizes}">
              <source type="image/webp" srcset="${set('webp')}" sizes="${sizes}">
              <img src="${C.SITE.photo.jpg}" width="${C.SITE.photo.width}" height="${C.SITE.photo.height}" fetchpriority="high" alt="${esc(t(H.portraitAlt))}">
            </picture>
            <figcaption class="portrait-tag mono">
              <span class="status-dot" aria-hidden="true"></span>
              <span>${t(H.available)}</span>
            </figcaption>
          </figure>
        </div>
      </div>

      <ul class="hero-stats" aria-label="${t(H.statsLabel)}">${stats}
      </ul>
    </section>`;
}

function videoSection(lang, transcript) {
  const s = C.SECTIONS.video;
  const f = C.VIDEO.files[lang];
  const V = C.VIDEO_UI;
  const t = (v, w) => L(v, lang, w);
  const paras = transcript.paragraphs.map((p) => `          <p>${esc(p)}</p>`).join('\n');
  // link de download só quando o MP4 existe; legenda com a duração só quando ela é conhecida
  const download = videoReady(lang) ? ` <a href="${f.mp4}">${t(V.download)}</a>` : '';
  const dur = durationLabel(lang);
  const caption = dur ? `\n        <figcaption class="video-caption mono">${t(V.caption).replace('{d}', dur)}</figcaption>` : '';
  return `
    <!-- ============ 00 — VÍDEO ============ -->
    <section class="section section-video" id="${s.id}" aria-labelledby="${s.id}-title">
      ${sectionHead(lang, s, { note: t(V.note), noteId: 'video-desc' })}
      <figure class="video-player" data-reveal>
        <div class="video-frame">
          <video id="video-apresentacao" controls playsinline preload="none" width="1280" height="720" data-poster="${f.poster}" aria-describedby="video-desc">
            <source src="${f.mp4}" type="video/mp4">
            <track kind="captions" srclang="${HTML_LANG[lang]}" label="${t(V.trackLabel)}" src="${f.vtt}">
            <p>${t(V.noVideo)}${download}</p>
          </video>
          <div class="video-fallback" role="status" data-msg="${esc(t(V.fallback))}"></div>
        </div>${caption}
      </figure>
      <p class="video-more" data-reveal><a class="btn btn-ghost" href="${VIDEO_PATH[lang]}">${t(C.VIDEO_PAGE.homeLink)}</a></p>
      <details class="transcript" data-reveal>
        <summary>${t(V.transcript)}</summary>
        <div class="transcript-body">
${paras}
        </div>
      </details>
    </section>`;
}

function about(lang) {
  const s = C.SECTIONS.about;
  const ps = C.ABOUT.map((p, i) => `        <p>${L(p, lang, `ABOUT[${i}]`)}</p>`).join('\n');
  return `
    <!-- ============ 01 — SOBRE ============ -->
    <section class="section" id="${s.id}" aria-labelledby="${s.id}-title">
      ${sectionHead(lang, s)}
      <div class="about-body" data-reveal>
${ps}
      </div>
    </section>`;
}

function services(lang) {
  const s = C.SECTIONS.services;
  const items = C.SERVICES.items
    .map((it, i) => `
        <li class="service-card" data-reveal>
          <span class="service-num mono">/${String(i + 1).padStart(2, '0')}</span>
          <h3 class="service-title">${L(it.title, lang)}</h3>
          <p class="service-desc">${L(it.text, lang)}</p>
        </li>`)
    .join('');
  return `
    <!-- ============ 02 — SERVIÇOS ============ -->
    <section class="section" id="${s.id}" aria-labelledby="${s.id}-title">
      ${sectionHead(lang, s, { note: L(C.SERVICES.intro, lang) })}
      <ul class="service-grid">${items}
      </ul>
    </section>`;
}

function stack(lang) {
  const s = C.SECTIONS.stack;
  const groups = C.STACK.map((g) => {
    const tags = g.tags.map((tag) => `<li class="tag">${L(tag, lang, 'stack')}</li>`).join('');
    return `
        <div class="stack-group" data-reveal>
          <h3 class="stack-label mono">${L(g.label, lang)}</h3>
          <ul class="tag-list">${tags}</ul>
        </div>`;
  }).join('');
  return `
    <!-- ============ 03 — STACK ============ -->
    <section class="section" id="${s.id}" aria-labelledby="${s.id}-title">
      ${sectionHead(lang, s)}
      <div class="stack-grid">${groups}
      </div>
    </section>`;
}

function work(lang) {
  const s = C.SECTIONS.work;
  let n = 0;
  const groups = C.WORK.groups.map((g) => {
    const cards = g.items.map((w) => {
      n += 1;
      const links = (w.links || []).map((l) => extLink(l.href, L(l, lang, `${w.id}.links`), lang, { hreflang: l.hreflang })).join('\n            ');
      return `
          <li class="work-card${w.featured ? ' is-featured' : ''}" id="${w.id}" data-reveal>
            <div class="work-card-head">
              <span class="work-num mono">${String(n).padStart(2, '0')}</span>
              <h4 class="work-title">${L(w.title, lang)}</h4>
            </div>
            <p class="work-badge mono">${L(w.badge, lang)}</p>
            <p class="work-desc">${L(w.text, lang, w.id)}</p>
            <ul class="work-tags">${w.tags.map((tag) => `<li class="tag">${tag}</li>`).join('')}</ul>${links ? `
            <p class="work-links">${links}</p>` : ''}
          </li>`;
    }).join('');
    return `
        <section class="work-group" aria-labelledby="grupo-${g.id}">
          <h3 class="work-group-title mono" id="grupo-${g.id}">${L(g.title, lang)}</h3>
          <ol class="work-list">${cards}
          </ol>
        </section>`;
  }).join('');
  return `
    <!-- ============ 04 — TRABALHOS ============ -->
    <section class="section" id="${s.id}" aria-labelledby="${s.id}-title">
      ${sectionHead(lang, s, { note: L(C.WORK.note, lang) })}
      <div class="work-groups">${groups}
      </div>
    </section>`;
}

function path(lang) {
  const s = C.SECTIONS.path;
  const P = C.PATH;
  const items = P.timeline.map((it) => `
            <li class="timeline-item">
              <span class="timeline-period mono">${L(it.period, lang)}</span>
              <h4 class="timeline-role">${L(it.role, lang)}</h4>
              <p class="timeline-desc">${L(it.text, lang)}</p>
            </li>`).join('');
  const edu = P.education.map((e) => `
            <li class="edu-item">
              <span class="edu-degree">${L(e.degree, lang)}</span>
              <span class="edu-meta mono">${L(e.meta, lang)}</span>
            </li>`).join('');
  return `
    <!-- ============ 05 — TRAJETÓRIA ============ -->
    <section class="section" id="${s.id}" aria-labelledby="${s.id}-title">
      ${sectionHead(lang, s)}
      <div class="path-grid">
        <div class="path-col" data-reveal>
          <h3 class="sub-label mono">${L(P.expLabel, lang)}</h3>
          <ol class="timeline">${items}
          </ol>
        </div>
        <div class="path-col" data-reveal>
          <h3 class="sub-label mono">${L(P.eduLabel, lang)}</h3>
          <ul class="edu-list">${edu}
          </ul>
        </div>
      </div>
    </section>`;
}

function docs(lang) {
  const s = C.SECTIONS.docs;
  const items = C.DOCS.items.map((d) => {
    const links = d.links.map((l) => `<li>${extLink(l.href, L(l, lang, 'docs.links'), lang, { hreflang: 'pt-BR' })}</li>`).join('\n            ');
    return `
        <li class="doc-item" data-reveal>
          <p class="doc-period mono">${L(d.period, lang)}</p>
          <h3 class="doc-title">${L(d.title, lang)}</h3>
          <p class="doc-desc">${L(d.text, lang)}</p>
          <ul class="doc-links">
            ${links}
          </ul>
        </li>`;
  }).join('');
  return `
    <!-- ============ 06 — DOCUMENTOS PÚBLICOS ============ -->
    <section class="section" id="${s.id}" aria-labelledby="${s.id}-title">
      ${sectionHead(lang, s, { note: L(C.DOCS.intro, lang) })}
      <ol class="doc-list">${items}
      </ol>
    </section>`;
}

function pubs(lang) {
  const s = C.SECTIONS.pubs;
  const items = C.PUBS.map((p) => {
    const titleLang = p.titleLang !== HTML_LANG[lang] ? ` lang="${p.titleLang}"` : '';
    return `
        <li class="pub-item">
          <span class="pub-year mono">${p.year}</span>
          <div class="pub-body">
            <p class="pub-title"${titleLang}>“${p.title}”</p>
            <p class="pub-meta">${L(p.meta, lang)}</p>
            <p class="pub-doi">${extLink(`https://doi.org/${p.doi}`, `DOI ${p.doi}`, lang)}</p>
          </div>
        </li>`;
  }).join('');
  return `
    <!-- ============ 07 — PUBLICAÇÕES ============ -->
    <section class="section" id="${s.id}" aria-labelledby="${s.id}-title">
      ${sectionHead(lang, s)}
      <ol class="pub-list" data-reveal>${items}
      </ol>
    </section>`;
}

function faq(lang) {
  const s = C.SECTIONS.faq;
  const items = C.FAQ.map((f) => `
        <div class="faq-item" data-reveal>
          <h3>${L(f.q, lang)}</h3>
          <p>${L(f.a, lang)}</p>
        </div>`).join('');
  return `
    <!-- ============ 08 — PERGUNTAS ============ -->
    <section class="section" id="${s.id}" aria-labelledby="${s.id}-title">
      ${sectionHead(lang, s)}
      <div class="faq-list">${items}
      </div>
    </section>`;
}

function contact(lang) {
  const s = C.SECTIONS.contact;
  const K = C.CONTACT;
  const t = (v, w) => L(v, lang, w);
  const PROFILE_HREFLANG = { lattes: 'pt-BR' }; // destino em português
  const profiles = Object.entries(C.PROFILES)
    .filter(([, href]) => href)
    .map(([key, href]) => {
      const p = K.profiles[key];
      const hl = PROFILE_HREFLANG[key] ? ` hreflang="${PROFILE_HREFLANG[key]}"` : '';
      return `
        <li>
          <a href="${esc(href)}" target="_blank" rel="noopener noreferrer"${hl}>
            <span class="link-label mono">${p.label}</span>
            <span class="link-value">${extTail(t(p.value), lang)}</span>
          </a>
        </li>`;
    }).join('');
  return `
    <!-- ============ 09 — CONTATO ============ -->
    <section class="section section-contact" id="${s.id}" aria-labelledby="${s.id}-title">
      ${sectionHead(lang, s, { note: t(K.note) })}
      <div class="contact-actions" data-reveal>
        <a class="btn btn-primary" href="${C.SITE.whatsapp}" target="_blank" rel="noopener noreferrer">${t(K.whatsapp)}<span class="visually-hidden"> ${t(C.UI.external)}</span></a>
        <a class="btn btn-ghost" href="mailto:${C.SITE.email}">${C.SITE.email}</a>
      </div>

      <div class="vcard" data-reveal>
        <div class="vcard-code">
          <img src="${t(K.qr)}" width="200" height="200" alt="${esc(t(K.qrAlt))}" loading="lazy" decoding="async">
          <span class="vcard-scan" aria-hidden="true"></span>
        </div>
        <p class="vcard-caption mono">${t(K.qrCaption)}</p>
        <p class="vcard-phone"><span class="mono">${t(K.phone.label)}</span> ${K.phone.display.replace(/ /g, '&nbsp;')}</p>
        <a class="btn btn-ghost" href="${t(K.vcf)}" download>${t(K.saveContact)}</a>
      </div>

      <ul class="contact-links" data-reveal>${profiles}
      </ul>
      <p class="contact-loc mono">${t(K.location)}</p>
    </section>`;
}

function footer(lang, mode = 'home') {
  const sw = langSwitch(lang, mode);
  const switchItem = `<li><a href="${sw.href}" hreflang="${sw.hreflang}" lang="${sw.lang}">${sw.footer}</a></li>`;
  const links = mode === 'video'
    ? `        <li><a href="${PAGE_PATH[lang]}">${L(C.VIDEO_PAGE.back, lang)}</a></li>
        ${switchItem}`
    : `        <li><a href="#video">${L(C.FOOTER.video, lang)}</a></li>
        ${switchItem}
        <li><a href="#topo">${L(C.FOOTER.top, lang)}</a></li>`;
  return `  <footer class="site-footer">
    <div class="footer-inner">
      <p class="footer-name">${C.SITE.name}</p>
      <p class="footer-meta mono">© ${C.SITE.year} ${C.SITE.fullName} · phellipe.eti.br</p>
      <p class="footer-craft">${L(C.FOOTER.craft, lang)}</p>
      <ul class="footer-links">
${links}
      </ul>
    </div>
  </footer>`;
}

const GENERATED = 'Gerado por tools/build.mjs a partir de src/content.mjs e styles.css. Não edite este arquivo: edite a fonte e rode `node tools/build.mjs`.';

function page(lang) {
  const transcript = transcriptFromVtt(lang);
  // typo(): espaço inseparável depois de "nº", "p.", "No." etc. só no texto visível
  const main = typo([
    hero(lang), videoSection(lang, transcript), about(lang), services(lang), stack(lang),
    work(lang), path(lang), docs(lang), pubs(lang), faq(lang), contact(lang),
  ].join('\n'));
  return `<!doctype html>
<!-- ${GENERATED} -->
<html lang="${HTML_LANG[lang]}">
${head(lang)}
<body>
${siteHeader(lang)}

  <main id="conteudo">
${main}

  </main>

${footer(lang)}

${jsonLd(lang)}
  <script src="/script.js" defer></script>
</body>
</html>
`;
}

/** Página de exibição do vídeo (/video/, /en/video/): o vídeo é o conteúdo principal. */
function videoPage(lang) {
  const t = (v, w) => L(v, lang, w);
  const V = C.VIDEO_UI;
  const P = C.VIDEO_PAGE;
  const K = C.CONTACT;
  const f = C.VIDEO.files[lang];
  const transcript = transcriptFromVtt(lang);
  const ready = videoReady(lang);
  const download = ready ? `<a class="btn btn-ghost" href="${f.mp4}" download>${t(P.download)}</a>` : '';
  const chapters = chaptersOf(lang)
    .map((c) => `
          <li><a href="?t=${c.t}" data-t="${c.t}"><span class="chapter-time mono">${clock(c.t)}</span><span class="chapter-name">${esc(c.name)}</span></a></li>`)
    .join('');
  const paras = transcript.paragraphs.map((p) => `        <p>${esc(p)}</p>`).join('\n');
  const transcriptBlock = paras ? `
      <section class="watch-section" aria-labelledby="transcricao-title">
        <h2 class="watch-h2" id="transcricao-title">${t(P.transcriptLabel)}</h2>
        <div class="watch-transcript">
${paras}
        </div>
      </section>` : '';
  const main = typo(`
    <article class="watch-wrap">
      <h1 class="watch-title">${esc(t(C.VIDEO.name))}</h1>

      <div class="video-player watch-player">
        <div class="video-frame is-ready">
          <video id="video-apresentacao" controls playsinline preload="none" width="1280" height="720" poster="${f.poster}" data-watch aria-describedby="watch-intro">
            <source src="${f.mp4}" type="video/mp4">
            <track kind="captions" srclang="${HTML_LANG[lang]}" label="${t(V.trackLabel)}" src="${f.vtt}" default>
            <p>${t(V.noVideo)}${ready ? ` <a href="${f.mp4}">${t(P.download)}</a>` : ''}</p>
          </video>
          <div class="video-fallback" role="status" data-msg="${esc(t(V.fallback))}"></div>
        </div>
      </div>

      <p class="watch-intro" id="watch-intro">${t(P.intro)}</p>

      <section class="watch-section" aria-labelledby="capitulos-title">
        <h2 class="watch-h2" id="capitulos-title">${t(P.chaptersLabel)}</h2>
        <ol class="chapters">${chapters}
        </ol>
      </section>
${transcriptBlock}

      <p class="watch-links">${download ? `${download}\n        ` : ''}<a class="btn btn-ghost" href="${PAGE_PATH[lang]}">${t(P.back)}</a></p>

      <section class="watch-section watch-contact" aria-labelledby="contato-title">
        <h2 class="watch-h2" id="contato-title">${t(C.SECTIONS.contact.title)}</h2>
        <p>${t(K.note)}</p>
        <div class="contact-actions">
          <a class="btn btn-primary" href="${C.SITE.whatsapp}" target="_blank" rel="noopener noreferrer">${t(K.whatsapp)}<span class="visually-hidden"> ${t(C.UI.external)}</span></a>
          <a class="btn btn-ghost" href="mailto:${C.SITE.email}">${C.SITE.email}</a>
        </div>
      </section>
    </article>`);
  return `<!doctype html>
<!-- ${GENERATED} -->
<html lang="${HTML_LANG[lang]}">
${videoHead(lang)}
<body>
${siteHeader(lang, 'video')}

  <main id="conteudo" class="watch">${main}

  </main>

${footer(lang, 'video')}

${videoJsonLd(lang, transcript)}
  <script src="/script.js" defer></script>
</body>
</html>
`;
}

function notFound() {
  const N = C.NOT_FOUND;
  const sw = C.UI.langSwitch.pt;
  return `<!doctype html>
<!-- ${GENERATED} -->
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(N.title)}</title>
  <meta name="description" content="${esc(N.description)}">
  <meta name="robots" content="noindex">
  <meta name="theme-color" content="#0A0B0E">
  <link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
  <link rel="icon" href="/assets/favicon-32.png" sizes="32x32" type="image/png">
  <link rel="apple-touch-icon" href="/assets/apple-touch-icon.png">
  <link rel="manifest" href="/site.webmanifest">
  <link rel="preload" href="/assets/fonts/bricolage-grotesque-latin-800-normal.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="/assets/fonts/hanken-grotesk-latin-400-normal.woff2" as="font" type="font/woff2" crossorigin>
  <style>${CSS}</style>
</head>
<body>
  <a class="skip-link" href="#conteudo">${C.UI.skip.pt}</a>
  <header class="site-header scrolled">
    <nav class="nav" aria-label="${C.UI.navLabel.pt}">
      <a class="brand" href="/">phellipe<span class="brand-accent">.eti.br</span></a>
      <a class="lang-toggle" href="${sw.href}" hreflang="${sw.hreflang}" lang="${sw.lang}" aria-label="${sw.aria}">${sw.label}</a>
    </nav>
  </header>

  <main id="conteudo" class="notfound">
    <p class="notfound-code mono">// erro 404</p>
    <h1>${N.h1}</h1>
    <p>${N.text}</p>
    <p lang="en">${N.textEn}</p>
    <div class="notfound-links">
      <a class="btn btn-primary" href="/">${N.home}</a>
      <a class="btn btn-ghost" href="/en/" hreflang="en" lang="en">${N.homeEn}</a>
      <a class="btn btn-ghost" href="/#video">${N.video}</a>
    </div>
  </main>

  <footer class="site-footer">
    <div class="footer-inner">
      <p class="footer-name">${C.SITE.name}</p>
      <p class="footer-meta mono">© ${C.SITE.year} ${C.SITE.fullName} · phellipe.eti.br</p>
    </div>
  </footer>
</body>
</html>
`;
}

function sitemap() {
  const alt = (urlOf) => ALTERNATES.map(([hl, l]) => `
    <xhtml:link rel="alternate" hreflang="${hl}" href="${urlOf(l)}"/>`).join('');
  const url = (lang) => `
  <url>
    <loc>${pageUrl(lang)}</loc>
    <lastmod>${C.SITE.updated}</lastmod>${alt(pageUrl)}
    <image:image>
      <image:loc>${abs(C.SITE.photo.jpg)}</image:loc>
    </image:image>
  </url>`;
  // Páginas do vídeo: a extensão de vídeo do Google só entra com o MP4 pronto e as datas preenchidas.
  const videoUrl = (lang) => {
    const f = C.VIDEO.files[lang];
    const seconds = isoSeconds(videoDuration(lang));
    const video = videoReady(lang) && seconds
      ? `
    <video:video>
      <video:thumbnail_loc>${abs(f.poster)}</video:thumbnail_loc>
      <video:title>${esc(L(C.VIDEO.name, lang))}</video:title>
      <video:description>${esc(L(C.VIDEO.description, lang))}</video:description>
      <video:content_loc>${abs(f.mp4)}</video:content_loc>
      <video:duration>${seconds}</video:duration>
      <video:publication_date>${C.VIDEO.uploadDate}</video:publication_date>
    </video:video>`
      : '';
    return `
  <url>
    <loc>${videoPageUrl(lang)}</loc>
    <lastmod>${C.SITE.updated}</lastmod>${alt(videoPageUrl)}${video}
  </url>`;
  };
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">${url('pt')}${url('en')}${videoUrl('pt')}${videoUrl('en')}
</urlset>
`;
}

function manifest() {
  return `${JSON.stringify({
    lang: 'pt-BR',
    dir: 'ltr',
    name: 'João Phellipe — Engenheiro de Software Sênior',
    short_name: 'João Phellipe',
    description: C.META.description.pt,
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#0A0B0E',
    theme_color: '#0A0B0E',
    icons: [
      { src: '/assets/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { src: '/assets/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
      { src: '/assets/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/assets/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  }, null, 2)}\n`;
}

// ------------------------------------------------------------------- saída ----
function write(rel, content) {
  const file = join(ROOT, rel);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, content, 'utf8');
  console.log(`  ${rel.padEnd(42)} ${(Buffer.byteLength(content) / 1024).toFixed(1)} KB`);
}

/** Confere se todo caminho local referenciado no HTML existe em disco. */
function checkLocalRefs(rel, html) {
  const refs = new Set();
  for (const m of html.matchAll(/\s(?:src|href|poster|data-poster|srcset|imagesrcset)="([^"]+)"/g)) {
    for (const part of m[1].split(',')) {
      const ref = part.trim().split(/\s+/)[0];
      if (ref.startsWith('/') && !ref.startsWith('//')) refs.add(ref.split('#')[0]);
    }
  }
  // URLs absolutas de arquivos do próprio site: og:image, twitter:image e as do JSON-LD
  const own = ORIGIN.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  for (const m of html.matchAll(new RegExp(`${own}(/[^"#?\\s]+\\.(?:jpg|jpeg|png|webp|avif|svg|mp4|vtt|vcf))`, 'g'))) refs.add(m[1]);
  for (const ref of refs) {
    if (ref.endsWith('/')) continue; // páginas (/, /en/, /video/, /en/video/): geradas neste mesmo build
    if (!existsSync(join(ROOT, ref))) warnings.push(`${rel}: ${ref} ainda não existe${ref.endsWith('.mp4') ? ' (vídeo a renderizar: até lá, a página não publica o VideoObject nem o link de download)' : ''}.`);
  }
}

console.log('build phellipe.eti.br');
for (const lang of LANGS) {
  const rel = lang === 'pt' ? 'index.html' : 'en/index.html';
  const html = page(lang);
  write(rel, html);
  checkLocalRefs(rel, html);
}
for (const lang of LANGS) {
  const rel = lang === 'pt' ? 'video/index.html' : 'en/video/index.html';
  const html = videoPage(lang);
  write(rel, html);
  checkLocalRefs(rel, html);
}
write('404.html', notFound());
write('sitemap.xml', sitemap());
write('site.webmanifest', manifest());
write(`${C.SITE.indexNowKey}.txt`, C.SITE.indexNowKey);

if (videoPlaceholdersPending()) {
  warnings.push('VIDEO.duration / VIDEO.uploadDate ainda são {{VIDEO_DURATION}} / {{VIDEO_UPLOAD_DATE}} (src/content.mjs).');
}
const pendingProfiles = ['linkedin', 'instagram', 'youtube'].filter((k) => !C.PROFILES[k]);
if (pendingProfiles.length) console.log(`\ninfo: perfis ainda vazios em PROFILES: ${pendingProfiles.join(', ')}`);
if (warnings.length) {
  console.log('\nPENDÊNCIAS:');
  for (const w of [...new Set(warnings)]) console.log(`  - ${w}`);
}
