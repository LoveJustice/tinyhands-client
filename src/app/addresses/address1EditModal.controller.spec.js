import Address1EditModalController from './address1EditModal.controller';

describe('Address1EditModalController', () => {
  
  let vm;

  beforeEach(() => {
    let $uibModalInstance = {close: () => {}, dismiss: () => {}};
    let address = null;
    let $scope = {};
    vm = new Address1EditModalController($uibModalInstance, address, $scope);
  });

  describe('function save', () => {
    it('should call modalInstance close with scope address', () => {
      spyOn(vm.modalInstance, 'close');
      vm.save();
      expect(vm.modalInstance.close).toHaveBeenCalledWith(vm.scope.address);
    });
  });

  describe('function load', () => {
    it("should call dismiss close with 'close'", () => {
      spyOn(vm.modalInstance, 'dismiss');
      vm.cancel();
      expect(vm.modalInstance.dismiss).toHaveBeenCalledWith('close');
    });
  });

});
