const body = document.querySelector("body");
const searchBox = document.querySelector(".search-box");
const weatherInfo = document.querySelector(".weather-info");
const weatherExtraInfo = document.querySelector(".weather-extra-info");
const weatherForecast = document.querySelector(".weather-forecast");

const updatePageColors = (timeOfDay) => {
  if (timeOfDay == "day") {
    body.style.background = "var(--day)";
    body.style.setProperty("--fc", "black");
    body.style.setProperty("--container", "var(--container-day)");
    body.style.setProperty("--active", "var(--day-blue-3)");
  } else {
    body.style.background = "var(--night)";
    body.style.setProperty("--fc", "white");
    body.style.setProperty("--container", "var(--container-night)");
    body.style.setProperty("--active", "var(--night-blue-2)");
  }
};

const updateWeatherInfo = (locationInfo, currentWeather) => {
  // console.log("location info", locationInfo);
  // console.log("current weather", currentWeather);

  // update place info
  const placeName = weatherInfo.querySelector(".place-name");
  placeName.textContent = locationInfo.name;
  const regionCountry = weatherInfo.querySelector(".place-region-country");
  regionCountry.textContent = `${locationInfo.region}, ${locationInfo.country}`;

  // update weather info
  const weatherIcon = currentWeather.condition.icon.split("weather/")[1];
  const icon = weatherInfo.querySelector(".condition-icon img");
  icon.src = `./weather-status/weather-icons/${weatherIcon}`;

  // update page theme based on the time o fthe day
  const timeOfDay = weatherIcon.split("/")[1];
  updatePageColors(timeOfDay);

  // update condition info
  const conditionTemp = weatherInfo.querySelector(".condition-temp");
  conditionTemp.textContent = `${currentWeather.temp_c} ° C`;
  const conditioneText = weatherInfo.querySelector(".condition-text");
  conditioneText.textContent = currentWeather.condition.text;
  const lastUpdate = weatherInfo.querySelector(".condition-last-updated");
  lastUpdate.textContent = currentWeather.last_updated;
};

const updateExtraInfo = (humidity, wind, max_temp, min_temp) => {
  const humidityText = weatherExtraInfo.querySelector(".extra-info-humidity p");
  humidityText.textContent = `${humidity} %`;

  const windText = weatherExtraInfo.querySelector(".extra-info-wind p");
  windText.textContent = `${wind} km/h`;

  const maxTempText = weatherExtraInfo.querySelector(".extra-info-max-temp p");
  maxTempText.textContent = `${max_temp} ° C`;

  const minTempText = weatherExtraInfo.querySelector(".extra-info-min-temp p");
  minTempText.textContent = `${min_temp} ° C`;
};

const updateForecast = (forecastData) => {
  // console.log(forecastData);

  const buttonToday = weatherForecast.querySelector("button.today");
  const buttonWeek = weatherForecast.querySelector("button.week");

  buttonWeek.classList.add("active");
  createForecastCards(forecastData.forecastday);

  buttonToday.addEventListener("click", () => {
    buttonToday.classList.add("active");
    buttonWeek.classList.remove("active");
    createForecastCards(forecastData.forecastday[0].hour, true);
  });

  buttonWeek.addEventListener("click", () => {
    buttonToday.classList.remove("active");
    buttonWeek.classList.add("active");
    createForecastCards(forecastData.forecastday, false);
  });
};

const createForecastCards = (data, hourly) => {
  const forecastCards = weatherForecast.querySelector(".forecast-cards");
  forecastCards.innerHTML = "";

  for (let i = 0; i < data.length; i++) {
    const dateField = !hourly ? data[i].date : data[i].time;
    const iconRef = !hourly ? data[i].day : data[i];
    const tempField = !hourly ? data[i].day.avgtemp_c : data[i].temp_c;

    // create card element
    const card = document.createElement("div");
    card.classList.add(`card-${i}`);

    // create date descriptor
    const date = document.createElement("p");
    date.classList.add("forecast-time");
    date.textContent = dateField;
    card.appendChild(date);

    // weather icon
    const icon = document.createElement("img");
    icon.classList.add("forecast-icon");
    const iconPath = iconRef.condition.icon.split("weather/")[1];
    icon.src = `./weather-status/weather-icons/${iconPath}`;
    card.appendChild(icon);

    // create temp descriptr
    const temp = document.createElement("p");
    temp.classList.add("forecast-temp");
    temp.textContent = `${tempField} ° C`;
    card.appendChild(temp);

    forecastCards.appendChild(card);
  }
};

const updateGeneralData = (data) => {
  updateWeatherInfo(data.location, data.current);
  updateExtraInfo(
    data.current.humidity,
    data.current.wind_kph,
    data.forecast.forecastday[0].day.maxtemp_c,
    data.forecast.forecastday[0].day.mintemp_c,
  );
  updateForecast(data.forecast);
};

const getDataFromApi = async (placeName) => {
  const key = "65cff02c03f3443ab9c194929230309";

  const response = await fetch(
    `http://api.weatherapi.com/v1/forecast.json?key=${key}&q=${placeName}&days=3&aqi=noy&alerts=no`,
  );

  if (!response.ok) {
    throw new Error("Bad fetch response");
  }

  const data = await response.json();
  // console.log(data);

  return data;
};

const setListenersSearchBox = () => {
  const searchInput = searchBox.querySelector(".search-box-input");
  const searchButton = searchBox.querySelector(".search-box-button");

  searchButton.addEventListener("click", () => {
    const targetPlace = searchInput.value;
    searchInput.value = "";

    getDataFromApi(targetPlace)
      .then(updateGeneralData)
      .catch((err) => console.log(err));
  });
};

const init = () => {
  getDataFromApi("Medellin").then(updateGeneralData);
  setListenersSearchBox();
};

init();
