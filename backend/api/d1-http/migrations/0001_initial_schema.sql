CREATE TABLE user (
	id TEXT PRIMARY KEY,
	name TEXT NOT NULL UNIQUE,
	email TEXT NOT NULL UNIQUE,
	email_verified INTEGER NOT NULL DEFAULT 0,
	image TEXT,
	created_at INTEGER NOT NULL,
	updated_at INTEGER NOT NULL,
	role TEXT NOT NULL DEFAULT 'user'
);

CREATE TABLE session (
	id TEXT PRIMARY KEY,
	expires_at INTEGER NOT NULL,
	token TEXT NOT NULL UNIQUE,
	created_at INTEGER NOT NULL,
	updated_at INTEGER NOT NULL,
	ip_address TEXT,
	user_agent TEXT,
	user_id TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE
);
CREATE INDEX session_userId_idx ON session(user_id);

CREATE TABLE account (
	id TEXT PRIMARY KEY,
	account_id TEXT NOT NULL,
	provider_id TEXT NOT NULL,
	user_id TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE,
	access_token TEXT,
	refresh_token TEXT,
	id_token TEXT,
	access_token_expires_at INTEGER,
	refresh_token_expires_at INTEGER,
	scope TEXT,
	password TEXT,
	created_at INTEGER NOT NULL,
	updated_at INTEGER NOT NULL
);
CREATE INDEX account_userId_idx ON account(user_id);

CREATE TABLE verification (
	id TEXT PRIMARY KEY,
	identifier TEXT NOT NULL,
	value TEXT NOT NULL,
	expires_at INTEGER NOT NULL,
	created_at INTEGER NOT NULL,
	updated_at INTEGER NOT NULL
);
CREATE INDEX verification_identifier_idx ON verification(identifier);

CREATE TABLE library (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	user_id TEXT NOT NULL UNIQUE REFERENCES user(id) ON DELETE CASCADE,
	createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE game (
	id INTEGER PRIMARY KEY,
	name TEXT NOT NULL,
	summary TEXT,
	releaseDate TEXT,
	publisher TEXT,
	developer TEXT,
	genre TEXT,
	coverImage TEXT
);

CREATE TABLE library_game (
	library_id INTEGER NOT NULL REFERENCES library(id) ON DELETE CASCADE,
	game_id INTEGER NOT NULL REFERENCES game(id) ON DELETE CASCADE,
	status TEXT NOT NULL DEFAULT 'planned'
		CHECK(status IN ('planned', 'playing', 'completed')),
	addedAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
	playtime INTEGER NOT NULL DEFAULT 0,
	PRIMARY KEY (library_id, game_id)
);
