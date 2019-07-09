import NavbarController from './navbar.controller';
import BorderStationService from '../../border-station/borderStation.service';

describe('NavbarController', () => {
    let vm, session;

    beforeEach(inject(($http, $q) => {
        let $scope = { $on: () => {} },
            $timeout,
            bss = new BorderStationService($http, $q);
        session = {
            logout: () => {},
            user: {},
            checkPermission: () => {
                return true;
            },
        };
        vm = new NavbarController($scope, {}, $timeout, bss, session);
    }));

    describe('function constructor', () => {
        it('should set Country names and borderStationMap to empty states', () => {
            expect(vm.countryNames).toEqual([]);
            expect(vm.borderStationMap).toEqual({});
        });

        it("should call $scope.$on with first argument as 'GetNavBarBorderStations'", () => {
            let firstArg,
                $scope = {
                    $on: a => {
                        firstArg = a;
                    },
                };
            vm.constructor($scope, null, null, session);
            expect(firstArg).toEqual('GetNavBarBorderStations');
        });

        it('should call getBorderStations', () => {
            let $scope = {
                $on: (_, f) => {
                    f();
                },
            };
            spyOn(vm, 'getBorderStations');
            vm.constructor($scope, null, null, session);
            expect(vm.getBorderStations).toHaveBeenCalled();
        });
    });

    describe('function getBorderStations', () => {
        it('should call borderStationService getUserStations', () => {
            spyOn(vm.borderStationService, 'getUserStations').and.callThrough();
            vm.session.user.permission_border_stations_view = true;
            vm.getBorderStations();
            expect(vm.borderStationService.getUserStations).toHaveBeenCalled();
        });

        it('should set borderStations to 123', () => {
            let response = { data: [{ country_name: 'nepal', value: 5 }] };
            vm.borderStationService.getUserStations = () => {
                return {
                    then: f => {
                        f(response);
                    },
                };
            };
            vm.session.user.permission_border_stations_view = true;
            vm.getBorderStations();
            expect(vm.countryNames).toEqual(['nepal']);
            expect(vm.borderStationMap).toEqual({ nepal: [{ country_name: 'nepal', value: 5 }] });
        });
    });

    describe('function logout', () => {
        it('should call session logout', () => {
            spyOn(vm.session, 'logout');
            vm.logout();
            expect(vm.session.logout).toHaveBeenCalled();
        });
    });
});
