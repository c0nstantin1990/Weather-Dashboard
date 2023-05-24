# Weather-Forecast

## Description

- Project was created to retrieve weather data for cities
- Application has header with the name of app
- Application has search bar on the left side of the page
- Application retrieving cities from local storage and puts them under search bar
- Application is displaying weather & in city for current date on right side of the page
- Application retrieves 5 day forecast for same city under today's forecast
- Application retrieves temperature, wind speed and humidity for current city
- Application using jQuery to minimize the code
- Application is using moment.js for implementing time & date
- Application is using @media to be minimized for all screen sizes
- Application creates html elements dynamically
- Application is not adding city to local storage if city doesn't exist

## Usage

When input in search bar is entered, application is making sure first letters are capitalized. When pressing search button city goes in local storage & appears under search bar. When search button is pressed app accessing weather api to obtain coordinates for the city & then retrieves weather for current city from api. On the right side its showing current weather & under 5 day forecast for same city. Every time new city is entered in search bar is appearing under search bar & right side is clearing from previous city.

![Main](/assets/screenshots/main.png)
![First city](/assets/screenshots/first_city.png)
![Capitalize city](/assets/screenshots/capitalize_city.png)
![Local storage](/assets/screenshots/local_storage.png)

GitHub Repo: https://github.com/c0nstantin1990/Weather-Forecast
Website Link: https://c0nstantin1990.github.io/Weather-Forecast/

## Credits

Used stack overflow for capitalized letters
Used documintation from 5 day/ 3 hour forecast & Geocoder API.
Used examples from UNCC textbook & mini project to creare functions.
Used google to look up solutions to build weather app.
