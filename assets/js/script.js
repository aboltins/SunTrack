
// required variables
let citySearches = []; // object for local storage
var latitude = "";
var longtitude = "";
var date = "";
var city = "";
var sunrise = "";
var firstLight = "";
var dawn = "";
var dusk = "";
var lastLight = "";
var sunset = "";
var imageURL = "";

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
  url: "https://api.sunrisesunset.io/json?lat=38.907192&lng=-77.036873&date=today", // with long and lat
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
      latitude = data[0].lat;
      longtitude = data[0].lon;
      imageURL =
        "https://maps.googleapis.com/maps/api/staticmap?center=" +
        latitude +
        "%2c%20" +
        longtitude +
        "8&zoom=12&size=600x600&key=AIzaSyCoIJTitaSal9kU_w5Gz0c-M5epiS69i44";
      // call to sunset api

      const sunriseSunset =
        "https://api.sunrisesunset.io/json?lat=" +
        latitude +
        "&lng=" +
        longtitude +
        "&date=" +
        date;
      $.ajax({
        url: sunriseSunset,
        method: "GET",
      }).then(function (sunriseSunsetResponse) {
        console.log(sunriseSunsetResponse);

        //saving API response to global scoped variables
        sunrise = sunriseSunsetResponse.results.sunrise;
        firstLight = sunriseSunsetResponse.results.first_light;
        dawn = sunriseSunsetResponse.results.dawn;
        dusk = sunriseSunsetResponse.results.dusk;
        lastLight = sunriseSunsetResponse.results.last_light;
        sunset = sunriseSunsetResponse.results.sunset;

        //local storage save work - saves an object to local storage

        let cityData = {
          city: city,
          latitude: latitude,
          longtitude: longtitude,
          sunrise: sunrise,
          firstLight: firstLight,
          dawn: dawn,
          dusk: dusk,
          lastLight: lastLight,
          sunset: sunset,
          imageURL: imageURL,
        };
        citySearches.push(cityData);
        localStorage.setItem("citySearches", JSON.stringify(citySearches));

        //adds sunrise data to HTML
        $("#first-light").text(firstLight);
        $("#sunrise").text(sunrise);
        $("#dawn-time").text(dawn);
        $("#dusk-time").text(dusk);
        $("#last-light").text(lastLight);
        $("#sunset").text(sunset);
        $("#map-title").text(city)

        // Card Titles

        $("#sunrise-card").text(city + " Sunrise Information");
        $("#sunset-card").text(city + " Sunset Information");
        //map image
        $("#mapimage").attr("src", imageURL);
      });
    });

  function displayCityData(data) {
    const cardContainer = $('<div class="myCard">');

    const cityName = $("<div>City: " + data[0].display_name + " </div>");
    const latDiv = $("<div>Lat: " + data[0].lat + " </div>");
    const lonDiv = $("<div>Lon: " + data[0].lon + " </div>");
    const cityBlurb = $("<div> Here is how to find " + "<strong>" + city + "</strong>" + " have fun seeing the sights!" + "</div>")

    cardContainer.append(cityName);
    cardContainer.append(latDiv);
    cardContainer.append(lonDiv);
    cardContainer.append(cityBlurb);
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
  setInterval(displayTime, 1000);
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
