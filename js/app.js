////////// Interactive Form //////////
//
// Author: Mason Embry
// Created 9/23/2016
// Last Updated: 9/25/2016
//
// Tested in current versions of Chrome, Safari, and Firefox.
//
//////////////////////////////////////



////////// Job Role //////////

// Hide #other-title when javascript is enabled.
$("#other-title").hide();

// Reveal a text field when "Other" option is selected from the "Job Role" drop down menu.
$("#title").change(function() {
    if ($(this).val() === "other") {
        $("#other-title").show();
    } else {
        $("#other-title").hide();
    }
});



////////// T-shirt Info //////////

// Only display the options that match the design selected in the "Design" menu.

// Set appropriate t-shirt dropdown menu.
var setTshirtMenus = function() {
    // First, hide all t-shirt color options within the #colors select menu.
    $("#color option").hide();

    // Show the #colors select menu until hidden.
    $("#colors").show();

    // Show certain color options, using classes, depending on the #design value chosen.
    if ($("#design").val() === "js puns") {
        $(".js-puns").show();
        // This line is required to make the #color menu display the first selection.
        $(".js-puns").eq(0).prop("selected", true);
    } else if ($("#design").val() === "heart js") {
        $(".heart-js").show();
        $(".heart-js").eq(0).prop("selected", true);
    } else {
        $("#colors").hide();
    }
};

// Bind event handler to "Design:" dropdown.
$("#design").change(function() {
    setTshirtMenus();
});

// Call function to set correct t-shirt options on page load.
setTshirtMenus();



////////// Register for Activities //////////

// Use regular expression to extract date and time from .activites label.
var getActivityData = function (activityToCheck) {
    // Extract day and time between "–" and "," characters.
    var dayAndTime = activityToCheck.text().match(/—\s(.*),/);

    // Check if result of previous expression was null.
    if (dayAndTime) {
        // If not null, convert dayAndTime from array to string using index 1 as the value.
        dayAndTime = dayAndTime[1];
    }

    return dayAndTime;
};

// Check for schedule conflicts between checked items.
var checkScheduleConflicts = function (clickedItem) {
    // Find day and time of clicked item.
    var clickedItemSchedule = getActivityData(clickedItem);

    var itemToDisable; // For keeping track of item to be disabled.
    var itemToEnable; // For keeping track of item to be enabled.

    // Get all items except the item clicked.
    var itemsToCheck = clickedItem.siblings("label");

    // Loop through itemsToCheck and check for conflicts with clickedItemSchedule.
    itemsToCheck.each(function () {
        // Find day and time of current item in loop.
        var thisItemSchedule = getActivityData($(this));

        // Select checkbox of clicked item.
        var checkbox = clickedItem.children();

        // Check each item in loop for conflict.
        // If conflict found, store in itemToDisable if checking the box and,
        // store in itemToEnable if unchecking the box.
        if ((thisItemSchedule === clickedItemSchedule) && (checkbox.prop("checked"))) {
            itemToDisable = $(this);
        } else if ((thisItemSchedule === clickedItemSchedule) && (!checkbox.prop("checked"))){
            itemToEnable = $(this);
        }
    });

    // Pass items to be disabled or enabled to displayScheduleConflicts().
    displayScheduleConflicts(itemToDisable, itemToEnable);
};

// Display the results of checkScheduleConflicts().
var displayScheduleConflicts = function (disable, enable) {

    // Disable or enable based on argument passed in to function.
    if (disable) {
        disable.children().prop("disabled", true);
        disable.addClass("disabled");
    }
    if (enable) {
        enable.children().prop("disabled", false);
        enable.removeClass("disabled");
    }
};

// Use regular expression to extract price from .activites label.
var returnPrice = function (inputElementToCheck) {

    // RegEx to search for a price value that starts with "$".
    var priceRegEx = /\$\d+(\.\d{1,2})?/;

    // Search element in parameter for match with RegEx.
    var price = inputElementToCheck.text().match(priceRegEx);

    // Retrieve price only (index 0) from the array.
    price = price[0];

    // Remove dollar sign from front of price.
    price = price.replace(/[^0-9\.]+/g,"");

    // Convert price string to float.
    price = parseFloat(price);

    return price;
};

// Add or subtract price from totalPrice.
var totalPrice = 0;
var addToTotal = function (price) {
    totalPrice += price;
};
var subtractFromTotal = function (price) {
    totalPrice -= price;
};

