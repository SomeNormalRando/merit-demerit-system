export const databaseURL = new URL("/database", window.location);
// data will be added to the table according to this order
export const tableOrder = [
	"id",
	"name",
	"class_2024",
	"merit_points",
	"demerit_points",
	"total_points",
];

export const successToast = (msg) => toast.push(msg, {
	theme: {
		"--toastBackground": "green",
		"--toastColor": "white",
		"--toastBarBackground": "white",
	},
});
export const errorToast = (msg) => toast.push(msg, {
	theme: {
		"--toastBackground": "red",
		"--toastColor": "white",
		"--toastBarBackground": "orange",
	},
});
