var searchInput = $('#search-input');
var searchHistoryEl = $('#search-history-element');
var fiveDayEl = $('#five-day-el');

// Gets the lat and lon of the location from Open Weather API when input into the search box
var getLocation = function (event) {
    event.preventDefault();
    var citySearch = searchInput.val().trim();
    var searchUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + citySearch + '&appid=ca767b568b7657c6b5f4da781ac95579'

    fetch(searchUrl).then(function (response) {
        if (response === 404) {
            return alert('Please enter a valid city');
        } else {
            return response.json();
        }
    }).then(function (data) {
        if (data) {
            searchHistory(citySearch);
            var lat = data.coord.lat;
            var lon = data.coord.lon;
            getWeather(lat, lon, citySearch);
        } else {
            return alert('Please enter a valid city');
        }
    });
    $("#form-el").trigger("reset")
};

// Uses the lat and lon to get the forecast for the location searched
function getWeather(lat, lon, city) {
    var searchUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon + '&units=imperial&appid=ca767b568b7657c6b5f4da781ac95579';

    fetch(searchUrl).then(function (response) {
        if (response === 404) {
            console.log('404 Error');
        } else {
            return response.json();
        }
    }).then(function (data) {
        displayCurrentWeather(data.daily[0], city);
        displayFiveDay(data,city)
    });
};

// Save search to localStorage, delete at 10 cities
function searchHistory(city) {
    const cityHistory = JSON.parse(localStorage.getItem('history')) || [];
    addToHistory(city);
    cityHistory.unshift(city);
    cityHistory.splice(10);
    deleteFromHistory(cityHistory);
    localStorage.setItem('history', JSON.stringify(cityHistory));
};

// Display search history from localStorage, with buttons to be able to search again
function displayHistory(searchHistory) {
    searchHistory.forEach(element => {
        const listItem = $('<li>');
        const btnItem = $('<button>' + element + '</button>');
        btnItem.addClass('btn history-btn');
        btnItem.attr('data-city', element);
        btnItem.appendTo(listItem);
        listItem.appendTo(searchHistoryEl);
    });
};

// Displays a new city in the search history when searched
function addToHistory(city) {
    const listItem = $('<li>');
    const btnItem = $('<button>' + city + '</button>');
    btnItem.addClass('btn history-btn');
    btnItem.attr('data-city', city);
    btnItem.appendTo(listItem);
    listItem.prependTo(searchHistoryEl);
};

// Removes the last item from the search history if it is over 10 items long
function deleteFromHistory(cityList) {
    if (cityList.length >= 10) {
        $('#search-history-element li:last-child').remove();;
    }
};

// Displays the current weather for the selected city into the current forecast box
function displayCurrentWeather(data, city) {
    var weatherIcon = $('#weather-icon')
    var currentTime = moment().format('MMM/do/YYYY');
    
    // City(date)
    $('#current-city-name').text(city + ' (' + currentTime + ')')
    // Weather Icon
    var iconCode = data.weather[0].icon
    var iconSRC = "http://openweathermap.org/img/w/" + iconCode + ".png"
    weatherIcon.attr('src', iconSRC)
    // Temp
    $('#current-temp').text('Temperate: ' + data.temp.day + ' °F')
    // Wind
    $('#current-wind').text('Wind: ' + data.wind_speed + ' MPH')
    // Humidity
    $('#current-humidity').text('Humidity: ' + data.humidity + '%')
    // UV Index
    $('#current-uvindex').text('UV Index: ' + data.uvi)
};

function displayFiveDay(data, city) {
    console.log(data);
    console.log(city);
}

// Gets the form element checking for a sumbit on it
$('#form-el').submit(getLocation);

// Displays the localStorage data on page start
displayHistory(JSON.parse(localStorage.getItem('history'))  || []);

// Gets the weather for cities in the search history on button click
$('.history-btn').click(function(e){
    var citySearch = $(e.target).data('city');
    var searchUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + citySearch + '&appid=ca767b568b7657c6b5f4da781ac95579'

    fetch(searchUrl).then(function (response) {
        return response.json();
    }).then(function (data) {
        var lat = data.coord.lat;
        var lon = data.coord.lon;
        getWeather(lat, lon, citySearch)
    });
});

// Display 5 day forecast
// What if input is 2 words?

//BUG: Created buttons will not query a search until the page has been reloaded