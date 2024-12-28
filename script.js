function getWeather() {
    const apiKey = 'YOUR_API_KEY'; // Replace with your actual API key
    const city = document.getElementById('city').value;

    if (!city) {
        alert('Please enter a city');
        return;
    }

    // Fetch current weather using the city name (no need for lat/lon)
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

    fetch(currentWeatherUrl)
        .then(response => {
            // Check if the response is ok (status code 200)
            if (!response.ok) {
                throw new Error(`Error: ${response.statusText} (${response.status})`);
            }
            return response.json();
        })
        .then(data => {
            if (data.cod === '404') {
                throw new Error('City not found');
            }
            console.log('Weather Data:', data); // Log for debugging
            displayWeather(data);
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            alert(`Error fetching weather data: ${error.message}. Please try again.`);
        });

    // Fetch hourly forecast (You can modify this as needed to fetch forecast data if required)
    const hourlyForecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;
    fetch(hourlyForecastUrl)
        .then(response => {
            // Check if the response is ok (status code 200)
            if (!response.ok) {
                throw new Error(`Error: ${response.statusText} (${response.status})`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Hourly Forecast Data:', data); // Log for debugging
            displayHourlyForecast(data.list); // Pass hourly data to display
        })
        .catch(error => {
            console.error('Error fetching hourly forecast data:', error);
            if (error.message.includes("401")) {
                alert('Invalid API key. Please check your API key and try again.');
            } else {
                alert(`Error fetching hourly forecast data: ${error.message}. Please try again.`);
            }
        });
}

function displayWeather(data) {
    const tempDivInfo = document.getElementById('temp-div');
    const weatherInfoDiv = document.getElementById('weather-info');
    const weatherIcon = document.getElementById('weather-icon');
    const hourlyForecastDiv = document.getElementById('hourly-forecast');

    // Clear previous content
    weatherInfoDiv.innerHTML = '';
    hourlyForecastDiv.innerHTML = '';
    tempDivInfo.innerHTML = '';

    if (data.cod === '404') {
        weatherInfoDiv.innerHTML = `<p>${data.message}</p>`;
    } else {
        const cityName = data.name;
        const temperature = Math.round(data.main.temp - 273.15); // Convert to Celsius
        const description = data.weather[0].description;
        const iconCode = data.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

        const temperatureHTML = `<p>${temperature}°C</p>`;
        const weatherHtml = `<p>${cityName}</p><p>${description}</p>`;

        tempDivInfo.innerHTML = temperatureHTML;
        weatherInfoDiv.innerHTML = weatherHtml;
        weatherIcon.src = iconUrl;
        weatherIcon.alt = description;
        weatherIcon.style.display = 'block'; // Ensure the weather icon is visible

        showImage();
    }
}

function displayHourlyForecast(hourlyData) {
    const hourlyForecastDiv = document.getElementById('hourly-forecast');

    // Use first 8 intervals (3-hour intervals) for the next 24 hours
    const next24Hours = hourlyData.slice(0, 8);

    hourlyForecastDiv.innerHTML = ''; // Clear previous forecast data
    next24Hours.forEach(item => {
        const dateTime = new Date(item.dt * 1000); // Convert timestamp to milliseconds
        const hour = dateTime.getHours(); // Get the hour of the forecast
        const temperature = Math.round(item.main.temp - 273.15); // Convert to Celsius
        const iconCode = item.weather[0].icon; // Weather icon code
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

        // Create hourly forecast HTML
        const hourlyItemHtml = `
            <div class="hourly-item">
                <span>${hour}:00</span>
                <img src="${iconUrl}" alt="Weather Icon">
                <span>${temperature}°C</span>
            </div>
        `;

        // Append to the hourly forecast container
        hourlyForecastDiv.innerHTML += hourlyItemHtml;
    });
}

function showImage() {
    const weatherIcon = document.getElementById('weather-icon');
    weatherIcon.style.display = 'block'; // Make the image visible once it's loaded
}
