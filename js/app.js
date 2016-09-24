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

var $nameError = $("<span class='invalid'> (please provide your name)</span>");
var $emailError = $("<span class='invalid'> (please provide a valid email address)</span>");
var $tshirtError = $("<p class='invalid'>Don't forget to pick a T-shirt</p>");
var $activitiesError = $("<p class='invalid'>(please choose at least one activity)</p>");
var $paymentError = $("<p class='invalid'>(please choose your payment method)</p>");

// Email validation.
var validateEmail = function () {
    return true;
};

// Validates all fields and returns true or false.
var validate = function () {
    var arrayOfErrors = []; // Stores errors in array as strings.
    var valid; // Make true if all validation passes.

    // Name
    if ($("#name").val().length === 0) {
        arrayOfErrors.push("nameInvalid");
    }

    // Email
    if (!validateEmail()) {
        arrayOfErrors.push("emailInvalid");
    }

    // T-shirt
    if (!($("#design option[value='js puns']").selected || $("#design option[value='heart js']").selected)) {
        arrayOfErrors.push("tshirtInvalid");
    }

    // Activities
    if (false) {
        arrayOfErrors.push("activitiesInvalid");
    }

    // Payment
    if (false) {
        arrayOfErrors.push("paymentInvalid");
    }

    // Credit Card Number
    if (false) {
        arrayOfErrors.push("cardNumberInvalid");
    }

    // Credit Card Zip
    if (false) {
        arrayOfErrors.push("cardZipInvalid");
    }

    // Credit Card CVV
    if (false) {
        arrayOfErrors.push("cardCVVInvalid");
    }

    if (arrayOfErrors.length === 0) {
        valid = true;
    }
    // Display errors if invalid, submit form if valid.
    if (valid) {
        // If this was a real form I would submit the form like this.
        // $("form").submit();

        // Fake submit.
        $(".submitted").remove(); // Deletes first in case submit button clicked more than once.
        $("header").append("<p class='submitted'>Your form has been submitted!</p>");
        $('html, body').scrollTop(0);
    } else {
        displayErrors(arrayOfErrors);
    }
};

// Displays error messages for invalid fields.
var displayErrors = function (arrayOfErrors) {
    for (var i = 0; i < arrayOfErrors.length; i++) {
        if (arrayOfErrors[i] === "nameInvalid") {
            $("#name").prev().addClass("invalid");
            $("#name").prev().append($nameError);
        }
        if (arrayOfErrors[i] === "emailInvalid") {
            $("#mail").prev().addClass("invalid");
            $("#mail").prev().append($emailError);
        }
        if (arrayOfErrors[i] === "tshirtInvalid") {
            $(".shirt legend").append($tshirtError);
        }
        if (arrayOfErrors[i] === "activitiesInvalid") {
            $(".activities legend").append($activitiesError);
        }
        if (arrayOfErrors[i] === "paymentInvalid") {
            $(".payment-info legend").append($paymentError);
        }
        if (arrayOfErrors[i] === "cardNumberInvalid") {
            $("#cc-num").prev().addClass("invalid");
        }
        if (arrayOfErrors[i] === "cardZipInvalid") {
            $("#zip").prev().addClass("invalid");
        }
        if (arrayOfErrors[i] === "cardCVVInvalid") {
            $("#cvv").prev().addClass("invalid");
        }
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
