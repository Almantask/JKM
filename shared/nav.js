// Užduoties viršutinė juosta: grįžimas į pradinį puslapį ir šios užduoties atsakymų eksportas.
// Naudojimas: <script src="../shared/nav.js" data-key="jkm-…" defer></script>
// Failo formatas toks pat kaip pradinio puslapio eksporto, todėl jį galima ten įkelti.
(() => {
  const KEY = document.currentScript.dataset.key;

  const style = document.createElement("style");
  style.textContent = `
    .jkm-nav { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; justify-content: space-between; margin: 0 0 12px; }
    .jkm-nav a, .jkm-nav button {
      font: inherit; font-size: 14px; border-radius: 10px; border: 1px solid var(--line); background: var(--surface);
      color: var(--ink); padding: 6px 12px; cursor: pointer; text-decoration: none;
    }
    .jkm-nav a:hover, .jkm-nav button:hover { border-color: var(--accent); }
    .jkm-nav .jkm-export { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }
    .jkm-nav output { font-size: 13px; color: var(--muted); }
  `;
  document.head.appendChild(style);

  const nav = document.createElement("nav");
  nav.className = "jkm-nav";
  nav.setAttribute("aria-label", "Užduoties meniu");
  nav.innerHTML = `
    <a href="../">← Visos užduotys</a>
    <span class="jkm-export">
      <output role="status"></output>
      <button type="button">Atsisiųsti atsakymus</button>
    </span>`;
  const main = document.querySelector("main");
  main.insertBefore(nav, main.firstChild);

  const msg = nav.querySelector("output");
  nav.querySelector("button").addEventListener("click", () => {
    let value = null;
    try { value = localStorage.getItem(KEY); } catch (e) {}
    if (value === null) { msg.textContent = "Kol kas nėra atsakymų."; return; }
    const date = new Date().toISOString().slice(0, 10);
    const file = { app: "jkm-uzduotys", version: 1, saved: new Date().toISOString(), task: document.title, data: { [KEY]: value } };
    const blob = new Blob([JSON.stringify(file, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${KEY}-${date}.json`;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    msg.textContent = "Išsaugota atsisiuntimų aplanke.";
  });
})();
