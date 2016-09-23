////////// Interactive Form //////////
//
// Author: Mason Embry
// Last Updated: 9/23/2016
//



////////// Job Role //////////

// Reveal a text field when the "Other" option is selected from the "Job Role" drop down menu.

$("#title").change(function() {
    if ($(this).val() === "other") {
        var newInputElement = '<input id="other-title" placeholder="Your Title" name="user_other_title">';
        $("#title").after(newInputElement);
    } else {
        $("#other-title").remove(); // Removes newInputElement if other options are selected.
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
var checkSchedule = function (clickedItem) {
    var clickedItemSchedule = getActivityData(clickedItem);

    // Loop through each .activities label item and check if its schedule matches clickedItemSchedule.
    $(".activities label").each(function () {
        var thisItemSchedule = getActivityData($(this));

        if (thisItemSchedule === clickedItemSchedule) {
            $(this).children().prop("disabled", true);
            $(this).addClass("disabled");
        }
    });

    clickedItem.children().prop("disabled", false);
    clickedItem.removeClass("disabled");
};

var totalPrice = 0;

// Use regular expression to extract price from .activites label.
var returnPrice = function (inputElementToCheck) {
    var priceRegEx = /\$\d+(\.\d{1,2})?/; // RegEx to search for a price value that starts with "$".
    var price = inputElementToCheck.text().match(priceRegEx); // Searches element for match with RegEx.
    price = price[0]; // Retrieves price only (index 0) from the array.
    price = price.replace(/[^0-9\.]+/g,""); // Removes dollar sign from front of price.
    price = parseFloat(price); // Converts price string to float.
    return price;
};

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
    checkSchedule($(this));
});



////////// Payment Info //////////





////////// Form Validation //////////





////////// Misc. //////////

// Set focus on input on page load.
$("#name").focus();
