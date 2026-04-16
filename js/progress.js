// Persistencia ligera en localStorage bajo la clave "leviz:state".
// No depende del módulo de contenido — acepta cualquier chapterId/pageIndex.

const KEY = "leviz:state";

const DEFAULTS = {
  currentChapter: null,
  currentPage: 0,
  chapters: {},          // { [chapterId]: { pagesRead:[], exercises:{[idx]:{score,total}}, flashSeen:[] } }
  vocab: {},             // { [en]: { seen, known } }
  theme: null,           // null = sistema
  streak: { lastOpenISO: null, days: 0 }
};

function safeParse(raw) {
  try { return raw ? JSON.parse(raw) : null; } catch { return null; }
}

function deepMerge(base, patch) {
  const out = Array.isArray(base) ? base.slice() : { ...base };
  for (const k of Object.keys(patch || {})) {
    const v = patch[k];
    if (v && typeof v === "object" && !Array.isArray(v)) {
      out[k] = deepMerge(base?.[k] ?? {}, v);
    } else {
      out[k] = v;
    }
  }
  return out;
}

export function load() {
  const stored = safeParse(localStorage.getItem(KEY)) || {};
  return deepMerge(DEFAULTS, stored);
}

export function save(patch) {
  const next = deepMerge(load(), patch);
  localStorage.setItem(KEY, JSON.stringify(next));
  return next;
}

export function reset() {
  localStorage.removeItem(KEY);
}

function getChapter(state, chId) {
  return state.chapters[chId] || { pagesRead: [], exercises: {}, flashSeen: [] };
}

export function markPageRead(chId, pageIndex) {
  const s = load();
  const ch = getChapter(s, chId);
  if (!ch.pagesRead.includes(pageIndex)) ch.pagesRead.push(pageIndex);
  s.chapters[chId] = ch;
  s.currentChapter = chId;
  s.currentPage = pageIndex;
  localStorage.setItem(KEY, JSON.stringify(s));
}

export function recordExercise(chId, pageIndex, score, total) {
  const s = load();
  const ch = getChapter(s, chId);
  ch.exercises[pageIndex] = { score, total };
  s.chapters[chId] = ch;
  localStorage.setItem(KEY, JSON.stringify(s));
}

export function updateVocab(en, known) {
  const s = load();
  const v = s.vocab[en] || { seen: 0, known: 0 };
  v.seen += 1;
  if (known) v.known += 1;
  s.vocab[en] = v;
  localStorage.setItem(KEY, JSON.stringify(s));
}

export function markFlashSeen(chId, cardIndex) {
  const s = load();
  const ch = getChapter(s, chId);
  if (!ch.flashSeen.includes(cardIndex)) ch.flashSeen.push(cardIndex);
  s.chapters[chId] = ch;
  localStorage.setItem(KEY, JSON.stringify(s));
}

export function setTheme(theme) { save({ theme }); }

export function tickStreak() {
  const s = load();
  const todayISO = new Date().toISOString().slice(0, 10);
  const last = s.streak.lastOpenISO;
  let days = s.streak.days || 0;
  if (last !== todayISO) {
    if (last) {
      const diff = (Date.parse(todayISO) - Date.parse(last)) / 86400000;
      days = diff === 1 ? days + 1 : 1;
    } else {
      days = 1;
    }
    s.streak = { lastOpenISO: todayISO, days };
    localStorage.setItem(KEY, JSON.stringify(s));
  }
  return s.streak;
}

// Porcentaje de avance en un capítulo: páginas leídas + ejercicios hechos / total.
export function chapterProgress(chapter) {
  const s = load();
  const ch = getChapter(s, chapter.id);
  const total = chapter.pages.length;
  let done = 0;
  chapter.pages.forEach((p, i) => {
    if (p.type === "reading" && ch.pagesRead.includes(i)) done++;
    else if (p.type !== "reading" && ch.exercises[i]) done++;
  });
  return { done, total, pct: total ? Math.round((done / total) * 100) : 0 };
}

export function overallProgress(chapters) {
  const all = chapters.map(chapterProgress);
  const done = all.reduce((a, b) => a + b.done, 0);
  const total = all.reduce((a, b) => a + b.total, 0);
  return { done, total, pct: total ? Math.round((done / total) * 100) : 0 };
}

export function exerciseStats(chapters) {
  const s = load();
  let score = 0, total = 0;
  chapters.forEach(ch => {
    const c = getChapter(s, ch.id);
    Object.values(c.exercises).forEach(e => { score += e.score; total += e.total; });
  });
  return { score, total, pct: total ? Math.round((score / total) * 100) : 0 };
}

export function vocabStats() {
  const s = load();
  const entries = Object.entries(s.vocab);
  const known = entries.filter(([, v]) => v.known > 0).length;
  return { known, total: entries.length };
}
