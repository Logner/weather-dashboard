function getCityData (city) {
    // Empty Data
    var data = {};

    // api data
    var key = 'd91f911bcf2c0f925fb6535547a5ddc9';
    var unit = 'metric';
    var base = 'http://api.openweathermap.org/data/2.5/';

    // fetch requests
    fetch (base+'weather?q='+city+'&appid='+key+'&units='+unit)
    // necessary to resolve the fetch request promise
    .then (res => res.json())
    .then( response => {
        // Populate empty data container
        data.name = response.name;
        data.id = response.id;
        data.time = response.dt;
        data.lat = response.coord.lat;
        data.lon = response.coord.lon;
        data.country = response.sys.country;
        data.temp = response.main.temp;
        data.humidity = response.main.humidity;
        data.desc = response.weather[0].description;
        data.windSpeed = response.wind.speed;
        data.windDir = response.wind.deg;
        data.icon = response.weather[0].icon;

        // return fetch for UV index
        return fetch(base+'uvi?appid='+key+'&lat='+data.lat+'&lon='+data.lon);

    })
    .then(res => res.json())
    .then(response => {
        data.uv = response.value
        // return fetch for 5 day forecast
        return fetch(base+'forecast?q='+data.name+'&appid='+key+'&units='+unit)
    })
    .then(res => res.json())
    .then(function(response) {
        // adding forecasts to data as an array
        data.forecast = []

        response.list.forEach(function(date) {
            var hours = date.dt_txt.split(' ')[1].split('').splice(0,2).join('');
            if (hours == '12') {
                var forecast = {};
                forecast.time = date.dt;
                forecast.temp = date.main.temp;
                forecast.humidity = date.main.humidity;
                forecast.icon = date.weather[0].icon;
                forecast.desc = date.weather[0].description;

                data.forecast.push(forecast);
            }
        })

        return data
    })
    .then(function(result) {
        // populate the page based on data
        populateIndex(result)
    })
}

var convertDate = function(input) {
    var date = new Date(parseInt(input) * 1000);
    console.log(date)
    
    return date.toLocaleDateString() + date.toLocaleTimeString();
}

var populateIndex = function (cityData) {
    // Find right elements
    $('.current-weather.name')
    $('.current-weather.temp')
    $('.current-weather.humidity')
    $('.current-weather.wind')

    // update elements

    // add button and eventListener, check if button exists
    console.log(cityData)
}

$('#search').on('click', function(){
    var location = document.querySelector('#city-input');
    //TODO: Validate input to make sure only alpha characters are present
    getCityData(location.value);
    location.value = ''
})