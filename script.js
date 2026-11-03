/*
	Survey Form Validation
	October 29, 2026
	Ray Hong
 */

/*
 * Handles the submit event of the survey form
 *
 * param e  A reference to the submit event
 * return   True if no validation errors; False if the form has
 *          validation errors
 */
const validate = (e) => {
	//	Hides all error elements on the page
	hideAllErrors();

	//	Determine if the form has errors
	if (formHasErrors()) {
		// 	Prevents the form from submitting
		e.preventDefault();
		return false;
	}

	return true;
};

/*
 * Does all the error checking for the form.
 *
 * return   True if an error was found; False if no errors were found
 */
const formHasErrors = () => {
	let errorFlag = false;

	//	Displays an error message and focuses the first invalid field
	const showError = (errorId, fieldElement = null, shouldSelect = false) => {
		document.getElementById(errorId).style.display = "block";

		//	Determine if this is the first error
		if (!errorFlag && fieldElement) {
			fieldElement.focus();
			if (shouldSelect && fieldElement.select) {
				fieldElement.select();
			}
		}

		//	Raise the error flag indicating an error
		errorFlag = true;
	};

	const requiredFields = [
		"email",
		"username",
		"game-genre",
		"play-hours",
		"start-date",
		"feedback"
	];

	//	Loop through the required fields and check to see the user entered a value
	for (const field of requiredFields) {
		const textField = document.getElementById(field);

		//	Determine if the user entered text
		if (!formFieldHasInput(textField)) {
			showError(field + "-error", textField);
		}
	}

	//	Validate fields that require regular expressions
	const regexRules = [
		{ id: "email", pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
		{ id: "username", pattern: /^[a-zA-Z0-9]{4,15}$/ }
	];

	for (const rule of regexRules) {
		const field = document.getElementById(rule.id);
		const regex = new RegExp(rule.pattern);

		if (formFieldHasInput(field) && !regex.test(field.value.trim())) {
			showError(rule.id + "-error", field, true);
		}
	}

	//	Check to ensure the user selected options for radio and checkbox groups
	const choiceGroups = [
		{
			ids: ["gender-male", "gender-female", "gender-other"],
			errorId: "gender-error"
		},
		{
			ids: [
				"game-gac",
				"game-coc",
				"game-loc",
				"game-cc",
				"game-catcraft",
				"game-csgo",
				"game-other"
			],
			errorId: "favorite-games-error"
		}
	];

	for (const group of choiceGroups) {
		const isChecked = group.ids.some((id) => document.getElementById(id).checked);
		if (!isChecked) {
			showError(group.errorId);
		}
	}

	//	Validate the other game genre field when "Other" is selected
	if (document.getElementById("game-genre").value === "Other") {
		const genreOtherInput = document.getElementById("game-genre-other-text");
		if (!formFieldHasInput(genreOtherInput)) {
			showError("game-genre-other-error", genreOtherInput);
		}
	}

	//	Validate the other favorite game field when "Other" checkbox is checked
	if (document.getElementById("game-other").checked) {
		const gameOtherInput = document.getElementById("game-other-text");
		if (!formFieldHasInput(gameOtherInput)) {
			showError("favorite-games-error", gameOtherInput);
		}
	}

	//	Validate the play hours number range (0 - 24)
	const playHoursField = document.getElementById("play-hours");
	const hoursValue = Number(playHoursField.value);
	if (
		formFieldHasInput(playHoursField) &&
		(isNaN(hoursValue) || hoursValue < 0 || hoursValue > 24)
	) {
		showError("play-hours-error", playHoursField, true);
	}

	return errorFlag;
};

/*
 * Resets (hides) all of the error messages on the page.
 */
const hideAllErrors = () => {
	const errorFields = document.getElementsByClassName("error");

	for (const field of errorFields) {
		field.style.display = "none";
	}
};

/*
 * Shows or hides a conditional "Other" text field based on whether
 * the "Other" option is active.
 *
 * param isOtherSelected  True if the "Other" option is selected
 * param containerElement The element to show or hide
 * param inputElement     The text input to clear and focus
 */
const toggleOtherField = (isOtherSelected, containerElement, inputElement) => {
	if (isOtherSelected) {
		//	Ensure the other field is displayed and focused
		containerElement.style.display = "block";
		inputElement.value = "";
		inputElement.focus();
	} else {
		//	Hide the other field when not selected
		containerElement.style.display = "none";
	}
};

/*
 * Handles the change event for the game genre dropdown to show or hide
 * the "Other" specification text field.
 */
const toggleGenreOther = () => {
	const genreSelect = document.getElementById("game-genre");
	const otherWrapper = document.getElementById("game-genre-other-wrapper");
	const otherInput = document.getElementById("game-genre-other-text");

	toggleOtherField(genreSelect.value === "Other", otherWrapper, otherInput);
};

/*
 * Handles the change event for the "Other" favorite game checkbox to
 * show or hide its specification text field.
 */
const toggleGameOther = () => {
	const gameOtherCheckbox = document.getElementById("game-other");
	const gameOtherInput = document.getElementById("game-other-text");

	toggleOtherField(gameOtherCheckbox.checked, gameOtherInput, gameOtherInput);
};

/*
 * Handles the reset event for the form.
 *
 * param e A reference to the reset event
 * return  True allows the reset to happen; False prevents
 *         the browser from resetting the form.
 */
const resetForm = (e) => {
	// Confirm that the user wants to reset the form.
	if (confirm("Clear survey?")) {
		// Ensure all error fields are hidden
		hideAllErrors();

		// Hide the conditional other fields
		document.getElementById("game-genre-other-wrapper").style.display = "none";
		document.getElementById("game-other-text").style.display = "none";

		// Set focus to the first text field on the page
		document.getElementById("name").focus();

		// When using onReset="resetForm()" in markup, returning true will allow
		// the form to reset
		return true;
	}

	// Prevents the form from resetting
	e.preventDefault();

	// When using onReset="resetForm()" in markup, returning false would prevent
	// the form from resetting
	return false;
};

/*
 * Determines if a text field element has input
 *
 * param   fieldElement A text field input element object
 * return  True if the field contains input; False if nothing entered
 */
const formFieldHasInput = (fieldElement) => {
	// Check if the text field has a value
	if (fieldElement.value == null || fieldElement.value.trim() == "") {
		// Invalid entry
		return false;
	}

	// Valid entry
	return true;
};

// Add the event listener for the document load
document.addEventListener("DOMContentLoaded", () => {
	// Ensure all error messages are hidden on load
	hideAllErrors();

	// Add event listener for the form submit
	document.getElementById("survey_form").addEventListener("submit", validate);

	// Reset the form using the default browser reset
	// This is done to ensure the radio buttons are unchecked when the page is refreshed
	// This line of code must be done before attaching the event listener for the customer reset
	document.getElementById("survey_form").reset();

	// Add event listener for our custom form reset function
	document.getElementById("survey_form").addEventListener("reset", resetForm);

	// Initialize and add event listeners for the "Other" fields
	toggleGenreOther();
	toggleGameOther();
	document.getElementById("game-genre").addEventListener("change", toggleGenreOther);
	document.getElementById("game-other").addEventListener("change", toggleGameOther);
});
