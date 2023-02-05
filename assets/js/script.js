// required variables
let citySearches = []; // object for local storage
var latitude = "";
var longitude = "";
var date = "Today";
var city = "";
var sunrise = "";
var firstLight = "";
var dawn = "";
var dusk = "";
var lastLight = "";
var sunset = "";
var imageURL = "";
var $modal = $("#errorModal");
var today = new Date();

let searchBtn = document.querySelector("#search-button");
let searchForm = document.querySelector("#search-form");
let initialImage = document.querySelector("#initial-image");
let mainContainer = document.querySelector(".main-content-container");
let myLocationsSection = document.querySelector("#my-locations-section");

const mapContent = $(".overflow-hidden");

////// MODAL WORK// calls modals when no response from maps API
function modal() {
  mainContainer.style.display = "none";
  initialImage.style.display = "block";
  myLocationsSection.style.display = "none";

  $("#errorModal").modal("show");
}

$modal.on("hidden.bs.modal", function () {
  // Reload the location data
  location.reload();
});

$(document).ready(function () {
  // Check if the modal has already been shown to the user
  if (!localStorage.getItem("modalShown")) {
    // Show the modal
    $("#modal").modal("show");
    // Set a flag in local storage to indicate that the modal has been shown
    localStorage.setItem("modalShown", true);
  }
});
//MODAL WORK END

// pulls info from local storage and saves to the city searches object
window.onload = function () {
  let storedData = JSON.parse(localStorage.getItem("citySearches"));
  if (storedData) {
    citySearches = storedData;
  }
};

///// adds local storage to HTML recent searches
$(document).ready(function () {
  let storedData = JSON.parse(localStorage.getItem("citySearches"));
  console.log(storedData);
  if (storedData) {
    citySearches = storedData;
    for (let i = 0; i < citySearches.length; i++) {
      let search = citySearches[i].city;
      let sunrise = citySearches[i].sunrise;
      let searchDate = citySearches[i].date;
      let sunset = citySearches[i].sunset;
      console.log($(`#search${i + 1}`));
      $(`#search${i + 1}`).text("Destination: " + search);
      $(`#sunrise${i + 1}`).text("Sunrise: " + sunrise);
      $(`#sunset${i + 1}`).text("Sunset: " + sunset);
      $(`#searchDate${i + 1}`).text("Date: " + searchDate);
    }
  }
});

$("#search-button").click(function (event) {
  event.preventDefault();
  const queryParam = $("#search-input").val();
  city = $("#search-input").val();
  city = city.charAt(0).toUpperCase() + city.slice(1); // makes the first letter caps of the city value :)
  const location =
    "https://nominatim.openstreetmap.org/search.php?city=" +
    queryParam +
    "&format=jsonv2";
  console.log(location);

  if (!queryParam) {
    return;
  }
  switchInitialImage();

  fetch(location)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);

      if (data.length === 0 || queryParam === "") {
        /// NEw code in place to stop no city response and show modal
        modal();
        return;
      }

      displayCityData(data);
      latitude = data[0].lat;
      longitude = data[0].lon;
      imageURL =
        "https://maps.googleapis.com/maps/api/staticmap?center=" +
        latitude +
        "%2c%20" +
        longitude +
        "8&zoom=12&size=600x600&key=AIzaSyCoIJTitaSal9kU_w5Gz0c-M5epiS69i44";
      // call to sunset api

      const sunriseSunset =
        "https://api.sunrisesunset.io/json?lat=" +
        latitude +
        "&lng=" +
        longitude +
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
          longitude: longitude,
          sunrise: sunrise,
          firstLight: firstLight,
          dawn: dawn,
          dusk: dusk,
          lastLight: lastLight,
          sunset: sunset,
          imageURL: imageURL,
          date: date,
        };

        // check if city and date already exist in citySearches
        let cityExists = false;
        let dateExists = false;
        for (let i = 0; i < citySearches.length; i++) {
          if (citySearches[i].city === city && citySearches[i].date === date) {
            cityExists = true;
            dateExists = true;
            break;
          }
        }

        // only add the city data if neither city nor date exists
        if (!cityExists && !dateExists) {
          citySearches.unshift(cityData);
          localStorage.setItem("citySearches", JSON.stringify(citySearches));
        }

        //adds sunrise data to HTML
        $("#first-light").text(firstLight);
        $("#sunrise").text(sunrise);
        $("#dawn-time").text(dawn);
        $("#dusk-time").text(dusk);
        $("#last-light").text(lastLight);
        $("#sunset").text(sunset);
        $("#map-title").text(city);
        $("#date").text(date);
        $("#dateSunset").text(date);

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
    const cityBlurb = $(
      "<div> Here is how to find " +
        "<strong>" +
        city +
        "</strong>" +
        ", have fun seeing the sights!" +
        "</div>"
    );

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

// moment .js
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
    maxDate: "+3m", // sets max date on date picker
    defaultDate: today,
  });
});

// saves the date to the date variable
$("#datepicker").on("change", function () {
  date = $(this).val();
});

//runs the time function
displayTime();
