var searchInput = $('#search-input');
var searchHistoryEl = $('#search-history-element');
var currentWeatherEl = $('#current-weather-el');
var fiveDayEl = $('#five-day-el');

// Gets the lat and lon of the location from Open Weather API
var getLocation = function (event) {
    event.preventDefault();
    var citySearch = searchInput.val().trim();
    var searchUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + citySearch + '&appid=ca767b568b7657c6b5f4da781ac95579'
    searchHistory(citySearch);

    fetch(searchUrl).then(function (response) {
        if (response === 404) {
            console.log('404 Error');
        } else {
            return response.json();
        }
    }).then(function (data) {
        var lat = data.coord.lat;
        var lon = data.coord.lon;
        getWeather(lat, lon);
    });
};

// Uses the lat and lon to get the forecast for the location searched
function getWeather(lat, lon) {
    var searchUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon + '&appid=ca767b568b7657c6b5f4da781ac95579';

    fetch(searchUrl).then(function (response) {
        if (response === 404) {
            console.log('404 Error');
        } else {
            return response.json();
        }
    }).then(function (data) {
        console.log(data);
    });
};

// Save search to localStorage, delete at 10 cities
function searchHistory(city) {
    const cityHistory = JSON.parse(localStorage.getItem('history')) || [];
    addToHistory(city);
    cityHistory.push(city);
    cityHistory.splice(9);
    localStorage.setItem('history', JSON.stringify(cityHistory));
};

// Display search history from localStorage, with buttons to be able to search again
function displayHistory(searchHistory) {
    searchHistory.forEach(element => {
        const listItem = $('<li>');
        const btnItem = $('<button>' + element + '</button>');
        btnItem.addClass('btn history-btn');
        btnItem.appendTo(listItem);
        listItem.appendTo(searchHistoryEl);
    });
};

function addToHistory(city) {
    const listItem = $('<li>');
    const btnItem = $('<button>' + city + '</button>');
    btnItem.addClass('btn history-btn');
    btnItem.appendTo(listItem);
    listItem.appendTo(searchHistoryEl);
};

$('#form-el').submit(getLocation);
displayHistory(JSON.parse(localStorage.getItem('history'))  || []);

// Display current weather
// Display 5 day forecast
// What if input is 2 words?