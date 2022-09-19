import IndicatorsController from './collectionIndicators.controller';

function createFakePromise(data) {
    return {
        then: (func) => {
            return func(data);
        }
    };
}

function createControllerWithCountries(_$rootScope_, irfCountries = [], cifCountries = [], vdfCountries = []) {
    const $rootScope = _$rootScope_;

    const mockUibModal = {};
    // jasmine.createSpyObj('SessionService', []);
    const mockSessionService = {
        user: {}
    };
    const irfPromise = createFakePromise({
        data: irfCountries
    });
    const cifPromise = createFakePromise({
        data: cifCountries
    });
    const vdfPromise = createFakePromise({
        data: vdfCountries
    });
    const mockCollectionIndicatorsService = {
        getUserCountries: jasmine.createSpy().and.returnValues(irfPromise, cifPromise, vdfPromise)
    };
    const mockSpinnerOverlayService = {};
    const mockStickyHeader = {
        stickyOptions: {}
    };

    return new IndicatorsController(
        mockUibModal,
        $rootScope,
        mockSessionService,
        mockCollectionIndicatorsService,
        mockSpinnerOverlayService,
        mockStickyHeader);
}

describe('Collection Indicators Controller', () => {

    describe('function constructor with no countries', () => {
        let vm;
        beforeEach(inject((_$rootScope_) => {
            vm = createControllerWithCountries(_$rootScope_);
        }));
        it('expect country request count to be 3', () => {
            expect(vm.countryRequestCount).toEqual(3);
        });
        it('expect countries list to be 1', () => {
            expect(vm.countries.length).toEqual(0);
        });
        it('expect countries dropdown list to have 0 option', () => {
            expect(vm.countryDropDown.options.length).toEqual(0);
        });
    });

    describe('function constructor with one irf country', () => {
        let vm;
        beforeEach(inject((_$rootScope_) => {
            const irfCountries = [
                {
                    id: 1,
                    name: 'Nepal'
                }
            ];
            vm = createControllerWithCountries(_$rootScope_, irfCountries);
        }));
        it('expect country request count to be 3', () => {
            expect(vm.countryRequestCount).toEqual(3);
        });
        it('expect countries list to be 1', () => {
            expect(vm.countries.length).toEqual(1);
        });
        it('expect countries dropdown list to have 1 option', () => {
            expect(vm.countryDropDown.options.length).toEqual(1);
            expect(vm.countryDropDown.options).toContain(
                jasmine.objectContaining({
                    label: 'Nepal'
                })
            );
        });
    });

    describe('function constructor with 2 irf countries', () => {
        let vm;
        beforeEach(inject((_$rootScope_) => {
            const irfCountries = [
                {
                    id: 1,
                    name: 'Nepal'
                },
                {
                    id: 2,
                    name: 'India'
                }
            ];
            vm = createControllerWithCountries(_$rootScope_, irfCountries);
        }));
        it('expect country request count to be 3', () => {
            expect(vm.countryRequestCount).toEqual(3);
        });
        it('expect countries list have 2 countries', () => {
            expect(vm.countries.length).toEqual(2);
        });
        it('expect countries dropdown list to have 2 options', () => {
            expect(vm.countryDropDown.options.length).toEqual(2);
            expect(vm.countryDropDown.options).toContain(
                jasmine.objectContaining({
                    label: 'Nepal'
                })
            );
            expect(vm.countryDropDown.options).toContain(
                jasmine.objectContaining({
                    label: 'India'
                })
            );
        });
    });

    describe('function constructor with 2 irf countries and one duplicate cif country', () => {
        let vm;
        beforeEach(inject((_$rootScope_) => {
            const irfCountries = [
                {
                    id: 1,
                    name: 'Nepal'
                },
                {
                    id: 2,
                    name: 'India'
                }
            ];
            const cifCountries = [
                {
                    id: 1,
                    name: 'Nepal'
                }
            ];
            vm = createControllerWithCountries(_$rootScope_, irfCountries, cifCountries);
        }));
        it('expect country request count to be 3', () => {
            expect(vm.countryRequestCount).toEqual(3);
        });
        it('expect countries list have 3 countries', () => {
            expect(vm.countries.length).toEqual(3);
        });
        it('expect countries dropdown list to have 2 options', () => {
            expect(vm.countryDropDown.options.length).toEqual(2);
            expect(vm.countryDropDown.options).toContain(
                jasmine.objectContaining({
                    label: 'Nepal'
                })
            );
            expect(vm.countryDropDown.options).toContain(
                jasmine.objectContaining({
                    label: 'India'
                })
            );
        });
    });

    describe('function constructor with 1 country duplicated in irf, cif, vdf', () => {
        let vm;
        beforeEach(inject((_$rootScope_) => {
            const irfCountries = [
                {
                    id: 1,
                    name: 'Nepal'
                }
            ];
            const cifCountries = [
                {
                    id: 1,
                    name: 'Nepal'
                }
            ];
            const vdfCountries = [
                {
                    id: 1,
                    name: 'Nepal'
                }
            ];
            vm = createControllerWithCountries(_$rootScope_, irfCountries, cifCountries, vdfCountries);
        }));
        it('expect country request count to be 3', () => {
            expect(vm.countryRequestCount).toEqual(3);
        });
        it('expect countries list have 3 countries', () => {
            expect(vm.countries.length).toEqual(3);
        });
        it('expect countries dropdown list to have 1 option', () => {
            expect(vm.countryDropDown.options.length).toEqual(1);
            expect(vm.countryDropDown.options).toContain(
                jasmine.objectContaining({
                    label: 'Nepal'
                })
            );
        });
    });

    describe('function constructor with 2 countries duplicated in irf, cif, vdf', () => {
        let vm;
        beforeEach(inject((_$rootScope_) => {
            const irfCountries = [
                {
                    id: 1,
                    name: 'Nepal'
                },
                {
                    id: 2,
                    name: 'India'
                }
            ];
            const cifCountries = [
                {
                    id: 1,
                    name: 'Nepal'
                },
                {
                    id: 2,
                    name: 'India'
                }
            ];
            const vdfCountries = [
                {
                    id: 1,
                    name: 'Nepal'
                },
                {
                    id: 2,
                    name: 'India'
                }
            ];
            vm = createControllerWithCountries(_$rootScope_, irfCountries, cifCountries, vdfCountries);
        }));
        it('expect country request count to be 3', () => {
            expect(vm.countryRequestCount).toEqual(3);
        });
        it('expect countries list have 6 countries', () => {
            expect(vm.countries.length).toEqual(6);
        });
        it('expect countries dropdown list to have 2 options', () => {
            expect(vm.countryDropDown.options.length).toEqual(2);
            expect(vm.countryDropDown.options).toContain(
                jasmine.objectContaining({
                    label: 'Nepal'
                })
            );
            expect(vm.countryDropDown.options).toContain(
                jasmine.objectContaining({
                    label: 'India'
                })
            );
        });
    });
});
