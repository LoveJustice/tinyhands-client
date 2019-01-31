import CifListController from './cifList.controller';

/* global angular */
/* global inject */

describe('CIF List Controller',() => {
    let vm,
        $timeout,
        MockCifListService,
        MockSessionService,
        MockSpinnerOverlayService,
        MockStickyHeader,
        mockToastr,
        $uibModal,
        $state,
        $stateParams,
        moment,
        queryParameters,
        transformedQueryParameters,
        checkPermissionValue = true;

    beforeEach(angular.mock.module('tinyhands.CIF'));

    beforeEach(inject((_$state_, _$timeout_, _moment_) => {
        $state = _$state_;
        $timeout = _$timeout_;
        $stateParams = {"search": "BHD"};
        MockSessionService = jasmine.createSpyObj('SessionService',['getUserPermissionList', 'checkPermission']);
        var user = Object();
        user.id = 10022;
        MockSessionService.user = user;
        MockSessionService.getUserPermissionList.and.callFake((a,b) => {
            return [{account:10, country: null, station: null, permission:23}];
        });
        MockSessionService.checkPermission.and.callFake((a,b) => {
            return checkPermissionValue;
        });
        MockSpinnerOverlayService = jasmine.createSpyObj('SpinnerOverlayService', ['show', 'hide']);
        MockStickyHeader = jasmine.createSpyObj('StickyHeader', ['stickyOptions']);

        MockCifListService = jasmine.createSpyObj('CifListService', [
            'getCifList',
            'getMoreCifs',
            'deleteCif',
            'cifExists',
            'getCsvExport',
            'getUserCountries',
            'getUserStationsForAdd'
        ]);

        let response = {'data':{
                        "count": 0,
                        "results": [],
                        "next": "",
                        "previous": ""}
        };

        MockCifListService.getCifList.and.callFake( () => {
            return {
                then: (f) => {
                    f(response);
                }
            };
        });

        MockCifListService.cifExists.and.callFake( () => {
            return {
                then: (f) => {
                    f({data: "BHD123"});
                }
            };
        });
        
        MockCifListService.getUserCountries.and.callFake( () => {
        	let response = {
        			data:[
		            	{id:1, name:"Nepal"},
		            	{id:4, name:"India"}
		            	]};
            return {
                then: (f) => {
                    f(response);
                }
            };
        });
        
        MockCifListService.getUserStationsForAdd.and.callFake( () => {
        	let response = {
        			data:[
		            	{id:1, name:"Test1", operating_country:1},
		            	{id:2, name:"Test2", operating_country:4}
		            	]};
            return {
                then: (f) => {
                    f(response);
                }
            };
        });

        mockToastr = jasmine.createSpyObj('mockToastr', ['success', 'error']);
        moment = _moment_;
        vm = new CifListController(MockCifListService, MockSessionService, MockSpinnerOverlayService, MockStickyHeader, $state, $stateParams, $uibModal, $timeout, mockToastr, {BaseUrl: "asdf"}, moment);
    }));

    describe('function constructor', () => {
        it('expect the search parameter to be set', () => {
            expect(vm.queryParameters.search).toBe("BHD");
        });

        it('expect the search parameter to be set', () => {
            $stateParams = {};
            vm = new CifListController(MockCifListService, MockSessionService, MockSpinnerOverlayService, MockStickyHeader, $state, $stateParams, $uibModal, $timeout, {}, {BaseUrl: "asdf"}, moment);
            expect(vm.queryParameters.search).not.toBe(null);
        });
    });

    describe('hasAddPermission', () => {
        describe('when user has cif add permission', () => {
            it('should return true', () => {
            	checkPermissionValue = true;

                expect(vm.hasAddPermission).toBe(true);
            });
        });

        describe('when user does not have cif add permission', () => {
            it('should return false', () => {
            	checkPermissionValue = false;

                expect(vm.hasAddPermission).toBe(false);
            });
        });
    });

    describe('function transform', () => {
        beforeEach(inject(() => {
            queryParameters = {
                "page_size": 50,
                "reverse": true,
                "ordering": 'cif_num',
                "search": 'BHD'
            };

            transformedQueryParameters = [
                {"name": "page_size", "value": 50},
                {"name": "ordering", "value": "-cif_num"},
                {"name": "search", "value": "BHD"}
            ];
        }));

        it('expect it to create an array of key value pairs for the parameters', () => {
            var val = vm.transform(queryParameters);
            expect(angular.equals(val, transformedQueryParameters)).toBe(true);
        });

        it('expect the reverse field to not be included', () => {
            queryParameters.reverse = false;
            var val = vm.transform(queryParameters);
            val.forEach( (obj) => {
                expect(obj.name).not.toEqual('reverse');
            });
        });

        it('expect the ordering field to have a "-" before the name', () => {
            var val = vm.transform(queryParameters);
            expect(val[1].value.slice(0,1)).toBe('-');
        });

        it('expect the ordering field to not have a "-" before the name', () => {
            queryParameters.reverse = false;
            var val = vm.transform(queryParameters);
            expect(val[1].value.slice(0,1)).not.toEqual('-');
        });
    });

    describe('function extractPage', () => {
        it('expect it to extract the page number so it can load the next page', () => {
            var val = vm.extractPage('http://tinyhandsdreamsuite.org/api/cif/?page=6&ordering=cif_number');
            expect(val).toBe('6');
        });
        it('When a null is passed in, expect to return 0', () => {
            var val = vm.extractPage(null);
            expect(val).toBe(0);
        });
    });

    describe('function getSortIcon', () => {
        it('expect it to return false when column is equal, but not reverse is not true', () => {
            var val = vm.getSortIcon('date_time_of_interception', '!reverse');
            expect(val).toBe(false);
        });

        it('expect it to return true when column is equal and reverse is true', () => {
            var val = vm.getSortIcon('date_time_of_interception', 'reverse');
            expect(val).toBe(true);
        });

        it('expect it to return false when column is not equal, but not reverse is true', () => {
            var val = vm.getSortIcon('ate_time_of_interception', 'reverse');
            expect(val).toBe(false);
        });

        it('expect it to return false when column is not equal, but not reverse is true', () => {
            var val = vm.getSortIcon('rf_number', '!reverse');
            expect(val).toBe(false);
        });
    });

    describe('function updateSort', () => {
        it('expect it to flip the reverse bool when column is equal to the parameter', () => {
            vm.queryParameters.ordering = 'cif_number';
            vm.queryParameters.reverse = false;

            vm.updateSort('cif_number');
            expect(vm.queryParameters.reverse).toBe(true);
            expect(vm.queryParameters.ordering).toBe('cif_number');
        });

        it('expect it to flip the reverse bool when column is equal to the parameter', () => {
            vm.queryParameters.ordering = 'cif_number';
            vm.queryParameters.reverse = true;

            vm.updateSort('cif_number');
            expect(vm.queryParameters.reverse).toBe(false);
            expect(vm.queryParameters.ordering).toBe('cif_number');
        });

        it('expect it to not flip the reverse bool when column is not equal to the parameter and expect it to change the ordering parameter', () => {
            vm.queryParameters.ordering = 'cif_number';
            vm.queryParameters.reverse = true;

            vm.updateSort('rf_number');
            expect(vm.queryParameters.reverse).toBe(true);
            expect(vm.queryParameters.ordering).toBe('rf_number');
        });

        it('expect it to not flip the reverse bool when column is not equal to the parameter and expect it to change the ordering parameter', () => {
            vm.queryParameters.ordering = 'cif_number';
            vm.queryParameters.reverse = false;

            vm.updateSort('rf_number');
            expect(vm.queryParameters.reverse).toBe(false);
            expect(vm.queryParameters.ordering).toBe('rf_number');
        });
    });
    
    describe('function getUserStationsForAdd', () => {
    	it('expect getUserStationsForAdd to return stations', () => {
    		vm.getUserStationsForAdd();
    		expect(vm.stationsForAdd.length).toBe(2);
    		expect(vm.stationsForAdd[0].country_name).toBe('Nepal');
    		expect(vm.stationsForAdd[1].country_name).toBe('India');
    	});
    	
    });
    
    describe('function getUserCountries', () => {
    	it('expect getUserCountries to return countries', () => {
    		vm.getUserCountries();
    		expect(vm.countries.length).toBe(2);
    		expect(vm.countryDropDown.options.length).toBe(2);
    		expect(vm.countryDropDown.selectedOptions.length).toBe(0);
    	})
    	
    });

    describe('exportCSV', () => {
        it('should show spinner', () => {
            vm.exportCsv();

            expect(MockSpinnerOverlayService.show).toHaveBeenCalledWith('Exporting to CSV');
        });

        it('should get CSV from service', () => {
            vm.exportCsv();

            expect(MockCifListService.getCsvExport).toHaveBeenCalled();
        });
    });

    describe('onExportComplete', () => {
        it('should hide spinner', () => {
            vm.onExportComplete();

            expect(MockSpinnerOverlayService.hide).toHaveBeenCalled();
        });
    });

    describe('onExportError', () => {
        it('should show toastr error message', () => {
            vm.onExportError();

            expect(mockToastr.error).toHaveBeenCalledWith('An error occurred while exporting');
        });

        it('should hide spinner', () => {
            vm.onExportError();

            expect(MockSpinnerOverlayService.hide).toHaveBeenCalled();
        });
    });

    describe('getExportFileName', () => {
        it('should return filename with date', () => {
            let result = vm.getExportFileName();

            expect(result).toBe(`cif-all-data-${moment().format('Y-M-D')}.csv`);
        });
    });
});
