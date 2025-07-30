const weatherForm = document.querySelector(".weatherForm");
const cityInput = document.querySelector(".cityInput");
const card = document.querySelector(".card");

const apiKey = "0a6e6936f2dfe122841978d40b7cf9eb";

let isUnitPressed = false;
let selectedUnit = "";

let tempCelsius = "";
let tempFahrenheit = "";
let tempKelvin = "";

document.addEventListener("DOMContentLoaded", () => {
  const screenWidth = window.screen.width;
  let celsiusText = document.getElementById("celsius");
  let fahrenheitText = document.getElementById("fahrenheit");
  let kelvinText = document.getElementById("kelvin");
  console.log(screenWidth);
  if (screenWidth <= 382) {
    celsiusText.textContent = "° C";
    fahrenheitText.textContent = "° F";
    kelvinText.textContent = "K";
  } else {
    celsiusText.textContent = "Celsius";
    fahrenheitText.textContent = "Fahrenheit";
    kelvinText.textContent = "Kelvin";
  }
});

const unitButtons = document.querySelectorAll(".unitButton");
unitButtons.forEach((button) => {
  button.addEventListener("click", () => {
    selectedUnit = button.textContent;
    isUnitPressed = true;
    console.log(selectedUnit);

    const unclickedButtons = [...unitButtons].filter((btn) => btn !== button);

    unclickedButtons.forEach((btn) => {
      btn.classList.remove("isPressed");
    });

    button.classList.add("isPressed");

    console.log(isUnitPressed);
  });
});

weatherForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const city = cityInput.value;

  if (city) {
    try {
      const weatherData = await getWeather(city);
      displayWeather(weatherData);
    } catch (error) {
      console.error(error);
      displayError(error);
    }
  } else {
    displayError("Please enter a valid city name");
  }
});

async function getWeather(city) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

  const response = await fetch(apiUrl);

  if (!response.ok) {
    throw new Error("Could not fetch weather data");
  }

  return await response.json();
}

function displayWeather(data) {
  const {
    name: city,
    main: { temp, humidity },
    weather: [{ description, id }],
  } = data;

  card.textContent = "";
  card.style.display = "flex";

  const cityDisplay = document.createElement("h1");
  const tempDisplay = document.createElement("p");
  const humidityDisplay = document.createElement("p");
  const descriptionDisplay = document.createElement("p");
  const weatherEmoji = document.createElement("p");

  cityDisplay.textContent = city;

  const unitTypes = {
    Celsius: `${Math.round(temp - 273.15)}°C`,
    Fahrenheit: `${Math.floor(((temp - 273.15) * 9) / 5 + 32)}°F`,
    Kelvin: `${Math.round(temp)}K`,
  };

  if (!isUnitPressed || !selectedUnit) {
    displayError("Please select a unit");
  } else {
    tempDisplay.textContent = unitTypes[selectedUnit];
    humidityDisplay.textContent = `Humidity: ${humidity}%`;
    descriptionDisplay.textContent =
      description.charAt(0).toUpperCase() + description.slice(1);
    weatherEmoji.textContent = getWeatherEmoji(id);

    cityDisplay.classList.add("cityDisplay");
    tempDisplay.classList.add("tempDisplay");
    humidityDisplay.classList.add("humidityDisplay");
    descriptionDisplay.classList.add("descripitionDisplay");
    weatherEmoji.classList.add("weatherEmoji");

    card.appendChild(cityDisplay);
    card.appendChild(tempDisplay);
    card.appendChild(humidityDisplay);
    card.appendChild(descriptionDisplay);
    card.appendChild(weatherEmoji);
  }
}

function getWeatherEmoji(weatherId) {
  switch (true) {
    case weatherId >= 200 && weatherId < 300:
      return "⛈️"; // Thunderstorm
    case weatherId >= 300 && weatherId < 500:
      return "🌧️"; // Drizzle
    case weatherId >= 500 && weatherId < 600:
      return "🌧️"; // Rain
    case weatherId >= 600 && weatherId < 700:
      return "❄️"; // Snow
    case weatherId >= 700 && weatherId < 800:
      return "🌫️"; // Atmosphere
    case weatherId === 800:
      return "☀️"; // Clear
    case weatherId > 800:
      return "☁️"; // Clouds
    default:
      return "❓"; // Unknown
  }
}

function displayError(message) {
  const errorDisplay = document.createElement("p");
  errorDisplay.textContent = message;
  errorDisplay.classList.add("errorDisplay");

  card.textContent = "";
  card.style.display = "flex";
  card.appendChild(errorDisplay);
}
