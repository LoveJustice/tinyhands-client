import AccessDefaultsController from './accessDefaults.controller';

describe('AccessDefaultsController', () => {

    let controller,
        rootScope,
        scope,
        mockEvent,
        stateName,
        $q,
        mockUibModal,
        mockState,
        mockPermissionsService,
        mockToastr,
        response;

    beforeEach(inject((_$q_, $rootScope) => {
        rootScope = $rootScope;
        scope = jasmine.createSpyObj('mockScope', ['$on']);
        mockEvent = jasmine.createSpyObj('mockEvent', ['preventDefault']);
        stateName = 'FooState';
        scope.$on.and.callFake((eventName, callback) => {
            callback(mockEvent, { name: stateName });
        });
        $q = _$q_;
        mockUibModal = jasmine.createSpyObj('mockUibModal', ['open']);
        mockUibModal.open.and.callFake(() => {
            return { result: $q.resolve(false) };
        });

        mockState = jasmine.createSpyObj('mockState', ['go']);
        mockPermissionsService = jasmine.createSpyObj('PermissionsService', ['getPermissions', 'create', 'update', 'destroy']);

        response = { data: { results: [{ id: 1, name: 'Foo' }] } };
        mockPermissionsService.getPermissions.and.callFake(() => {
            return $q.resolve(response);
        });

        mockPermissionsService.create.and.callFake((set) => {
            let newSet = {
                name: set.name,
                id: 5
            };
            return $q.resolve(newSet);
        });

        mockPermissionsService.update.and.callFake((set) => {
            return $q.resolve(set);
        });

        mockToastr = jasmine.createSpyObj('mockToastr', ['error']);

        controller = new AccessDefaultsController(scope, $q, mockUibModal, mockState, mockPermissionsService, mockToastr);
    }));

    describe('saveButtonText', () => {
        describe('when saveButtonClicked', () => {
            it('should return "Saving..."', () => {
                controller.saveButtonClicked = true;

                expect(controller.saveButtonText).toEqual('Saving...');
            });
        });

        describe('when this.permissions.hasChanges', () => {
            it('should return "Save All"', () => {
                rootScope.$apply();
                controller.permissions.add({ id: 2, name: "Bar" });

                expect(controller.saveButtonText).toEqual('Save All');
            });
        });
    });

    describe('when saveButtonClicked is false and permissions has no changes', () => {
        it('should return "Saved"', () => {
            expect(controller.saveButtonText).toEqual('Saved');
        });
    });

    describe('saveButtonStyle', () => {
        describe('when saveButtonClicked', () => {
            it('should return "btn-success"', () => {
                controller.saveButtonClicked = true;

                expect(controller.saveButtonStyle).toEqual('btn-success');
            });
        });

        describe('when saveButtonClicked is false', () => {
            it('should return "btn-primary"', () => {
                controller.saveButtonClicked = false;

                expect(controller.saveButtonStyle).toEqual('btn-primary');
            });
        });
    });

    describe('getPermissions', () => {
        it('should call PermissionsService.getPermissions', () => {
            controller.getPermissions();

            expect(mockPermissionsService.getPermissions).toHaveBeenCalled();
        });

        describe('when permissions are returned', () => {
            it('should set controller.permissions', () => {
                controller.getPermissions();
                rootScope.$apply();

                expect(controller.permissions.items).toEqual(response.data.results);
            });
        });
    });

    describe('createOnStateChangeListener', () => {
        it('should set listener for $stateChangeStart', () => {
            controller.createOnStateChangeListener();

            expect(scope.$on).toHaveBeenCalledWith('$stateChangeStart', jasmine.any(Function));
        });

        describe('when $stateChangeStart event fired and this.permissions.hasChanges', () => {

            it('should call event.preventDefault', () => {
                rootScope.$apply();
                controller.permissions.add({ id: 2, name: "Bar" });
                controller.createOnStateChangeListener();
                rootScope.$apply();

                expect(mockEvent.preventDefault).toHaveBeenCalled();
            });

            it('should call controller.openUnsavedChangesModal with correct state', () => {
                spyOn(controller, 'openUnsavedChangesModal');
                rootScope.$apply();
                controller.permissions.add({ id: 2, name: "Bar" });
                controller.createOnStateChangeListener();
                rootScope.$apply();

                expect(controller.openUnsavedChangesModal).toHaveBeenCalledWith(stateName);
            });
        });
    });

    describe('getStyling', () => {
        describe('when called with true', () => {
            it('should return "btn btn-success"', () => {
                let result = controller.getStyling(true);
                expect(result).toEqual('btn btn-success');
            });
        });

        describe('when called with false', () => {
            it('should return "btn btn-danger"', () => {
                let result = controller.getStyling(false);
                expect(result).toEqual('btn btn-danger');
            });
        });
    });

    describe('addAnother', () => {
        it('should add a new permissions set to permissions', () => {
            rootScope.$apply();
            spyOn(controller.permissions, 'add');

            controller.addAnother();

            expect(controller.permissions.add).toHaveBeenCalledWith({ is_used_by_accounts: false });
        });
    });

    describe('removePermissionRole', () => {
        it('should remove role at index', () => {
            rootScope.$apply();
            spyOn(controller.permissions, 'remove');

            controller.removePermissionRole(0);

            expect(controller.permissions.remove).toHaveBeenCalledWith(0);
        });
    });

    describe('discardChanges', () => {
        it('should discard changes on controller.permissions', () => {
            rootScope.$apply();
            spyOn(controller.permissions, 'discardChanges');

            controller.discardChanges();

            expect(controller.permissions.discardChanges).toHaveBeenCalled();
        });
    });

    describe('saveAll', () => {
        it('should set saveButtonClicked to true', () => {
            rootScope.$apply();

            controller.saveAll();

            expect(controller.saveButtonClicked).toEqual(true);
        });

        it('should update each set in permissions.updatedItems', () => {
            spyOn(controller, "updateSet");
            rootScope.$apply();
            controller.permissions.items[0].name = "Bar";

            controller.saveAll();

            expect(controller.updateSet).toHaveBeenCalledWith(controller.permissions.items[0]);
        });

        it('should create each set in permissions.newItems', () => {
            spyOn(controller, "createSet");
            rootScope.$apply();
            controller.permissions.add({ id: 2, name: "Qux" });

            controller.saveAll();

            expect(controller.createSet).toHaveBeenCalledWith(controller.permissions.items[1]);
        });

        it('should remove each set in permissions.removedItems', () => {
            spyOn(controller, "removeSet");
            rootScope.$apply();
            let item = controller.permissions.items[0];
            controller.permissions.remove(0);

            controller.saveAll();

            expect(controller.removeSet).toHaveBeenCalledWith(item);
        });

        describe('when all promises resolved', () => {
            it('should set saveButtonClicked to false', () => {
                rootScope.$apply();

                controller.saveAll();
                rootScope.$apply();

                expect(controller.saveButtonClicked).toEqual(false);
            });

            it('should save changes to controller.permissions', () => {
                rootScope.$apply();
                spyOn(controller.permissions, 'saveChanges');

                controller.saveAll();
                rootScope.$apply();

                expect(controller.permissions.saveChanges).toHaveBeenCalled();
            });
        });

        describe('when one promise is rejected', () => {
            beforeEach(() => {
                mockPermissionsService.update.and.callFake((set) => {
                    let response = { data: { name: ["Error"] } };
                    return $q.reject(response);
                });
            });

            it('should set saveButtonClicked to false', () => {
                rootScope.$apply();
                controller.permissions.items[0].name = "Bar";

                controller.saveAll();
                rootScope.$apply();

                expect(controller.saveButtonClicked).toEqual(false);
            });

            it('should set toastr error', () => {
                rootScope.$apply();
                controller.permissions.items[0].name = "Bar";

                controller.saveAll();
                rootScope.$apply();

                expect(mockToastr.error).toHaveBeenCalledWith("One or more Designations could not be saved");
            });
        });
    });

    describe('createSet', () => {
        let newSet = { name: 'Test' };

        it('should call PermissionsService.create', () => {
            controller.createSet(newSet);

            expect(mockPermissionsService.create).toHaveBeenCalledWith(newSet);
        });

        it('should set error on permissions set', () => {
            let error = "Error";
            mockPermissionsService.create.and.callFake((set) => {
                let response = { data: { name: [error] } };
                return $q.reject(response);
            });

            controller.createSet(newSet);
            rootScope.$apply();

            expect(newSet.error).toEqual(error);
        });
    });

    describe('updateSet', () => {

        let setToUpdate = { name: 'Foo', id: 4 };

        it('should call PermissionsService.update with set id and set', () => {
            controller.updateSet(setToUpdate);

            expect(mockPermissionsService.update).toHaveBeenCalledWith(setToUpdate.id, setToUpdate);
        });

        describe('when error returned', () => {
            let error = "name error";

            it('should set error on permissions set', () => {
                mockPermissionsService.update.and.callFake((set) => {
                    let response = { data: { name: [error] } };
                    return $q.reject(response);
                });

                controller.updateSet(setToUpdate);
                rootScope.$apply();

                expect(setToUpdate.error).toEqual(error);
            });
        });
    });

    describe('removeSet', () => {
        it('should call PermissionsService.destroy with set id', () => {
            let setToRemove = { name: 'Foo', id: 4 };

            controller.removeSet(setToRemove);

            expect(mockPermissionsService.destroy).toHaveBeenCalledWith(setToRemove.id);
        });
    });

    describe('openUnsavedChangesModal', () => {
        it('should open modal with correct options', () => {
            let modalOptions = {
                templateUrl: 'app/account/components/modal/unsavedChangesModal.html',
                controller: 'UnsavedChangesModalController',
                controllerAs: 'UnsavedChangesModalCtrl'
            };

            controller.openUnsavedChangesModal();

            expect(mockUibModal.open).toHaveBeenCalledWith(modalOptions);
        });

        describe('when user decides to discard changes', () => {
            it('should discard changes', () => {
                spyOn(controller, 'discardChanges');
                rootScope.$apply();

                controller.openUnsavedChangesModal();
                rootScope.$apply();

                expect(controller.discardChanges).toHaveBeenCalled();
            });
        });

        describe('when user decides to save', () => {
            it('should call controller.saveAll', () => {
                mockUibModal.open.and.callFake(() => {
                    return { result: $q.resolve(true) };
                });
                spyOn(controller, 'saveAll');
                controller.saveAll.and.callFake(() => { return $q.resolve(true) });
                rootScope.$apply();

                controller.openUnsavedChangesModal();
                rootScope.$apply();

                expect(controller.saveAll).toHaveBeenCalled();
            });
        });

        describe('when toState is not null', () => {
            it('should go to state', () => {
                let toState = "fooState";
                rootScope.$apply();

                controller.openUnsavedChangesModal(toState);
                rootScope.$apply();

                expect(mockState.go).toHaveBeenCalledWith(toState);
            });
        });
    });
});