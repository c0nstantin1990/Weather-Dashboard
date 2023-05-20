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
  
  function saveSearchHistory() {
    localStorage.setItem("search history", JSON.stringify(searchHistoryArray));
  }
  
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
  