import Address1Controller from './address1.controller';
import Address1Service from './address1.service';

describe('Address1Controller', () => {
    let vm;
    let mockStickyHeader,
        $rootScope,
        $scope,
        $timeout,
        address1Service,
        $uibModal;

    beforeEach(inject(($http) => {
        //mockStickyHeader = jasmine.createSpyObj('mockStickyHeader', ['stickyOptions']);
        mockStickyHeader = jasmine.createSpyObj('StickyHeader', ['stickyOptions']);
        address1Service = new Address1Service($http);
        vm = new Address1Controller(mockStickyHeader, $rootScope, $scope, $http, $timeout, address1Service, $uibModal);
    }));

    describe('function constructor', () => {

        beforeEach(() => {
            vm.getAddresses = () => { };
            vm.constructor();
        });

        it('loading should be false', () => {
            expect(vm.loading).toBe(false);
        });

        it('reverse should be false', () => {
            expect(vm.reverse).toBe(false);
        });

        it('paginateBy should be 25 by default', () => {
            expect(vm.paginateBy).toEqual(25);
        });

        it('addresses should be an empty array', () => {
            expect(vm.addresses).toEqual([]);
        });

        it('searchValue should be an empty string', () => {
            expect(vm.searchValue).toEqual("");
        });

        it('nextPageUrl should be an empty string', () => {
            expect(vm.nextPageUrl).toEqual("");
        });

        it('sortColumn should be an empty string', () => {
            expect(vm.sortColumn).toEqual("");
        });

    });

    describe("function loadMoreAddresses", () => {
        let response = { "data": { 'results': 'page1', 'next': 'test.com/page=469876' } }
        beforeEach(() => {
            vm.address1Service.loadMoreAddresses = () => {
                return {
                    then: (f) => {
                        f(response);
                    }
                };
            };
            vm.loadMoreAddresses();
        });

        it("loading should be true", () => {
            expect(vm.loading).toBe(false);
        });

        it("addresses should append onto addresses[]", () => {
            expect(vm.addresses).toEqual(['page1']);
        });

        it("addresses should change nextPageUrl", () => {
            expect(vm.nextPageUrl).toEqual('469876');
        });
    });

    describe("function sortIcon", () => {
        it("if reverse is true, should return string: glyphicon-sort-by-alphabet-alt", () => {
            vm.reverse = true;
            vm.sortColumn = "name";
            let fetchedStr = vm.sortIcon('name');
            expect(fetchedStr).toEqual('glyphicon-sort-by-alphabet-alt');
        });

        it("if reverse is false, should return string: glyphicon-sort-by-alphabet", () => {
            vm.reverse = false;
            vm.sortColumn = "name";
            let fetchedStr = vm.sortIcon('name');
            expect(fetchedStr).toEqual('glyphicon-sort-by-alphabet');
        });
    });

    describe("function search addresses", () => {
        let response = { "data": { 'results': 'page1', 'next': 'test.com/page=469876' } }
        beforeEach(() => {
            vm.address1Service.searchAddresses = () => {
                return {
                    then: (f) => {
                        f(response);
                    }
                };
            };
            vm.searchAddresses();
        });

        it("loading should be false", () => {
            expect(vm.loading).toBe(false);
        });

        it("addresses should append onto addresses[]", () => {
            expect(vm.addresses).toEqual('page1');
        });

        it("addresses should change nextPageUrl", () => {
            expect(vm.nextPageUrl).toEqual('469876');
        });
    });

    describe("function getQueryParams", () => {
        it("if param's nextPageURL is not null, should push onto params page_size & paginateBy with their respective values", () => {
            let params = vm.getQueryParams();
            expect(params).toContain({ "name": "page_size", "value": vm.paginateBy });
        });

        it("if param's nextPageURL is not null, params should contain {name: page, value: vm.nextPageUrl}", function () {
            vm.nextPageUrl = 'testURL.html';
            let loadMore = true;
            let params = vm.getQueryParams(loadMore);
            expect(params).toContain({ "name": "page", "value": vm.nextPageUrl });
        });

        it("if param's searchVal is not null, params should contain {name: search, value: vm.searchValue}", function () {
            vm.searchValue = "testString";
            let params = vm.getQueryParams();
            expect(params).toContain({ "name": "search", "value": vm.searchValue });
        });

        it("if param's sortColumn is not null AND reverse is true, params should contain {name: ordering, value: -sortColumn}", function () {
            vm.sortColumn = "testString";
            vm.reverse = true;
            let params = vm.getQueryParams();
            expect(params).toContain({ "name": "ordering", "value": ("-" + vm.sortColumn.replace(".", "__")) });
        });

        it("if param's sortColumn is not null AND reverse is false, params should contian {name: ordering, value: sortColumn}", function () {
            vm.sortColumn = "testString2";
            vm.reverse = false;
            let params = vm.getQueryParams();
            expect(params).toContain({ "name": "ordering", "value": (vm.sortColumn.replace(".", "__")) });
        });
    });

    describe("function getAddresses", () => {
        let response = { "data": { 'results': 'page1', 'next': 'test.com/page=469876' } }
        beforeEach(() => {
            vm.address1Service.listAddresses = () => {
                return {
                    then: (f) => {
                        f(response);
                    }
                };
            };
            vm.getAddresses();
        });

        it("loading should be false", () => {
            expect(vm.loading).toBe(false);
        });

        it("addresses should append onto addresses[]", () => {
            expect(vm.addresses).toEqual('page1');
        });

        it("addresses should change nextPageUrl", () => {
            expect(vm.nextPageUrl).toEqual('469876');
        });
    });

    describe('function editAddress1', () => {
        let address = 'foo';
        let modal = {
            open: () => {
                return {
                    result: {
                        then: (f) => {
                            f(address);
                        }
                    }
                }
            }
        };

        let saveAddress = () => {
            return {
                then: (f) => {
                    f();
                }
            }
        };

        beforeEach(() => {
            vm.modal = modal;
            vm.address1Service.saveAddress = saveAddress;
        });

        it("function getAddresses should be called", () => {
            spyOn(vm, "getAddresses").and.callThrough();
            vm.editAddress1();
            expect(vm.getAddresses).toHaveBeenCalled();
        });

        it("function open should be called", () => {
            spyOn(vm.modal, "open").and.callThrough();
            vm.editAddress1(address);
            expect(vm.modal.open).toHaveBeenCalled();
        });

        it("function saveAttributes should be called", () => {
            spyOn(vm.address1Service, "saveAddress").and.callThrough();
            vm.editAddress1(address);
            expect(vm.address1Service.saveAddress).toHaveBeenCalled();
        });

    });

    describe('function nextUrl', () => {
        it("if url is null, should return null", () => {
            let emptyString = null;
            let url = vm.nextUrl(emptyString);
            expect(url).toBe(null);
        });

        it("Checks that the regex passes with a valid input", () => {
            let testURL = "test.com/page=469876";
            let url = vm.nextUrl(testURL);
            expect(url).toBe("469876");
        });


        it("Checks that the regex fails with an invalid input", () => {
            let testURL = "test.com";
            let url = vm.nextUrl(testURL);
            expect(url).toBe(null);
        });
    });

});
