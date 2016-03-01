import SessionService from './session.service';

describe('SessionService', () => {

  let service;

  beforeEach(inject(($http, $rootScope, $timeout) => {
    // FIXME can't inject $state
    let $state = {go: () => {}};
    service = new SessionService($http, $rootScope, $state, $timeout);
  }));


  describe('function constructor', () => {
    it('user should be {}', () => {
      expect(service.user).toEqual({});
    });
  });

  describe('function attemptLogin with username and password', () => {
    // TODO
  });

  describe('function me', () => {
    // TODO
  });

  describe('function checkAuthenticity', () => {
    it('should call createStateChangeListener', () => {
      spyOn(service, 'createStateChangeListener');
      service.checkAuthenticity();
      expect(service.createStateChangeListener).toHaveBeenCalled();
    });
  });

  describe('function checkAuthenticityLogic with requireLogin and token', () => {
    // TODO
  });

  describe('function createStateChangeListener', () => {
    // TODO
  });

  describe('function logout', () => {

    it('user should be {}', () => {
      service.logout();
      expect(service.user).toEqual({});
    });

    it('root.authenticated should be false', () => {
      service.logout();
      expect(service.root.authenticated).toBe(false);
    });

    it('should call routeState go with "login"', () => {
      spyOn(service.routeState, 'go');
      service.logout();
      expect(service.routeState.go).toHaveBeenCalledWith('login');
    });

  });

});
