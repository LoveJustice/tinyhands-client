(function() {
    'use strict';

    describe('Address1Controller', function() {
        var vm;

        beforeEach(module('tinyhandsFrontend'));

        beforeEach(inject(function($controller, $rootScope) {
            var scope = $rootScope.$new();
            vm = $controller('Address1Controller', {$scope: scope});
        }));

        /*No tests verifying $rootScope, $scope, etc (constructor pass ins) because they are
        just services. We only want to test local variables.*/

        describe('function constructor', function() {
            it('loading should be true', function() {
                expect(vm.loading).toBe(true);
                pending("TODO: will fail later - not retrieving data on getAddresses()");
            });

            it('reverse should be false', function() {
                expect(vm.reverse).toBe(false);
            });

            it('paginateBy should be 25 by default', function(){
                expect(vm.paginateBy).toEqual(25);
            });

            it('addresses should be an empty array', function(){
                expect(vm.addresses).toEqual([]);
                pending("TODO: will fail later - not retrieving data on getAddresses()");
            });

            it('searchValue should be an empty string', function() {
                expect(vm.searchValue).toEqual("");
            });

            it('nextPageUrl should be an empty string', function(){
                expect(vm.nextPageUrl).toEqual("");
                pending("TODO: will fail later - not retrieving data on getAddresses()");
            });

            it('sortColumn should be an empty string', function(){
                expect(vm.sortColumn).toEqual("");
            });

            //TODO: add more tests when able to getAddresses() working
        });

        describe("loadMoreAddresses", function(){
            it("loading should be true", function(){
                pending("TODO: will fail later - not retrieving data on loadMoreAddresses()")
                expect(vm.loading).toBe(true);
            });

            //TODO: add more tests when able to get loadMoreAddresses() working
        });

        describe("search addresses", function(){
            it("loading should be true", function(){
                pending("TODO: will fail later - not retrieving data on loadMoreAddresses()")
                expect(vm.loading).toBe(true);
            });

            //TODO: add more tests when able to get searchAddresses() working
        });

        describe("getQueryParams", function(){
            it("should push onto params page_size & paginateBy with their respective values", function(){
                var params = vm.getQueryParams();

                expect(params).toContain({"name": "page_size", "value": vm.paginateBy});
            });

            //TODO: fix if condition should result for the text of the it statement
            it("param's nextPageUrl & loadMore are set", function(){
                vm.nextPageUrl = 'testURL.html';
                var loadMore = true;
                var params = vm.getQueryParams(loadMore);

                expect(params).toContain({"name": "page", "value": vm.nextPageUrl});
            });

            it("param's searchValue is set", function(){
                vm.searchValue = "testString";
                var params = vm.getQueryParams();

                expect(params).toContain({"name": "search", "value": vm.searchValue});
            });

            it("param's sortColumn is set & reverse is true", function(){
                vm.sortColumn = "testString";
                vm.reverse = true;
                var params = vm.getQueryParams();
                expect(params).toContain({"name": "ordering", "value": ("-" + vm.sortColumn.replace(".", "__"))});
            });

            it("param's sortColumn is set & reverse is false", function(){
                vm.sortColumn = "testString2";
                vm.reverse = false;
                var params = vm.getQueryParams();

                expect(params).toContain({"name": "ordering", "value": (vm.sortColumn.replace(".", "__"))});
            });
        });
    });

})();




