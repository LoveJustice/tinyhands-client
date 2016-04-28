import LoginController from './login.controller';
import SessionService from './../utils/session.service';

describe('LoginController', () => {

  let vm;

  beforeEach(() => {
    let $http = null;
    let $rootScope = null;
    let $state = {go: () => {}};
    let $timeout = null;
    let service = new SessionService($http, $rootScope, $state, $timeout);
    vm = new LoginController(service);
  });

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
