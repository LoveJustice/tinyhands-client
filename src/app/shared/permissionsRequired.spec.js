import PermissionsRequired from './permissionsRequired';

describe('PermissionsRequired', () => {

    let $q, mockState, mockSessionService, $rootScope;

    beforeEach(inject((_$q_, _$rootScope_) => {
        $q = _$q_;
        mockState = jasmine.createSpyObj('state', ['go']);


        mockSessionService = jasmine.createSpyObj('sessionService', ['me']);
        mockSessionService.me.and.callFake(() => {
            return $q.resolve({ permission_border_stations_add: false, permission_border_stations_edit: false});
        });

        $rootScope = _$rootScope_;
    }));

    it("should always call root $on with first arg '$stateChangeStart'", () => {
        let firstArg;
        $rootScope.$on = (fa) => { firstArg = fa; };
        let result = PermissionsRequired($rootScope, mockState, mockSessionService);

        expect(firstArg).toEqual('$stateChangeStart');
    });


    it("When there are no permissions required it should not call sesson service to get identity", () => {
        let toState = { };
        $rootScope.$on = (_, f) => { f({preventDefault: () => {}}, toState); };
        let result = PermissionsRequired($rootScope, mockState, mockSessionService);
        expect(mockSessionService.me).not.toHaveBeenCalled();
    });

    describe('When there are permissions required', () => {
        it("it should call sesson service to get identity", () => {
            let toState = { data: { permissions_required: ["permission_border_stations_add", "permission_border_stations_edit"] } };
            $rootScope.$on = (_, f) => { f({preventDefault: () => {}}, toState); };
            let result = PermissionsRequired($rootScope, mockState, mockSessionService);
            expect(mockSessionService.me).toHaveBeenCalled();
        });

        it("if the user does not have the permission it should call state.go", () => {
            let toState = { data: { permissions_required: ["permission_border_stations_add", "permission_border_stations_edit"] } };
            $rootScope.$on = (_, f) => { f({preventDefault: () => {}}, toState); };

            let result = PermissionsRequired($rootScope, mockState, mockSessionService);

            $rootScope.$apply();

            expect(mockState.go).toHaveBeenCalledWith("dashboard");
        });
        
        it("if the user does not have the permission it should toast", () => {
            let toState = { data: { permissions_required: ["permission_border_stations_add", "permission_border_stations_edit"] } };
            $rootScope.$on = (_, f) => { f({preventDefault: () => {}}, toState); };
            spyOn(window.toastr, "error");

            let result = PermissionsRequired($rootScope, mockState, mockSessionService);

            $rootScope.$apply();
            expect(window.toastr.error).toHaveBeenCalled();
        });

        it("if the user does have the permission it should not call state go", () => {
            let toState = { data: { permissions_required: ["permission_border_stations_add", "permission_border_stations_edit"] } };
            $rootScope.$on = (_, f) => { f({preventDefault: () => {}}, toState); };
            mockSessionService.me.and.callFake(() => {
                return $q.resolve({ permission_border_stations_add: true, permission_border_stations_edit: true});
            });



            let result = PermissionsRequired($rootScope, mockState, mockSessionService);

            $rootScope.$apply();

            expect(mockState.go).not.toHaveBeenCalledWith("dashboard");
        });
    });
});