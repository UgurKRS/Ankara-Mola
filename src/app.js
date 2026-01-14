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

  // --- SCRIPT 4: YOUTUBE LAZY LOAD (FACADE) ---
  // Replace YouTube thumbnail placeholders with real iframes on click
  const ytPlaceholders = document.querySelectorAll('.youtube-facade');
  
  ytPlaceholders.forEach(placeholder => {
    placeholder.addEventListener('click', () => {
      const videoId = placeholder.dataset.videoId;
      const iframe = document.createElement('iframe');
      iframe.setAttribute('width', '560');
      iframe.setAttribute('height', '315');
      iframe.setAttribute('src', `https://www.youtube.com/embed/${videoId}?autoplay=1`);
      iframe.setAttribute('title', 'YouTube video player');
      iframe.setAttribute('frameborder', '0');
      iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
      iframe.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
      iframe.setAttribute('allowfullscreen', '');
      
      placeholder.replaceWith(iframe);
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
    // Add a 5-second timeout to prevent hanging
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(apiUrl, { signal: controller.signal });
    clearTimeout(timeoutId);
    
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