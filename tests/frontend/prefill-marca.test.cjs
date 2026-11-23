const { test } = require("node:test");
const assert = require("node:assert/strict");
require("../../app/web/static/prefill-marca.js");
const { parseMarca, prefill } = globalThis.zePrefillMarca;
const doc = (value = "", found = true) => {
  const el = { value, dispatchEvent() {} };
  return { el, querySelector: () => (found ? el : null) };
};
test("simples", () => assert.equal(parseMarca("?marca=Padaria"), "Padaria"));
test("espaços (+ e %20)", () => {
  assert.equal(parseMarca("?marca=Padaria+Teste"), "Padaria Teste");
  assert.equal(parseMarca("?marca=%20Padaria%20%20Teste%20"), "Padaria Teste");
});
test("acentos", () => assert.equal(parseMarca("?marca=Caf%C3%A9+S%C3%A3o+Jo%C3%A3o"), "Café São João"));
test("vazio/ausente", () => {
  assert.equal(parseMarca("?marca="), null);
  assert.equal(parseMarca(""), null);
  assert.equal(parseMarca("?marca=+"), null);
  assert.equal(parseMarca("?outro=x"), null);
});
test("malformado não quebra", () => {
  assert.doesNotThrow(() => parseMarca("?marca=%E0%A4%A"));
  assert.equal(parseMarca("?marca=a%00b%0Ac"), "abc");
});
test("limites 2..200", () => {
  assert.equal(parseMarca("?marca=x"), null);
  assert.equal(parseMarca("?marca=" + "x".repeat(201)), null);
  assert.equal(parseMarca("?marca=" + "x".repeat(200)).length, 200);
});
test("HTML fica como texto", () =>
  assert.equal(parseMarca("?marca=%3Cb%3Eoi%3C%2Fb%3E"), "<b>oi</b>"));
test("não sobrescreve o que foi digitado", () => {
  const d = doc("Já digitado");
  assert.equal(prefill(d, "?marca=Outra"), false);
  assert.equal(d.el.value, "Já digitado");
});
test("preenche campo vazio", () => {
  const d = doc();
  assert.equal(prefill(d, "?marca=Padaria+Teste"), true);
  assert.equal(d.el.value, "Padaria Teste");
});
test("sem campo na página não falha", () =>
  assert.equal(prefill(doc("", false), "?marca=Padaria"), false));
