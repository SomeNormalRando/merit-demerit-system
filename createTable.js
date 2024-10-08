import sqlite3 from "sqlite3";
import { open } from "sqlite";

import { DATABASE_FILE_PATH, CREATE_TABLE_QUERY } from "./config.js";


open({ filename: DATABASE_FILE_PATH, driver: sqlite3.Database }).then(async (db) => {
	await db.run(CREATE_TABLE_QUERY);

	console.log(`created table successfully in ${DATABASE_FILE_PATH}`);
	console.log(`\nexecuted query:\n${CREATE_TABLE_QUERY}`);
}).catch(console.error);
