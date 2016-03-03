import Address1Controller from './address1.controller';
import Address1Service from './address1.service';

describe('Address1Controller',() => {
    let vm;

    beforeEach(inject(($http) => {
        let $rootScope,
            $scope,
            $timeout,
            address1Service = new Address1Service($http),
            $uibModal;
        vm = new Address1Controller($rootScope, $scope, $http, $timeout, address1Service, $uibModal);
    }));

    /*No tests verifying $rootScope, $scope, etc (constructor pass ins) because they are
    just services. We only want to test local variables.*/

    describe('function constructor', () => {
        it('loading should be true', () => {
            expect(vm.loading).toBe(true);
            pending("TODO: will fail later - not retrieving data on getAddresses()");
        });

        it('reverse should be false', () => {
            expect(vm.reverse).toBe(false);
        });

        it('paginateBy should be 25 by default', () => {
            expect(vm.paginateBy).toEqual(25);
        });

        it('addresses should be an empty array', () => {
            expect(vm.addresses).toEqual([]);
            pending("TODO: will fail later - not retrieving data on getAddresses()");
        });

        it('searchValue should be an empty string', () => {
            expect(vm.searchValue).toEqual("");
        });

        it('nextPageUrl should be an empty string', () =>{
            expect(vm.nextPageUrl).toEqual("");
            pending("TODO: will fail later - not retrieving data on getAddresses()");
        });

        it('sortColumn should be an empty string', () =>{
            expect(vm.sortColumn).toEqual("");
        });

        //TODO: add more tests when able to getAddresses() working
    });

    describe("loadMoreAddresses",() => {
        it("loading should be true",() => {
            pending("TODO: will fail later - not retrieving data on loadMoreAddresses()")
            expect(vm.loading).toBe(true);
        });

        //TODO: add more tests when able to get loadMoreAddresses() working
    });

    describe("search addresses",() => {
        it("loading should be true",() =>{
            pending("TODO: will fail later - not retrieving data on loadMoreAddresses()")
            expect(vm.loading).toBe(true);
        });

        //TODO: add more tests when able to get searchAddresses() working
    });

    describe("getQueryParams",() =>{
        it("should push onto params page_size & paginateBy with their respective values",() =>{
            let params = vm.getQueryParams();

            expect(params).toContain({"name": "page_size", "value": vm.paginateBy});
        });

        it("if param's nextPageURL is not null, params should contain {name: page, value: vm.nextPageUrl}", function(){
            vm.nextPageUrl = 'testURL.html';
            let loadMore = true;
            let params = vm.getQueryParams(loadMore);

            expect(params).toContain({"name": "page", "value": vm.nextPageUrl});
        });

        it("if param's searchVal is not null, params should contain {name: search, value: vm.searchValue}", function(){
            vm.searchValue = "testString";
            let params = vm.getQueryParams();

            expect(params).toContain({"name": "search", "value": vm.searchValue});
        });

        it("if param's sortColumn is not null AND reverse is true, params should contain {name: ordering, value: -sortColumn}", function(){
            vm.sortColumn = "testString";
            vm.reverse = true;
            let params = vm.getQueryParams();
            expect(params).toContain({"name": "ordering", "value": ("-" + vm.sortColumn.replace(".", "__"))});
        });

        it("if param's sortColumn is not null AND reverse is false, params should contian {name: ordering, value: sortColumn}", function(){
            vm.sortColumn = "testString2";
            vm.reverse = false;
            let params = vm.getQueryParams();

            expect(params).toContain({"name": "ordering", "value": (vm.sortColumn.replace(".", "__"))});
        });
    });

    //TODO: write tests for editAddress1(address)
    /*describe('editAddress1', function(){
        it("param modalInstance should not be null and should contain URL", function(){

        });
    });*/

    describe('nextUrl tests',() => {
       it("if url is null, should return null",() => {
           let emptyString = null;
           let url = vm.nextUrl(emptyString);
           expect(url).toBe(null);
        });

        it("Checks the Regex with a valid input",() => {
            let testURL = "test.com/page=469876";
            let url = vm.nextUrl(testURL);
            expect(url).toBe("469876");
        });


        it("Checks the Regex with an invalid input",() => {
            let testURL = "test.com";
            let url = vm.nextUrl(testURL);
            expect(url).toBe(null);
        });
    });

});

