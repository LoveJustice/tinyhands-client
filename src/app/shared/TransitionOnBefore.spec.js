import { SatisfiesLoginRequired, SatisfiesPermissionsRequired } from './TransitionOnBefore';


describe('SatisfiesLoginRequired', () => {

    let $q, toastr, mockSessionService, $rootScope, transition;

    beforeEach(inject((_$q_, _$rootScope_) => {
        $q = _$q_;
        $rootScope = _$rootScope_;
        mockSessionService = jasmine.createSpyObj('sessionService', ['checkIfAuthenticated']);
        transition = jasmine.createSpyObj('transition', ['to']);
    }));

    describe('when user is authenticated', () => {

        beforeEach(() => {
            mockSessionService.checkIfAuthenticated.and.callFake(() => {
                return $q.resolve();
            });

        });
        
        it('should return true when login is not required', () => {
            transition.to.and.callFake(() => {
                return {name: "dashboard", data: {loginNotRequired: true}};
            });

            let result = SatisfiesLoginRequired(mockSessionService, transition);
            expect(result).toBe(true);
        });

        it('should return true when login is required', () => {
            transition.to.and.callFake(() => {
                return {name: "dashboard"};
            });
            
            let result = SatisfiesLoginRequired(mockSessionService, transition);
            expect(result).toBeTruthy();
        });
    });

    describe('when user is not authenticated', () => {
        beforeEach(() => {
            mockSessionService.checkIfAuthenticated.and.callFake(() => {
                return $q.resolve();
            });

            transition.to.and.callFake(() => {
                return {name: "dashboard", data: {loginNotRequired: true}};
            });
        });

        it('should return true when login is not required', () => {
            transition.to.and.callFake(() => {
                return {name: "dashboard", data: {loginNotRequired: true}};
            });

            let result = SatisfiesLoginRequired(mockSessionService, transition);
            expect(result).toBe(true);
        });


        // it('should return login state', () => {
        //     let result = SatisfiesLoginRequired(mockSessionService, transition);
            
        //     expect(result).toContain();

        // });
    });
});


describe('SatisfiesPermissionsRequired', () => {
    
        let $q, toastr, mockToastr, mockSessionService, $rootScope, transition;
    
        beforeEach(inject((_$q_, _$rootScope_) => {
            $q = _$q_;
            $rootScope = _$rootScope_;
            mockSessionService = jasmine.createSpyObj('sessionService', ['me']);
            mockToastr = jasmine.createSpyObj('toastr', ['error']);
            transition = jasmine.createSpyObj('transition', ['to', 'from']);
    
        }));
    
        describe('when user is authenticated', () => {
    
            beforeEach(() => {
                mockSessionService.me.and.callFake(() => {
                    return $q.resolve({result: {thing: false}});
                });
                transition.from.and.callFake(() => {
                    return {name: "dashboard"};
                });
            });
            
            it('should return undefined when permissions required isnt there', () => {
                transition.to.and.callFake(() => {
                    return {name: "dashboard"};
                });
    
                let result = SatisfiesPermissionsRequired(mockToastr, mockSessionService, transition);
                expect(result).toBe(undefined);
            });
    
            // it('should return dashboard state if permissionsrequired fails and on login page', () => {
            //     transition.to.and.callFake(() => {
            //         return {name: "login",};
            //     });
                
            //     let result = SatisfiesPermissionsRequired(mockToastr, mockSessionService, transition);
            //     expect(result).toBeTruthy();
            // });

            it("When there are permissions required it should call toastr and display a warning", () => {
                transition.to.and.callFake(() => {
                    return {name: "dashboard", data: {permissions_required: ['thing']}};
                });

                let result = SatisfiesPermissionsRequired(mockToastr, mockSessionService, transition);
                $rootScope.$apply();

                expect(mockToastr.error).toHaveBeenCalled();
            });
    });
});