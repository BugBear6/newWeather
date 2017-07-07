angular.module('newWeather', ['randomColor', 'ngSanitize', 'ngCookies'])

.controller('weatherDashboardController', ['$cookies', '$rootScope', '$interval', '$timeout', function($cookies, $rootScope, $interval, $timeout) {
	var vm = this;
	vm.cities = [];
	$rootScope.intervals = [];
	vm.newCityFormData = {};

	// handle city cookie
	var citiesCookie = $cookies.getObject('citiesCookie');
	if (citiesCookie) {
		vm.cities = angular.copy(citiesCookie);
	}
	vm.updateCityCookie = function() {
		$cookies.putObject('citiesCookie', vm.cities)
	}
	$rootScope.$on('updateCityCookie', vm.updateCityCookie);

	// add city
	vm.addCity = function() {
		if (!vm.newCityFormData.newCityName) {
			return;
		}

		var newCity = {
			cityName: vm.newCityFormData.newCityName,
			country: vm.newCityFormData.newCityCountry
		}
		vm.cities.push(newCity);

		vm.newCityForm.$setPristine();
		vm.newCityForm.$setUntouched();
		vm.newCityFormData = {};
		$rootScope.$broadcast('updateCityCookie');
	};

	// close widget
	vm.closeWidget = function(index) {
		console.log('$rootScope on close', $rootScope);
		// remove city from cities array
		vm.cities.splice(index, 1);
		// update cookie file
		$rootScope.$broadcast('updateCityCookie');
		// cancel running interval
		$interval.cancel($rootScope.intervals[index]);
		$rootScope.intervals.splice(index, 1);
		$timeout(function() {
			$rootScope.$apply();
		}, 250)
	}

	// refresh widget
	vm.refreshWidget = function(index) {
		vm.cities[index] = angular.copy(vm.cities[index]);
	}

	$rootScope.$watch($rootScope.intervals, function(){
		$timeout(function() {
			console.log('apply');
			$rootScope.$apply();
		}, 100);
	}, true);

}])

.filter('weatherIcon', function($sce) {
	return function(weatherCode, isNight) {

		var isNight = isNight || false;
		var template;
		var iconCode;

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

.directive('weatherWidget', function(getWeatherService, getFlickrPhotosSerice, randomColorService, $rootScope, $interval) {
	return {
		templateUrl: 'weather-widget.html',
		scope: {
			city: '=',
			index: '@',
			getPhoto: '@',
			closeWidget: '&',
			refreshWidget: '&',
		},
		link: function(scope, elem, attrs) {
			// init widget
			getWeather(scope.getPhoto);

			// auto refresh widget
			$rootScope.intervals[scope.index] = $interval(function() {
				getWeather(false);
			}, 8000);

			function getWeather(getPhoto) {
				getWeatherService.forSixDays(scope.city).then(
					function onSuccess(response) {
						console.log('from factory to controller', response)
						var col;

						scope.weather = {
							today: response.data.list.shift(),
							forecast: response.data.list
						}

						if (getPhoto === 'true') {
							// randomColor
							// set location, color and photo data only on the first run
							col = randomColorService.getColor();
							scope.location = {
								city: response.data.city.name,
								country: response.data.city.country,
								bgColor: col,
								photoUrl: ''
							}
						}

						$rootScope.$broadcast('weatherUpdate');

						if (getPhoto === 'true') {
							// get city photos 
							// set location, color and photo data only on the first run
							getFlickrPhotosSerice.getCity(scope.city)
								.then(function onSuccess(response) {
									console.log('photo', response);
									var photos = response.data.photos.photo,
										photoNumber = Math.floor((Math.random() * photos.length) + 1) - 1,
										photo = photos[photoNumber];

									var farmId = photo.farm,
										serverId = photo.server,
										id = photo.id,
										secret = photo.secret,
										size = 'c';

									var photoUrl = `https://farm${farmId}.staticflickr.com/${serverId}/${id}_${secret}_${size}.jpg`;
									scope.location.photoUrl = photoUrl;

								}, function onError(response) {
									console.log('Flickr API error: ', response)
								});

							// prevents from setting location data again on the interval
							scope.getPhoto = false;
						}
					},
					function onError(response) {
						console.log('OpenWeather connection error: ', response)
					});
			}

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

.factory('getFlickrPhotosSerice', function($http) {
	return {
		getCity: function(city) {
			console.log(city);
			var cityName = city.cityName;
			var tags = `${cityName},city` // any of them, separated by coma
			var tagsMode = 'all'; // Either 'any' for an OR combination of tags, or 'all' for an AND combination. Defaults to 'any' if not specified.
			var url = `https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=${flickr_key}&text=${cityName}&tags=${tags}&tags_mode=${tagsMode}&per_page=100&format=json&sort=relevance&nojsoncallback=1`;
			return $http({
				method: 'GET',
				url: url
			});
		}
	}
})


//  run server 
//  http-server -o