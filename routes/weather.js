const express = require("express");
const router = express.Router();
const https = require("https");
const fetch = require("node-fetch");
const unsplashApiKey = "As_rPDDI2zDlPtiXiS0vQ3-Kn4VtkooIjOGM3UoLOsM";
const googlePlacesApiKey = "AIzaSyBSNERGFARriiKLB-9Y82Uv6oUoGvUZUmU";
const covid19ApiUrl = "https://disease.sh/v3/covid-19/countries/";

function convertKelvinToCelsius(kelvin) {
  return Math.round(kelvin - 273.15);
}

router.get("/", (req, res) => {
  res.render("index");
});

router.get("/weather", async (req, res) => {
  const apiKey = "14882d9791674ae40196bb2a87f7dd81";
  const city = req.query.city;
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=${apiKey}`;

  try {
    if (city !== undefined && city.trim() !== "") {
      const weatherdata = await fetchData(url);

      const temp = convertKelvinToCelsius(weatherdata.main.temp);
      const feelsLike = convertKelvinToCelsius(weatherdata.main.feels_like);
      const description = weatherdata.weather[0].description;
      const icon = weatherdata.weather[0].icon;
      const imgURL = `https://openweathermap.org/img/wn/${icon}@2x.png`;

      const covid19Data = await fetch(covid19ApiUrl + city).then((res) =>
        res.json()
      );

      const weatherDetails = {
        temp,
        feelsLike,
        description,
        imgURL,
        city,
        coordinates: weatherdata.coord,
        humidity: weatherdata.main.humidity,
        pressure: weatherdata.main.pressure,
        windSpeed: weatherdata.wind.speed,
        countryCode: weatherdata.sys.country,
        rainVolumeLast3Hours: weatherdata.rain ? weatherdata.rain["3h"] : 0,
        covid19Stats: {
          cases: covid19Data.cases,
          deaths: covid19Data.deaths,
          recovered: covid19Data.recovered,
          active: covid19Data.active,
          continent: covid19Data.continent,
        },
      };

      const unsplashQuery = getUnsplashQueryBasedOnWeather(weatherdata);
      const unsplashData = await fetch(
        `https://api.unsplash.com/photos/random?query=${unsplashQuery}&client_id=${unsplashApiKey}`
      ).then((res) => res.json());

      weatherDetails.unsplashImage = unsplashData.urls.full;

      const placeDetails = await fetchPlaceDetails(city);

      res.render("index", { weather: weatherDetails, placeDetails });
    } else {
      res.render("index");
    }
  } catch (error) {
    console.log("Error fetching data:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

function fetchData(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      let data = "";

      response.on("data", (chunk) => {
        data += chunk;
      });

      response.on("end", () => {
        resolve(JSON.parse(data));
      });

      response.on("error", (error) => {
        reject(error);
      });
    });
  });
}

function fetchPlaceDetails(city) {
  const googlePlacesApiUrl = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${city}&inputtype=textquery&key=${googlePlacesApiKey}`;

  return fetch(googlePlacesApiUrl).then((response) => response.json());
}

function getUnsplashQueryBasedOnWeather(weatherdata) {
  const weatherKeywords = [];

  if (weatherdata.weather[0].main === "Clear") {
    weatherKeywords.push("clear sky");
  } else if (weatherdata.weather[0].main === "Clouds") {
    weatherKeywords.push("cloudy sky");
  } else if (weatherdata.weather[0].main === "Rain") {
    weatherKeywords.push("rainy sky");
  } else if (weatherdata.weather[0].main === "Mist") {
    weatherKeywords.push("mist");
  }

  return weatherKeywords.join(" ");
}

module.exports = router;
