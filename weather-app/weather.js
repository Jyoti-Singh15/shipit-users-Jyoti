// Global variables
let apiKey = "dummyapikey"; // Replace with your actual API key
let weatherDisplay = document.getElementById("weather-display");
let errorDisplay = document.getElementById("error-display");
let debounceTimer;

/**
 * Level 5 Bug 1 Fix: Debounce utility to prevent API spam.
 * This function ensures that the provided function `func` is not executed more than once
 * every `delay` milliseconds, preventing excessive API calls from rapid user input.
 */
function debounce(func, delay) {
    return function(...args) {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}

// Add Enter key listener
document.getElementById("city-input").addEventListener("keydown", (e) => {
    // Level 1 Bug 1 Fix: Trigger the weather search when the 'Enter' key is pressed.
    if (e.key === "Enter") {
        // Call the debounced version of the function to prevent multiple rapid submissions.
        debouncedGetWeather();
    }
});

function getWeather() {
    const city = document.getElementById("city-input").value.trim();

    // Level 4 Bug 1 Fix: Clear previous weather display and errors at the start of a new search.
    // This ensures that if the new API call fails, the old data isn't left on the screen.
    errorDisplay.textContent = "";
    weatherDisplay.innerHTML = "";

    if (!city) {
        errorDisplay.textContent = "Please enter a city name.";
        return;
    }
    
    // Level 5 Bug 2 Fix: Add basic input validation to check for a plausible city name format.
    // This regex allows letters, spaces, and hyphens, filtering out purely numerical or script-based inputs.
    const cityPattern = /^[a-zA-Z\s-]+$/;
    if (!cityPattern.test(city)) {
        errorDisplay.textContent = "Please enter a valid city name (letters, spaces, hyphens only).";
        return;
    }

    weatherDisplay.innerHTML = "Loading...";

    fetch(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=no`)
        .then((response) => {
            if (!response.ok) {
                // Provide a more user-friendly error for common problems like city not found.
                if(response.status === 400 || response.status === 404){
                     throw new Error(`'${city}' could not be found.`);
                }
                throw new Error(`HTTP error ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            // Add a more robust check for a valid data structure.
            if (!data || !data.current || !data.location) {
                throw new Error("Invalid data received from the weather service.");
            }

            const temp = data.current.temp_c;
            const desc = data.current.condition.text;
            
            // Level 4 Bug 2 Fix: Validate the icon path before trying to use it.
            // Use optional chaining (?.) to safely access nested properties. If the icon URL is missing,
            // the image tag will not be rendered, preventing a broken image from appearing.
            const iconUrl = data.current?.condition?.icon ? "https:" + data.current.condition.icon : "";
            const iconElement = iconUrl ? `<img src="${iconUrl}" alt="weather icon" class="mb-2">` : "";

            weatherDisplay.innerHTML = `
                <div class="flex flex-col items-center">
                    ${iconElement}
                    <span class="text-xl font-bold">${temp} °C</span>
                    <span class="capitalize">${desc}</span>
                    <span class="text-gray-600 text-sm">${data.location.name}, ${data.location.country}</span>
                </div>
            `;
            errorDisplay.textContent = ""; // Clear any previous errors on success.
        })
        .catch((err) => {
            errorDisplay.textContent = `Error: ${err.message}`;
            weatherDisplay.innerHTML = ""; // Ensure weather display is clear on error.
        });
}

// Create a debounced version of the getWeather function with a 500ms delay.
const debouncedGetWeather = debounce(getWeather, 500);