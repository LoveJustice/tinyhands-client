import MapController from './map.controller';

describe('MapController', () => {
    let controller,
        mockNgMap,
        mockMap,
        borderStations,
        mockBorderStationService,
        $rootScope;

    let borderStation =     {
        id: 1,
        station_name: "Foo",
        station_code: "FOO",
        latitude:  10,
        longitude: 12,
        date_established: "2017-1-1",
        has_shelter: true,
        number_of_interceptions: 10,
        ytd_interceptions: 6,
        number_of_staff: 3
    };

    let expectedMappedStation = {
        id: 1,
        markerId: 'station-1',
        stationName: 'Foo',
        stationCode: 'FOO',
        position: [10, 12],
        dateEstablished: '2017-1-1',
        hasShelter: true,
        interceptions: 10,
        ytdInterceptions: 6,
        numberOfStaff: 3
    };

    beforeEach(inject((_$rootScope_, $q) => {
        $rootScope = _$rootScope_;
        mockMap = jasmine.createSpyObj('map', ['showInfoWindow', 'hideInfoWindow']);

        mockNgMap = jasmine.createSpyObj('ngMap', ['getMap']);
        mockNgMap.getMap.and.callFake(() => {
            return $q.resolve(mockMap);
        });

        borderStations = [ borderStation ];

        mockBorderStationService = jasmine.createSpyObj('borderStationService', ['getBorderStations']);
        mockBorderStationService.getBorderStations.and.callFake(() => {
            return $q.resolve({ data: borderStations });
        });

        controller = new MapController($rootScope, mockNgMap, mockBorderStationService);
    }));

    describe('center', () => {
        it(`should return map center point`,() => {
            expect(controller.center).toBe('28.394857, 84.124008');
        });
    });

    describe('apiUrl', () => {
        it(`should return correct map api url`,() => {
            expect(controller.apiUrl).toBe("https://maps.google.com/maps/api/js?key=AIzaSyChNFPd_bOOnk59AkeKM862OqN80Lvp56g");
        });
    });

    describe('fusionLayerOptions', () => {
        it(`should return fusion layer options`,() => {
            var expectedOptions = {
                query: {
                    select: 'col13',
                    from: '1r-omWhMz1wzQG3-e55K7dmCetVe3fRWX4Ai4G_U1'
                },
                styles: [{
                    polygonOptions: {
                        fillOpacity: 0.2,
                        fillColor: '#FFFFFF'
                    }
                }],
                styleId: 2,
                templateId: 2
            }

            expect(controller.fusionLayerOptions).toEqual(expectedOptions);
        });
    });

    describe('function createMapListeners', () => {

        it("should call rootScope $on with first argument of 'toggleAddress2Layer'", () => {
            spyOn(controller.rootScope, "$on");
            controller.createMapListeners();
            expect(controller.rootScope.$on).toHaveBeenCalled();
        });
    });

    describe('getBorderStations', () => {

        it('should call borderStationService getBorderStations', () => {
            controller.getBorderStations();
            expect(mockBorderStationService.getBorderStations).toHaveBeenCalled();
        });

        describe('when border stations received', () => {
            it('should set border stations to mapped station data', () => {
                controller.getBorderStations();
                $rootScope.$apply();

                expect(controller.borderStations).toEqual([ expectedMappedStation ]);
            });
        });
    });

    describe('mapStationData', () => {
        it('should map borderStations to station objects for ui', () => {
            let result = controller.mapStationData(borderStation);
            expect(result).toEqual(expectedMappedStation);
        });
    });

    describe('showStationInfoWindow', () => {
        it('should hide info window', () => {
            $rootScope.$apply();
            controller.showStationInfoWindow(null, { markerId: 2 });
            expect(mockMap.hideInfoWindow).toHaveBeenCalledWith(controller.locationInfoWindowId);
            expect(mockMap.hideInfoWindow).toHaveBeenCalledWith(controller.stationInfoWindowId);
        });

        it('should set selected station', () => {
            $rootScope.$apply();
            let station = { markerId: 2 };
            controller.showStationInfoWindow(null, station);
            expect(controller.station).toBe(station);
        });

        it('should show station info window', () => {
            $rootScope.$apply();
            controller.showStationInfoWindow(null, { markerId: 2 });
            expect(mockMap.showInfoWindow).toHaveBeenCalledWith(controller.stationInfoWindowId, 2);
        });
    });

    describe('showLocationInfoWindow', () => {
        it('should hide info window', () => {
            $rootScope.$apply();
            controller.showLocationInfoWindow(null, { markerId: 2 });
            expect(mockMap.hideInfoWindow).toHaveBeenCalledWith(controller.locationInfoWindowId);
            expect(mockMap.hideInfoWindow).toHaveBeenCalledWith(controller.stationInfoWindowId);
        });

        it('should set selected station', () => {
            $rootScope.$apply();
            let location = { markerId: 2 };
            controller.showLocationInfoWindow(null, location);
            expect(controller.location).toBe(location);
        });

        it('should show station info window', () => {
            $rootScope.$apply();
            controller.showLocationInfoWindow(null, { markerId: 2 });
            expect(mockMap.showInfoWindow).toHaveBeenCalledWith(controller.locationInfoWindowId, 2);
        });
    });
});