// Append total price on activites div.
var writeTotalPrice = function () {

    // First remove totalPrice h4 if it exists.
    $(".total-price").remove();

    // Only append total price if price is greater than 0.
    if (totalPrice > 0) {
        $(".activities").append("<h4 class='total-price'>Total: $" + totalPrice + "</h4>");
    }
};

// Update total price with price of checked or unchecked element.
var updatePrice = function (clickedItem) {

    // Get price of clicked item.
    var price = returnPrice(clickedItem);

    // Get child of clickedItem, which is the actual checkbox.
    var inputToCheck = clickedItem.children();

    // Call addToTotal or subtractFromTotal depending on whether checkbox has been checked or unchecked.
    if (inputToCheck.prop('checked')) {
        addToTotal(price);
    } else {
        subtractFromTotal(price);
    }

    writeTotalPrice();
};

// Update price and check for schedule conflicts on each change of checkbox.
$(".activities label").change(function () {
    updatePrice($(this));
    checkScheduleConflicts($(this));
});



////////// Payment Info //////////

// Make "Credit Card" the selected option in dropdown and disable the "Select Payment Method" option.
$("[value='credit card']").prop("selected", true);
$("[value='select_method']").prop("disabled", true);

// Hide all then show selected payment info passed in as an argument.
var hideShowPaymentInfo = function (classToShow) {
    $(".credit-card, .paypal, .bitcoin").hide();
    $(classToShow).show();
};

// Select which payment type to show and pass to hideShowPaymentInfo().
var selectPaymentToShow = function(selectedOption) {
    var classToPassIn;

    // Had to use an if/else here because of the space in "credit card".
    if (selectedOption === "credit card") {
        classToPassIn = ".credit-card";
    } else {
        classToPassIn = "." + selectedOption;
    }

    hideShowPaymentInfo(classToPassIn);
};

// Hide bitcoin and paypal on page load.
hideShowPaymentInfo(".credit-card");

// Event listener to pass selected value to selectPaymentToShow().
$("#payment").change(function() {
    selectPaymentToShow($(this).val());
});



////////// Form Validation //////////

// Create all DOM elements to be added.
var $nameError = $("<span class='invalid name-error'> (please provide your name)</span>");
var $emailError = $("<span class='invalid email-error'> (please provide a valid email address)</span>");
var $tshirtError = $("<p class='invalid tshirt-error'>Don't forget to pick a T-shirt</p>");
var $activitiesError = $("<p class='invalid activities-error'>(please choose at least one activity)</p>");
var $paymentError = $("<p class='invalid payment-error'>(please choose your payment method)</p>");

// Email validation.
var validateEmail = function () {

    // Get email text from input.
    var enteredEmail = $("#mail").val();

    // Store email validation RegEx in variable.
    var validEmailRegEx = (/^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i);

    // Returns true if enteredEmail matches email validation RegEx.
    return validEmailRegEx.test(enteredEmail);
};

// Credit card validation with the Luhn formula.
var validateCC = function (cardNumber) {

    // Create an array with each digit of number.
    var cardNumberArray = (cardNumber).toString(10).split("").map(Number);

    // Drop the last digit and store in lastDigit.
    var lastDigit = cardNumberArray.pop();

    // Reverse the numbers.
    cardNumberArray = cardNumberArray.reverse();

    // If number is in an odd position, multiply by 2.
    for(var i = 0; i < cardNumberArray.length; i++) {
        if ((i % 2) === 0) {
            cardNumberArray[i] = cardNumberArray[i] * 2;
        }
    }

    // Subtract 9 from numbers over 9.
    for(i = 0; i < cardNumberArray.length; i++) {
        if (cardNumberArray[i] > 9) {
            cardNumberArray[i] = cardNumberArray[i] - 9;
        }
    }

    // Add all numbers.
    var added = 0;
    for (i = 0; i < cardNumberArray.length; i++) {
        added += cardNumberArray[i];
    }

    // Add total to lastDigit. Mod 10 should return 0. Returns true or false.
    return ((added + lastDigit) % 10 === 0);
};

