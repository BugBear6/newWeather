angular.module('newWeather', [])

    .controller('weatherDashboardController', [function() {
        var vm = this;

        vm.cities = [{
            cityName: 'Madrid'
        }, {
            cityName: 'Barcelona'
        }];

        vm.newCityFormData = {};

        vm.addCity = function() {
        	console.log(!vm.newCityFormData.newCityName);
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

        vm.closeWidget = function (index) {
        	console.log(index);
        	vm.cities.splice(index, 1);
        }

    }])

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