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
