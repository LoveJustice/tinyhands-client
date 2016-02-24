(function() {
  'use strict';

  describe('SessionService', function() {

    var service;

    beforeEach(module('tinyhandsFrontend'));

    beforeEach(inject(function($injector) {
      service = $injector.get('session');
    }));

    describe('function constructor', function() {
      it('user should be {}', function() {
        expect(service.user).toEqual({});
      });
    });

    describe('function attemptLogin with username and password', function() {
      // TODO
    });

    describe('function me', function() {
      // TODO
    });

    describe('function checkAuthenticity', function() {
      it('should call createStateChangeListener', function() {
        spyOn(service, 'createStateChangeListener');
        service.checkAuthenticity();
        expect(service.createStateChangeListener).toHaveBeenCalled();
      });
    });

    describe('function checkAuthenticityLogic with requireLogin and token', function() {
      // TODO
    });

    describe('function createStateChangeListener', function() {
      // TODO
    });

    describe('function logout', function() {

      it('user should be {}', function() {
        service.logout();
        expect(service.user).toEqual({});
      });

      it('root.authenticated should be false', function() {
        service.logout();
        expect(service.root.authenticated).toBe(false);
      });

      it('should call routeState go with "login"', function() {
        spyOn(service.routeState, 'go');
        service.logout();
        expect(service.routeState.go).toHaveBeenCalledWith('login');
      });

    });

  });
})();
