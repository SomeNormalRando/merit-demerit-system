import { errorToast } from "../config.js";
import refreshDatabase from "../refreshDatabase.js";

const deleteRowScreen = document.getElementById("delete-row-screen");
const inputDeleteRowID = document.getElementById("input-delete-row-id");

const buttonSubmitDeleteRow = document.getElementById("button-submit-delete-row");

export const showDeleteRowContainer = () => { deleteRowScreen.style.display = "block"; };
export const hideDeleteRowContainer = () => {
	deleteRowScreen.style.display = "none";
	inputDeleteRowID.value = "";
};

buttonSubmitDeleteRow.addEventListener("click", () => {
	const rowID = inputDeleteRowID.value;

	if (!rowID) {
		errorToast("Row ID cannot be empty.");
		return;
	}

	const url = new URL("delete-row", window.location);
	url.search = `id=${rowID}`;

	fetch(url, { method: "DELETE" }).then(() => {
		refreshDatabase();

		hideDeleteRowContainer();
	});
});
