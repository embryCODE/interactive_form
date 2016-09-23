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

var totalPrice = 0;

// Get price of event from checkbox label text.
var returnPrice = function (elementToCheck) {
    var priceRegEx = /\$\d+(\.\d{1,2})?/; // RegEx to search for a price value that starts with "$".
    var price = elementToCheck.text().match(priceRegEx); // Searches element for match with RegEx.
    price = price[0]; // Retrieves price only (index 0) from the array.
    price = price.replace(/[^0-9\.]+/g,""); // Removes dollar sign from front of price.
    price = parseFloat(price); // Converts price string to float.
    return price;
};

var addToTotal = function (price) {
    totalPrice += price;
    console.log(totalPrice);
};

var subtractFromTotal = function (price) {
    totalPrice -= price;
    console.log(totalPrice);
};

// Checkbox event listener.
$("[type='checkbox']").change(function () {
    var price = returnPrice($(this).parent());
    if ($(this).prop('checked')) {
        addToTotal(price);
    } else {
        subtractFromTotal(price);
    }
});



////////// Payment Info //////////





////////// Form Validation //////////





////////// Misc. //////////

// Set focus on input on page load.
$("#name").focus();
