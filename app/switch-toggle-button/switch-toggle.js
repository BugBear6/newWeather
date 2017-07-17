angular.module('switchToggle', [])

    .directive('switchToggle', function () {
        return {
            templateUrl: 'app/switch-toggle-button/switch-toggle.html',
            scope: {
                // name / id
                name: '@',
                // colors
                normalColor: '@',
                checkedColor: '@',
                // model / data
                falseValue: '@',
                trueValue: '@',
                onChange: '&',
                model: '=',
                key: '@switchModelKey'
            },
            link: function (scope, element, attrs, controller, transcludeFn) {

                element.on('change', function () {

                    var model = scope.model,
                        key = scope.key,
                        trueValue = scope.trueValue,
                        falseValue = scope.falseValue;

                    if (model[key] === trueValue) {
                        model[key] = falseValue;
                    } else {
                        model[key] = trueValue;
                    }

                    if (scope.onChange) {
                        scope.onChange();
                    }
                });
            }
        }
    });