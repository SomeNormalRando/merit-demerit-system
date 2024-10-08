import { errorToast } from "../config.js";
import refreshDatabase from "../refreshDatabase.js";

const addPointsScreen = document.getElementById("add-points-screen");
const inputAddPointsNumber = document.getElementById("input-add-points-number");

const selectEditingColumn = document.getElementById("select-editing-column");
const editingNameDisplay = document.getElementById("editing-name-display");
const buttonSubmitEdit = document.getElementById("button-submit-edit");

let currentlyEditingID = -1;

export const showAddPointsScreen = (name, id) => {
	addPointsScreen.style.display = "block";

	editingNameDisplay.innerText = name;
	currentlyEditingID = id;
};

export const hideAddPointsScreen = () => {
	addPointsScreen.style.display = "none";
	editingNameDisplay.innerText = "none selected";
	currentlyEditingID = -1;
	inputAddPointsNumber.value = 1;
};

buttonSubmitEdit.addEventListener("click", () => {
	const pointsToAdd = parseInt(inputAddPointsNumber.value, 10);

	if (Number.isNaN(pointsToAdd)) {
		errorToast("Invalid number.");
		return;
	}
	if (pointsToAdd === 0) {
		errorToast("Points cannot be 0.");
		return;
	}

	// is either "merit" or "demerit"
	const meritOrDemerit = selectEditingColumn.value;

	const url = new URL(`add-${meritOrDemerit}-points`, window.location);
	url.search = `id=${currentlyEditingID}&points=${pointsToAdd}`;

	fetch(url, { method: "POST" }).then(() => {
		refreshDatabase();
		hideAddPointsScreen();
	});
});
