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
        it('should call $state.go with selected country and then call close', () => {
            spyOn(vm.$state, 'go');
            spyOn(vm, 'close');
            vm.selectedCountry = "Bryan topia";

            vm.createNewIrf();

            expect(vm.$state.go).toHaveBeenCalledWith("irfBryantopia");
            expect(vm.close).toHaveBeenCalled();
        });
    });
});