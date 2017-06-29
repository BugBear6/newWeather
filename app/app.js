angular.module('newWeather', [])

.controller('mainController', ['getWeatherService', function(getWeatherService) {
    console.log('main controller running', api_key);
    var vm = this;
    getWeatherService.fiveDaysBroadcast();
    vm.value = 22;
}])

.factory('greeter', function() {
    return {
        getGreeting: function(name) {
            return "Hello " + name;
        }
    };
})

.directive('weatherWidget', function() {
    return {
        templateUrl: 'weather-widget.html'
    }
})

// get weather
//
.service('getWeatherService', function($http) {
    this.fiveDaysBroadcast = function() {
        // api.openweathermap.org/data/2.5/forecast/daily?q=Barcelona,ES&cnt=5&units=metric&appid=
        // api.openweathermap.org/data/2.5/forecast?q=London,us&units=metric&appid=" + api_key 3h + 5 days
        // var url = "http://api.openweathermap.org/data/2.5/forecast/daily?id=" + cities[id] + "&units=metric&cnt=7&appid=" + key;
        var url = `http://api.openweathermap.org/data/2.5/forecast/daily?q=Barcelona&cnt=5&units=metric&appid=${api_key}`;
        var today;
        var forecast

        $http({
            method: 'GET',
            url: url
        }).then(function successCallback(response) { // on success

                today = response.data.list.shift();
                forecast = response.data.list;

                console.log(today)

            },
            function errorCallback(response) { // on error
                console.log(response);
            });

        // response.list.forEach(function(el) {
        //     data.push(round(el.temp.day));
        // });

        // response.list.forEach(function(el) {
        //     days.push(day(el.dt));
        // });

        // weather.humidity = response.list[0].humidity + "%";
        // weather.clouds = response.list[0].clouds + "%";
        // weather.pressure = response.list[0].pressure + " hPa";
        // weather.snow = response.list[0].snow || "brak opadów";
        // weather.rain = response.list[0].rain || "brak opadów";
        // weather.speed = response.list[0].speed + " m/s";

        // weather.day = round(response.list[0].temp.day) + "°C";
        // weather.max = round(response.list[0].temp.max) + "°C";
        // weather.min = round(response.list[0].temp.min) + "°C";
        // weather.night = round(response.list[0].temp.night) + "°C";

    }
})


//  run server 
//  http-server -o