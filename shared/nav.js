// Užduoties viršutinė juosta: grįžimas į pradinį puslapį, šios užduoties atsakymų eksportas ir įkėlimas.
// Naudojimas: <script src="../shared/nav.js?v=N" data-key="jkm-…" defer></script> – pakeitus šį failą, padidink N visose užduotyse.
// Failo formatas toks pat kaip pradinio puslapio eksporto, todėl jį galima ten įkelti.
(() => {
  const KEY = document.currentScript.dataset.key;

  const style = document.createElement("style");
  style.textContent = `
    .jkm-nav { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; justify-content: space-between; margin: 0 0 12px; }
    .jkm-nav a, .jkm-nav button, .jkm-nav .jkm-file {
      font: inherit; font-size: 14px; border-radius: 10px; border: 1px solid var(--line); background: var(--surface);
      color: var(--ink); padding: 6px 12px; cursor: pointer; text-decoration: none;
    }
    .jkm-nav a:hover, .jkm-nav button:hover, .jkm-nav .jkm-file:hover { border-color: var(--accent); }
    .jkm-nav .jkm-file input { position: absolute; width: 1px; height: 1px; opacity: 0; }
    .jkm-nav .jkm-file:focus-within { outline: 2px solid var(--accent); outline-offset: 2px; }
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
      <label class="jkm-file">Įkelti atsakymus<input type="file" accept=".json,application/json"></label>
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

  // Įkelia tik šios užduoties atsakymus – tinka ir pradinio puslapio viso progreso failas
  nav.querySelector("input[type=file]").addEventListener("change", async e => {
    const f = e.target.files[0];
    e.target.value = "";
    if (!f) return;
    let file;
    try { file = JSON.parse(await f.text()); } catch (err) { file = null; }
    if (!file || file.app !== "jkm-uzduotys" || !file.data || typeof file.data !== "object") {
      msg.textContent = "Tai ne JKM atsakymų failas."; return;
    }
    const value = file.data[KEY];
    if (typeof value !== "string") { msg.textContent = "Šiame faile nėra šios užduoties atsakymų."; return; }
    let current = null;
    try { current = localStorage.getItem(KEY); } catch (err) {}
    if (current !== null && !confirm("Dabartiniai šios užduoties atsakymai bus pakeisti atsakymais iš failo. Tęsti?")) return;
    try { localStorage.setItem(KEY, value); }
    catch (err) { msg.textContent = "Nepavyko įrašyti – gal naršyklėje išjungta saugykla?"; return; }
    location.reload();
  });
})();
