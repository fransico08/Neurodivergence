// Hàm dùng chung cho browser và server; nhận diện từ khóa theo trọn từ.
export function norm(s) {
  return (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/[^a-z0-9\s-]/g, ' ').replace(/\s+/g, ' ').trim();
}
export function hasKeyword(text, keyword) {
  const k = norm(keyword);
  if (!k) return false;
  const escaped = k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`(^| )${escaped}( |$)`).test(norm(text));
}
