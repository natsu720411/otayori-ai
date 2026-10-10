-- Cloudflare D1 console: create tables before binding AI_RATE_DB
CREATE TABLE IF NOT EXISTS ai_rate_limits (
  bucket TEXT PRIMARY KEY,
  used INTEGER NOT NULL DEFAULT 0 CHECK(used >= 0),
  expires_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_ai_rate_limits_expiry ON ai_rate_limits(expires_at);
