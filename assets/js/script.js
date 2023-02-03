// required variables 

let latitude = ""
let longtitude = ""
let date = ""
let city = ""
let searchBtn = document.querySelector("#search-button");
let searchForm = document.querySelector("#search-form");
let initialImage = document.querySelector("#initial-image");
let mainContainer = document.querySelector(".main-content-container");
let myLocationsSection = document.querySelector("#my-locations-section");

const mapContent = $(".overflow-hidden");

// base ajax calls to see repsponse
/*$.ajax({
    url: "https://nominatim.openstreetmap.org/search.php?city=taipei&format=jsonv2", // uses city as the search
    method: "GET"
  }).then(function(response) {
    console.log(response);
  });*/

// pulls info from local storage and saves to the city searches object
window.onload = function () {
  let storedData = JSON.parse(localStorage.getItem("citySearches"));
  if (storedData) {
    citySearches = storedData;
  }
};

$.ajax({
  url: "https://api.sunrisesunset.io/json?lat=38.907192&lng=-77.036873&timezone=UTC&date=today", // with long and lat
  method: "GET",
}).then(function (response) {
  console.log(response);
});

$("#search-button").click(function (event) {
  event.preventDefault();

  const queryParam = $("#search-input").val();
  city = $("#search-input").val();
  const location =
    "https://nominatim.openstreetmap.org/search.php?city=" +
    queryParam +
    "&format=jsonv2";
  console.log(location);

  if (!queryParam) {
    return;
  }

  fetch(location)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      displayCityData(data);
     
    });

    function displayCityData(data) {


        
        const cardContainer = $('<div class="myCard">');
      
  
        const cityName = $(
          "<div>City: " + data[0].display_name + " </div>"
        );
        const latDiv = $(
          "<div>Lat: " + data[0].lat + " </div>"
        );
        const lonDiv = $(
          "<div>Lon: " + data[0].lon + " </div>"
        );
  
        cardContainer.append(cityName);
        cardContainer.append(latDiv);
        cardContainer.append(lonDiv);
        mapContent.empty();
        mapContent.append(cardContainer);
      
      
  }
});

// sets initial display values for main container and -
// mylocations sections.
mainContainer.style.display = "none";
myLocationsSection.style.display = "none";

// function that hides initial image  -
// and displays main container and my locations sections
// will need to add other criteria in case the user submits empty fields.
function switchInitialImage() {
  if (initialImage.style.display !== "none") {
    initialImage.style.display = "none";
    mainContainer.style.display = "inherit";
    myLocationsSection.style.display = "inherit";
  }
}

// click event that prevents default and then -
// checks if button clicked is the searchBtn and then -
// calls switchInitialImage function.
searchForm.addEventListener("click", function (event) {
  event.preventDefault();
  if (event.target === searchBtn) {
    switchInitialImage();
  }
});

var timeDisplayEl = $("#time-display");

// handle displaying the time
function displayTime() {
  var rightNow = moment().format("llll");
  timeDisplayEl.text(rightNow);
}

// Datepicker widget
$(function () {
  $("#datepicker").datepicker({
    changeMonth: true,
    changeYear: true,
    dateFormat: "yy-mm-dd",
  });
});

// saves the date to the date variable
$("#datepicker").on("change", function () {
  date = $(this).val();
});

  displayTime();