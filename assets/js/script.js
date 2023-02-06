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
  const modalShown = localStorage.getItem("modalShown");
  if (modalShown === null || modalShown === "false") {
    $("#modal").modal("show");
    localStorage.setItem("modalShown", "true");
  }
});

//MODAL WORK END

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
      // console.log($(`#search${i + 1}`));
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
      "<div> Discover the perfect spot in " +
        "<strong>" +
        city +
        "</strong>" +
        ", to witness breathtaking sunsets and sunrises with our easy-to-use map. Simply navigate to the coordinates and bask in the glory of the  sun." +
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
// and displays main container and my locations section
function switchInitialImage() {
  if (initialImage.style.display !== "none") {
    initialImage.style.display = "none";
    mainContainer.style.display = "inherit";
    myLocationsSection.style.display = "inherit";
  }
}

// moment .js
let timeDisplayEl = $("#time-display");

function displayTime() {
  let rightNow = moment().format("llll");
  timeDisplayEl.text(rightNow);
}

setInterval(displayTime, 1000);
displayTime();

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



// Repopulating the search if user clicks on one of the local search cards.

// selects all elements with the class history-card, adds a 'click' event listener
// to each of them and then executes the below code .
document.querySelectorAll(".history-card").forEach((card) => {
  card.addEventListener("click", () => {
    let searchValue = card
      .querySelector(".recentSearch")
      .innerText.split(":")[1];
    let dateValue = card
      .querySelector(".searchDate")
      .innerText.split("Date:")[1]
      .trim();
    document.querySelector("#search-input").value = searchValue.trim();
    document.querySelector("#datepicker").value = dateValue;
    // the above line does not trigger the change event on the datepicker element
    // so it has been manually triggered below.
    $("#datepicker").trigger("change");
    document.querySelector("#date").value = dateValue;
    searchBtn.click();
  });
});
