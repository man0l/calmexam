-- Waitlist for the CalmExam app launch.
CREATE TABLE IF NOT EXISTS waitlist (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  exam TEXT,
  platform TEXT,
  source TEXT,
  country TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
