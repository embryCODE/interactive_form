////////// Interactive Form //////////
//
// Author: Mason Embry
// Last Updated: 9/23/2016
//



////////// Job Role //////////

// Hide #other-title when javascript is enabled.
$("#other-title").hide();

// Reveal a text field when the "Other" option is selected from the "Job Role" drop down menu.
$("#title").change(function() {
    if ($(this).val() === "other") {
        $("#other-title").show();
    } else {
        $("#other-title").hide();
    }
});



////////// T-shirt Info //////////

// Only display the options that match the design selected in the "Design" menu.

// Function to set t-shirt dropdown menus.
var setTshirtMenus = function() {
    // First, hide all t-shirt selections.
    $("#color option").hide();

    // Show the #colors until hidden.
    $("#colors").show();

    // Show certain t-shirts, using classes, depending on the #design value chosen.
    if ($("#design").val() === "js puns") {
        $(".js-puns").show();
        $(".js-puns").eq(0).prop("selected", true); // This line is required to make the #color menu display the first selection.
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
    var dayAndTime = activityToCheck.text().match(/—\s(.*),/); // Extracts day and time between "–" and "," characters.

    // Checks if result of previous expression was null.
    if (dayAndTime) {
        dayAndTime = dayAndTime[1]; // If not null, sets dayAndTime to extracted day and time from array.
    }

    return dayAndTime;
};

// Check for schedule conflicts between checked items.
var checkScheduleConflicts = function (clickedItem) {
    // Find day and time of clicked item.
    var clickedItemSchedule = getActivityData(clickedItem);

    var itemToDisable; // For keeping track of item to be disabled.
    var itemToEnable; // For keeping track of item to be enabled.

    // Checks all items except the item clicked.
    var itemsToCheck = clickedItem.siblings("label");

    itemsToCheck.each(function () {
        // Find day and time of item in loop.
        thisItemSchedule = getActivityData($(this));

        // Select checkbox of clicked item.
        var checkbox = clickedItem.children();

        // Check each item in loop for conflict.
        // If conflict found, store in itemToDisable if checking the box.
        // Store in itemToEnable if unchecking the box.
        if ((thisItemSchedule === clickedItemSchedule) && (checkbox.prop("checked"))) {
            itemToDisable = $(this);
        } else if ((thisItemSchedule === clickedItemSchedule) && (!checkbox.prop("checked"))){
            itemToEnable = $(this);
        }
    });

    // Pass items to be disabled or enabled to function to display conflicts.
    displayScheduleConflicts(itemToDisable, itemToEnable);
};

// Display the results of checkScheduleConflicts.
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
    var priceRegEx = /\$\d+(\.\d{1,2})?/; // RegEx to search for a price value that starts with "$".
    var price = inputElementToCheck.text().match(priceRegEx); // Searches element for match with RegEx.
    price = price[0]; // Retrieves price only (index 0) from the array.
    price = price.replace(/[^0-9\.]+/g,""); // Removes dollar sign from front of price.
    price = parseFloat(price); // Converts price string to float.
    return price;
};

var totalPrice = 0;

// Add or subtract price from totalPrice.
var addToTotal = function (price) {
    totalPrice += price;
};
var subtractFromTotal = function (price) {
    totalPrice -= price;
};

// Append total price on activites div.
var writeTotalPrice = function () {
    $(".total-price").remove(); // First remove totalPrice h3 if it exists.
    // Only append total price if price is greater than 0.
    if (totalPrice > 0) {
        $(".activities").append("<h3 class='total-price'>Total: $" + totalPrice + "</h3>");
    }
};

// Update total price with price of checked or unchecked element.
var updatePrice = function (clickedItem) {
    var inputToCheck = clickedItem.children();
    var price = returnPrice(clickedItem);
    // Call addToTotal or subtractFromTotal depending on whether checked or unchecked.
    if (inputToCheck.prop('checked')) {
        addToTotal(price);
    } else {
        subtractFromTotal(price);
    }

    writeTotalPrice();
};

// Checkbox event listener.
$(".activities label").change(function () {
    updatePrice($(this));
    checkScheduleConflicts($(this));
});



////////// Payment Info //////////

// Make "Credit Card" the selected option in dropdown and disable the "Select Payment Method" option.
$("[value='credit card']").prop("selected", true);
$("[value='select_method']").prop("disabled", true);

