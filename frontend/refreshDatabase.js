import { showAddPointsScreen } from "./containers/addPoints.js";
import { databaseURL, tableOrder, successToast, errorToast } from "./config.js";

// column name that will be <th> (header of every row) instead of <td> (like all other columns)
const thColName = "name";
async function getDatabase() {
	let result = null;
	try {
		const response = await fetch(databaseURL);
		if (!response.ok) throw new Error(`response not ok: status ${response.status}`);

		result = await response.json();
	} catch (error) {
		console.error(error);
		errorToast(`Error while fetching database: ${error}`);
	}

	return result;
}

function populateTableContent(databaseObj) {
	const tbody = document.getElementById("tbody");
	while (tbody.firstChild) tbody.removeChild(tbody.lastChild);

	for (const row of databaseObj) {
		const tr = document.createElement("tr");
		for (const colName of tableOrder) {
			// if this column name is the header (as in thColName), use <th> instead of <td>
			const el = document.createElement(colName === thColName ? "th" : "td");
			el.classList.add(`t-${colName}`);
			el.innerText = row[colName];
			tr.appendChild(el);
		}

		// add edit button
		const td = document.createElement("td");
		td.classList.add("cell-button-edit");
		const btn = document.createElement("button");
		btn.innerText = "edit";
		// eslint-disable-next-line no-loop-func
		btn.addEventListener("click", () => {
			showAddPointsScreen(row.name, row.id);
		});
		td.appendChild(btn);
		tr.appendChild(td);

		tbody.appendChild(tr);
	}
}

export default async function refreshDatabase() {
	const { database, timestamp } = await getDatabase();

	populateTableContent(database);

	successToast("Refreshed database.");

	const date = new Date(timestamp);
	const tableCaption = document.getElementById("table-caption");
	tableCaption.innerText = `database at ${date.toLocaleTimeString("en-US")}`;
}
