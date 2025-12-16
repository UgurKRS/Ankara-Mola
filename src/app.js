// --- IMPORTS ---
import * as basicLightbox from 'basiclightbox';
import 'basiclightbox/dist/basicLightbox.min.css';

// --- MAIN STARTUP SCRIPT ---
// This one function runs after the HTML is loaded
document.addEventListener('DOMContentLoaded', () => {

  // --- SCRIPT 1: AUTOMATIC COPYRIGHT YEAR ---
  const yearSpan = document.getElementById("current-year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // --- SCRIPT 2: WEATHER WIDGET ---
  if (document.getElementById("weather-widget")) {
    fetchWeather();
  }

  // --- SCRIPT 3: LIGHTBOX FOR DETAIL IMAGES ---
  // Finds all images with the class "clickable-image"
  const images = document.querySelectorAll('.clickable-image');

  images.forEach(img => {
    img.addEventListener('click', () => {
      // When clicked, shows the lightbox
      basicLightbox.create(`
        <img src="${img.src}" style="max-width: 90vw; max-height: 90vh;">
      `).show();
    });
  });

}); // <-- End of the main startup script

// --- WEATHER FUNCTION ---
async function fetchWeather() {
  const weatherWidget = document.getElementById("weather-widget");
  const city = "Ankara";
  const apiKey = process.env.OPENWEATHER_API_KEY;

  if (!apiKey) {
    console.error("API Key not found.");
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
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`; // Using 2x icon

    weatherWidget.innerHTML = `
      <div class="weather-content">
        <img src="${iconUrl}" alt="${description}">
        <div class="weather-info">
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
    weatherWidget.innerHTML = "No se pudo cargar el tiempo.";
  }
}