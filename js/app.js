// Controlador principal: router por hash, swipe, tooltips de traducción,
// render de cada vista y tema claro/oscuro.

import { CHAPTERS } from "./content.js";
import {
  load, save, reset, markPageRead, setTheme, tickStreak,
  chapterProgress, overallProgress, exerciseStats, vocabStats
} from "./progress.js";
import { renderQuiz, renderFillBlank, renderFlashcards } from "./exercises.js";

const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

const views = {
  cover:    $("#view-cover"),
  toc:      $("#view-toc"),
  reader:   $("#view-reader"),
  vocab:    $("#view-vocab"),
  progress: $("#view-progress"),
  settings: $("#view-settings")
};

function showView(name) {
  Object.entries(views).forEach(([k, el]) => el.classList.toggle("active", k === name));
  $$(".bottom-nav button").forEach(b => b.classList.toggle("active", b.dataset.view === name));
  window.scrollTo(0, 0);
}

// ───────── Router por hash ─────────
function parseHash() {
  const h = location.hash.slice(1) || "/cover";
  const [, route, ...rest] = h.split("/");
  return { route: route || "cover", params: rest };
}

function go(path) { location.hash = path; }

function route() {
  const { route, params } = parseHash();
  switch (route) {
    case "cover":    renderCover();    showView("cover"); break;
    case "toc":      renderTOC();      showView("toc"); break;
    case "reader": {
      const chId = params[0] || CHAPTERS[0].id;
      const page = Math.max(0, parseInt(params[1] || "0", 10));
      renderReader(chId, page);
      showView("reader");
      break;
    }
    case "vocab":    renderVocab();    showView("vocab"); break;
    case "progress": renderProgress(); showView("progress"); break;
    case "settings": renderSettings(); showView("settings"); break;
    default: go("/cover");
  }
}

// ───────── Vistas ─────────
function renderCover() {
  const s = load();
  const cont = $("#cover-continue");
  if (s.currentChapter) {
    const ch = CHAPTERS.find(c => c.id === s.currentChapter);
    if (ch) {
      cont.hidden = false;
      cont.textContent = `Continuar: ${ch.title} · pág. ${s.currentPage + 1}`;
      cont.onclick = () => go(`/reader/${ch.id}/${s.currentPage}`);
    }
  } else {
    cont.hidden = true;
  }
}

function renderTOC() {
  const list = $("#toc-list");
  list.innerHTML = "";
  CHAPTERS.forEach((ch, idx) => {
    const p = chapterProgress(ch);
    const item = document.createElement("button");
    item.type = "button";
    item.className = "toc-item";
    item.innerHTML = `
      <div class="toc-emoji" aria-hidden="true">${ch.emoji}</div>
      <div class="toc-body">
        <div class="toc-title">${idx + 1}. ${ch.title}</div>
        <div class="toc-sub">${ch.subtitle}</div>
        <div class="toc-bar"><div class="toc-bar-fill" style="width:${p.pct}%"></div></div>
        <div class="toc-meta">${p.done}/${p.total} · ${p.pct}% ${p.pct === 100 ? "✓" : ""}</div>
      </div>
      <svg class="icon"><use href="assets/icons.svg#i-arrow-right"/></svg>
    `;
    item.onclick = () => go(`/reader/${ch.id}/0`);
    list.append(item);
  });
}

function renderReader(chId, pageIndex) {
  const ch = CHAPTERS.find(c => c.id === chId);
  if (!ch) return go("/toc");
  const page = ch.pages[pageIndex];
  if (!page) return go("/toc");

  const body = $("#reader-body");
  body.className = "reader-body";
  body.innerHTML = "";

  $("#reader-title").textContent = ch.title;
  $("#reader-counter").textContent = `${pageIndex + 1} / ${ch.pages.length}`;
  const pct = Math.round(((pageIndex + 1) / ch.pages.length) * 100);
  $("#reader-progress").style.width = pct + "%";

  const ctx = {
    chapter: ch,
    pageIndex,
    onDone: () => {
      const next = pageIndex + 1;
      if (next < ch.pages.length) go(`/reader/${chId}/${next}`);
      else go("/toc");
    }
  };

  if (page.type === "reading") {
    const art = document.createElement("article");
    art.className = "reading";
    if (page.heading) {
      const h = document.createElement("h2");
      h.textContent = page.heading;
      art.append(h);
    }
    const div = document.createElement("div");
    div.innerHTML = page.html;
    art.append(div);
    body.append(art);
    markPageRead(chId, pageIndex);
  } else if (page.type === "quiz") {
    renderQuiz(body, page, ctx);
  } else if (page.type === "fill") {
    renderFillBlank(body, page, ctx);
  } else if (page.type === "flash") {
    renderFlashcards(body, page, ctx);
  }

  // Prev/Next buttons
  $("#reader-prev").disabled = pageIndex === 0;
  $("#reader-next").disabled = pageIndex === ch.pages.length - 1;
  $("#reader-prev").onclick = () => pageIndex > 0 && go(`/reader/${chId}/${pageIndex - 1}`);
  $("#reader-next").onclick = () => pageIndex < ch.pages.length - 1 && go(`/reader/${chId}/${pageIndex + 1}`);
}

