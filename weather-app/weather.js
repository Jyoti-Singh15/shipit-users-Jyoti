// Global variables
let apiKey = "dummyapikey"; 
let weatherDisplay = document.getElementById("weather-display");
let errorDisplay = document.getElementById("error-display");
let debounceTimer;

// Initialize Enter key listener with debounce
document.getElementById("city-input").addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        getWeatherDebounced();
    }
});

// Debounce function to prevent API flooding
function getWeatherDebounced() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(getWeather, 500); // 500ms delay
}

function getWeather() {
    const cityInput = document.getElementById("city-input");
    const city = cityInput.value.trim();

    // Input validation: letters and spaces only
    if (!city || !/^[a-zA-Z\s]+$/.test(city)) {
        errorDisplay.textContent = "Please enter a valid city name.";
        weatherDisplay.innerHTML = "";
        return;
    }

    errorDisplay.textContent = "";
    weatherDisplay.innerHTML = "Loading...";

    fetch(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=no`)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            if (!data || !data.current || !data.location) {
                throw new Error("Invalid data received from API");
            }

            const temp = data.current.temp_c;
            const desc = data.current.condition.text;
            const icon = data.current.condition.icon ? "https:" + data.current.condition.icon : "default-icon.png";

            weatherDisplay.innerHTML = `
                <div class="flex flex-col items-center">
                    <img src="${icon}" alt="weather icon" class="mb-2">
                    <span class="text-xl font-bold">${temp} °C</span>
                    <span class="capitalize">${desc}</span>
                    <span class="text-gray-600 text-sm">${data.location.name}, ${data.location.country}</span>
                </div>
            `;
            errorDisplay.textContent = "";
        })
        .catch((err) => {
            errorDisplay.textContent = `Error: ${err.message}`;
            weatherDisplay.innerHTML = ""; // Clear old weather info
        });
}
