    angular.module('newWeather', [])

    .controller('mainController', [function() {
        console.log('main controller running', api_key);
        var vm = this;

        vm.value = 22;
    }])

    .factory('greeter', function() {
        return {
            getGreeting: function(name) {
                return "Hello " + name;
            }
        };
    });


    //  run server 
    //  http-server -o