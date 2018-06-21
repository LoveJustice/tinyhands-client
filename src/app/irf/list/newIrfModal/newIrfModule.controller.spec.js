import NewIrfModalController from './newIrfModal.controller';

describe('NewIrfModalController', () => {
    let vm;

    beforeEach(() => {
        let $uibModalInstance = {
            close() {},
            dismiss() {}
        };

        let $state = {
            go() {}
        };

        vm = new NewIrfModalController($state, $uibModalInstance);
    });

    describe('function createNewIrf', () => {
        it('should call $state.go with selected country', () => {
            spyOn(vm.$state, 'go');
            vm.selectedCountry = 'Bryan topia';

            vm.createNewIrf();

            expect(vm.$state.go).toHaveBeenCalledWith('irfBryantopia');
        });
        it('should call close', () => {
            spyOn(vm, 'close');

            vm.createNewIrf();

            expect(vm.close).toHaveBeenCalled();
        });
    });
});