export const SERVER_HOST = "127.0.0.1";
export const SERVER_PORT = 8000;

export const DATABASE_FILE_PATH = "./database.sqlite";

export const CREATE_TABLE_QUERY = `\
CREATE TABLE prefects (
	id INTEGER PRIMARY KEY,
	name TEXT UNIQUE NOT NULL,
	class_2024 TEXT NOT NULL,
	merit_points INTEGER DEFAULT 0,
	demerit_points INTEGER DEFAULT 0,
	total_points INTEGER AS (merit_points - demerit_points)
) STRICT`;
