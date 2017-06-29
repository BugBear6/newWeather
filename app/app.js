angular.module('newWeather', [])

.controller('weatherDashboardController', [function() {
    var vm = this;
    vm.cities = ['Barcelona'];
    vm.weather = {};
}])


.directive('weatherWidget', function() {
    return {
        templateUrl: 'weather-widget.html',
        scope: {
            city: '@'
        },
        controller: ['$scope', '$http', function($scope, $http) {
            // getWeatherService.fiveDaysBroadcast()

            var url = `http://api.openweathermap.org/data/2.5/forecast/daily?q=Barcelona&cnt=5&units=metric&appid=${api_key}`;
            var weather;

            $http({
                method: 'GET',
                url: url
            }).then(function successCallback(response) { // on success
                    weather = {
                        today: response.data.list.shift(),
                        forecast: response.data.list
                    }
                    console.info(weather)
                    $scope.weather = weather;
                },
                function errorCallback(response) { // on error
                    console.log(response);
                });
        }],
}
})

// get weather
//
// .service('getWeatherService', function($http) {
//     this.fiveDaysBroadcast = function() {
//         var url = `http://api.openweathermap.org/data/2.5/forecast/daily?q=Barcelona&cnt=5&units=metric&appid=${api_key}`;
//         var weather;

//         $http({
//             method: 'GET',
//             url: url
//         }).then(function successCallback(response) { // on success
//             return response;
//                 // weather = {
//                 //     today: response.data.list.shift(),
//                 //     forecast: response.data.list
//                 // }
//                 // return weather;
//             },
//             function errorCallback(response) { // on error
//                 console.log(response);
//             });

//         // response.list.forEach(function(el) {
//         //     data.push(round(el.temp.day));
//         // });

//         // response.list.forEach(function(el) {
//         //     days.push(day(el.dt));
//         // });

//         // weather.humidity = response.list[0].humidity + "%";
//         // weather.clouds = response.list[0].clouds + "%";
//         // weather.pressure = response.list[0].pressure + " hPa";
//         // weather.snow = response.list[0].snow || "brak opadów";
//         // weather.rain = response.list[0].rain || "brak opadów";
//         // weather.speed = response.list[0].speed + " m/s";

//         // weather.day = round(response.list[0].temp.day) + "°C";
//         // weather.max = round(response.list[0].temp.max) + "°C";
//         // weather.min = round(response.list[0].temp.min) + "°C";
//         // weather.night = round(response.list[0].temp.night) + "°C";

//     }
// }
// )


//  run server 
//  http-server -o