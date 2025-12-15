    /*******************************
     * CONFIG (EDIT THESE PER EXERCISE)
     *******************************/
    const SCENARIO_ID = "Scenario-001"; // e.g., "Negligence-Pistachio-01"
    // If you keep multiple exercises in one file, you can set DOCTRINE_ID explicitly.
    // If null, the code will infer doctrine from the first decision slide prefix.
    const DOCTRINE_ID = null; // e.g., "torts_negligence" | "criminal_law" | "conlaw"

    /*******************************
     * STORAGE KEYS (fail-safe)
     *******************************/
    const KEY_HISTORY = "ldt_history";        // array of { fromId, fromLabel, choice, toId, toLabel }
    const KEY_LAST_ROUTE = "ldt_last_route";  // { fromId, choice, toId }
    const KEY_SESSION_ID = "ldt_session_id";  // random UUID-like token per session

    const __memStore = Object.create(null);

    function storageGet(key) {
      try { return sessionStorage.getItem(key); }
      catch { return __memStore[key] ?? null; }
    }
    function storageSet(key, value) {
      try { sessionStorage.setItem(key, value); }
      catch { __memStore[key] = value; }
    }
    function storageRemove(key) {
      try { sessionStorage.removeItem(key); }
      catch { delete __memStore[key]; }
    }

    function loadJSON(key, fallback) {
      try {
        const raw = storageGet(key);
        if (raw == null) return fallback;
        return JSON.parse(raw);
      } catch {
        return fallback;
      }
    }
    function saveJSON(key, value) {
      try { storageSet(key, JSON.stringify(value)); }
      catch { /* ignore */ }
    }

    function loadHistory() { return loadJSON(KEY_HISTORY, []); }
    function saveHistory(hist) { saveJSON(KEY_HISTORY, hist); }

    function setLastRoute(route) { saveJSON(KEY_LAST_ROUTE, route); }
    function getLastRoute() { return loadJSON(KEY_LAST_ROUTE, null); }

    function escapeHtml(s) {
      return String(s).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;");
    }

    function makeSessionId() {
      // Lightweight UUID-ish generator (no crypto dependency)
      const rnd = () => Math.random().toString(16).slice(2);
      return `${Date.now().toString(16)}-${rnd()}-${rnd()}`;
    }

    function getSessionId() {
      const existing = storageGet(KEY_SESSION_ID);
      if (existing) return existing;
      const sid = makeSessionId();
      storageSet(KEY_SESSION_ID, sid);
      return sid;
    }

    /*******************************
     * MERMAID + REVEAL INIT
     *******************************/
    mermaid.initialize({ startOnLoad: false, securityLevel: "loose" });

    const deck = new Reveal({
      hash: true,
      plugins: [ RevealNotes ]
    });

    deck.initialize().then(() => {
      getSessionId(); // ensure session id exists early
      renderMermaidVisible();
      updateUIForSlide(deck.getCurrentSlide());
      renderBreadcrumbs();
      applyAutoHighlight(deck.getCurrentSlide());
      if (deck.getCurrentSlide()?.id === "SUMMARY") renderSummary();
    });

    deck.on("slidechanged", (ev) => {
      renderMermaidVisible();
      updateUIForSlide(ev.currentSlide);
      renderBreadcrumbs();
      applyAutoHighlight(ev.currentSlide);
      if (ev.currentSlide?.id === "SUMMARY") renderSummary();
    });

    function renderMermaidVisible() {
      const slide = deck.getCurrentSlide();
      if (!slide) return;

      const blocks = slide.querySelectorAll("pre.mermaid:not([data-rendered='true'])");
      blocks.forEach(async (block) => {
        const code = block.textContent;
        const id = "mmd_" + Math.random().toString(16).slice(2);

        try {
          const { svg } = await mermaid.render(id, code);
          const container = document.createElement("div");
          container.innerHTML = svg;
          block.replaceWith(container);
          container.setAttribute("data-rendered", "true");
        } catch (e) {
          console.error("Mermaid render error:", e);
        }
      });
    }

    /*******************************
     * CONTROLS (Y/N + Back + Summary)
     *******************************/
    const btnYes = document.getElementById("btnYes");
    const btnNo  = document.getElementById("btnNo");
    const btnBack = document.getElementById("btnBack");
    const btnSummary = document.getElementById("btnSummary");

    btnYes.addEventListener("click", () => route("yes"));
    btnNo.addEventListener("click", () => route("no"));
    btnBack.addEventListener("click", () => goBackToLastDecision());
    btnSummary.addEventListener("click", () => gotoSummary());

    document.addEventListener("keydown", (ev) => {
      const k = ev.key.toLowerCase();
      if (k === "y") { ev.preventDefault(); route("yes"); }
      if (k === "n") { ev.preventDefault(); route("no"); }
      if (k === "b") { ev.preventDefault(); goBackToLastDecision(); }
      if (k === "s") { ev.preventDefault(); gotoSummary(); }
    }, true);

    function gotoSummary() {
      window.location.hash = "#/SUMMARY";
    }

    function isDecisionSlide(slide) {
      if (!slide) return false;
      if (slide.dataset.ynDisabled === "true") return false;
      return !!(slide.dataset.yes && slide.dataset.no);
    }

    function updateUIForSlide(slide) {
      const decision = isDecisionSlide(slide);
      btnYes.disabled = !decision;
      btnNo.disabled  = !decision;
      btnBack.disabled = loadHistory().length === 0;
    }

    function getSlideLabelById(id) {
      const el = document.getElementById(id);
      if (!el) return id;
      return el.dataset.label || id;
    }

    function route(choice) {
      const slide = deck.getCurrentSlide();
      if (!isDecisionSlide(slide)) return;

      const fromId = slide.id;
      const fromLabel = slide.dataset.label || fromId;

      const toId = (choice === "yes") ? slide.dataset.yes : slide.dataset.no;
      if (!toId || !document.getElementById(toId)) return;

      const toLabel = getSlideLabelById(toId);

      const hist = loadHistory();
      hist.push({ fromId, fromLabel, choice, toId, toLabel });
      saveHistory(hist);

      setLastRoute({ fromId, choice, toId });

      window.location.hash = "#/" + toId;
    }

    /*******************************
     * BREADCRUMBS
     *******************************/
    function renderBreadcrumbs() {
      const bc = document.getElementById("breadcrumbs");
      const hist = loadHistory();

      bc.innerHTML = "";

      const title = document.createElement("span");
      title.style.fontWeight = "600";
      title.textContent = "Path:";
      bc.appendChild(title);

      if (hist.length === 0) {
        const empty = document.createElement("span");
        empty.style.opacity = "0.7";
        empty.style.marginLeft = "0.5rem";
        empty.textContent = "—";
        bc.appendChild(empty);
        return;
      }

      hist.forEach((h) => {
        const pill = document.createElement("span");
        pill.className = "crumb";
        pill.textContent = h.fromLabel;

        const ch = document.createElement("span");
        ch.className = "choice";
        ch.textContent = (h.choice === "yes") ? "Y" : "N";
        pill.appendChild(ch);

        bc.appendChild(pill);
      });
    }

    /*******************************
     * BACK
     *******************************/
    function goBackToLastDecision() {
      const hist = loadHistory();
      if (hist.length === 0) return;

      const last = hist.pop();
      saveHistory(hist);
      storageRemove(KEY_LAST_ROUTE);

      if (last?.fromId && document.getElementById(last.fromId)) {
        window.location.hash = "#/" + last.fromId;
      }

      renderBreadcrumbs();
      btnBack.disabled = hist.length === 0;
    }

    /*******************************
     * AUTO-HIGHLIGHT CHOSEN BRANCH
     *******************************/
    function applyAutoHighlight(slide) {
      if (!slide) return;

      slide.classList.remove("chosen-yes", "chosen-no");

      const route = getLastRoute();
      if (!route) return;
      if (route.toId !== slide.id) return;

      if (route.choice === "yes") slide.classList.add("chosen-yes");
      if (route.choice === "no")  slide.classList.add("chosen-no");
    }

    /*******************************
     * SUMMARY + SUBMISSION EXPORT
     *******************************/
    function computeReachedOutcome() {
      const current = deck.getCurrentSlide();
      if (current?.dataset?.outcome === "true") return current;

      const hist = loadHistory();
      if (hist.length === 0) return null;

      const last = hist[hist.length - 1];
      const candidate = document.getElementById(last.toId);
      if (candidate?.dataset?.outcome === "true") return candidate;

      return null;
    }

    function inferDoctrineIdFromHistory(hist) {
      if (DOCTRINE_ID) return DOCTRINE_ID;
      if (!hist || hist.length === 0) return "mixed";

      const first = hist[0]?.fromId || "";
      if (first.startsWith("TORT_")) return "torts_negligence";
      if (first.startsWith("CRIM_")) return "criminal_law";
      if (first.startsWith("CON_"))  return "constitutional_law";
      return "mixed";
    }

    function getStaticFeedbackForDecisionSlide(fromId) {
      const el = document.getElementById(fromId);
      return el?.dataset?.feedback ?? "";
    }

    function renderSummary() {
      const hist = loadHistory();
      const outcomeEl = document.getElementById("summaryOutcome");
      const pathEl = document.getElementById("summaryPath");
      const metaEl = document.getElementById("summaryMeta");

      const doctrineId = inferDoctrineIdFromHistory(hist);
      const sessionId = getSessionId();

      metaEl.innerHTML = `
        <div class="muted">
          <strong>Scenario:</strong> <span class="mono">${escapeHtml(SCENARIO_ID)}</span>
          &nbsp;&nbsp; <strong>Doctrine:</strong> <span class="mono">${escapeHtml(doctrineId)}</span>
          &nbsp;&nbsp; <strong>Session:</strong> <span class="mono">${escapeHtml(sessionId)}</span>
        </div>
      `;

      const outcomeSlide = computeReachedOutcome();
      const outcomeText =
        outcomeSlide?.dataset?.outcomeText ||
        outcomeSlide?.querySelector("p")?.textContent ||
        null;

      outcomeEl.innerHTML = outcomeText
        ? `<div><strong>Outcome:</strong> ${escapeHtml(outcomeText)}</div>`
        : `<div class="muted"><strong>Outcome:</strong> In progress (no terminal outcome reached yet).</div>`;

      if (hist.length === 0) {
        pathEl.innerHTML = `<p class="muted">No decisions recorded yet. Navigate to a decision slide and press Y/N.</p>`;
      } else {
        const rows = hist.map((h, idx) => {
          const note = getStaticFeedbackForDecisionSlide(h.fromId);
          return `
            <tr>
              <td>${idx + 1}</td>
              <td>${escapeHtml(h.fromLabel || h.fromId)}</td>
              <td>${h.choice === "yes" ? "Y" : "N"}</td>
              <td>${escapeHtml(h.toLabel || h.toId)}</td>
              <td>${escapeHtml(note)}</td>
            </tr>`;
        }).join("");

        pathEl.innerHTML = `
          <table class="summary-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Decision</th>
                <th>Choice</th>
                <th>Next</th>
                <th>Instructor explanation</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>`;
      }

      // Wire buttons once
      const dl = document.getElementById("btnDownload");
      if (dl && dl.dataset.wired !== "true") {
        dl.dataset.wired = "true";
        dl.addEventListener("click", downloadSubmissionJSON);
      }
      const reset = document.getElementById("btnReset");
      if (reset && reset.dataset.wired !== "true") {
        reset.dataset.wired = "true";
        reset.addEventListener("click", resetSession);
      }
    }

    function buildSubmissionPayload() {
      const hist = loadHistory();
      const doctrineId = inferDoctrineIdFromHistory(hist);
      const outcomeSlide = computeReachedOutcome();

      return {
        scenarioId: SCENARIO_ID,
        doctrineId,
        sessionId: getSessionId(),
        completedAt: new Date().toISOString(),
        outcome: outcomeSlide ? {
          id: outcomeSlide.id,
          label: outcomeSlide.dataset.label || outcomeSlide.id,
          text: outcomeSlide.dataset.outcomeText || outcomeSlide.querySelector("p")?.textContent || ""
        } : null,
        history: hist
      };
    }

    function downloadSubmissionJSON() {
      const payload = buildSubmissionPayload();

      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);

      // Filename includes scenario + doctrine + session for easy aggregation
      const safe = (s) => String(s).replaceAll(/[^a-zA-Z0-9._-]/g, "_");
      a.download = `submission_${safe(payload.scenarioId)}_${safe(payload.doctrineId)}_${safe(payload.sessionId)}.json`;

      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 500);
    }

    function resetSession() {
      storageRemove(KEY_HISTORY);
      storageRemove(KEY_LAST_ROUTE);
      // keep session id stable unless you want a new one each attempt; comment out next line to keep stable
      // storageRemove(KEY_SESSION_ID);

      renderBreadcrumbs();
      renderSummary();
      updateUIForSlide(deck.getCurrentSlide());
    }
