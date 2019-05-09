import {
    LocationSelectController
}
from './location-select.component';

describe('LocationSelectController', () => {
    let vm;
    beforeEach(() => {
        let LocationService = {
            getLocation: () => ({
                then: () => {}
            })
        };
        vm = new LocationSelectController(LocationService);
    });

    describe('function filterLocationByName', () => {
        let location;
        beforeEach(() => {
            location = 'Johnalonny Jordanstinston';
        });

        it('when searchValue is in location name should return true', () => {
            let value = 'alon';

            let isContained = vm.filterLocationByName(location, value);

            expect(isContained).toBeTruthy();
        });


        it('when searchValue is not in location name should return false', () => {
            let value = 'bob';

            let isContained = vm.filterLocationByName(location, value);

            expect(isContained).toBeFalsy();
        });

        it('when location is undefined, return false', () => {
            location = undefined;
            let value = 'bob';

            let isContained = vm.filterLocationByName(location, value);

            expect(isContained).toBeFalsy();
        });

        it('when value is undefined, return false', () => {
            let isContained = vm.filterLocationByName(location, undefined);

            expect(isContained).toBeFalsy();
        });
    });

    describe('$onInit', () => {
        it('should set selectedLocationList by splitting selectedLocation by semicolon', () => {
            let bob = 'Bob Foo';
            let joe = 'Joe Bar';
            let selectedLocation = bob + ';' + joe;
            vm.selectedLocation = selectedLocation;

            vm.$onInit();

            expect(vm.selectedLocationList).toContain(bob);
            expect(vm.selectedLocationList).toContain(joe);
        });
    });

    describe('when selectedLocationList changed', () => {

        it('should update selectedLocation', () => {
            let bob = 'Bob Foo';
            let joe = 'Joe Bar';
        
            vm.selectedLocationList = [bob, joe];

            expect(vm.selectedLocation).toEqual(bob + ';' + joe);

        });
    });
});