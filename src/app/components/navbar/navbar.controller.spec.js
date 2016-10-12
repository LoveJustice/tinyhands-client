import NavbarController from './navbar.controller';
import BorderStationService from '../../border-station/borderStation.service';

describe('NavbarController', () => {
  let vm, session;

  beforeEach(inject(($http, $q) => {
    let $scope = {$on: () => {}},
        $timeout,
        bss = new BorderStationService($http, $q);
    session = {logout: () => {}, user: {}};
    vm = new NavbarController($scope, $timeout, bss, session);
  }));

  describe('function constructor', () => {

    it('should set borderStations to []', () => {
      expect(vm.borderStations).toEqual([]);
    });

    it(`should set nepalTime to string`, () => {
      expect(typeof vm.nepalTime).toEqual('string');
    });

    it('should call window.moment.tz', () => {
      spyOn(window.moment, 'tz').and.callThrough();
      vm.constructor({$on: () => {}});
      expect(window.moment.tz).toHaveBeenCalledWith('Asia/Kathmandu');
    });

    it("should call $scope.$on with first argument as 'GetNavBarBorderStations'", () => {
      let firstArg,
          $scope = {$on: (a) => { firstArg = a}};
      vm.constructor($scope, null, null, session);
      expect(firstArg).toEqual('GetNavBarBorderStations');
    });

    it('should call getBorderStations', () => {
      let $scope = {$on: (_, f) => { f() }};
      spyOn(vm, 'getBorderStations');
      vm.constructor($scope, null, null, session);
      expect(vm.getBorderStations).toHaveBeenCalled();
    });

  });

  describe('function getBorderStations', () => {

    it('should call borderStationService getBorderStations', () => {
      spyOn(vm.borderStationService, 'getBorderStations').and.callThrough();
      vm.session.user.permission_border_stations_view = true;
      vm.getBorderStations();
      expect(vm.borderStationService.getBorderStations).toHaveBeenCalled();
    });

    it('should set borderStations to 123', () => {
      let response = {data: 123};
      vm.borderStationService.getBorderStations = () => {return {then: (f) => {f(response)}}};
      vm.session.user.permission_border_stations_view = true;
      vm.getBorderStations();
      expect(vm.borderStations).toEqual(response.data);
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
