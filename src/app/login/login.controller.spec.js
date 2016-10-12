import LoginController from './login.controller';

describe('LoginController', () => {

  let vm,
    mockState,
    mockToastr,
    mockSessionService,
    $q,
    $rootScope;

  beforeEach(inject((_$q_, _$rootScope_) => {
    $q = _$q_;
    $rootScope = _$rootScope_;
    mockState = jasmine.createSpyObj('state', ['go']);
    mockToastr = jasmine.createSpyObj('toastr', ['error']);
    mockSessionService = jasmine.createSpyObj('SessionService', ['attemptLogin']);
    mockSessionService.attemptLogin.and.callFake(() => {
      return $q.resolve();
    }); 

    vm = new LoginController(mockState, mockToastr, mockSessionService);
  }));

  describe('function constructor', () => {

    it('password should be empty string', () => {
      expect(vm.password).toEqual('');
    });

    it('username should be empty string', () => {
      expect(vm.password).toEqual('');
    });

  });

  describe('function attemptLogin', () => {
    it('should call sesssion attemptLogin with username and password', () => {

      vm.attemptLogin();

      expect(mockSessionService.attemptLogin).toHaveBeenCalledWith(vm.username, vm.password);
    });

    describe('when login succeeds', () => {
      it('should go to dashboard', () => {
        vm.attemptLogin();
        $rootScope.$apply();

        expect(mockState.go).toHaveBeenCalledWith('dashboard');
      });
    });

    describe('when login fails', () => {
      it('should show toastr error', () => {
        let reason = "Bad password";
        mockSessionService.attemptLogin.and.callFake(() => {
          return $q.reject(reason);
        });
        
        vm.attemptLogin();
        $rootScope.$apply();

        expect(mockToastr.error).toHaveBeenCalledWith(reason);
      });
    });


  });
});
