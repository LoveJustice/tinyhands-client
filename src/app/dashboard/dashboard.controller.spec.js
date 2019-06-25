import BaseService from '../base.service'
import DashboardController from './dashboard.controller';
import DashboardService from './dashboard.service';

describe('DashboardController', () => {

    let vm;
    beforeEach(inject(($http) => {
        let $rootScope = { $emit: () => { } };
        let sessionService = {user:{id:10032}};
        let baseService = new BaseService($http);
        let dashboardService = new DashboardService(baseService);
        vm = new DashboardController($rootScope, sessionService, dashboardService);
    }));

    describe('function constructor', () => {

        it('showTally should be true', () => {
            expect(vm.showTally).toBe(true);
        });

        it('showBorderStationLocations should be false', () => {
            expect(vm.showBorderStationLocations).toBe(false);
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
