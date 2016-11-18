import Address2Controller from './address2.controller';
import Address2Service from './address2.service';

describe('Address2Controller', () => {

    let vm;
    let address = { id: '123' };

    let mockThen = (...args) => {
        return () => {
            return {
                then: (f) => {
                    f(...args);
                    return mockThen();
                }
            };
        };
    };

    beforeEach(inject(($http) => {
        let $rootScope,
            $scope,
            $timeout,
            address2Service = new Address2Service($http),
            $uibModal = {
                open: () => {
                    return {
                        result: {
                            then: (f) => {
                                return f(address);
                            }
                        }
                    };
                }
            };
        vm = new Address2Controller($rootScope, $scope, $http, $timeout, address2Service, $uibModal);
    }));

    describe('function constructor', () => {

        it('loading should be true from getAddresses()', () => {
            expect(vm.loading).toBe(true);
        });

        it('reverse should be false', () => {
            expect(vm.reverse).toBe(false);
        });

        it('paginateBy should equal 25', () => {
            expect(vm.paginateBy).toEqual(25);
        });

        it('addresses should equal []', () => {
            expect(vm.addresses).toEqual([]);
        });

        it('searchValue should equal ""', () => {
            expect(vm.searchValue).toEqual('');
        });

        it('nextPageUrl should equal ""', () => {
            expect(vm.nextPageUrl).toEqual('');
        });

        it('sortColumn should equal ""', () => {
            expect(vm.sortColumn).toEqual('');
        });

        it('should call getAddresses', () => {
            spyOn(vm, 'getAddresses');
            vm.constructor();
            expect(vm.getAddresses).toHaveBeenCalled();
        });

    });

    describe('function sortIcon with column', () => {

        it('should return "glyphicon-sort" if column does not equal sortColumn', () => {
            let column = 'a';
            vm.sortColumn = 'b';
            expect(vm.sortIcon(column)).toEqual('glyphicon-sort');
        });

        describe('if column equals sortColumn', () => {

            describe('and this.reverse', () => {

                beforeEach(() => {
                    vm.reverse = true;
                });

                let ret = "glyphicon-sort-by-order-alt";
                describe(`should return '${ret}'`, () => {

                    it(`if column equals "latitude"`, () => {
                        vm.sortColumn = 'latitude';
                        expect(vm.sortIcon(vm.sortColumn)).toEqual(ret);
                    });

                    it(`if column equals "longitude"`, () => {
                        vm.sortColumn = 'longitude';
                        expect(vm.sortIcon(vm.sortColumn)).toEqual(ret);
                    });

                });

                let retAlt = "glyphicon-sort-by-alphabet-alt";
                describe(`should return '${retAlt}'`, () => {

                    it(`if column equals "name"`, () => {
                        vm.sortColumn = 'name';
                        expect(vm.sortIcon(vm.sortColumn)).toEqual(retAlt);
                    });

                    it(`if column equals "canonical_name.name"`, () => {
                        vm.sortColumn = 'canonical_name.name';
                        expect(vm.sortIcon(vm.sortColumn)).toEqual(retAlt);
                    });

                    it(`if column equals "address1.name"`, () => {
                        vm.sortColumn = 'address1.name';
                        expect(vm.sortIcon(vm.sortColumn)).toEqual(retAlt);
                    });

                    it(`if column equals "verified"`, () => {
                        vm.sortColumn = 'verified';
                        expect(vm.sortIcon(vm.sortColumn)).toEqual(retAlt);
                    });

                });

            });

            describe('and not this.reverse', () => {

                beforeEach(() => {
                    vm.reverse = false;
                });

                let retOrder = "glyphicon-sort-by-order";
                describe(`should return '${retOrder}'`, () => {

                    it(`if column equals "latitude"`, () => {
                        vm.sortColumn = 'latitude';
                        expect(vm.sortIcon(vm.sortColumn)).toEqual(retOrder);
                    });

                    it(`if column equals "longitude"`, () => {
                        vm.sortColumn = 'longitude';
                        expect(vm.sortIcon(vm.sortColumn)).toEqual(retOrder);
                    });
                });

                let retAlphabet = "glyphicon-sort-by-alphabet";
                describe(`should return '${retAlphabet}'`, () => {

                    it(`if column equals "name"`, () => {
                        vm.sortColumn = 'name';
                        expect(vm.sortIcon(vm.sortColumn)).toEqual(retAlphabet);
                    });

                    it(`if column equals "canonical_name.name"`, () => {
                        vm.sortColumn = 'canonical_name.name';
                        expect(vm.sortIcon(vm.sortColumn)).toEqual(retAlphabet);
                    });

                    it(`if column equals "address1.name"`, () => {
                        vm.sortColumn = 'address1.name';
                        expect(vm.sortIcon(vm.sortColumn)).toEqual(retAlphabet);
                    });

                    it(`if column equals "verified"`, () => {
                        vm.sortColumn = 'verified';
                        expect(vm.sortIcon(vm.sortColumn)).toEqual(retAlphabet);
                    });
                });

            });

            it('should return "glyphicon-sort" if unknown', () => {
                vm.sortColumn = 'abcd';
                expect(vm.sortIcon(vm.sortColumn)).toEqual('glyphicon-sort');
            });

        });

    });

    describe('function getAddresses', () => {

        it('should set loading to true', () => {
            vm.getAddresses();
            expect(vm.loading).toBe(true);
        });

        it('should call getQueryParams', () => {
            spyOn(vm, 'getQueryParams');
            vm.getAddresses();
            expect(vm.getQueryParams).toHaveBeenCalled();
        });

        describe('on then', () => {

            let nextPageUrl;
            let promise = { "data": { results: 'abcdef', next: 'page=123' } };

            beforeEach(() => {
                vm.address2Service.listAddresses = mockThen(promise);
                nextPageUrl = vm.nextUrl(promise.data.next);
            });

            it(`should set addresses to '${promise.data.results}'`, () => {
                vm.getAddresses();
                expect(vm.addresses).toEqual(promise.data.results);
            });

            it(`should set nextPageUrl to '${nextPageUrl}'`, () => {
                vm.getAddresses();
                expect(vm.nextPageUrl).toEqual(nextPageUrl);
            });

            it('should set loading to false', () => {
                vm.loading = true;
                vm.getAddresses();
                expect(vm.loading).toBe(false);
            });

        });

    });

    describe('function loadMoreAddresses', () => {

        it('should set loading to true', () => {
            vm.loading = false;
            vm.loadMoreAddresses();
            expect(vm.loading).toBe(true);
        });

        it('should call getQueryParams', () => {
            spyOn(vm, 'getQueryParams');
            vm.loadMoreAddresses();
            expect(vm.getQueryParams).toHaveBeenCalled();
        });

        describe('on then', () => {

            let nextPageUrl, addresses;
            let promise = { "data": { results: 'abcdef', next: 'page=123' } };

            beforeEach(() => {
                vm.address2Service.loadMoreAddresses = mockThen(promise);
                nextPageUrl = vm.nextUrl(promise.data.next);
                addresses = vm.addresses.concat(promise.data.results);
                vm.loadMoreAddresses();
            });

            it(`should set addresses to '${addresses}'`, () => {
                expect(vm.addresses).toEqual(addresses);
            });

            it(`should set nextPageUrl to '${nextPageUrl}'`, () => {
                expect(vm.nextPageUrl).toEqual(nextPageUrl);
            });

            it('should set loading to false', () => {
                expect(vm.loading).toBe(false);
            });

        });

    });

    describe('function searchAddresses', () => {

        it('should set loading to true', () => {
            vm.searchAddresses();
            expect(vm.loading).toBe(true);
        });

        it('should call getQueryParams', () => {
            spyOn(vm, 'getQueryParams');
            vm.searchAddresses();
            expect(vm.getQueryParams).toHaveBeenCalled();
        });

        describe('on then', () => {

            let nextPageUrl, addresses;
            let promise = { "data": { results: 'abcdef', next: 'page=123' } };

            beforeEach(() => {
                vm.address2Service.searchAddresses = mockThen(promise);
                nextPageUrl = vm.nextUrl(promise.data.next);
                addresses = promise.data.results;
                vm.searchAddresses();
            });

            it(`should set addresses to '${addresses}'`, () => {
                expect(vm.addresses).toEqual(addresses);
            });

            it(`should set nextPageUrl to '${nextPageUrl}'`, () => {
                expect(vm.nextPageUrl).toEqual(nextPageUrl);
            });

            it('should set loading to false', () => {
                expect(vm.loading).toBe(false);
            });

        });

    });

    describe('function getQueryParams', () => {

        let paginateBy = 'foo',
            nextPageUrl = 'bar',
            searchValue = 'baz',
            sortColumn = 'foo.bar',
            res1 = { name: 'page_size', value: paginateBy },
            res2 = { name: 'page', value: nextPageUrl },
            res3 = { name: 'search', value: searchValue },
            res4 = { name: 'ordering', value: '-foo__bar' },
            res5 = { name: 'ordering', value: 'foo__bar' };

        beforeEach(() => {
            vm.paginateBy = paginateBy;
        });

        it(`should return ${[res1]}`, () => {
            expect(vm.getQueryParams()).toEqual([res1]);
        });

        it(`should return ${[res1, res2]} if nextPageUrl and loadMore set`, () => {
            vm.nextPageUrl = nextPageUrl;
            expect(vm.getQueryParams(true)).toEqual([res1, res2]);
        });

        it(`should return ${[res1, res3]} if searchValue set`, () => {
            vm.searchValue = searchValue;
            expect(vm.getQueryParams()).toEqual([res1, res3]);
        });

        it(`should return ${[res1, res4]} if sortColumn and reverse`, () => {
            vm.sortColumn = sortColumn;
            vm.reverse = true;
            expect(vm.getQueryParams()).toEqual([res1, res4]);
        });

        it(`should return ${[res1, res5]} if sortColumn and not reverse`, () => {
            vm.sortColumn = sortColumn;
            vm.reverse = false;
            expect(vm.getQueryParams()).toEqual([res1, res5]);
        });

    });

    describe('function editAddress2 with address', () => {

        it('should call modal open', () => {
            spyOn(vm.modal, 'open').and.callThrough();
            vm.editAddress2(address);
            expect(vm.modal.open).toHaveBeenCalled();
        });

        it(`should call address2Service saveAddress with '${address}'`, () => {
            spyOn(vm.address2Service, 'saveAddress').and.callThrough();
            vm.editAddress2(address);
            expect(vm.address2Service.saveAddress).toHaveBeenCalledWith(address);
        });

        it('should call getAddresses', () => {
            spyOn(vm, 'getAddresses');
            vm.address2Service.saveAddress = () => {
                return {
                    then: (f) => { f(); }
                }
            };
            vm.editAddress2(address);
            expect(vm.getAddresses).toHaveBeenCalled();
        });

    });

    describe('function nextUrl', () => {

        let testUrl = "/test/url/page=123/test";

        it('should return null when url is null', () => {
            expect(vm.nextUrl(null)).toBeNull();
        });

        it(`should return "123" when url is '${testUrl}'`, () => {
            expect(vm.nextUrl(testUrl)).toEqual("123");
        });

    });

});
