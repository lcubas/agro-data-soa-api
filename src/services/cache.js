// Cache en memoria con TTL simple
class TTLCache {
  constructor(ttlMs = 10 * 60 * 1000) {
    this.ttl = ttlMs;
    this.map = new Map();
  }
  get(key) {
    const v = this.map.get(key);
    if (!v) return null;
    if (Date.now() > v.exp) { this.map.delete(key); return null; }
    return v.val;
  }
  set(key, val) {
    this.map.set(key, { val, exp: Date.now() + this.ttl });
  }
}
module.exports = new TTLCache();
