// Renderizadores de ejercicios. Cada función recibe (container, page, ctx)
// donde ctx = { chapter, pageIndex, onDone(score,total) }.

import { recordExercise, updateVocab, markFlashSeen } from "./progress.js";

const el = (tag, props = {}, ...children) => {
  const n = Object.assign(document.createElement(tag), props);
  children.flat().forEach(c => n.append(c?.nodeType ? c : document.createTextNode(c)));
  return n;
};

const normalize = s => s.toLowerCase().trim().replace(/\s+/g, " ").replace(/[.,!?;:'"]/g, "");

// ───────── Quiz ─────────
export function renderQuiz(container, page, ctx) {
  container.innerHTML = "";
  const state = { answered: new Array(page.questions.length).fill(null), score: 0 };
  const header = el("header", { className: "ex-head" },
    el("h2", {}, page.title || "Quiz"),
    el("p", { className: "muted" }, `${page.questions.length} preguntas`)
  );
  container.append(header);

  page.questions.forEach((q, qi) => {
    const card = el("article", { className: "ex-card" });
    card.append(el("h3", {}, `${qi + 1}. ${q.q}`));
    const opts = el("div", { className: "options" });
    q.options.forEach((opt, oi) => {
      const btn = el("button", { type: "button", className: "option", "aria-pressed": "false" }, opt);
      btn.addEventListener("click", () => {
        if (state.answered[qi] !== null) return;
        state.answered[qi] = oi;
        const correct = oi === q.answer;
        if (correct) state.score++;
        btn.classList.add(correct ? "correct" : "wrong");
        if (!correct) opts.children[q.answer].classList.add("correct");
        Array.from(opts.children).forEach(c => c.disabled = true);
        const fb = el("p", { className: `feedback ${correct ? "ok" : "ko"}`, role: "status" },
          correct ? "✔ ¡Correcto! " : "✘ No es correcta. ",
          q.explain || ""
        );
        card.append(fb);
        if (state.answered.every(a => a !== null)) finish();
      });
      opts.append(btn);
    });
    card.append(opts);
    container.append(card);
  });

  const summary = el("div", { className: "ex-summary", hidden: true });
  container.append(summary);

  function finish() {
    summary.hidden = false;
    summary.innerHTML = "";
    const pct = Math.round((state.score / page.questions.length) * 100);
    summary.append(
      el("h3", {}, `Resultado: ${state.score} / ${page.questions.length} (${pct}%)`),
      el("button", {
        type: "button",
        className: "btn primary",
        onclick: () => ctx.onDone?.(state.score, page.questions.length)
      }, "Continuar")
    );
    recordExercise(ctx.chapter.id, ctx.pageIndex, state.score, page.questions.length);
    summary.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }
}

// ───────── Fill in the blank ─────────
export function renderFillBlank(container, page, ctx) {
  container.innerHTML = "";
  const state = { done: 0, score: 0 };
  container.append(
    el("header", { className: "ex-head" },
      el("h2", {}, page.title || "Completa los huecos"),
      el("p", { className: "muted" }, "Escribe la palabra que falta y pulsa Comprobar.")
    )
  );

  page.items.forEach((it, i) => {
    const card = el("article", { className: "ex-card" });
    const line = el("p", { className: "fill-line" },
      el("span", {}, it.before || "")
    );
    const input = el("input", {
      type: "text",
      className: "fill-input",
      autocomplete: "off",
      autocapitalize: "none",
      spellcheck: false,
      "aria-label": `Hueco ${i + 1}`
    });
    input.size = Math.max(it.blank.length + 2, 6);
    line.append(input, el("span", {}, it.after || ""));
    const hint = it.hint ? el("p", { className: "hint muted" }, `Pista: ${it.hint}`) : null;
    const check = el("button", { type: "button", className: "btn" }, "Comprobar");
    const fb = el("p", { className: "feedback", role: "status" });

    let answered = false;
    const verify = () => {
      if (answered) return;
      const ok = normalize(input.value) === normalize(it.blank);
      answered = true;
      input.disabled = true;
      check.disabled = true;
      state.done++;
      if (ok) {
        state.score++;
        input.classList.add("correct");
        fb.className = "feedback ok";
        fb.textContent = "✔ ¡Correcto!";
      } else {
        input.classList.add("wrong");
        fb.className = "feedback ko";
        fb.textContent = `✘ Respuesta: ${it.blank}`;
      }
      if (state.done === page.items.length) finish();
    };
    check.addEventListener("click", verify);
    input.addEventListener("keydown", e => { if (e.key === "Enter") verify(); });

    card.append(line);
    if (hint) card.append(hint);
    card.append(check, fb);
    container.append(card);
  });

  const summary = el("div", { className: "ex-summary", hidden: true });
  container.append(summary);

  function finish() {
    summary.hidden = false;
    summary.innerHTML = "";
    summary.append(
      el("h3", {}, `Resultado: ${state.score} / ${page.items.length}`),
      el("button", {
        type: "button",
        className: "btn primary",
        onclick: () => ctx.onDone?.(state.score, page.items.length)
      }, "Continuar")
    );
    recordExercise(ctx.chapter.id, ctx.pageIndex, state.score, page.items.length);
    summary.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }
}

// ───────── Flashcards ─────────
export function renderFlashcards(container, page, ctx) {
  container.innerHTML = "";
  let index = 0;
  let known = 0;
  const queue = page.cards.map((_, i) => i);

  container.append(
    el("header", { className: "ex-head" },
      el("h2", {}, page.title || "Flashcards"),
      el("p", { className: "muted" }, "Toca la tarjeta para voltearla.")
    )
  );

  const counter = el("p", { className: "counter" });
  const deck = el("div", { className: "deck" });
  const actions = el("div", { className: "actions" });
  const btnRepeat = el("button", { type: "button", className: "btn ghost" }, "Repasar");
  const btnKnown = el("button", { type: "button", className: "btn primary" }, "Ya la sé");
  actions.append(btnRepeat, btnKnown);

  container.append(counter, deck, actions);

  const summary = el("div", { className: "ex-summary", hidden: true });
  container.append(summary);

  const render = () => {
    deck.innerHTML = "";
    if (queue.length === 0) return finish();
    const cardIdx = queue[0];
    const card = page.cards[cardIdx];
    counter.textContent = `Tarjeta ${index + 1} · Quedan ${queue.length}`;

    const flipper = el("button", { type: "button", className: "flashcard", "aria-label": "Voltear tarjeta" });
    const front = el("div", { className: "face front" }, el("span", { className: "word" }, card.en));
    const back = el("div", { className: "face back" }, el("span", { className: "word" }, card.es));
    flipper.append(front, back);
    flipper.addEventListener("click", () => flipper.classList.toggle("flipped"));
    deck.append(flipper);
    markFlashSeen(ctx.chapter.id, cardIdx);
  };

  btnKnown.addEventListener("click", () => {
    const cardIdx = queue.shift();
    updateVocab(page.cards[cardIdx].en, true);
    known++;
    index++;
    render();
  });
  btnRepeat.addEventListener("click", () => {
    const cardIdx = queue.shift();
    updateVocab(page.cards[cardIdx].en, false);
    queue.push(cardIdx);
    index++;
    render();
  });

  function finish() {
    deck.innerHTML = "";
    actions.hidden = true;
    counter.hidden = true;
    summary.hidden = false;
    summary.append(
      el("h3", {}, `¡Bien hecho! ${known} / ${page.cards.length} dominadas.`),
      el("button", {
        type: "button",
        className: "btn primary",
        onclick: () => ctx.onDone?.(known, page.cards.length)
      }, "Continuar")
    );
    recordExercise(ctx.chapter.id, ctx.pageIndex, known, page.cards.length);
  }

  render();
}
