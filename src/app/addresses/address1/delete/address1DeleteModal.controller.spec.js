import Address1DeleteModalController from './address1DeleteModal.controller';

describe('Address1DeleteModalController', () => {
    let vm,
        state,
        uibModalInstance,
        mockToastr,
        mockAdreess1Service,
        $scope,
        $q,
        $rootScope;

    let address = {
        "id": 791,
        "name": "aaaaaa test address",
        "latitude": 0.0,
        "longitude": 0.0,
        "level": "District",
        "completed": false
    };

    let addressWithRelatedItems = {
        "id": 791,
        "related_items": [
            {
                "objects": [
                    {
                        "name": "Forbesganj",
                        "id": 15756
                    }
                ],
                "type": "address2"
            },
            {
                "objects": [
                    {
                        "name": "Chloe Sanders",
                        "id": 4452
                    }
                ],
                "type": "person"
            },
            {
                "objects": [
                    {
                        "name": "VIF1231",
                        "id": 4452
                    }
                ],
                "type": "victiminterview"
            },
            {
                "objects": [
                    {
                        "name": "VIF1231",
                        "id": 4452
                    }
                ],
                "type": "victiminterviewlocationbox"
            }
        ],
        "name": "aaaaaa test address",
        "latitude": 0.0,
        "longitude": 0.0,
        "level": "District",
        "completed": false
    };

    beforeEach(inject((_$q_, _$rootScope_) => {
        $q = _$q_;
        $rootScope = _$rootScope_;
        $scope = {};
        state = jasmine.createSpyObj('state', ['go', 'reload', 'href']);

        mockToastr = jasmine.createSpyObj('mockToastr', ['success', 'error']);
        uibModalInstance = jasmine.createSpyObj('uibModalInstance', ['close', 'dismiss']);


        mockAdreess1Service = jasmine.createSpyObj('mockAdreess1Service', ['getRelatedItems', 'deleteAddress', 'swapAddresses']);
        mockAdreess1Service.getRelatedItems.and.callFake(() => {
            return $q.resolve({data: addressWithRelatedItems});
        });

        mockAdreess1Service.deleteAddress.and.callFake(() => {
            return $q.resolve();
        });

        mockAdreess1Service.swapAddresses.and.callFake(() => {
            return $q.resolve("success!");
        });

        vm = new Address1DeleteModalController(uibModalInstance, address, $scope, mockAdreess1Service, state, mockToastr);

        vm.addressToSwapWith = {id: 23};
    }));

    describe('- function constructor - ', () => {
        it('should call get related items', () => {
            spyOn(vm, "getAddressRelatedItems");
            vm.constructor(uibModalInstance, address, $scope, mockAdreess1Service, state, mockToastr);

            expect(vm.getAddressRelatedItems).toHaveBeenCalled();
        });

        it('should set address on scope', () => {
            spyOn(vm, "getAddressRelatedItems");
            expect(vm.scope.address).toEqual(address);
        });
    });

    describe('- function showMore - ', () => {
        it('should increment object limit by 10', () => {
            let obj = {limit: 0};

            vm.showMore(obj);
            expect(obj.limit).toEqual(10);

            vm.showMore(obj);
            expect(obj.limit).toEqual(20);
        });
    });


    describe('- function getAddressRelatedItems - ', () => {
        it('should call api with address', () => {
            vm.getAddressRelatedItems(address);
            expect(mockAdreess1Service.getRelatedItems).toHaveBeenCalledWith(address);
        });

        it('should set related_items on the controller', () => {
            spyOn(vm, "updateCanDelete");

            vm.getAddressRelatedItems(address);
            $rootScope.$apply();

            expect(mockAdreess1Service.getRelatedItems).toHaveBeenCalledWith(address);
            expect(vm.related_items).toEqual(addressWithRelatedItems.related_items);
            expect(vm.updateCanDelete).toHaveBeenCalled();
        });
    });

    describe('- function updateCanDelete - ', () => {
        it('should set canDelete to false if there are any related_items', () => {
            let ri = [
                {
                    "objects": [
                        {
                            "name": "VIF1231",
                            "id": 4452
                        }
                    ],
                    "type": "victiminterviewlocationbox"
                }
            ];

            vm.related_items = ri;
            vm.updateCanDelete();

            expect(vm.canDelete).toEqual(false);
        });

        it('should set canDelete to true if there are not any related_items', () => {
            vm.related_items = [];
            vm.updateCanDelete();

            expect(vm.canDelete).toEqual(true);
        });
    });

    describe('- function getHrefForIdAndType - ', () => {
        let test = {id: 23, name: "test"};

        it('if address to is passed in, should make url to address2 state with delete id set to address2 passed in', () => {
            vm.getHrefForIdAndType(test, "address2");
            expect(state.href).toHaveBeenCalledWith('address2', {deleteId: test.id});
        });

        it('if vif passed in, should go to viflist state with search set to the objects name', () => {
            vm.getHrefForIdAndType({id: 23, name: "test"}, "victiminterview");
            expect(state.href).toHaveBeenCalledWith('vifList', {search: test.name});
        });

        it('if viflb passed in, should go to viflist state with search set to the objects name', () => {
            vm.getHrefForIdAndType({id: 23, name: "test"}, "victiminterviewlocationbox");
            expect(state.href).toHaveBeenCalledWith('vifList', {search: test.name});
        });
    });

    describe('- function getPrettyTypeName - ', () => {
        it('should return correct name according to the objects type', () => {
            let result = vm.getPrettyTypeName({type: "address2"});
            expect(result).toEqual("Address 2");

            result = vm.getPrettyTypeName({type: "person"});
            expect(result).toEqual("Person");

            result = vm.getPrettyTypeName({type: "victiminterview"});
            expect(result).toEqual("VIF");

            result = vm.getPrettyTypeName({type: "victiminterviewlocationbox"});
            expect(result).toEqual("Victim Interview Location Box");
        });
    });

    describe('- function cancel - ', () => {
        it('should go to address1 list without any stateParams', () => {
            vm.cancel();
            expect(state.go).toHaveBeenCalledWith('address1', {deleteId: null}, {notify: false});
        });

        it('should call modal dismiss', () => {
            vm.cancel();
            expect(vm.modalInstance.dismiss).toHaveBeenCalledWith('close');
        });
    });

    describe('- function delete - ', () => {
        it('should set confirm to true the first time it is called', () => {
            vm.delete(address);

            expect(vm.confirm).toBe(true);
        });

        it('should call api delete address with address id', () => {
            vm.confirm = true;
            vm.delete(address);

            expect(mockAdreess1Service.deleteAddress).toHaveBeenCalledWith(address.id);
        });

        it('on success it should toast', () => {
            vm.confirm = true;
            vm.delete(address);
            $rootScope.$apply();

            expect(mockToastr.success).toHaveBeenCalledWith("Address successfully deleted!");
        });

        it('on success it should close modal', () => {
            vm.confirm = true;
            vm.delete(address);
            $rootScope.$apply();

            expect(vm.modalInstance.dismiss).toHaveBeenCalledWith("close");
        });

        it('on success it should go to address1 without state params', () => {
            vm.confirm = true;
            vm.delete(address);
            $rootScope.$apply();

            expect(vm.state.go).toHaveBeenCalledWith('address1', {deleteId: null});
        });

        it('on failure it should toast', () => {
            vm.confirm = true;

            mockAdreess1Service.deleteAddress.and.callFake(() => {
                return $q.reject();
            });
            vm.delete(address);
            $rootScope.$apply();

            expect(vm.toastr.error).toHaveBeenCalledWith("Address failed to be deleted!");
        });
    });

    describe('- function swapAndDelete - ', () => {
        it('should set confirmSwap to true the first time it is called', () => {
            vm.swapAndDelete(address);

            expect(vm.confirmSwap).toBe(true);
        });

        it('should call api swap address with address id of both objects', () => {
            vm.confirmSwap = true;
            vm.swapAndDelete();

            expect(mockAdreess1Service.swapAddresses).toHaveBeenCalledWith(address.id, vm.addressToSwapWith.id);
        });

        it('on success it should toast', () => {
            vm.confirmSwap = true;
            vm.swapAndDelete(address.id, vm.addressToSwapWith.id);
            $rootScope.$apply();

            expect(mockToastr.success).toHaveBeenCalledWith("Addresses successfully swapped and deleted!");
        });

        it('on success it should close modal', () => {
            vm.confirmSwap = true;
            vm.swapAndDelete(address, vm.addressToSwapWith.id);
            $rootScope.$apply();

            expect(vm.modalInstance.dismiss).toHaveBeenCalledWith("close");
        });

        it('on success it should go to address1 without state params', () => {
            vm.confirmSwap = true;
            vm.swapAndDelete(address, vm.addressToSwapWith.id);
            $rootScope.$apply();

            expect(vm.state.go).toHaveBeenCalledWith('address1', {deleteId: null});
        });

        it('on failure it should toast', () => {
            vm.confirmSwap = true;

            mockAdreess1Service.swapAddresses.and.callFake(() => {
                return $q.reject();
            });
            vm.swapAndDelete(address, vm.addressToSwapWith.id);
            $rootScope.$apply();

            expect(vm.toastr.error).toHaveBeenCalledWith("Address swapping failed!");
        });
    });
});
