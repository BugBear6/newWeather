// describe("getGreeting", function() {
//     var greeter;

//     beforeEach(module('newWeather'));

//     beforeEach(inject(function(_greeter_) {
//         greeter = _greeter_;
//     }));

//     it("says Hello to me", function() {
//         expect(greeter.getGreeting("Dave")).toEqual("Hello Dave");
//     });
// });

describe('mainController', function() {

    beforeEach(module('newWeather'));

    var mainCtrl;
    beforeEach(inject(function($controller) {
        mainCtrl = $controller('mainController');
    }));

    it('should have a value', function() {
        expect(mainCtrl.value).toEqual(22);
    });
});