describe('SwitchToggle test', () => {

    beforeEach(module('switchToggle'));

    var scope, element, model, key;

    beforeEach(inject(($rootScope, $compile) => {
        scope = $rootScope.$new();

        scope.name = 'switchView';

        scope.trueValue = 'threeRows';
        scope.key = 'rows';
        scope.model = {
            rows: 'threeRows'
        };

        key = scope.key;
        model = scope.model;

        element = angular.element(`
            <label for="{{name}}" class="switch-toggle">
                <input 
                    id="{{name}}" 
                    name="{{name}}"
                    type="checkbox"
                    ng-checked="model[key] === trueValue"
                    >
                <span></span>
            </label>`
        );

        element = $compile(element)(scope);

        $rootScope.$digest();
    }));

    describe("Check if `name`, `id` and `for` are the same", () => {
        it('should have an input with a name', () => {
            expect(element.find('input').attr('name')).toEqual('switchView');
        });
        it('should have a input with exact name and id', () => {
            expect(element.find('input').attr('id')).toEqual('switchView');
        });
        it('should have a label and input with the same name', () => {
            expect(element.attr('for')).toEqual('switchView');
        });
    });

    describe('Check `checked` status', () => {
        it('should be checked', () => {
            expect(model[key] === scope.trueValue).toBe(true);
        });
        it('should not be checked', () => {
            expect(model[key] === 'twoValues').not.toBe(true);
        });
    });


});