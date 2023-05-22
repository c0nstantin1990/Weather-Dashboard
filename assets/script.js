(function () {
  // Defining variables
  const weatherUrl = "https://api.openweathermap.org/data/2.5/forecast?lat=";
  const openWeatherCoordinatesUrl =
    "https://api.openweathermap.org/geo/1.0/direct?q=";
  const openWeatherApiKey = "f167efcb103ada2b421534d6aa6f01cf";
  const userFormEL = $("#city-search");
  const cityInputEl = $("#city");
  const fiveDayEl = $("#five-day");
  const searchHistoryEl = $("#search-history");
  const currentDay = moment().format("M/DD/YYYY");
  const weatherIconUrl = "https://openweathermap.org/img/wn/";
  let searchHistoryArray = loadSearchHistory();

  // Defined function to capitalize the first letter of each word
  function getTitleCase(str) {
    const splitStr = str.toLowerCase().split(" ");
    for (let i = 0; i < splitStr.length; i++) {
      splitStr[i] =
        splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    return splitStr.join(" ");
  }
  // Retrieves search history from browsers local storage
  function loadSearchHistory() {
    let searchHistoryArray = JSON.parse(localStorage.getItem("search history"));

    if (!searchHistoryArray) {
      searchHistoryArray = {
        searchedCity: [],
      };
    } else {
      searchHistoryArray.searchedCity.forEach((city) => {
        searchHistory(city);
      });
    }

    return searchHistoryArray;
  }
  // Function saves search history array to browsers local storage
  function saveSearchHistory() {
    localStorage.setItem("search history", JSON.stringify(searchHistoryArray));
  }
  // Function creates search history button for given city
  function searchHistory(city) {
    const searchHistoryBtn = $("<button>")
      .addClass("btn")
      .text(city)
      .on("click", function () {
        $("#current-weather").remove();
        $("#five-day").empty();
        $("#five-day-header").remove();
        getWeather(city);
      })
      .attr("type", "button");

    searchHistoryEl.append(searchHistoryBtn);
  }
  // Recives city name & weather data. Renders current & 5 day weather as parameters.
  function handleWeatherData(city, weatherData) {
    $("#current-weather").remove();
    $("#five-day").empty();
    $("#five-day-header").remove();

    const currentWeatherEl = $("<div>").attr("id", "current-weather");
    const weatherIcon = weatherData.list[0].weather[0].icon;
    const cityCurrentWeatherIcon = weatherIconUrl + weatherIcon + ".png";

    const currentWeatherHeadingEl = $("<h2>").text(
      city + " (" + currentDay + ")"
    );
    const iconImgEl = $("<img>").attr({
      id: "current-weather-icon",
      src: cityCurrentWeatherIcon,
      alt: "Weather Icon",
    });

    const currWeatherListEl = $("<ul>");

    const currWeatherDetails = [
      "Temp: " + weatherData.list[0].main.temp + " °F",
      "Wind: " + weatherData.list[0].wind.speed + " MPH",
      "Humidity: " + weatherData.list[0].main.humidity + " %",
    ];

    currWeatherDetails.forEach((detail) => {
      const currWeatherListItem = $("<li>").text(detail);
      currWeatherListEl.append(currWeatherListItem);
    });

    $("#five-day").before(currentWeatherEl);
    currentWeatherEl.append(currentWeatherHeadingEl);
    currentWeatherHeadingEl.append(iconImgEl);
    currentWeatherEl.append(currWeatherListEl);

    const fiveDayHeaderEl = $("<h2>")
      .text("5-Day Forecast:")
      .attr("id", "five-day-header");
    $("#current-weather").after(fiveDayHeaderEl);

    const fiveDayArray = [];

    for (let i = 0; i < 5; i++) {
      const forecastDate = moment()
        .add(i + 1, "days")
        .format("M/DD/YYYY");
      fiveDayArray.push(forecastDate);

      const cardDivEl = $("<div>").addClass("col3");
      const cardBodyDivEl = $("<div>").addClass("card-body");
      const cardTitleEl = $("<h3>")
        .addClass("card-title")
        .text(fiveDayArray[i]);

      const forecastIcon = weatherData.list[i].weather[0].icon;
      const forecastIconEl = $("<img>").attr({
        src: weatherIconUrl + forecastIcon + ".png",
        alt: "Weather Icon",
      });

      const tempEL = $("<p>")
        .addClass("card-text")
        .text("Temp: " + weatherData.list[i].main.temp + " °F");
      const windEL = $("<p>")
        .addClass("card-text")
        .text("Wind: " + weatherData.list[i].wind.speed + " MPH");
      const humidityEL = $("<p>")
        .addClass("card-text")
        .text("Humidity: " + weatherData.list[i].main.humidity + " %");

      fiveDayEl.append(cardDivEl);
      cardDivEl.append(cardBodyDivEl);
      cardBodyDivEl.append(cardTitleEl);
      cardBodyDivEl.append(forecastIconEl);
      cardBodyDivEl.append(tempEL);
      cardBodyDivEl.append(windEL);
      cardBodyDivEl.append(humidityEL);
    }
  }
  // Function retrieves data for given city
  function getWeather(city) {
    const apiCoordinatesUrl =
      openWeatherCoordinatesUrl + city + "&appid=" + openWeatherApiKey;
    let apiWeatherUrl;

    fetch(apiCoordinatesUrl)
      .then((coordinateResponse) => {
        if (coordinateResponse.ok) {
          return coordinateResponse.json();
        } else {
          throw new Error("Error: Open Weather could not find city");
        }
      })
      .then((data) => {
        //destruction of data (in case data for some varsiables are not recieved)
        const [{ lat = [] } = {}] = data;
        const [{ lon = [] } = {}] = data;
        apiWeatherUrl =
          weatherUrl +
          lat +
          "&lon=" +
          lon +
          "&appid=" +
          openWeatherApiKey +
          "&units=imperial";
        return fetch(apiWeatherUrl);
      })
      .then((weatherResponse) => {
        if (weatherResponse.ok) {
          return weatherResponse.json();
        } else {
          throw new Error("Error: Unable to retrieve weather data");
        }
      })
      .then((weatherData) => {
        handleWeatherData(city, weatherData);
      })
      .catch((error) => {
        alert(error.message);
      });
  }

  function submitCitySearch(event) {
    event.preventDefault();

    const city = getTitleCase(cityInputEl.val().trim());

    if (searchHistoryArray.searchedCity.includes(city)) {
      alert(
        city +
          " is included in history below. Click the " +
          city +
          " button to get weather."
      );
    } else if (city) {
      getWeather(city);
      searchHistory(city);
      searchHistoryArray.searchedCity.push(city);
      saveSearchHistory();
    } else {
      alert("Please enter a city");
    }

    cityInputEl.val("");
  }

  // Event listener for city search form
  userFormEL.on("submit", submitCitySearch);
})();
