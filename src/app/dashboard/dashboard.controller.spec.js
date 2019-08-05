import DashboardController from './dashboard.controller';

describe('DashboardController', () => {

    let vm;

    beforeEach(() => {
        let $rootScope = { $emit: () => { } };
        vm = new DashboardController($rootScope);
    });

    describe('function constructor', () => {
        it('showEvents should be true', () => {
            expect(vm.showEvents).toBe(true);
        });

        it('showTally should be true', () => {
            expect(vm.showTally).toBe(true);
        });

        it('showAddress2Layer shouw be true', () => {
            expect(vm.showAddress2Layer).toBe(true);
        });

        it('showBorderStationLocations should be false', () => {
            expect(vm.showBorderStationLocations).toBe(false);
        });
    });

    describe('toggleAddress2Layer', () => {
        it("emits the thing it's supposed to", () => {
            spyOn(vm.$rootScope, '$emit');

            vm.toggleAddress2Layer();

            expect(vm.$rootScope.$emit).toHaveBeenCalledWith('toggleAddress2Layer', vm.showAddress2Layer);
        });
    });

    describe('toggleBorderStationLocations', () => {
        it("emits the thing it's supposed to", () => {
            spyOn(vm.$rootScope, '$emit');

            vm.toggleBorderStationLocations();

            expect(vm.$rootScope.$emit).toHaveBeenCalledWith('toggleBorderStationLocations', vm.showBorderStationLocations);
        });
    });

});