function renderVocab() {
  const list = $("#vocab-list");
  const s = load();
  list.innerHTML = "";
  CHAPTERS.forEach(ch => {
    const flashPages = ch.pages.filter(p => p.type === "flash");
    if (flashPages.length === 0) return;
    const section = document.createElement("section");
    section.className = "vocab-group";
    section.innerHTML = `<h3>${ch.emoji} ${ch.title}</h3>`;
    flashPages.forEach(fp => {
      fp.cards.forEach(c => {
        const v = s.vocab[c.en] || { seen: 0, known: 0 };
        const mastery = v.seen ? Math.round((v.known / v.seen) * 100) : 0;
        const row = document.createElement("div");
        row.className = "vocab-row";
        row.innerHTML = `
          <div class="vocab-words"><b>${c.en}</b><span class="muted"> — ${c.es}</span></div>
          <div class="vocab-bar" title="Dominio ${mastery}%">
            <div class="vocab-bar-fill" style="width:${mastery}%"></div>
          </div>`;
        section.append(row);
      });
    });
    list.append(section);
  });
}

function renderProgress() {
  const o = overallProgress(CHAPTERS);
  const e = exerciseStats(CHAPTERS);
  const v = vocabStats();
  const s = tickStreak();
  $("#stat-overall").textContent    = `${o.pct}%`;
  $("#stat-overall-sub").textContent = `${o.done} de ${o.total} elementos`;
  $("#stat-exercises").textContent  = e.total ? `${e.pct}%` : "—";
  $("#stat-exercises-sub").textContent = e.total ? `${e.score} / ${e.total} aciertos` : "Sin datos aún";
  $("#stat-vocab").textContent      = String(v.known);
  $("#stat-vocab-sub").textContent  = `de ${v.total} vistas`;
  $("#stat-streak").textContent     = String(s.days || 0);
  $("#stat-streak-sub").textContent = "días consecutivos";

  const perCh = $("#progress-chapters");
  perCh.innerHTML = "";
  CHAPTERS.forEach(ch => {
    const p = chapterProgress(ch);
    const row = document.createElement("div");
    row.className = "prog-row";
    row.innerHTML = `
      <div class="prog-label">${ch.emoji} ${ch.title}</div>
      <div class="prog-bar"><div class="prog-bar-fill" style="width:${p.pct}%"></div></div>
      <div class="prog-pct">${p.pct}%</div>`;
    perCh.append(row);
  });
}

function renderSettings() {
  const s = load();
  const r = $$('input[name="theme"]');
  r.forEach(i => { i.checked = (i.value === (s.theme || "system")); });
}

// ───────── Tooltip de traducción (<w data-es="...">) ─────────
let tooltipEl = null;
function setupTooltips() {
  document.body.addEventListener("click", e => {
    const w = e.target.closest("w[data-es]");
    if (w) {
      e.preventDefault();
      e.stopPropagation();
      showTooltip(w);
    } else if (tooltipEl) {
      tooltipEl.remove();
      tooltipEl = null;
    }
  });
}
function showTooltip(target) {
  if (tooltipEl) tooltipEl.remove();
  tooltipEl = document.createElement("div");
  tooltipEl.className = "word-tooltip";
  tooltipEl.textContent = target.dataset.es;
  document.body.append(tooltipEl);
  const r = target.getBoundingClientRect();
  const tw = tooltipEl.offsetWidth;
  const th = tooltipEl.offsetHeight;
  const left = Math.max(8, Math.min(window.innerWidth - tw - 8, r.left + r.width / 2 - tw / 2));
  const top = r.top - th - 8 + window.scrollY;
  tooltipEl.style.left = left + "px";
  tooltipEl.style.top = (top < 8 ? r.bottom + 8 + window.scrollY : top) + "px";
  tooltipEl.classList.toggle("below", top < 8);
}

