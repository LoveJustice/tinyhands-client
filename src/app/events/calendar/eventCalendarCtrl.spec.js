describe("eventCalendarCtrl", function() {
    var scope, controller, mockModal;

    beforeEach(module('EventsMod'));

    beforeEach(inject(function($rootScope, $controller){
        scope = $rootScope.$new();
        mockModal = jasmine.createSpyObj('mockModal', ['open']);
        controller = $controller('CalendarCtrl', {$modal: mockModal});
    }));

    describe('getToday', function() {
        it('should return today as YYYY-MM-DD', function() {
            var testDate = new Date(2016, 10, 29); //setting month to 10=Nov. as 0=Jan.
            jasmine.clock().mockDate(testDate);

            var result = controller.getToday();

            expect(result).toEqual("2016-11-29");
        });

        it('when month is a single digit should append leading zero', function() {
            var testDate = new Date(2016, 0, 29); //setting date to Jan. 1st 2016
            jasmine.clock().mockDate(testDate);

            var result = controller.getToday();

            expect(result).toEqual("2016-01-29");
        });

        it('when month is a single digit should append leading zero', function() {
            var testDate = new Date(2016, 10, 9); //setting date to Jan. 1st 2016
            jasmine.clock().mockDate(testDate);

            var result = controller.getToday();

            expect(result).toEqual("2016-11-09");
        });
    });

    describe('onCalendarEventClicked', function() {
        it('should open Event Modal', function() {
            var mockEvent = {title: 'foo'};

            controller.onCalendarEventClicked(mockEvent);
            scope.$apply();

            expect(mockModal.open).toHaveBeenCalled();
            var modalArgs = mockModal.open.calls.mostRecent().args[0];
            expect(modalArgs.templateUrl).toEqual('modal.html');
            expect(modalArgs.controller).toEqual('EventModalCtrl');
            expect(modalArgs.controllerAs).toEqual('modalCtrl');
            expect(modalArgs.bindToController).toEqual(true);
            expect(modalArgs.resolve.event()).toEqual(mockEvent);
        });
    });
});