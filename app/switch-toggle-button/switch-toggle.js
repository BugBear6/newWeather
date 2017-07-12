angular.module('switchToggle', [])

.controller('switchTogglecontroller', function() {

})

.directive('switchToggle', function() {
    return {
        templateUrl: 'app/switch-toggle-button/switch-toggle.html',
        scope: {
            normalColor: '@',
            checkedColor: '@',
            falseValue: '@',
            trueValue: '@',
            changeValue: '='
        },
        link: function() {

        }
    }
});