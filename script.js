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

var convertDate = function(input, format) {
    var date = moment(input, 'X');
    console.log(date)
    
    if (format == 'current') {
            return date.format('LLL');
    } else {
        return date.format('LL')
    }
}

var getWindDirection = function(windDegrees) {
    var deg = parseInt(windDegrees);
    if (deg < 30) {
        return 'N'
    }else if(deg < 60) {
        return 'NE'
    }else if(deg < 120) {
        return 'E'
    }else if(deg < 150) {
        return 'SE'
    }else if(deg < 210){
        return 'S'
    }else if(deg < 240){
        return 'SW'
    }else if(deg < 300){
        return 'W'
    }else if(deg < 330){
        return 'NW'
    }else{
        return 'N'
    }
}

var getUvHtml = function(num) {
    var uv = parseInt(num);
    if (uv < 3) {
        return "bg-success text-white"
    } else if (uv < 5) {
        return "bg-warning text-dark"
    }else{
        return "bg-danger text-white"
    }
}

var populateIndex = function (cityData) {
    // Update Page Content
    $('.name').html('<h5>'+cityData.name+' on '+convertDate(cityData.time, 'current')+'</h5>');
    $('.temp').html(cityData.temp+'°C with '+cityData.desc+' <img id="current-img">');
    $('#current-img').attr('src', "http://openweathermap.org/img/w/"+cityData.icon+".png")
    $('.humidity').html('Humidity: '+cityData.humidity+'%');
    $('.wind').html('Wind Speed: '+cityData.windSpeed+' m/s blowing '+getWindDirection(cityData.windDir));
    $('.uv').html('UV: <span class="'+getUvHtml(cityData.uv)+' px-2"> '+cityData.uv+' </span>')

    // update Forecast Container
    var forecastContainer = $('.forecast-container')
    forecastContainer.html("")
    cityData.forecast.forEach(function(date, i){
        console.log(date)
        var dateContainer = $('<div>');
        dateContainer.attr('class', 'card m-3 border-info col text-center');

        var header = $("<div>");
        header.attr('class', 'card-header');
        var time = $('<h6>');
        time.attr('class', 'card-title text-info')
        time.html(convertDate(date.time, 'forecast'));


        var body = $('<div>')
        body.attr('class', 'class-body')
        var img = $('<img>');
        img.attr('id', "img"+i)
        var temp = $('<h7>');
        temp.html(date.temp+'°C with '+date.desc);
        temp.attr('class', 'card-text text-info')
        var humidity = $('<p>');
        humidity.attr('class', 'card-text text-info')
        humidity.html('Humidity: '+date.humidity+'%');

        header.append(time);
        body.append(img,temp,humidity);
        dateContainer.append(header,body);
        forecastContainer.append(dateContainer);

        // Must append parents to actual HTML before forcing an image draw....
        $('#img'+i).attr('src', "http://openweathermap.org/img/w/"+date.icon+".png")
    })


    // add button and eventListener, check if button exists
    console.log(cityData)
}

$('#search').on('click', function(){
    var location = document.querySelector('#city-input');
    //TODO: Validate input to make sure only alpha characters are present
    getCityData(location.value);
    location.value = ''
})

getCityData('Toronto')