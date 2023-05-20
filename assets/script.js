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
  
  function getWeather(city) {
    var apiCoordinatesUrl =
      openWeatherCoordinatesUrl + city + "&appid=" + openWeatherApiKey;
  
    fetch(apiCoordinatesUrl)
      .then(function (coordinateResponse) {
        if (coordinateResponse.ok) {
          coordinateResponse.json().then(function (data) {
            console.log(data);
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
            console.log(apiWeatherUrl);
            fetch(apiWeatherUrl).then(function (weatherResponse) {
              if (weatherResponse.ok) {
                weatherResponse.json().then(function (weatherData) {
                    var currentWeatherEl = $("<div>").attr({
                        id: "current-weather",
                      });
                      console.log(weatherData);
                      var weatherIcon = weatherData.list[0].weather[0].icon;
                      console.log(weatherIcon);
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
                      console.log(weatherData);
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
                      }
      
                      for (var i = 0; i < fiveDayArray.length; i++) {
                        var cardDivEl = $("<div>").addClass("col3");
                        var cardBodyDivEl = $("<div>").addClass("card-body");
                        var cardTitleEl = $("<h3>")
                          .addClass("card-title")
                          .text(fiveDayArray[i]);
                        console.log(weatherData);
                        var forecastIcon = weatherData.list[i].weather[0].icon;
      
                        var forecastIconEl = $("<img>").attr({
                          src: weatherIconUrl + forecastIcon + ".png",
                          alt: "Weather Icon",
                        });
      