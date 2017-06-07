import IrfListController from './irfList.controller';

describe('IRF List Controller',() => {
    let vm,
        $timeout,
        MockIrfListService,
        MockSessionService,
        MockSpinnerOverlayService,
        MockStickyHeader,
        mockToastr,
        $state,
        $stateParams,
        moment,
        queryParameters,
        transformedQueryParameters;

    beforeEach(angular.mock.module('tinyhands.IRF'));

    beforeEach(inject((_$state_, _$timeout_, _moment_) => {
        $state = _$state_;
        $timeout = _$timeout_;
        $stateParams = {"search": "BHD"};
        MockSessionService = { user: { } };
        MockSpinnerOverlayService = jasmine.createSpyObj('SpinnerOverlayService', ['show', 'hide']);
        MockStickyHeader = jasmine.createSpyObj('StickyHeader', ['stickyOptions']);

        MockIrfListService = jasmine.createSpyObj('IrfListService', [
            'getIrfList',
            'getMoreIrfs',
            'deleteIrf',
            'irfExists',
            'getCsvExport'
        ]);

        let response = {'data':{
                        "count": 0,
                        "results": [],
                        "next": "",
                        "previous": ""}
        };

        MockIrfListService.getIrfList.and.callFake( () => {
            return {
                then: (f) => {
                    f(response);
                }
            };
        });

        MockIrfListService.irfExists.and.callFake( () => {
            return {
                then: (f) => {
                    f({data: "BHD123"});
                }
            };
        });

        mockToastr = jasmine.createSpyObj('mockToastr', ['success', 'error']);
        moment = _moment_;
        vm = new IrfListController(MockIrfListService, MockSessionService, MockSpinnerOverlayService, MockStickyHeader, $state, $stateParams, $timeout, mockToastr, {BaseUrl: "asdf"}, moment);
    }));

    describe('function constructor', () => {
        it('expect the search parameter to be set', () => {
            expect(vm.queryParameters.search).toBe("BHD");
        });

        it('expect the search parameter to be set', () => {
            $stateParams = {};
            vm = new IrfListController(MockIrfListService, MockSessionService, MockSpinnerOverlayService, MockStickyHeader, $state, $stateParams, $timeout, {}, {BaseUrl: "asdf"}, moment);
            expect(vm.queryParameters.search).not.toBe(null);
        });

        it('expect checkForExistingIrfs to be called', () => {
            spyOn(vm, 'checkForExistingIrfs');
            vm.constructor(MockIrfListService, MockSessionService, MockSpinnerOverlayService, MockStickyHeader, $state, $stateParams, $timeout, {}, {BaseUrl: "asdf"}, moment);
            expect(vm.checkForExistingIrfs).toHaveBeenCalled();
        });
    });

    describe('hasAddPermission', () => {
        describe('when user has irf add permission', () => {
            it('should return true', () => {
                MockSessionService.user.permission_irf_add = true;

                expect(vm.hasAddPermission).toBe(true);
            });
        });

        describe('when user does not have irf add permission', () => {
            it('should return false', () => {
                MockSessionService.user.permission_irf_add = false;

                expect(vm.hasAddPermission).toBe(false);
            });
        });
    });

    describe('hasDeletePermission', () => {
        describe('when user has irf delete permission', () => {
            it('should return true', () => {
                MockSessionService.user.permission_irf_delete = true;

                expect(vm.hasDeletePermission).toBe(true);
            });
        });

        describe('when user does not have irf delete permission', () => {
            it('should return false', () => {
                MockSessionService.user.permission_irf_delete = false;

                expect(vm.hasDeletePermission).toBe(false);
            });
        });
    });

    describe('hasEditPermission', () => {
        describe('when user has irf edit permission', () => {
            it('should return true', () => {
                MockSessionService.user.permission_irf_edit = true;

                expect(vm.hasEditPermission).toBe(true);
            });
        });

        describe('when user does not have irf edit permission', () => {
            it('should return false', () => {
                MockSessionService.user.permission_irf_edit = false;

                expect(vm.hasEditPermission).toBe(false);
            });
        });
    });

    describe('hasViewPermission', () => {
        describe('when user has irf view permission', () => {
            it('should return true', () => {
                MockSessionService.user.permission_irf_view = true;

                expect(vm.hasViewPermission).toBe(true);
            });
        });

        describe('when user does not have irf view permission', () => {
            it('should return false', () => {
                MockSessionService.user.permission_irf_view = false;

                expect(vm.hasViewPermission).toBe(false);
            });
        });
    });

    describe('function transform', () => {
        beforeEach(inject(() => {
            queryParameters = {
                "page_size": 50,
                "reverse": true,
                "ordering": 'irf_num',
                "search": 'BHD'
            };

            transformedQueryParameters = [
                {"name": "page_size", "value": 50},
                {"name": "ordering", "value": "-irf_num"},
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
            var val = vm.extractPage('http://tinyhandsdreamsuite.org/api/irf/?page=6&ordering=irf_number');
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
            vm.queryParameters.ordering = 'irf_number';
            vm.queryParameters.reverse = false;

            vm.updateSort('irf_number');
            expect(vm.queryParameters.reverse).toBe(true);
            expect(vm.queryParameters.ordering).toBe('irf_number');
        });

        it('expect it to flip the reverse bool when column is equal to the parameter', () => {
            vm.queryParameters.ordering = 'irf_number';
            vm.queryParameters.reverse = true;

            vm.updateSort('irf_number');
            expect(vm.queryParameters.reverse).toBe(false);
            expect(vm.queryParameters.ordering).toBe('irf_number');
        });

        it('expect it to not flip the reverse bool when column is not equal to the parameter and expect it to change the ordering parameter', () => {
            vm.queryParameters.ordering = 'irf_number';
            vm.queryParameters.reverse = true;

            vm.updateSort('rf_number');
            expect(vm.queryParameters.reverse).toBe(true);
            expect(vm.queryParameters.ordering).toBe('rf_number');
        });

        it('expect it to not flip the reverse bool when column is not equal to the parameter and expect it to change the ordering parameter', () => {
            vm.queryParameters.ordering = 'irf_number';
            vm.queryParameters.reverse = false;

            vm.updateSort('rf_number');
            expect(vm.queryParameters.reverse).toBe(false);
            expect(vm.queryParameters.ordering).toBe('rf_number');
        });
    });

    describe('function checkForExistingIrfs', () => {
        let savedIrfs;
        beforeEach(() => {
            savedIrfs = {
                BHD123: {asdf: "asdf"},
                BHD1234: {asdf: "asdf"}
            };
            localStorage.setItem('saved-irfs', JSON.stringify(savedIrfs));
        });

        it('should return undefined if no saved-irfs', () => {
            localStorage.removeItem('saved-irfs');
            let result = vm.checkForExistingIrfs();

            expect(result).toEqual(undefined);
        });

        it('should call irfExists on each form in savedIrfs', () => {
            vm.checkForExistingIrfs();

            expect(vm.service.irfExists).toHaveBeenCalledWith('BHD123');
            expect(vm.service.irfExists).toHaveBeenCalledWith('BHD1234');
        });

        it('should call removeIrfFromSaveForLater on response with same name', () => {
            spyOn(vm, 'removeIrfFromSaveForLater');

            vm.checkForExistingIrfs();

            expect(vm.removeIrfFromSaveForLater).toHaveBeenCalledWith('BHD123');
            expect(vm.removeIrfFromSaveForLater).not.toHaveBeenCalledWith('BHD1234');
        });
    });

    describe('function removeIrfFromSaveForLater', () => {
        let savedIrfs;
        beforeEach(() => {
            savedIrfs = {
                BHD123: {asdf: "asdf"},
                BHD1234: {asdf: "asdf"}
            };
            localStorage.setItem('saved-irfs', JSON.stringify(savedIrfs));
        });

        it('Should remove object with passed in parameter from local storage', () => {
            expect(savedIrfs).toEqual(JSON.parse(localStorage.getItem('saved-irfs')));

            vm.removeIrfFromSaveForLater('BHD123');

            expect(savedIrfs).not.toEqual(JSON.parse(localStorage.getItem('saved-irfs')));
        });
    });

    describe('exportCSV', () => {
        it('should show spinner', () => {
            vm.exportCsv();

            expect(MockSpinnerOverlayService.show).toHaveBeenCalledWith('Exporting to CSV');
        });

        it('should get CSV from service', () => {
            vm.exportCsv();

            expect(MockIrfListService.getCsvExport).toHaveBeenCalled();
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

            expect(result).toBe(`irf-all-data-${moment().format('Y-M-D')}.csv`);
        });
    });
});
