import { SatisfiesLoginRequired, SatisfiesPermissionsRequired } from './TransitionOnBefore';


// export const SatisfiesPermissionsRequired = ($q, toastr, SessionService, transition) => {
//     let toState = transition.to();
//     let returnValue = transition.from().name !== 'login' ? false : transition.router.stateService.target('dashboard'); // send them to dash if already on login page
    
//     if (angular.isDefined(toState.data) && angular.isDefined(toState.data.permissions_required)) {
//         let permissions = toState.data.permissions_required;
//         return SessionService.me().then((result) => {
//             if (permissions.some(p => !result[p])) {
//                 toastr.error(`You are not authorized to view that page!`);
//                 return returnValue;
//             }
//         });
//     }
// };



// export const SatisfiesLoginRequired = ($q, toastr, SessionService, transition) => {
//     let toState = transition.to();

//     if (angular.isDefined(toState.data) && angular.isDefined(toState.data.loginNotRequired) && !toState.loginNotRequired) {
//         return true;
//     }

//     return SessionService.checkIfAuthenticated().then(
//         () => {}, 
//         () => {
//             return transition.router.stateService.target('login', {returnState: toState.name, params: $.param(transition.params())});
//         }
//     );
// };


describe('SatisfiesLoginRequired', () => {

    let $q, toastr, mockSessionService, $rootScope, transition;

    beforeEach(inject((_$q_, _$rootScope_) => {
        mockState = jasmine.createSpyObj('state', ['go']);
        
        mockSessionService = jasmine.createSpyObj('sessionService', ['checkIfAuthenticated']);
        
        transition = jasmine.createSpyObj('transition', ['to']);



        $rootScope = _$rootScope_;
    }));

    describe('when user is authenticated', () => {

        beforeEach(() => {
            mockSessionService.checkIfAuthenticated.and.callFake(() => {
                return $q.resolve();
            });

            transition.to.and.callFake(() => {
                return {name: "state", data: {loginNotRequired: true}}
            });
        });

        it('should return true', (done) => {
            let result = SatisfiesLoginRequired($q, toastr, mockSessionService, transition);

            expect(result).toBe(true);
            // result.then(() => {
            //     done();
            // }, () => {
            //     done.fail('User not authenticated');
            // });
            $rootScope.$apply();
        });
    });
});

//     describe('when user is not authenticated', () => {

//         beforeEach(() => {
//             mockSessionService.checkIfAuthenticated.and.callFake(() => {
//                 return $q.reject();
//             });
//         });

//         it('should reject promise', (done) => {
//             let result = RequireLogin($q, mockState, mockSessionService);

//             result.then(() => {
//                 done.fail('User is authenticated');
//             }, () => {
//                 done();
//             });
//             $rootScope.$apply();
//         });

//         it('should go to login state', (done) => {
//             let result = RequireLogin($q, mockState, mockSessionService);

//             result.then(() => {
//                 done.fail('User is authenticated');
//             }, () => {
//                 expect(mockState.go).toHaveBeenCalledWith('login');
//                 done();
//             });
//             $rootScope.$apply();
//         });
//     });
// });