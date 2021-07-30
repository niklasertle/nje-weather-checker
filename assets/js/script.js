var searchInput = $('#search-input');
var searchHistoryEl = $('#search-history-element');
var currentWeatherEl = $('#current-weather');
var fiveDayEl = $('#five-day');

var getWeather = function (event) {
    event.preventDefault();
    var citySearch = searchInput.val().trim();
    console.log(citySearch);
};

$('#form-el').submit(getWeather);

// Fetch data for searched city from the weather API
// Save search to localStorage, delete at 10 cities
// Display search history from localStorage, buttons to be able to search again
// Display current weather
// Display 5 day forecast