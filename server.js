import sqlite3 from "sqlite3";
import { open } from "sqlite";

import express from "express";
import morgan from "morgan";

import { DATABASE_FILE_PATH, SERVER_HOST, SERVER_PORT } from "./config.js";

// eslint-disable-next-line no-console
const logInfo = (...args) => console.log(...args);
// eslint-disable-next-line no-console
const logError = (...args) => console.error(...args);

const app = express();
app.use(morgan("dev"));
app.use(express.static("./frontend/"));
app.use(express.static("./node_modules/@zerodevx/"));

open({ filename: DATABASE_FILE_PATH, driver: sqlite3.Database }).then(async (db) => {
	// await db.run("UPDATE prefects SET merit_points = 2 WHERE id = 1");

	// await db.run("INSERT INTO prefects (name, class_2024) VALUES ('Jane Smith', '3A')");
	app.get("/database", async (req, res) => {
		const queryResult = await db.all("SELECT * FROM prefects");

		const response = {
			timestamp: Date.now(),
			database: queryResult,
		};

		res.send(response);
	});
	app.post("/add-row", async (req, res) => {
		const { name, class: class2024 } = req.query;

		try {
			await db.run(
				`INSERT INTO prefects (name, class_2024) VALUES ('${name}', '${class2024}')`
			);
		} catch (err) {
			logError(err);
		}

		res.statusCode = 201;
		res.send();
	});
	app.delete("/delete-row", async (req, res) => {
		const { id } = req.query;

		const query = `DELETE FROM prefects WHERE id = ${id}`;
		await db.run(query);

		res.statusCode = 200;
		res.send();
	});
	app.post("/add-:meritOrDemerit-points", async (req, res) => {
		// from URL
		const { meritOrDemerit } = req.params;
		if (meritOrDemerit !== "merit" && meritOrDemerit !== "demerit") return;

		const pointsType = `${meritOrDemerit}_points`;

		const { id, points } = req.query;
		// query returns an object like { merit_points: 1 }
		const curPointsObj = await db.get(`SELECT ${pointsType} FROM prefects WHERE id = ${id}`);

		const newPoints = parseInt(curPointsObj[pointsType], 10) + parseInt(points, 10);

		const query = `UPDATE prefects SET ${pointsType} = ${newPoints} WHERE id = ${id}`;
		await db.run(query);

		res.statusCode = 201;
		res.send();
	});

	app.listen({ host: SERVER_HOST, port: SERVER_PORT });
	logInfo(`server listening at http://${SERVER_HOST}:${SERVER_PORT}`);
}).catch(logError);
