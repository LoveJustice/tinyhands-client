import VifListController from './vifList.controller';

describe('VIF List Controller',() => {
    let vm,
        $timeout,
        MockVifListService,
        MockSessionService,
        MockSpinnerOverlayService,
        MockStickyHeader,
        mockToastr,
        $state,
        $stateParams,
        queryParameters,
        transformedQueryParameters,
        moment;

    beforeEach(angular.mock.module('tinyhands.VIF'));

    beforeEach(inject((_$state_, _$timeout_, _moment_) => {
        $state = _$state_;
        $timeout = _$timeout_;
        $stateParams = {"search": "BHD"};
        moment = _moment_;
        MockSessionService = { user: { } };
        MockSpinnerOverlayService = jasmine.createSpyObj('SpinnerOverlayService', ['show', 'hide']);
        MockStickyHeader = jasmine.createSpyObj('StickyHeader', ['stickyOptions']);

        MockVifListService = jasmine.createSpyObj('VifListService', [
            'getVifList',
            'getMoreVifs',
            'deleteVif',
            'vifExists',
            'getCsvExport'
        ]);

        let response = {'data':{
                        "count": 0,
                        "results": [],
                        "next": "",
                        "previous": ""}
        };

        MockVifListService.getVifList.and.callFake( () => {
            return {
                then: (f) => {
                    f(response);
                }
            };
        });

        MockVifListService.vifExists.and.callFake( () => {
            return {
                then: (f) => {
                    f({data: "BHD123"});
                }
            };
        });

        mockToastr = jasmine.createSpyObj('mockToastr', ['success', 'error']);

        vm = new VifListController(MockVifListService, MockSessionService, MockSpinnerOverlayService, MockStickyHeader, $state, $stateParams, $timeout, mockToastr, {BaseUrl: "asdf"}, moment);
    }));

    describe('function constructor', () => {
        it('expect the search parameter to be set', () => {
            expect(vm.queryParameters.search).toBe("BHD");
        });

        it('expect the search parameter to be set', () => {
            $stateParams = {};
            vm = new VifListController(MockVifListService, MockSessionService, MockSpinnerOverlayService, MockStickyHeader, $state, $stateParams, $timeout, {}, {BaseUrl: "asdf"}, moment);
            expect(vm.queryParameters.search).not.toBe(null);
        });

        it('should be called with the constructor', () => {
            spyOn(vm, 'checkForExistingVifs');
            vm.constructor(MockVifListService, MockSessionService, MockSpinnerOverlayService, MockStickyHeader, $state, $stateParams, $timeout, {}, {BaseUrl: "asdf"}, moment);

            expect(vm.checkForExistingVifs).toHaveBeenCalled();
        });
    });

    describe('hasAddPermission', () => {
        describe('when user has vif add permission', () => {
            it('should return true', () => {
                MockSessionService.user.permission_vif_add = true;

                expect(vm.hasAddPermission).toBe(true);
            });
        });

        describe('when user does not have vif add permission', () => {
            it('should return false', () => {
                MockSessionService.user.permission_vif_add = false;

                expect(vm.hasAddPermission).toBe(false);
            });
        });
    });

    describe('hasDeletePermission', () => {
        describe('when user has vif delete permission', () => {
            it('should return true', () => {
                MockSessionService.user.permission_vif_delete = true;

                expect(vm.hasDeletePermission).toBe(true);
            });
        });

        describe('when user does not have vif delete permission', () => {
            it('should return false', () => {
                MockSessionService.user.permission_vif_delete = false;

                expect(vm.hasDeletePermission).toBe(false);
            });
        });
    });

    describe('hasEditPermission', () => {
        describe('when user has vif edit permission', () => {
            it('should return true', () => {
                MockSessionService.user.permission_vif_edit = true;

                expect(vm.hasEditPermission).toBe(true);
            });
        });

        describe('when user does not have vif edit permission', () => {
            it('should return false', () => {
                MockSessionService.user.permission_vif_edit = false;

                expect(vm.hasEditPermission).toBe(false);
            });
        });
    });

    describe('hasViewPermission', () => {
        describe('when user has vif view permission', () => {
            it('should return true', () => {
                MockSessionService.user.permission_vif_view = true;

                expect(vm.hasViewPermission).toBe(true);
            });
        });

        describe('when user does not have vif view permission', () => {
            it('should return false', () => {
                MockSessionService.user.permission_vif_view = false;

                expect(vm.hasViewPermission).toBe(false);
            });
        });
    });

    describe('function transform', () => {
        beforeEach(inject(() => {
            queryParameters = {
                "page_size": 50,
                "reverse": true,
                "ordering": 'vif_num',
                "search": 'BHD'
            };

            transformedQueryParameters = [
                {"name": "page_size", "value": 50},
                {"name": "ordering", "value": "-vif_num"},
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
            var val = vm.extractPage('searchlightdata.org/api/vif/?page=6&ordering=vif_number');
            expect(val).toBe('6');
        });
        it('When a null is passed in, expect to return 0', () => {
            var val = vm.extractPage(null);
            expect(val).toBe(0);
        });
    });

    describe('function getSortIcon', () => {
        it('expect it to return false when column is equal, but not reverse is not true', () => {
            var val = vm.getSortIcon('date', '!reverse');
            expect(val).toBe(false);
        });

        it('expect it to return true when column is equal and reverse is true', () => {
            var val = vm.getSortIcon('date', 'reverse');
            expect(val).toBe(true);
        });

        it('expect it to return false when column is not equal, but not reverse is true', () => {
            var val = vm.getSortIcon('rf_number', 'reverse');
            expect(val).toBe(false);
        });

        it('expect it to return false when column is not equal, but not reverse is true', () => {
            var val = vm.getSortIcon('rf_number', '!reverse');
            expect(val).toBe(false);
        });
    });

    describe('function updateSort', () => {
        it('expect it to flip the reverse bool when column is equal to the parameter', () => {
            vm.queryParameters.ordering = 'vif_number';
            vm.queryParameters.reverse = false;

            vm.updateSort('vif_number');
            expect(vm.queryParameters.reverse).toBe(true);
            expect(vm.queryParameters.ordering).toBe('vif_number');
        });

        it('expect it to flip the reverse bool when column is equal to the parameter', () => {
            vm.queryParameters.ordering = 'vif_number';
            vm.queryParameters.reverse = true;

            vm.updateSort('vif_number');
            expect(vm.queryParameters.reverse).toBe(false);
            expect(vm.queryParameters.ordering).toBe('vif_number');
        });

        it('expect it to not flip the reverse bool when column is not equal to the parameter and expect it to change the ordering parameter', () => {
            vm.queryParameters.ordering = 'vif_number';
            vm.queryParameters.reverse = true;

            vm.updateSort('rf_number');
            expect(vm.queryParameters.reverse).toBe(true);
            expect(vm.queryParameters.ordering).toBe('rf_number');
        });

        it('expect it to not flip the reverse bool when column is not equal to the parameter and expect it to change the ordering parameter', () => {
            vm.queryParameters.ordering = 'vif_number';
            vm.queryParameters.reverse = false;

            vm.updateSort('rf_number');
            expect(vm.queryParameters.reverse).toBe(false);
            expect(vm.queryParameters.ordering).toBe('rf_number');
        });
    });

    describe('function checkForExistingVifs', () => {
        let savedVifs;
        beforeEach(() => {
            savedVifs = {
                BHD123: {asdf: "asdf"},
                BHD1234: {asdf: "asdf"}
            };
            localStorage.setItem('saved-vifs', JSON.stringify(savedVifs));
        });

        it('should return undefined if no saved-vifs', () => {
            localStorage.removeItem('saved-vifs');
            let result = vm.checkForExistingVifs();

            expect(result).toEqual(undefined);
        });

        it('should call vifExists on each form in savedVifs', () => {
            vm.checkForExistingVifs();

            expect(vm.service.vifExists).toHaveBeenCalledWith('BHD123');
            expect(vm.service.vifExists).toHaveBeenCalledWith('BHD1234');
        });

        it('should call removeVifFromSaveForLater on response with same name', () => {
            spyOn(vm, 'removeVifFromSaveForLater');

            vm.checkForExistingVifs();

            expect(vm.removeVifFromSaveForLater).toHaveBeenCalledWith('BHD123');
            expect(vm.removeVifFromSaveForLater).not.toHaveBeenCalledWith('BHD1234');
        });
    });

    describe('function removeVifFromSaveForLater', () => {
        let savedVifs;
        beforeEach(() => {
            savedVifs = {
                BHD123: {asdf: "asdf"},
                BHD1234: {asdf: "asdf"}
            };
            localStorage.setItem('saved-vifs', JSON.stringify(savedVifs));
        });

        it('Should remove object with passed in parameter from local storage', () => {
            expect(savedVifs).toEqual(JSON.parse(localStorage.getItem('saved-vifs')));

            vm.removeVifFromSaveForLater('BHD123');

            expect(savedVifs).not.toEqual(JSON.parse(localStorage.getItem('saved-vifs')));
        });
    });

    describe('exportCSV', () => {
        it('should show spinner', () => {
            vm.exportCsv();

            expect(MockSpinnerOverlayService.show).toHaveBeenCalledWith('Exporting to CSV');
        });

        it('should get CSV from service', () => {
            vm.exportCsv();

            expect(MockVifListService.getCsvExport).toHaveBeenCalled();
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

            expect(result).toBe(`vif-all-data-${moment().format('Y-M-D')}.csv`);
        });
    });
});
