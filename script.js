import API_KEY from './config.js'; //remove this
//const API_KEY = 'YOUR_API_KEY'; //uncomment this line and put your api key here
const cityInput = document.querySelector("#city_input");
const searchBtn = document.querySelector("#searchBtn");
const locationBtn = document.querySelector("#locationBtn");
const currentWeatherCard = document.querySelectorAll(".weather-left .card")[0];
const fiveDaysForecastCard = document.querySelector(".day-forecast");
const aqiCard = document.querySelectorAll(".highlights .card")[0];
const sunriseCard = document.querySelectorAll(".highlights .card")[1];
const aqiList = ['Good', 'Fair', 'Moderate', 'Poor', 'Very Poor'];
const humidityVal = document.querySelector("#humidityVal"),
    pressureVal = document.querySelector("#pressureVal"),
    visibilityVal = document.querySelector("#visibilityVal"),
    windSpeedVal = document.querySelector("#windSpeedVal"),
    feelsVal = document.querySelector("#feelsVal");
const hourlyForecastCard = document.querySelector(".hourly-forecast");

function getWeatherDetails(name, lat, lon, country, state) {
    const FORECAST_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
    const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
    const AIR_POLLUTION_API_URL = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
    const days = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
    ];
    const months = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
    ];

    fetch(AIR_POLLUTION_API_URL)
        .then(res => res.json())
        .then(data => {
            if (data.list.length === 0) throw new Error("No air quality data available");
            const { co, no, no2, o3, so2, pm2_5, pm10, nh3 } = data.list[0].components;
            aqiCard.innerHTML = `
            <div class="card-head">
                <p>Air Quality Index</p>
                <p class="air-index aqi-${data.list[0].main.aqi}">${aqiList[data.list[0].main.aqi - 1]}</p>
            </div>
            <div class="air-indices">
                <i class="fa-regular fa-wind fa-3x"></i>
                ${generateAirQualityItems({ pm2_5, pm10, so2, co, no, no2, nh3, o3 })}
            </div>
            `;
        })
        .catch(() => {
            alert("Failed to fetch Air Quality Index");
        });

    fetch(WEATHER_API_URL)
        .then(res => res.json())
        .then(data => {
            const date = new Date();
            currentWeatherCard.innerHTML = `
                <div class="current-weather">
                    <div class="details">
                        <p>Now</p>
                        <h2>${(data.main.temp - 273.15).toFixed(2)}&deg;C</h2>
                        <p>${data.weather[0].description}</p>
                    </div>
                    <div class="weather-icon">
                        <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="weather icon">
                    </div>
                </div>
                <hr>
                <div class="card-footer">
                    <p><i class="fa-light fa-calendar"></i> ${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}</p>
                    <p><i class="fa-light fa-location-dot"></i> ${name}, ${country}</p>
                </div>
            `;

            const { sunrise, sunset } = data.sys,
                { timezone, visibility } = data,
                { humidity, pressure, feels_like } = data.main,
                { speed } = data.wind,
                sRiseTime = moment.utc(sunrise, 'X').add(timezone, 'seconds').format('hh:mm A'),
                sSetTime = moment.utc(sunset, 'X').add(timezone, 'seconds').format('hh:mm A');

            sunriseCard.innerHTML = `
            <div class="card-head">
                <p>Sunrise & Sunset</p>
            </div>
            <div class="sunrise-sunset">
                <div class="item">
                    <div class="icon">
                        <i class="fa-light fa-sunrise fa-4x"></i>
                    </div>
                    <div>
                        <p>Sunrise</p>
                        <h2>${sRiseTime}</h2>
                    </div>
                </div>
                <div class="item">
                    <div class="icon">
                        <i class="fa-light fa-sunset fa-4x"></i>
                    </div>
                    <div>
                        <p>Sunset</p>
                        <h2>${sSetTime}</h2>
                    </div>
                </div>
            </div>
            `;

            humidityVal.innerHTML = `${humidity}%`;
            pressureVal.innerHTML = `${pressure}hPa`;
            visibilityVal.innerHTML = `${visibility / 1000}km`;
            windSpeedVal.innerHTML = `${speed}m/s`;
            feelsVal.innerHTML = `${(feels_like - 273.15).toFixed(2)}&deg;C`;
        })
        .catch(() => {
            alert("Failed to fetch current weather");
        });

    fetch(FORECAST_API_URL)
        .then(res => res.json())
        .then(data => {
            const hourlyForecast = data.list;
            hourlyForecastCard.innerHTML = ``;
            for (let i = 0; i <= 7; i++) {
                const hrForecastDate = new Date(hourlyForecast[i].dt_txt);
                let hr = hrForecastDate.getHours();
                let a = 'PM';
                if (hr < 12) a = "AM";
                if (hr === 0) hr = 12;
                if (hr > 12) hr -= 12;
                hourlyForecastCard.innerHTML += `
                <div class="card">
                    <p>${hr} ${a}</p>
                    <img src="https://openweathermap.org/img/wn/${hourlyForecast[i].weather[0].icon}.png" alt="">
                    <p>${(hourlyForecast[i].main.temp - 273.15).toFixed(2)}&deg;C</p>
                </div>
                `;
            }

            const uniqueForecastDays = [];
            const fiveDaysForecast = data.list.filter(forecast => {
                const forecastDate = new Date(forecast.dt_txt).getDate();
                if (!uniqueForecastDays.includes(forecastDate)) {
                    uniqueForecastDays.push(forecastDate);
                    return true;
                }
                return false;
            });

            fiveDaysForecastCard.innerHTML = '';
            for (let i = 1; i < fiveDaysForecast.length; i++) {
                const date = new Date(fiveDaysForecast[i].dt_txt);
                fiveDaysForecastCard.innerHTML += `
                    <div class="forecast-item">
                        <div class="icon-wrapper">
                            <img src="https://openweathermap.org/img/wn/${fiveDaysForecast[i].weather[0].icon}.png" alt="weather icon">
                            <span>${(fiveDaysForecast[i].main.temp - 273.15).toFixed(2)}&deg;C</span>
                        </div>
                        <p>${date.getDate()} ${months[date.getMonth()]}</p>
                        <p>${days[date.getDay()]}</p>
                    </div>
                `;
            }
        })
        .catch(() => {
            alert("Failed to fetch weather forecast");
        });
}

