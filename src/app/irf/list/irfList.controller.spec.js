import IrfListController from './irfList.controller';

describe('IRF List Controller',() => {
    let vm,
        $timeout,
        MockIrfListService,
        MockSessionService,
        $stateParams,
        queryParameters,
        transformedQueryParameters;

    beforeEach(inject((_$timeout_) => {
        $timeout = _$timeout_;
        $stateParams = {"search": "BHD"};

        MockIrfListService = jasmine.createSpyObj('IrfListService', [
            'getIrfList',
            'getMoreIrfs',
            'deleteIrf'
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

        vm = new IrfListController(MockIrfListService, MockSessionService, $stateParams, $timeout);
    }));

    describe('function constructor', () => {
        it('expect the search parameter to be set', () => {
            expect(vm.queryParameters.search).toBe("BHD");
        });

        it('expect the search parameter to be set', () => {
            $stateParams = {};
            vm = new IrfListController(MockIrfListService, MockSessionService, $stateParams, $timeout);
            expect(vm.queryParameters.search).not.toBe(null);
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
            var val = vm.getSortIcon('irf_number', 'reverse');
            expect(val).toBe(false);
        });

        it('expect it to return true when column is equal, but not reverse is true', () => {
            var val = vm.getSortIcon('irf_number', '!reverse');
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
});
