import MapController from './map.controller';
import BorderStationService from '../../border-station/borderStation.service';

describe('MapController', () => {
  let vm,
      rootScope = {$on: () => {}},
      uiggmapi = {then: () => {}};

  beforeEach(inject(($http, $q) => {
    let bsService = new BorderStationService($http, $q);
    vm = new MapController(rootScope, bsService, uiggmapi);
  }));

  describe('function constructor', () => {

    it('should set maps to null', () => {
      expect(vm.maps).toBeNull();
    });

    let nepal = {lat: 28.394857, lon: 84.124008};
    it(`should set nepal to ${nepal}`, () => {
      expect(vm.nepal).toEqual(nepal);
    });

    it('should set borderStations to []', () => {
      expect(vm.borderStations).toEqual([]);
    });

    it('should set showAddress2Layer to true', () => {
      expect(vm.showAddress2Layer).toBe(true);
    });

    let templateUrl = 'app/dashboard/map/infoWindow.html';
    it(`should set templateUrl to '${templateUrl}'`, () => {
      expect(vm.templateUrl).toEqual(templateUrl);
    });

    it('should call createMapListeners', () => {
      spyOn(vm, 'createMapListeners');
      vm.constructor(rootScope, null, uiggmapi);
      expect(vm.createMapListeners).toHaveBeenCalled();
    });

    it('should call initializeGoogleMaps', () => {
      spyOn(vm, 'initializeGoogleMaps');
      vm.constructor(rootScope, null, uiggmapi);
      expect(vm.initializeGoogleMaps).toHaveBeenCalled();
    });

  });

  describe('function createMapListeners', () => {

    it("should call rootScope $on with first argument of 'toggleAddress2Layer'", () => {
      let firstArg;
      vm.rootScope.$on = (a) => {firstArg = a;};
      vm.createMapListeners();
      expect(firstArg).toEqual('toggleAddress2Layer');
    });

    it('should call toggleAddress2Layer with 1 and 2', () => {
      vm.rootScope.$on = (_, f) => {f(1, 2);};
      spyOn(vm, 'toggleAddress2Layer');
      vm.createMapListeners();
      expect(vm.toggleAddress2Layer).toHaveBeenCalledWith(1, 2);
    });

  });

  describe('getBorderStations', () => {

    it('should call borderStationService getBorderStations', () => {
      spyOn(vm.borderStationService, 'getBorderStations').and.callThrough();
      vm.getBorderStations();
      expect(vm.borderStationService.getBorderStations).toHaveBeenCalled();
    });

    describe('on then', () => {
      let response = {data: [1,2,3]};
      beforeEach(() => {
        vm.borderStationService.getBorderStations = () => { return {
          then: (f) => {f(response)}
        };};

        // need to do this here because of read-only properties stuff
        spyOn(vm, 'setInfoWindowParams');
      });

      it(`should set borderStations to ${response.data}`, () => {
        vm.borderStations = [];
        vm.getBorderStations();
        expect(vm.borderStations).toEqual(response.data);
      });

      it('should call setInfoWindowParams with 1', () => {
        vm.getBorderStations();
        expect(vm.setInfoWindowParams).toHaveBeenCalledWith(1);
      });

      it('should call setInfoWindowParams with 2', () => {
        vm.getBorderStations();
        expect(vm.setInfoWindowParams).toHaveBeenCalledWith(2);
      });

      it('should call setInfoWindowParams with 3', () => {
        vm.getBorderStations();
        expect(vm.setInfoWindowParams).toHaveBeenCalledWith(3);
      });

    });

  });

  describe('function initializeGoogleMaps', () => {

    let maps = {
      ControlPosition: {},
      MapTypeControlStyle: {},
      ZoomControlStyle: {},
    };
    let gMapsApi = {then: (f) => {
      f(maps);
    }};

    it(`should set maps to '${maps}'`, () => {
      vm.maps = null;
      vm.initializeGoogleMaps(gMapsApi);
      expect(vm.maps).toEqual(maps);
    });

    it('should call setMapData', () => {
      spyOn(vm, 'setMapData');
      vm.initializeGoogleMaps(gMapsApi);
      expect(vm.setMapData).toHaveBeenCalled();
    });

    it('should call setAddress2Layer', () => {
      spyOn(vm, 'setAddress2Layer');
      vm.initializeGoogleMaps(gMapsApi);
      expect(vm.setAddress2Layer).toHaveBeenCalled();
    });

    it('should call getBorderStations', () => {
      spyOn(vm, 'getBorderStations');
      vm.initializeGoogleMaps(gMapsApi);
      expect(vm.getBorderStations).toHaveBeenCalled();
    });

  });

  describe('function setAddress2Layer', () => {

    beforeEach(() => {
      vm.setAddress2Layer();
    });

    it("should set layerOptions.query.select to 'col13'", () => {
      expect(vm.layerOptions.query.select).toEqual('col13');
    });

    it("should set layerOptions.query.from to '1r-omWhMz1wzQG3-e55K7dmCetVe3fRWX4Ai4G_U1'", () => {
      expect(vm.layerOptions.query.from).toEqual('1r-omWhMz1wzQG3-e55K7dmCetVe3fRWX4Ai4G_U1');
    });

    let style = {polygonOptions: {fillOpacity: 0.2}};
    it(`should set layerOptions.styles to ${[style]}`, () => {
      expect(vm.layerOptions.styles).toEqual([style]);
    });

    it("should set layerOptions.options.styleId to 2", () => {
      expect(vm.layerOptions.options.styleId).toEqual(2);
    });

    it("should set layerOptions.options.templateId to 2", () => {
      expect(vm.layerOptions.options.templateId).toEqual(2);
    });

  });

  describe('function setInfoWindowParams', () => {

    it("should set borderStation.templateUrl to 'foo'", () => {
      let borderStation = {};
      vm.templateUrl = 'foo';
      vm.setInfoWindowParams(borderStation);
      expect(borderStation.templateUrl).toEqual('foo');
    });

    it('should set borderStation.templateParameter to borderStation', () => {
      let borderStation = {
        date_established: 123,
        has_shelter: true,
        id: 321,
        number_of_staff: 10,
        number_of_interceptions: 10,
        station_code: 100,
        station_name: 200
      };
      let templateParameter = angular.copy(borderStation);
      vm.setInfoWindowParams(borderStation);
      expect(borderStation.templateParameter).toEqual(templateParameter);
    });

  });

  describe('function setMapData', () => {

    let nepal = {lat: 123, lon: 321},
        maps = {
          ControlPosition: {TOP_LEFT: 'foo', RIGHT_BOTTOM: 'bar'},
          MapTypeControlStyle: {HORIZONTAL_BAR: 'baz'},
          ZoomControlStyle: {SMALL: 'qux'},
        },
        data = {
          control: {},
          options: {
            mapTypeControlOptions: {
              position: maps.ControlPosition.TOP_LEFT,
              style: maps.MapTypeControlStyle.HORIZONTAL_BAR
            },
            panControl: false,
            streetViewControl: false,
            zoomControlOptions: {
              position: maps.ControlPosition.RIGHT_BOTTOM,
              style: maps.ZoomControlStyle.SMALL
            }
          },
        };

    it(`should set data to ${data}`, () => {
      vm.data = null;
      vm.nepal = nepal;
      vm.maps = maps;
      vm.setMapData();
      expect(vm.data).toEqual(data);
    });

  });

  describe('function toggleAddress2Layer', () => {

    it('should set showAddress2Layer to true with true', () => {
      vm.showAddress2Layer = null;
      vm.toggleAddress2Layer(null, true);
      expect(vm.showAddress2Layer).toBe(true);
    });

    it('should set showAddress2Layer to false with false', () => {
      vm.showAddress2Layer = null;
      vm.toggleAddress2Layer(null, false);
      expect(vm.showAddress2Layer).toBe(false);
    });

  });

});
