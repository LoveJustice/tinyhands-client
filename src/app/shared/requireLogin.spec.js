import RequireLogin from './requireLogin';

describe('RequireLogin', () => {
  
  let $q, mockState, mockSessionService, $rootScope;

  beforeEach(inject((_$q_, _$rootScope_) => {
    $q = _$q_;
    mockState = jasmine.createSpyObj('state', ['go']);
    mockSessionService = jasmine.createSpyObj('sessionService', ['checkIfAuthenticated']);
    $rootScope = _$rootScope_;
  }));

  describe('when user is authenticated', () => {

    beforeEach(() => {
      mockSessionService.checkIfAuthenticated.and.callFake(() => {
        return $q.resolve();
      });
    });

    it('should resolve promise', (done) => {
      let result = RequireLogin($q, mockState, mockSessionService);

      result.then(() => {
        done();
      }, () => {
        done.fail('User not authenticated');
      });
      $rootScope.$apply();
    });
  });

  describe('when user is not authenticated', () => {

    beforeEach(() => {
      mockSessionService.checkIfAuthenticated.and.callFake(() => {
        return $q.reject();
      });
    });

    it('should reject promise', (done) => {
      let result = RequireLogin($q, mockState, mockSessionService);

      result.then(() => {
        done.fail('User is authenticated');
      }, () => {
        done();
      });
      $rootScope.$apply();
    });

    it('should go to login state', (done) => {
      let result = RequireLogin($q, mockState, mockSessionService);

      result.then(() => {
        done.fail('User is authenticated');
      }, () => {
        expect(mockState.go).toHaveBeenCalledWith('login');
        done();
      });
      $rootScope.$apply();
    });
  });
});