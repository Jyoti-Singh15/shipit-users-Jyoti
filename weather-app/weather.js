// Global variables
let apiKey = "dummyapikey"; 
let weatherDisplay = document.getElementById("weather-display");
let errorDisplay = document.getElementById("error-display");

// Add Enter key listener (fix Level 1 Bug 1)
document.getElementById("city-input").addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        getWeather();
    }
});

let debounceTimer;
function getWeather() {
    const city = document.getElementById("city-input").value.trim();
    
    // Level 5 Bug 2: Input validation (prevent numbers, scripts, or invalid entries)
    if (!city || /[^a-zA-Z\s]/.test(city)) {
        errorDisplay.textContent = "Please enter a valid city name.";
        weatherDisplay.innerHTML = "";
        return;
    }

    errorDisplay.textContent = "";
    weatherDisplay.innerHTML = "Loading...";

    // Level 5 Bug 1: Debounce the API call to prevent flooding
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        fetch(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=no`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                if (!data || !data.current || !data.current.condition) {
                    throw new Error("Invalid data received");
                }

                // Level 4 Bug 2: Validate icon URL
                let icon = data.current.condition.icon;
                if (!/^\/\//.test(icon)) {
                    throw new Error("Invalid icon URL");
                }
                icon = "https:" + icon; // prepend protocol

                const temp = data.current.temp_c;
                const desc = data.current.condition.text;

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
                // More descriptive error handling
                errorDisplay.textContent = `Error: ${err.message}`;
                weatherDisplay.innerHTML = ""; // Level 4 Bug 1 fix
            });
    }, 500); // 500ms debounce delay
}

// Level 4 Bug 1: Old weather doesn't clear if new search fails
// Level 4 Bug 2: Icons may not match weather condition: icon fetch not validated

// Level 5 Bug 1: No debounce for search; repeated clicks can flood API
// Level 5 Bug 2: No input validation (numbers, script, non-city input allowed)
