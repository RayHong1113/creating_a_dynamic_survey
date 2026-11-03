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
	//	Prevents the form from navigating away on submit
	e.preventDefault();

	//	Hides all error elements on the page
	hideAllErrors();

	//	Determine if the form has errors
	if (formHasErrors()) {
		return false;
	}

	//	Add validated data to the table and reset the form inputs
	displayData();
	resetFields();

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

	const requiredTextFields = [
		"name",
		"email",
		"username",
		"play-hours",
		"start-date",
		"feedback"
	];

	//	Loop through the required text fields and check to see the user entered a value
	for (const field of requiredTextFields) {
		const textField = document.getElementById(field);

		//	Determine if the user entered text
		if (!formFieldHasInput(textField)) {
			showError(field + "-error", textField);
		}
	}

	//	Validate the email format
	const emailField = document.getElementById("email");
	if (formFieldHasInput(emailField) && !isValidEmail(emailField)) {
		showError("email-error", emailField, true);
	}

	//	Validate the username format using a regular expression
	const usernameField = document.getElementById("username");
	if (
		formFieldHasInput(usernameField) &&
		!isValidRegex(usernameField, /^[a-zA-Z0-9]{4,15}$/)
	) {
		showError("username-error", usernameField, true);
	}

	//	Validate the game genre dropdown selection
	const genreSelect = document.getElementById("game-genre");
	if (!isSelected(genreSelect)) {
		showError("game-genre-error", genreSelect);
	}

	//	Check to ensure the user selected options for radio and checkbox groups
	const choiceGroups = [
		{ name: "gender", errorId: "gender-error" },
		{ name: "favorite-games", errorId: "favorite-games-error" }
	];

	for (const group of choiceGroups) {
		if (!hasCheckedOption(group.name)) {
			showError(group.errorId);
		}
	}

	//	Validate the other game genre field when "Other" is selected
	if (genreSelect.value === "Other") {
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
	if (
		formFieldHasInput(playHoursField) &&
		!isValidNumberRange(playHoursField, 0, 24)
	) {
		showError("play-hours-error", playHoursField, true);
	}

	return errorFlag;
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

/*
 * Validates an email input element using a regular expression.
 *
 * param   emailElement An email input element object
 * return  True if the email format is valid; False otherwise
 */
const isValidEmail = (emailElement) => {
	return isValidRegex(emailElement, /^[^\s@]+@[^\s@]+\.[^\s@]+$/);
};

/*
 * Validates an input element's value against a regular expression pattern.
 *
 * param   inputElement The input element to validate
 * param   pattern      The regular expression pattern to test
 * return  True if the value matches the pattern; False otherwise
 */
const isValidRegex = (inputElement, pattern) => {
	const regex = new RegExp(pattern);
	return regex.test(inputElement.value.trim());
};

/*
 * Determines if a dropdown select element has a non-default option selected.
 *
 * param   selectElement A select element object
 * return  True if an option is selected; False if left at default
 */
const isSelected = (selectElement) => {
	return formFieldHasInput(selectElement);
};

/*
 * Determines if at least one radio button or checkbox with the given
 * name attribute is checked.
 *
 * param   name The name attribute of the radio or checkbox group
 * return  True if at least one option is checked; False otherwise
 */
const hasCheckedOption = (name) => {
	return document.querySelector(`input[name="${name}"]:checked`) !== null;
};

/*
 * Determines if a number input element's value falls within the specified range.
 *
 * param   numberElement The number input element object
 * param   min           Minimum allowed value
 * param   max           Maximum allowed value
 * return  True if the value is a valid number between min and max; False otherwise
 */
const isValidNumberRange = (numberElement, min, max) => {
	const value = Number(numberElement.value);
	return !isNaN(value) && value >= min && value <= max;
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
 * Creates table elements using DOM methods and adds the validated
 * survey data to the table.
 */
const displayData = () => {
	const tbody = document.getElementById("list");

	const nameValue = document.getElementById("name").value.trim();
	const emailValue = document.getElementById("email").value.trim();
	const usernameValue = document.getElementById("username").value.trim();
	const genderValue = document.querySelector('input[name="gender"]:checked').value;

	const genreSelectValue = document.getElementById("game-genre").value;
	const genreValue =
		genreSelectValue === "Other"
			? document.getElementById("game-genre-other-text").value.trim()
			: genreSelectValue;

	const checkedBoxes = document.querySelectorAll('input[name="favorite-games"]:checked');
	const checkedGames = [];

	for (const checkbox of checkedBoxes) {
		if (checkbox.value === "Other") {
			checkedGames.push(document.getElementById("game-other-text").value.trim());
		} else {
			checkedGames.push(checkbox.value);
		}
	}
	const favoriteGamesValue = checkedGames.join(", ");

	const playHoursValue = document.getElementById("play-hours").value.trim();
	const startDateValue = document.getElementById("start-date").value;
	const feedbackValue = document.getElementById("feedback").value.trim();

	const rowValues = [
		nameValue,
		emailValue,
		usernameValue,
		genderValue,
		genreValue,
		favoriteGamesValue,
		playHoursValue,
		startDateValue,
		feedbackValue
	];

	//	Build the row and its tds
	const newTr = document.createElement("tr");

	for (const value of rowValues) {
		const newTd = document.createElement("td");
		newTd.textContent = value;
		newTr.appendChild(newTd);
	}

	//	Append the new tr to the tbody
	tbody.appendChild(newTr);

	document.getElementById("clearbutton").style.display = "block";
	saveListData();
};

/*
 * Clears the data in the table and hides the clear button.
 */
const clearButton = () => {
	const tbody = document.getElementById("list");
	while (tbody.firstChild) {
		tbody.removeChild(tbody.firstChild);
	}

	document.getElementById("clearbutton").style.display = "none";
	localStorage.removeItem("surveyData");
};

/*
 * Resets the form inputs after a successful submission.
 */
const resetFields = () => {
	document.getElementById("survey_form").reset();
	document.getElementById("game-genre-other-wrapper").style.display = "none";
	document.getElementById("game-other-text").style.display = "none";
	document.getElementById("name").focus();
};

/*
 * Saves the data in the table to localStorage.
 */
const saveListData = () => {
	const list = document.getElementById("list");
	localStorage.setItem("surveyData", list.innerHTML);
};

// Add the event listener for the document load
document.addEventListener("DOMContentLoaded", () => {
	//	Check the local storage for existing data
	if (localStorage.getItem("surveyData")) {
		//	Populate the table with the stored data
		document.getElementById("list").innerHTML = localStorage.getItem("surveyData");
		document.getElementById("clearbutton").style.display = "block";
	}

	// Ensure all error messages are hidden on load
	hideAllErrors();

	// Add event listener for the form submit
	document.getElementById("survey_form").addEventListener("submit", validate);

	// Reset the form using the default browser reset
	document.getElementById("survey_form").reset();

	// Add event listener for our custom form reset function
	document.getElementById("survey_form").addEventListener("reset", resetForm);

	// Add event listener for the table clear button
	document.getElementById("clearbutton").addEventListener("click", clearButton);

	// Initialize and add event listeners for the "Other" fields
	toggleGenreOther();
	toggleGameOther();
	document.getElementById("game-genre").addEventListener("change", toggleGenreOther);
	document.getElementById("game-other").addEventListener("change", toggleGameOther);
});
