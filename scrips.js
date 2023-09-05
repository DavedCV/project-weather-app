const body = document.querySelector("body");
const searchBox = document.querySelector(".search-box");
const weatherInfo = document.querySelector(".weather-info");
const weatherExtraInfo = document.querySelector(".weather-extra-info");
const weatherForecast = document.querySelector(".weather-forecast");

const updatePageColors = (timeOfDay) => {
  if (timeOfDay == "day"){
    body.style.background = "var(--day)";
    body.style.setProperty("--fc", "black");
    body.style.setProperty("--container", "var(--container-day)");
    body.style.setProperty("--active", "var(--day-blue-3)");
  }
  else {
    body.style.background = "var(--night)";
    body.style.setProperty("--fc", "white");
    body.style.setProperty("--container", "var(--container-night)");
    body.style.setProperty("--active", "var(--night-blue-2)");
  }
}

const updateWeatherInfoAndExtra = (locationInfo, currentWeather) => {
  console.log("location info", locationInfo);
  console.log("current weather", currentWeather);

  const weatherIcon = currentWeather.condition.icon.split("weather/")[1];
  const timeOfDay = weatherIcon.split("/")[1];

  updatePageColors(timeOfDay);
};

const updateForecast = () => {};

const getDataFromApi = async (placeName) => {
  const key = "65cff02c03f3443ab9c194929230309";

  try {
    const response = await fetch(
      `http://api.weatherapi.com/v1/forecast.json?key=${key}&q=${placeName}&days=3&aqi=noy&alerts=no`,
    );

    if (!response.ok) {
      throw new Error("Bad fetch response");
    }

    const data = await response.json();
    //console.log(data);

    updateWeatherInfoAndExtra(data.location, data.current);

  } catch(err) {
    console.log("error", err);
  }
};

const init = () => {
  getDataFromApi("medellin");
};

init();