// Hide all then show selected payment info.
var hideShowPaymentInfo = function (classToShow) {
    $(".credit-card, .paypal, .bitcoin").hide();
    $(classToShow).show();
};

// Select which payment type to show and pass to hideShowPaymentInfo().
var selectPaymentToShow = function(selectedOption) {
    var classToPassIn;

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

var $nameError = $("<span class='invalid name-error'> (please provide your name)</span>");
var $emailError = $("<span class='invalid email-error'> (please provide a valid email address)</span>");
var $tshirtError = $("<p class='invalid tshirt-error'>Don't forget to pick a T-shirt</p>");
var $activitiesError = $("<p class='invalid activities-error'>(please choose at least one activity)</p>");
var $paymentError = $("<p class='invalid payment-error'>(please choose your payment method)</p>");

// Email validation.
var validateEmail = function () {
    var enteredEmail = $("#mail").val();
    validEmailRegEx = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;
    return validEmailRegEx.test(enteredEmail);
};

// Credit card validation.
var validateCC = function (cardNumber) {

    // Creates an array with each digit of number.
    var cardNumberArray = (cardNumber).toString(10).split("").map(Number);
    console.log(cardNumberArray);

    // Drop the last digit and store in lastDigit.
    var lastDigit = cardNumberArray.pop();
    console.log(cardNumberArray);

    // Reverse the numbers.
    cardNumberArray = cardNumberArray.reverse();
    console.log(cardNumberArray);

    // If number is in an odd position, multiply by 2.
    for(i = 0; i < cardNumberArray.length; i++) {
        if ((i % 2) === 0) {
            cardNumberArray[i] = cardNumberArray[i] * 2;
        }
    }
    console.log(cardNumberArray);

    // Subtract 9 from numbers over 9.
    for(i = 0; i < cardNumberArray.length; i++) {
        if (cardNumberArray[i] > 9) {
            cardNumberArray[i] = cardNumberArray[i] - 9;
        }
    }
    console.log(cardNumberArray);

    // Add all numbers.
    var added = 0;
    for (i = 0; i < cardNumberArray.length; i++) {
        added += cardNumberArray[i];
    }
    console.log(added);
    console.log(added % 10);
    console.log(lastDigit);
    // Mod 10 and compare to last digit. Returns true or false.
    return (added % 10 === lastDigit);
};

// Validates all fields and returns true or false.
var validate = function () {
    var valid; // Make true if all validation passes.

    // Test all fields and call errorStatus() for each.

    // Name
    if ($("#name").val().length > 0) {
        errorStatus("nameValid");
    } else {
        errorStatus("nameInvalid");
    }
    // Email
    if (validateEmail()) {
        errorStatus("emailValid");
    } else {
        errorStatus('emailInvalid');
    }
    // T-shirt
    if ($('#design option[value="js puns"]').is(':selected') || $('#design option[value="heart js"]').is(':selected')) {
        errorStatus("tshirtValid");
    } else {
        errorStatus('tshirtInvalid');
    }
    // Activities
    if ($(".activities input").is(':checked')) {
        errorStatus("activitiesValid");
    } else {
        errorStatus('activitiesInvalid');
    }
    // Payment
    if ($("#payment option").is(':selected')) {
        errorStatus("paymentValid");
    } else {
        errorStatus('paymentInvalid');
    }
    // Credit Card Number
    if (validateCC(parseInt($("#cc-num").val()))) {
        errorStatus("cardNumberValid");
    } else {
        errorStatus('cardNumberInvalid');
    }
    // Credit Card Zip
    if (($("#zip").val().length === 5) && !isNaN(parseInt($("#zip").val()))) {
        errorStatus("cardZipValid");
    } else {
        errorStatus('cardZipInvalid');
    }
    // Credit Card CVV
    if (($("#cvv").val().length === 3) && !isNaN(parseInt($("#cvv").val()))) {
        errorStatus("cardCVVValid");
    } else {
        errorStatus('cardCVVInvalid');
    }

    // Display errors if invalid, submit form if valid.
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

// Event handler for submit button.
$("button[type='submit']").click( function (e) {
    validate();
    e.preventDefault();
});



////////// Misc. //////////

// Set focus on input on page load.
$("#name").focus();
