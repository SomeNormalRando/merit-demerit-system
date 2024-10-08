/* eslint-env browser */

const databaseURL = new URL("/database", window.location);
const dataFormat = new Map()
	.set("id", "ID")
	.set("name", "Name")
	.set("class_2024", "Class")
	.set("merit_points", "Merit points")
	.set("demerit_points", "Demerit points")
	.set("total_points", "Total points");
// column name that will be <th> (header of every row) instead of <td> (like all other columns)
const thColName = "name";

// id in the database of the current row being edited
let currentlyEditingID = -1;

const editPointsContainer = document.getElementById("add-points-container");
const inputAddPointsNumber = document.getElementById("input-add-points-number");

const selectEditingColumn = document.getElementById("select-editing-column");
const editingNameDisplay = document.getElementById("editing-name-display");
const buttonSubmitEdit = document.getElementById("button-submit-edit");

const showAddPointsContainer = () => { editPointsContainer.style.display = "flex"; };
const hideAddPointsContainer = () => {
	editPointsContainer.style.display = "none";
	editingNameDisplay.innerText = "none";
	currentlyEditingID = -1;
	inputAddPointsNumber.value = 1;
};
hideAddPointsContainer();

function populateTableHeader() {
	const thead = document.getElementById("thead");
	const tr = document.createElement("tr");
	for (const [_, colNameFormatted] of dataFormat) {
		const th = document.createElement("th");
		th.scope = "col";
		th.innerText = colNameFormatted;
		tr.appendChild(th);
	}
	// add empty column for edit buttons
	const th = document.createElement("th");
	th.scope = "col";
	tr.appendChild(th);

	thead.appendChild(tr);
}
async function getDatabase() {
	let result = null;
	try {
		const response = await fetch(databaseURL);
		if (!response.ok) throw new Error(`response not ok: status ${response.status}`);

		result = await response.json();
	} catch (error) {
		console.error(error);
	}

	return result;
}
function populateTableContent(databaseResponseObj) {
	const tbody = document.getElementById("tbody");
	while (tbody.firstChild) tbody.removeChild(tbody.lastChild);

	for (const row of databaseResponseObj.database) {
		const tr = document.createElement("tr");
		for (const [colName, _] of dataFormat) {
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
			showAddPointsContainer();

			editingNameDisplay.innerText = row.name;
			currentlyEditingID = row.id;
		});
		td.appendChild(btn);
		tr.appendChild(td);

		tbody.appendChild(tr);
	}

	const date = new Date(databaseResponseObj.timestamp);
	const tableCaption = document.getElementById("table-caption");
	tableCaption.innerText = `database at ${date.toLocaleTimeString("en-US")}`;
}

// populateTableHeader();

const buttonRefreshDatabase = document.getElementById("button-refresh-database");
buttonRefreshDatabase.addEventListener("click", () => {
	getDatabase().then(populateTableContent);
});

buttonRefreshDatabase.dispatchEvent(new Event("click"));

buttonSubmitEdit.addEventListener("click", () => {
	// is either "merit" or "demerit"
	const meritOrDemerit = selectEditingColumn.value;
	const pointsToAdd = parseInt(inputAddPointsNumber.value, 10);

	const url = new URL(`add-${meritOrDemerit}-points`, window.location);
	url.search = `id=${currentlyEditingID}&points=${pointsToAdd}`;

	fetch(url, { method: "POST" }).then(() => {
		buttonRefreshDatabase.dispatchEvent(new Event("click"));

		hideAddPointsContainer();
	});
});


const addNewRowContainer = document.getElementById("add-new-row-container");
const inputNewRowName = document.getElementById("input-new-row-name");
const inputNewRowClass = document.getElementById("input-new-row-class");

const showAddNewRowContainer = () => { addNewRowContainer.style.display = "flex"; };
const hideAddNewRowContainer = () => {
	addNewRowContainer.style.display = "none";
	inputNewRowName.value = "";
	inputNewRowClass.value = "";
};
hideAddNewRowContainer();

const buttonAdd = document.getElementById("button-add-new-row");
buttonAdd.addEventListener("click", () => {
	showAddNewRowContainer();
});

const buttonSubmitAddNewRow = document.getElementById("button-submit-add-new-row");
buttonSubmitAddNewRow.addEventListener("click", () => {
	const newRowName = inputNewRowName.value;
	const newRowClass = inputNewRowClass.value;

	if (!newRowName || !newRowClass) return;

	const url = new URL("add-new-row", window.location);
	url.search = `name=${newRowName}&class=${newRowClass}`;

	fetch(url, { method: "POST" }).then(() => {
		buttonRefreshDatabase.dispatchEvent(new Event("click"));

		hideAddNewRowContainer();
	});
});

document.addEventListener("keydown", (ev) => {
	if (ev.key === "Escape") {
		hideAddPointsContainer();
		hideAddNewRowContainer();
	}
});
