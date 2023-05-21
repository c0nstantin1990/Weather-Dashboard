var weatherUrl = "https://api.openweathermap.org/data/2.5/forecast?lat=";
var openWeatherCoordinatesUrl =
  "https://api.openweathermap.org/geo/1.0/direct?q=";
var openWeatherApiKey = "f167efcb103ada2b421534d6aa6f01cf";
var userFormEL = $("#city-search");
var col2El = $(".col2");
var cityInputEl = $("#city");
var fiveDayEl = $("#five-day");
var searchHistoryEl = $("#search-history");
var currentDay = moment().format("M/DD/YYYY");
const weatherIconUrl = "https://openweathermap.org/img/wn/";
var searchHistoryArray = loadSearchHistory();

// Defined function to capitalize the first letter of a string
function titleCase(str) {
  var splitStr = str.toLowerCase().split(" ");
  for (var i = 0; i < splitStr.length; i++) {
    splitStr[i] =
      splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
  }
  return splitStr.join(" ");
}

function loadSearchHistory() {
  var searchHistoryArray = JSON.parse(localStorage.getItem("search history"));

  if (!searchHistoryArray) {
    searchHistoryArray = {
      searchedCity: [],
    };
  } else {
    for (var i = 0; i < searchHistoryArray.searchedCity.length; i++) {
      searchHistory(searchHistoryArray.searchedCity[i]);
    }
  }

  return searchHistoryArray;
}
//saving to local storage
function saveSearchHistory() {
  localStorage.setItem("search history", JSON.stringify(searchHistoryArray));
}
//creating history buttons
function searchHistory(city) {
  var searchHistoryBtn = $("<button>")
    .addClass("btn")
    .text(city)
    .on("click", function () {
      $("#current-weather").remove();
      $("#five-day").empty();
      $("#five-day-header").remove();
      getWeather(city);
    })
    .attr({
      type: "button",
    });

  searchHistoryEl.append(searchHistoryBtn);
}
//geting weather data from apiUrl
function getWeather(city) {
  //apiUrl for coordinates
  var apiCoordinatesUrl =
    openWeatherCoordinatesUrl + city + "&appid=" + openWeatherApiKey;
  //fetching the coordinates for parameter city
  fetch(apiCoordinatesUrl)
    .then(function (coordinateResponse) {
      if (coordinateResponse.ok) {
        coordinateResponse.json().then(function (data) {
          var cityLatitude = data[0].lat;
          var cityLongitude = data[0].lon;

          var apiWeatherUrl =
            weatherUrl +
            cityLatitude +
            "&lon=" +
            cityLongitude +
            "&appid=" +
            openWeatherApiKey +
            "&units=imperial";

          fetch(apiWeatherUrl).then(function (weatherResponse) {
            if (weatherResponse.ok) {
              weatherResponse.json().then(function (weatherData) {
                $("#current-weather").remove();
                $("#five-day").empty();
                $("#five-day-header").remove();
                var currentWeatherEl = $("<div>").attr({
                  id: "current-weather",
                });

                var weatherIcon = weatherData.list[0].weather[0].icon;

                var cityCurrentWeatherIcon =
                  weatherIconUrl + weatherIcon + ".png";

                var currentWeatherHeadingEl = $("<h2>").text(
                  city + " (" + currentDay + ")"
                );

                var iconImgEl = $("<img>").attr({
                  id: "current-weather-icon",
                  src: cityCurrentWeatherIcon,
                  alt: "Weather Icon",
                });

                var currWeatherListEl = $("<ul>");

                var currWeatherDetails = [
                  "Temp: " + weatherData.list[0].main.temp + " °F",
                  "Wind: " + weatherData.list[0].wind.speed + " MPH",
                  "Humidity: " + weatherData.list[0].main.humidity + "%",
                ];

                for (var i = 0; i < currWeatherDetails.length; i++) {
                  var currWeatherListItem = $("<li>").text(
                    currWeatherDetails[i]
                  );
                  currWeatherListEl.append(currWeatherListItem);
                }
                $("#five-day").before(currentWeatherEl);
                currentWeatherEl.append(currentWeatherHeadingEl);
                currentWeatherHeadingEl.append(iconImgEl);
                currentWeatherEl.append(currWeatherListEl);
                var fiveDayHeaderEl = $("<h2>").text("5-Day Forecast:").attr({
                  id: "five-day-header",
                });

                $("#current-weather").after(fiveDayHeaderEl);

                var fiveDayArray = [];

                for (var i = 0; i < 5; i++) {
                  let forecastDate = moment()
                    .add(i + 1, "days")
                    .format("M/DD/YYYY");

                  fiveDayArray.push(forecastDate);

                  var cardDivEl = $("<div>").addClass("col3");
                  var cardBodyDivEl = $("<div>").addClass("card-body");
                  var cardTitleEl = $("<h3>")
                    .addClass("card-title")
                    .text(fiveDayArray[i]);

                  var forecastIcon = weatherData.list[i].weather[0].icon;

                  var forecastIconEl = $("<img>").attr({
                    src: weatherIconUrl + forecastIcon + ".png",
                    alt: "Weather Icon",
                  });
                  var tempEL = $("<p>")
                    .addClass("card-text")
                    .text("Temp: " + weatherData.list[i].main.temp + " °F");
                  var windEL = $("<p>")
                    .addClass("card-text")
                    .text("Wind: " + weatherData.list[i].wind.speed + " MPH");
                  var humidityEL = $("<p>")
                    .addClass("card-text")
                    .text(
                      "Humidity: " + weatherData.list[i].main.humidity + "%"
                    );

                  fiveDayEl.append(cardDivEl);
                  cardDivEl.append(cardBodyDivEl);
                  cardBodyDivEl.append(cardTitleEl);
                  cardBodyDivEl.append(forecastIconEl);
                  cardBodyDivEl.append(tempEL);
                  cardBodyDivEl.append(windEL);
                  cardBodyDivEl.append(humidityEL);
                }
              });
            }
          });
        });
      } else {
        alert("Error: Open Weather could not find city");
      }
    })
    .catch(function (error) {
      alert("Unable to connect to Open Weather");
    });
}
function submitCitySearch(event) {
  event.preventDefault();

  var city = titleCase(cityInputEl.val().trim());

  if (searchHistoryArray.searchedCity.includes(city)) {
    alert(
      city +
        " is included in history below. Click the " +
        city +
        " button to get weather."
    );
    cityInputEl.val("");
  } else if (city) {
    getWeather(city);
    searchHistory(city);
    searchHistoryArray.searchedCity.push(city);
    saveSearchHistory();
    cityInputEl.val("");
  } else {
    alert("Please enter a city");
  }
}
// Event listener for city search form
userFormEL.on("submit", submitCitySearch);
