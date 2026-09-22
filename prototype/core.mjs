// Hàm dùng chung cho browser và server; dữ liệu domain quyết định định tuyến.
export function norm(s) {
  return (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/[^a-z0-9\s-]/g, ' ').replace(/\s+/g, ' ').trim();
}
export function hasKeyword(text, keyword) {
  const k = norm(keyword);
  if (!k) return false;
  const escaped = k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`(^| )${escaped}( |$)`).test(norm(text));
}
export function extractTicket(text) { return text.match(/\b([A-Za-z]{2,6}-\d{1,5})\b/)?.[1].toUpperCase() || null; }
export const fillTicket = (text, ticket) => text.replace(/\{ticket\}/g, ticket || 'việc được giao');
export function detectIntent(text, data) {
  let best = null;
  for (const intent of data.intents) {
    const hits = intent.keywords.filter(k => hasKeyword(text, k));
    if (hits.length && (!best || hits.length > best.hits.length)) best = {intent, hits};
  }
  return best;
}
