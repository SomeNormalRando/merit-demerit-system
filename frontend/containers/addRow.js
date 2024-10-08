import { errorToast } from "../config.js";
import refreshDatabase from "../refreshDatabase.js";

const addRowScreen = document.getElementById("add-row-screen");
const inputAddRowName = document.getElementById("input-add-row-name");
const inputAddRowClass = document.getElementById("input-add-row-class");

const buttonSubmitAddRow = document.getElementById("button-submit-add-row");

export const showAddRowContainer = () => { addRowScreen.style.display = "block"; };
export const hideAddRowContainer = () => {
	addRowScreen.style.display = "none";
	inputAddRowName.value = "";
	inputAddRowClass.value = "";
};

buttonSubmitAddRow.addEventListener("click", () => {
	const newRowName = inputAddRowName.value;
	const newRowClass = inputAddRowClass.value;

	if (!newRowName) {
		errorToast("Name cannot be empty.");
		return;
	}
	if (!newRowClass) {
		errorToast("Class cannot be empty.");
		return;
	}

	const url = new URL("add-row", window.location);
	url.search = `name=${newRowName}&class=${newRowClass}`;

	fetch(url, { method: "POST" }).then(() => {
		refreshDatabase();

		hideAddRowContainer();
	});
});
