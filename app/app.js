angular.module('newWeather', [])

.controller('weatherDashboardController', [function() {
    var vm = this;
    vm.cities = [{
            cityName: 'Madrid'
        },
        {
            cityName: 'Barcelona'
        }
    ];
}])

.directive('weatherWidget', function(getWeatherService, $rootScope) {
    return {
        templateUrl: 'weather-widget.html',
        scope: {
            city: '='
        },
        link: function(scope, elem, attrs) {

            getWeatherService.forSixDays(scope.city.cityName).then(
                function onSuccess(response) {

                    console.log('from factory to controller', response)
                    console.log('elem', elem)
                    console.log('attrs', attrs)
                    
                    scope.weather = {
                        today: response.data.list.shift(),
                        forecast: response.data.list
                    }
                    scope.location = {
                        city: response.data.city.name,
                        country: response.data.city.country
                    }
                },
                function onError(response) {
                    console.log(response)
                });

        }
    }
})

.factory('getWeatherService', function($http) {
    return {
        forSixDays: function(city) {
            console.log('city that comes', city)
            var url = `http://api.openweathermap.org/data/2.5/forecast/daily?q=${city}&cnt=6&units=metric&appid=${api_key}`;
            return $http({
                method: 'GET',
                url: url
            });
        }
    }
})

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