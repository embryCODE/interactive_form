// Set focus on input after page load.
$("#name").focus();

// Reveal a text field when the "Other" option is selected from the "Job Role" drop down menu.
$("#title").change(function() {
  if ($(this).val() === "other") {
    var newInputElement = '<input id="other-title" placeholder="Your Title" name="user_other_title">';
    $("#title").after(newInputElement);
  } else {
    $("#other-title").remove(); // Removes newInputElement if other options are selected.
  }
});