// ───────── Swipe en el lector ─────────
function setupSwipe() {
  const reader = $("#view-reader");
  let startX = 0, startY = 0, active = false, dx = 0;
  const body = $("#reader-body");

  reader.addEventListener("pointerdown", e => {
    if (e.target.closest("input, button, textarea, .flashcard, .option")) return;
    active = true; startX = e.clientX; startY = e.clientY; dx = 0;
    body.style.transition = "none";
  });
  reader.addEventListener("pointermove", e => {
    if (!active) return;
    dx = e.clientX - startX;
    const dy = e.clientY - startY;
    if (Math.abs(dy) > Math.abs(dx)) { active = false; body.style.transform = ""; return; }
    body.style.transform = `translateX(${dx}px)`;
  });
  const end = () => {
    if (!active) return;
    active = false;
    body.style.transition = "transform .25s ease";
    const { route, params } = parseHash();
    if (route !== "reader") { body.style.transform = ""; return; }
    const chId = params[0], page = parseInt(params[1] || "0", 10);
    const ch = CHAPTERS.find(c => c.id === chId);
    if (!ch) { body.style.transform = ""; return; }
    if (dx < -50 && page < ch.pages.length - 1) {
      body.style.transform = "translateX(-100%)";
      setTimeout(() => { body.style.transform = ""; go(`/reader/${chId}/${page + 1}`); }, 200);
    } else if (dx > 50 && page > 0) {
      body.style.transform = "translateX(100%)";
      setTimeout(() => { body.style.transform = ""; go(`/reader/${chId}/${page - 1}`); }, 200);
    } else {
      body.style.transform = "";
    }
  };
  reader.addEventListener("pointerup", end);
  reader.addEventListener("pointercancel", end);
  reader.addEventListener("pointerleave", end);
}

// ───────── Teclado ─────────
function setupKeyboard() {
  document.addEventListener("keydown", e => {
    const { route, params } = parseHash();
    if (route !== "reader") return;
    if (e.target.matches("input, textarea")) return;
    const chId = params[0], page = parseInt(params[1] || "0", 10);
    const ch = CHAPTERS.find(c => c.id === chId);
    if (!ch) return;
    if (e.key === "ArrowRight" && page < ch.pages.length - 1) go(`/reader/${chId}/${page + 1}`);
    if (e.key === "ArrowLeft" && page > 0) go(`/reader/${chId}/${page - 1}`);
  });
}

// ───────── Tema ─────────
function applyTheme() {
  const s = load();
  const theme = s.theme || "system";
  const resolved = theme === "system"
    ? (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
    : theme;
  document.documentElement.dataset.theme = resolved;
}

function setupThemeControls() {
  $("#settings-reset")?.addEventListener("click", () => {
    if (confirm("¿Borrar todo tu progreso? Esta acción no se puede deshacer.")) {
      reset(); applyTheme(); route();
    }
  });
  document.addEventListener("change", e => {
    if (e.target.matches('input[name="theme"]')) {
      setTheme(e.target.value === "system" ? null : e.target.value);
      applyTheme();
    }
  });
  $("#btn-theme")?.addEventListener("click", () => {
    const cur = document.documentElement.dataset.theme;
    setTheme(cur === "dark" ? "light" : "dark");
    applyTheme();
  });
}

// ───────── Bottom nav ─────────
function setupBottomNav() {
  $$(".bottom-nav button").forEach(b => {
    b.addEventListener("click", () => go("/" + b.dataset.view));
  });
}

// ───────── Init ─────────
function init() {
  applyTheme();
  tickStreak();
  setupTooltips();
  setupSwipe();
  setupKeyboard();
  setupThemeControls();
  setupBottomNav();

  $("#cover-start")?.addEventListener("click", () => go("/toc"));
  $("#reader-back")?.addEventListener("click", () => go("/toc"));

  window.addEventListener("hashchange", route);
  route();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
