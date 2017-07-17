angular.module('switchToggle', [])

    .controller('switchTogglecontroller', function () {

    })

    .directive('switchToggle', function () {
        return {
            templateUrl: 'app/switch-toggle-button/switch-toggle.html',
            scope: {
                normalColor: '@',
                checkedColor: '@',
                falseValue: '@',
                trueValue: '@',
                onChange: '&',
                changeValue: '='
            },
            link: function (scope, element, attrs, controller, transcludeFn) {

                element.on('change', function () {

                    if (scope.changeValue.rows === scope.trueValue) {
                        scope.changeValue.rows = scope.falseValue;
                    } else {
                        scope.changeValue.rows = scope.trueValue;                        
                    }     

                    if (scope.onChange) {
                        scope.onChange();
                    }                    
                });
            }
        }
    });