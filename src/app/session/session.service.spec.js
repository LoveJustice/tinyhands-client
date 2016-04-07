import SessionService from './session.service';

describe('SessionService', () => {

  let service;

  beforeEach(inject(($http) => {
    let $rootScope = {
          authenticated: null,
          $broadcast: () => {}
        },
        $state = {go: () => {}},
        $timeout = (f) => {f();};
    service = new SessionService($http, $rootScope, $state, $timeout);
  }));


  describe('function constructor', () => {
    it('user should be {}', () => {
      expect(service.user).toEqual({});
    });
  });

  describe('function attemptLogin with username and password', () => {
    let url = 'api/login/',
        username = 'test_user',
        password = 'test_password',
        obj = {username: username, password: password};

    beforeEach(() => {
      let promise = {data: {token: 123}};
      sessionStorage.token = null;
      service.post = () => { return {then: (f) => {
        f(promise);
      }};};
    });

    it(`should call post with ${url} and ${obj}`, () => {
      spyOn(service, 'post').and.callThrough();
      service.attemptLogin(username, password);
      expect(service.post).toHaveBeenCalledWith(url, obj);
    });

    let token = "Token 123";
    it(`should set sessionStorage token to "${token}"`, () => {
      service.attemptLogin(username, password);
      expect(sessionStorage.token).toEqual(token);
    });

    it(`should set root authenticated to true`, () => {
      service.attemptLogin(username, password);
      expect(service.root.authenticated).toBe(true);
    });

    it(`should call routeState go with 'dashboard'`, () => {
      spyOn(service.routeState, 'go');
      service.attemptLogin(username, password);
      expect(service.routeState.go).toHaveBeenCalledWith('dashboard');
    });

  });

  describe('function me', () => {

    let result = {data: 'foobar'};

    beforeEach(() => {
      service.get = () => { return {then: (f) => {
        f(result);
      }};};
    });

    it("should call get with 'api/me/'", () => {
      spyOn(service, 'get').and.callThrough();
      service.me();
      expect(service.get).toHaveBeenCalledWith('api/me/');
    });

    it(`should set user to '${result.data}'`, () => {
      service.me();
      expect(service.user).toEqual(result.data);
    });

    it("should call root $broadcast with 'GetNavBarBorderStations'", () => {
      spyOn(service.root, '$broadcast');
      service.me();
      expect(service.root.$broadcast).toHaveBeenCalledWith('GetNavBarBorderStations');
    });

  });

  describe('function checkAuthenticity', () => {
    it('should call createStateChangeListener', () => {
      spyOn(service, 'createStateChangeListener');
      service.checkAuthenticity();
      expect(service.createStateChangeListener).toHaveBeenCalled();
    });
  });

  describe('function checkAuthenticityLogic with requireLogin and token', () => {

    it("should call routeState go with 'login' if requireLogin and token undefined", () => {
      spyOn(service.routeState, 'go');
      service.checkAuthenticityLogic(true, undefined);
      expect(service.routeState.go).toHaveBeenCalledWith('login');
    });

    it('should set root authenticated to true if token', () => {
      service.root.authenticated = false;
      service.checkAuthenticityLogic(null, true);
      expect(service.root.authenticated).toBe(true);
    });

    it('should call me if token', () => {
      spyOn(service, 'me');
      service.checkAuthenticityLogic(null, true);
      expect(service.me).toHaveBeenCalled();
    });

  });

  describe('function createStateChangeListener', () => {

    it("should call root $on with first arg '$stateChangeStart'", () => {
      let firstArg;
      service.root.$on = (fa) => { firstArg = fa; };
      service.createStateChangeListener();
      expect(firstArg).toEqual('$stateChangeStart');
    });

    it("should call checkAuthenticityLogic with true and 'foo'", () => {
      let toState = {data: {requireLogin: true } };
      service.root.$on = (_, f) => { f(null, toState); };
      sessionStorage.token = 'foo';
      spyOn(service, 'checkAuthenticityLogic');
      service.createStateChangeListener();
      expect(service.checkAuthenticityLogic).toHaveBeenCalledWith(true, 'foo');
    });

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
