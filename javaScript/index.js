"use strict";

// * HTML Elements
const searchInput = document.querySelector(".searchInput");
const findBtn = document.querySelector(".findBtn");
const country = document.querySelector(".location");
const degree = document.querySelector(".degree span");
const currentDayCustom = document.querySelector(".custom");
const weatherIcon = document.querySelector(".degree + .icon img");
const day = document.querySelector(".day");
const nextDay = document.querySelector(".next-day");
const nexttDay = document.querySelector(".nextt-day");
const formattedDate = document.querySelector(".date");
const nextDayMaxDegree = document.querySelector(".next-degree span");
const nextDayMinDegree = document.querySelector(".next-degree + small");
const nextDayCustom = document.querySelector(".next-custom");
const nextdayIcon = document.querySelector(".forecast-icon img")
const nexttDayMaxDegree = document.querySelector(".nextt-degree span");
const nexttDayMinDegree = document.querySelector(".nextt-degree + small");
const nexttDayCustom = document.querySelector(".nextt-custom");
const nexttdayIcon = document.querySelector(".forecast-iicon img")


// * App Variables
let cityName = "";

// * Functions

// ! Fetch data from API
async function getData(method, query) {
    const response = await fetch(`https://api.weatherapi.com/v1/${method}.json?key=b7f5b25b7cd24e8293b180332241010&q=${query}`);
    return await response.json();
}

// ! Display weather data
async function displayData() {
    const searchData = await getData("search", searchInput.value);

    if (searchData && searchData[0]) {
        country.innerHTML = searchData[0].name;
        cityName = searchData[0].name;

        const currentWeather = await getData("current", searchInput.value);

        if (currentWeather.current) {
            degree.innerHTML = currentWeather.current.temp_c;
            currentDayCustom.innerHTML = currentWeather.current.condition.text;
            weatherIcon.src = currentWeather.current.condition.icon;

            await getNextDaysWeather(cityName, 2, nextDayMaxDegree, nextDayMinDegree, nextDayCustom, nextdayIcon);
            await getNextDaysWeather(cityName, 3, nexttDayMaxDegree, nexttDayMinDegree, nexttDayCustom, nexttdayIcon);
        }
    }
}

// ! Get user location and weather based on geolocation
function getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            const data = await getData("current", `${latitude},${longitude}`);

            if (data.location) {
                country.innerHTML = data.location.region;
                degree.innerHTML = data.current.temp_c;
                cityName = data.location.region;

                getFormattedDates(data);
                await getNextDaysWeather(cityName, 1, nextDayMaxDegree, nextDayMinDegree, nextDayCustom, nextdayIcon);
                await getNextDaysWeather(cityName, 2, nexttDayMaxDegree, nexttDayMinDegree, nexttDayCustom, nexttdayIcon);
            }
        }, () => {
            alert("Unable to retrieve your location.");
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

// ! Format dates for display
function getFormattedDates(data) {
    const date = new Date(data.location.localtime);
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    day.innerHTML = daysOfWeek[date.getDay()];
    nextDay.innerHTML = daysOfWeek[(date.getDay() + 1) % 7];
    nexttDay.innerHTML = daysOfWeek[(date.getDay() + 2) % 7];
    formattedDate.innerHTML = `${date.getDate()} ${months[date.getMonth()]}`;
}

// ! Get weather for the next 2 days
async function getNextDaysWeather(city, dayIndex, maxDegreeElem, minDegreeElem, customElem, icon) {
    const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=b7f5b25b7cd24e8293b180332241010&q=${city}&days=${dayIndex + 1}`);
    const forecastData = await response.json();

    if (forecastData.forecast) {
        const dayData = forecastData.forecast.forecastday[dayIndex - 1];
        maxDegreeElem.innerHTML = `${dayData.day.maxtemp_c}`;
        minDegreeElem.innerHTML = `${dayData.day.mintemp_c}`;
        customElem.innerHTML = `${dayData.day.condition.text}`;
        icon.src = dayData.day.condition.icon;
    } else {
        console.error("Forecast data not available.");
    }
}

// * Events
searchInput.addEventListener("input", displayData);
findBtn.addEventListener("click", displayData);
window.addEventListener("load", getUserLocation);
