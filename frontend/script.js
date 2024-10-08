import refreshDatabase from "./refreshDatabase.js";
import { hideAddPointsScreen } from "./containers/addPoints.js";
import { showAddRowContainer, hideAddRowContainer } from "./containers/addRow.js";
import { showDeleteRowContainer, hideDeleteRowContainer } from "./containers/deleteRow.js";

const app = new SvelteToast({
	target: document.body,
});

refreshDatabase();
hideAddPointsScreen();
hideAddRowContainer();
hideDeleteRowContainer();

const buttonRefreshDatabase = document.getElementById("button-refresh-database");
buttonRefreshDatabase.addEventListener("click", refreshDatabase);

const buttonAddRow = document.getElementById("button-add-row");
buttonAddRow.addEventListener("click", () => { showAddRowContainer(); });

const buttonDeleteRow = document.getElementById("button-delete-row");
buttonDeleteRow.addEventListener("click", () => { showDeleteRowContainer(); });

document.addEventListener("keydown", (ev) => {
	if (ev.key === "Escape") {
		hideAddPointsScreen();
		hideAddRowContainer();
		hideDeleteRowContainer();
	}
});
