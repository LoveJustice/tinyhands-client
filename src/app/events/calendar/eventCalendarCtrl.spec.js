import EventCalendarController from './eventCalendar.controller';
import EventsService from '../events.service';

describe('EventCalendarController', () => {
    let vm;
    let $state,
        $uibModal,
        eventsService,
        $http;

    beforeEach(inject(($http) => {
        var eventsService = new EventsService($http);
        vm = new EventCalendarController($state, $uibModal, eventsService);
    }));


    describe('getToday', () => {
        beforeEach( () => {
            vm.constructor();
        });

        it('should return today as YYYY-MM-DD', () => {
            var testDate = new Date(2016, 10, 29); //setting month to 10=Nov. as 0=Jan.
            jasmine.clock().mockDate(testDate);

            var result = vm.getToday();

            expect(result).toEqual("2016-11-29");
        });

        it('when month is a single digit should append leading zero', () => {
            var testDate = new Date(2016, 0, 29); //setting date to Jan. 1st 2016
            jasmine.clock().mockDate(testDate);

            var result = vm.getToday();

            expect(result).toEqual("2016-01-29");
        });

        it('when month is a single digit should append leading zero', () => {
            var testDate = new Date(2016, 10, 9); //setting date to Jan. 1st 2016
            jasmine.clock().mockDate(testDate);

            var result = vm.getToday();

            expect(result).toEqual("2016-11-09");
        });
    });

});
