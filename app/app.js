angular.module('newWeather', ['ngSanitize', 'ngCookies'])

    .controller('weatherDashboardController', ['$cookies', function($cookies) {
        var vm = this;

        vm.cities = [{
            cityName: 'Madrid'
        }, {
            cityName: 'Barcelona'
        }];

        vm.newCityFormData = {};

        vm.addCity = function() {
            if (!vm.newCityFormData.newCityName) {
                return
            }

            var newCity = {
                cityName: vm.newCityFormData.newCityName,
                country: vm.newCityFormData.newCityCountry
            }
            vm.cities.push(newCity);

            vm.newCityForm.$setPristine();
            vm.newCityForm.$setUntouched();
            vm.newCityFormData = {};
        };

        vm.closeWidget = function(index) {
            vm.cities.splice(index, 1);
        }

    }])

    .filter('weatherIcon', function($sce) {
        return function(weatherCode, isNight) {
        	
            var isNight = isNight || false;
            var template;
            var iconCode;

            console.log('after broadcast', weatherCode);

            if (weatherCode == 800) { // clear sky
                iconCode = isNight ? '2' : 'B';
            } else if (weatherCode == 801) { // few clouds
                iconCode = isNight ? '4' : 'H';
            } else if (weatherCode == 802 || weatherCode == 803 || weatherCode == 804) { // scatered, broken, overcast clouds
                iconCode = isNight ? '5' : 'N';
            } else if (weatherCode >= 500 && weatherCode <= 531) { // rain group
                iconCode = isNight ? '8' : 'R';
            } else if (weatherCode >= 600 && weatherCode <= 622) { // snow group
                iconCode = isNight ? '#' : 'W';
            } else if (weatherCode == 701) { // mist
                iconCode = 'M';
            } else if ((weatherCode >= 200 && weatherCode <= 232) || weatherCode == 960 || weatherCode == 961) { // storm
                iconCode = isNight ? '&' : '0';
            } else if (weatherCode == 953 || weatherCode == 954 || weatherCode == 955 || weatherCode == 956 || weatherCode == 957 || weatherCode == 958 || weatherCode == 959) { // wind
                iconCode = isNight ? '&' : '0';
            } else {
                iconCode = ')';
            }

            template = `<span class="icon" data-icon="${iconCode}"></span>`
            return $sce.trustAsHtml(template);
        }
    })

    .directive('weatherWidget', function(getWeatherService, $rootScope) {
        return {
            templateUrl: 'weather-widget.html',
            scope: {
                city: '=',
                closeWidget: '&'
            },
            link: function(scope, elem, attrs) {

                getWeatherService.forSixDays(scope.city).then(
                    function onSuccess(response) {

                        console.log('from factory to controller', response)

                        scope.weather = {
                            today: response.data.list.shift(),
                            forecast: response.data.list
                        }
                        scope.location = {
                            city: response.data.city.name,
                            country: response.data.city.country
                        }

                        scope.initOver = true;
                        $rootScope.$broadcast('weatherUpdate');
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
                var cityName = city.cityName
                var country = (typeof city.country !== 'undefined' && city.country) ? ',' + city.country : '';
                var url = `http://api.openweathermap.org/data/2.5/forecast/daily?q=${cityName}${country}&cnt=6&units=metric&appid=${api_key}`;

                return $http({
                    method: 'GET',
                    url: url
                });
            }
        }
    })

// .factory('getDay', function(){
// 	return {
// 		getDay: function(timestamp){
// 			console.log(timestamp);
// 			var timestamp = new Date ()
// 		}
// 	}
// })

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