import Address1EditModalController from './address1EditModal.controller';

describe('Address1EditModalController', () => {

    let vm,
        $state;

    beforeEach(() => {
        let $uibModalInstance = { close: () => { }, dismiss: () => { } };
        let address = null;
        let $scope = {};
        $state = {go: () => {}};

        vm = new Address1EditModalController($uibModalInstance, address, $scope, $state);
    });

    describe('function save', () => {
        it('should call modalInstance close with scope address', () => {
            spyOn(vm.modalInstance, 'close');
            spyOn(vm.state, 'go');
            vm.save();

            expect(vm.modalInstance.close).toHaveBeenCalledWith(vm.scope.address);
            expect(vm.state.go).toHaveBeenCalledWith('address1', {editId: null}, {notify: false});
        });
    });

    describe('function load', () => {
        it("should call dismiss close with 'close'", () => {
            spyOn(vm.modalInstance, 'dismiss');
            spyOn(vm.state, 'go');
            vm.cancel();
            
            expect(vm.state.go).toHaveBeenCalledWith('address1', {editId: null}, {notify: false});
            expect(vm.modalInstance.dismiss).toHaveBeenCalledWith('close');
        });
    });

});
