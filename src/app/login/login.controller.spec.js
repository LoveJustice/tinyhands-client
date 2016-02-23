import LoginController from './login.controller';
import SessionService from '../utils/session.service';

describe('LoginController', () => {

  let vm;

  beforeEach(inject(($http, $rootScope, $timeout) => {
    // FIXME can't inject $state
    let $state = {go: () => {}};
    let service = new SessionService($http, $rootScope, $state, $timeout);
    vm = new LoginController(service);
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
      spyOn(vm.session, 'attemptLogin');

      vm.attemptLogin();

      expect(vm.session.attemptLogin).toHaveBeenCalledWith(vm.username, vm.password);
    });
  });
});
