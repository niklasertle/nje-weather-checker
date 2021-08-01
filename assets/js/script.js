var searchInput = $('#search-input');
var searchHistoryEl = $('#search-history-element');

// Gets the lat and lon of the location from Open Weather API when input into the search box
var getLocation = function (event) {
    event.preventDefault();
    var citySearch = searchInput.val().trim();
    var searchUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + citySearch + '&appid=ca767b568b7657c6b5f4da781ac95579'

    fetch(searchUrl).then(function (response) {
        if (response.status === 404) {
            return alert('Please enter a valid city');
        } else {
            return response.json();
        }
    }).then(function (data) {
        if (data.status === 404) {
            return alert('Please enter a valid city');
        } else {
            searchHistory(citySearch);
            var lat = data.coord.lat;
            var lon = data.coord.lon;
            getWeather(lat, lon, citySearch);
        };
    });
    $("#form-el").trigger("reset")
};

// Uses the lat and lon to get the forecast for the location searched
function getWeather(lat, lon, city) {
    var searchUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon + '&units=imperial&appid=ca767b568b7657c6b5f4da781ac95579';

    fetch(searchUrl).then(function (response) {
        if (response.status === 404) {
            console.log('404 Error');
            return;
        } else {
            return response.json();
        }
    }).then(function (data) {
        displayCurrentWeather(data.current, city);
        displayFiveDay(data);
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
    var weatherIcon = $('#weather-icon');
    
    // City(date)
    var dateCode = new Date(data.dt * 1000);
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
    var month = months[dateCode.getMonth()];
    var date = dateCode.getDate();
    var year = dateCode.getFullYear();
    var currentDay = month + '/' + date + '/' + year;
    $('#current-city-name').text(city + ' (' + currentDay + ')');
    // Weather Icon
    var iconCode = data.weather[0].icon;
    var iconSRC = "http://openweathermap.org/img/w/" + iconCode + ".png";
    weatherIcon.attr('src', iconSRC);
    // Temp
    $('#current-temp').text('Temperate: ' + data.temp + ' °F');
    // Wind
    $('#current-wind').text('Wind: ' + data.wind_speed + ' MPH');
    // Humidity
    $('#current-humidity').text('Humidity: ' + data.humidity + '%');
    // UV Index
    $('#current-uvindex').text('UV Index: ' + data.uvi);
};

//Displays the five day forecast from the weather API and uses empty to remove the previous searches elements
function displayFiveDay(data) {
    var fiveDayEl = $('#five-day-el');

    fiveDayEl.empty();

    for (let i = 1; i < 6; i++) {
        var weatherData = data.daily[i];
        const divEl = $('<div>');
        divEl.addClass('col-2 five-day-blocks');
        // Date
        var dateCode = new Date(weatherData.dt * 1000);
        var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        var month = months[dateCode.getMonth()];
        var date = dateCode.getDate();
        var year = dateCode.getFullYear();
        const dateEl = $('<p>' + month + '/' + date + '/' + year + '</p>');
        // Icon
        var iconCode = weatherData.weather[0].icon;
        var iconSRC = "http://openweathermap.org/img/w/" + iconCode + ".png";
        const iconEl = $('<img src="'+ iconSRC +'"></img>');
        // Temp
        const tempEl = $('<p>Temperate: ' + weatherData.temp.day + ' °F</p>');
        // Wind
        const windEl = $('<p>Wind: ' + weatherData.wind_speed + ' MPH</p>');
        // Humidity
        const humidityEl = $('<p>Humidity: ' + weatherData.humidity + '%</p>');

        dateEl.appendTo(divEl);
        iconEl.appendTo(divEl);
        tempEl.appendTo(divEl);
        windEl.appendTo(divEl);
        humidityEl.appendTo(divEl);
        divEl.appendTo(fiveDayEl);
    };
};

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

//TODO: How to concat words to be searched properly is they contain more than 2 words
//TODO: Created buttons will not query a search until the page has been reloaded