// Validates all fields and returns true or false.
var validate = function () {
    var valid = true; // Make false if any validation fails.

    // Test all fields and call errorStatus() for each.

    // Name.
    if ($("#name").val().length > 0) {
        errorStatus("nameValid");
    } else {
        errorStatus("nameInvalid");
        valid = false;
    }

    // Email. Run validateEmail function to determine true or false.
    if (validateEmail()) {
        errorStatus("emailValid");
    } else {
        errorStatus('emailInvalid');
        valid = false;
    }

    // T-shirt. Return true if either T-shirt option is selected.
    if ($('#design option[value="js puns"]').is(':selected') ||
        $('#design option[value="heart js"]').is(':selected')) {

        errorStatus("tshirtValid");
    } else {
        errorStatus('tshirtInvalid');
        valid = false;
    }

    // Activities. Return true if one or more inputs is checked.
    if ($(".activities input").is(':checked')) {
        errorStatus("activitiesValid");
    } else {
        errorStatus('activitiesInvalid');
        valid = false;
    }

    // Credit Card Number. Run validateCC() to determine true or false.
    if (validateCC(parseInt($("#cc-num").val()))) {
        errorStatus("cardNumberValid");
    } else {
        errorStatus('cardNumberInvalid');
        valid = false;
    }

    // Credit Card Zip. Return true if zip length is 5 and is a number.
    if (($("#zip").val().length === 5) && !isNaN(parseInt($("#zip").val()))) {
        errorStatus("cardZipValid");
    } else {
        errorStatus('cardZipInvalid');
        valid = false;
    }

    // Credit Card CVV. Return true if CVV length is 3 and is a number.
    if (($("#cvv").val().length === 3) && !isNaN(parseInt($("#cvv").val()))) {
        errorStatus("cardCVVValid");
    } else {
        errorStatus('cardCVVInvalid');
        valid = false;
    }

    // Marks credit card info as valid if paypal or bitcoin are selected as payment option.
    if ($("option[value='paypal']").is(':selected') || $("option[value='bitcoin']").is(':selected')) {
        errorStatus("cardNumberValid");
        errorStatus("cardZipValid");
        errorStatus("cardCVVValid");
        valid = true;
    }

    // Submit form if valid.
    if (valid) {
        // If this was a real form I would submit the form like this.
        // $("form").submit();

        // Fake submit.
        $(".submitted").remove(); // Deletes first in case submit button clicked more than once.
        $("header").append("<p class='submitted'>Your form has been submitted!</p>");
        $('html, body').scrollTop(0);
    }
};

// Displays error messages for invalid fields.
// Valid or invalid status of each item checked is passed to this function as a string.
// Each string is checked and action is taken based on its value.
var errorStatus = function (status) {
    if (status === "nameInvalid") {
        $("#name").prev().addClass("invalid");
        $("#name").prev().append($nameError);
    } else if (status === "nameValid"){
        $("#name").prev().removeClass("invalid");
        $(".name-error").remove();
    }
    if (status === "emailInvalid") {
        $("#mail").prev().addClass("invalid");
        $("#mail").prev().append($emailError);
    } else if (status === "emailValid"){
        $("#mail").prev().removeClass("invalid");
        $(".email-error").remove();
    }
    if (status === "tshirtInvalid") {
        $(".shirt legend").append($tshirtError);
    } else if (status === "tshirtValid"){
        $(".tshirt-error").remove();
    }
    if (status === "activitiesInvalid") {
        $(".activities legend").append($activitiesError);
    } else if (status === "activitiesValid"){
        $(".activities-error").remove();
    }
    if (status === "paymentInvalid") {
        $(".payment-info legend").append($paymentError);
    } else if (status === "paymentValid"){
        $(".payment-error").remove();
    }
    if (status === "cardNumberInvalid") {
        $("#cc-num").prev().addClass("invalid");
    } else if (status === "cardNumberValid"){
        $("#cc-num").prev().removeClass("invalid");
    }
    if (status === "cardZipInvalid") {
        $("#zip").prev().addClass("invalid");
    } else if (status === "cardZipValid"){
        $("#zip").prev().removeClass("invalid");
    }
    if (status === "cardCVVInvalid") {
        $("#cvv").prev().addClass("invalid");
    } else if (status === "cardCVVValid"){
        $("#cvv").prev().removeClass("invalid");
    }
};



////////// Misc. //////////

// Event handler for submit button. Call validate() and prevent form submission.
$("button[type='submit']").click( function (e) {
    validate();
    e.preventDefault();
});

// Set focus on input on page load.
$("#name").focus();
