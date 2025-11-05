console.log("¡Hola desde app.js!");

// Automatic Copyright Year
const yearSpan = document.getElementById("current-year");
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

// --- Weather Widget ---

document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("weather-widget")) {
    fetchWeather();
  }
});

async function fetchWeather() {
  const weatherWidget = document.getElementById("weather-widget");
  const city = "Ankara";
  
  const apiKey = process.env.OPENWEATHER_API_KEY;

  if (!apiKey) {
    console.error("API Key not found. Make sure it's in your .env file.");
    weatherWidget.innerHTML = "Error: API Key no configurada.";
    return;
  }

  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=es`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    const temperature = Math.round(data.main.temp);
    const description = data.weather[0].description;
    const iconCode = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

    weatherWidget.innerHTML = `
      <div class="weather-content">
        <img src="${iconUrl}" alt="${description}">
        <div>
          <p class="weather-temp">${temperature}°C</p>
          <div class="weather-details">
            <p class="weather-desc">${description}</p>
            <p class="weather-city">${data.name}</p>
          </div>
        </div>
      </div>
    `;

  } catch (error) {
    console.error("Failed to fetch weather:", error);
    weatherWidget.innerHTML = "No se pudo cargar el tiempo. (Inténtalo de nuevo más tarde)";
  }
}