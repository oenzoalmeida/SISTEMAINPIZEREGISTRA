// prefill-marca.js v1.0.0 — lê ?marca= e preenche #brand-input sem sobrescrever o usuário.
// Não envia nem registra o valor em lugar nenhum.
(function (root) {
  const MIN = 2, MAX = 200; // espelha minlength/maxlength do input

  function parseMarca(search) {
    let raw;
    try { raw = new URLSearchParams(search).get("marca"); } catch { return null; }
    if (typeof raw !== "string") return null;
    const v = raw.normalize("NFC").replace(/[\u0000-\u001F\u007F]/g, "").replace(/\s+/g, " ").trim();
    if (v.length < MIN || v.length > MAX) return null;
    return v;
  }

  function prefill(doc, search) {
    const input = doc.querySelector("#brand-input");
    const v = parseMarca(search);
    if (!input || !v || input.value.trim() !== "") return false;
    input.value = v; // .value = texto puro, sem HTML
    if (typeof Event === "function") {
      input.dispatchEvent(new Event("input", { bubbles: true }));
      input.dispatchEvent(new Event("change", { bubbles: true }));
    }
    return true;
  }

  root.zePrefillMarca = { parseMarca, prefill };
  if (typeof document !== "undefined") {
    const run = () => prefill(document, location.search);
    document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", run) : run();
  }
})(typeof window !== "undefined" ? window : globalThis);
