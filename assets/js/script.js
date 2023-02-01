// required variables 

let latitude = ""
let longtitude = ""
let date = ""
let city = ""
const googleAPIKey = "AIzaSyCoIJTitaSal9kU_w5Gz0c-M5epiS69i44"

// base ajax calls to see repsponse 
$.ajax({
  url: "https://nominatim.openstreetmap.org/search.php?city=taipei&format=jsonv2", // uses city as the search
  method: "GET"
}).then(function(response) {
  console.log(response);
});

$.ajax({
  url: "https://api.sunrisesunset.io/json?lat=38.907192&lng=-77.036873&timezone=UTC&date=today", // with long and lat
  method: "GET"
}).then(function(response) {
  console.log(response);
});



var timeDisplayEl = $("#time-display");

// handle displaying the time
function displayTime() {
    var rightNow = moment().format('llll');
    timeDisplayEl.text(rightNow);
  }

// Datepicker widget
$(function () {
    $('#datepicker').datepicker({
      changeMonth: true,
      changeYear: true,
      dateFormat: 'yy-mm-dd'
    });
  });

  // saves the date to the date variable 
  $('#datepicker').on('change', function() {
    date = $(this).val();
  });



  displayTime();