function generateAirQualityItems(components) {
    return Object.keys(components).map(key => `
        <div class="item">
            <p>${key.toUpperCase()}</p>
            <h2>${components[key]}</h2>
        </div>
    `).join('');
}

function getCityCoordinates() {
    const cityName = cityInput.value.trim();
    cityInput.value = '';
    if (!cityName) return;
    const GEOCODING_API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=5&appid=${API_KEY}`;
    fetch(GEOCODING_API_URL)
        .then(res => res.json())
        .then(data => {
            if (!data.length) throw new Error('Location not found');
            const { name, lat, lon, country, state } = data[0];
            getWeatherDetails(name, lat, lon, country, state);
        })
        .catch(() => {
            alert('Failed to get coordinates');
        });
}

searchBtn.addEventListener("click", getCityCoordinates);
cityInput.addEventListener("keydown", e => {
    if (e.keyCode === 13) getCityCoordinates();
});

function getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            const REVERSE_GEOCODING_API_URL = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=5&appid=${API_KEY}`;
            fetch(REVERSE_GEOCODING_API_URL)
                .then(res => res.json())
                .then(data => {
                    if (!data.length) throw new Error('Location not found');
                    const { name, lat, lon, country, state } = data[0];
                    getWeatherDetails(name, lat, lon, country, state);
                })
                .catch(() => {
                    alert('Failed to get coordinates');
                });
        });
    }
}

locationBtn.addEventListener("click", getUserLocation);
