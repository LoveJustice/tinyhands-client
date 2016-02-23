(function() {
  'use strict';

  describe('LoginController', function() {
    var vm;

    beforeEach(module('tinyhandsFrontend'));

    beforeEach(inject(function($controller) {
      vm = $controller('LoginController');
    }));

    describe('function constructor', function() {

      it('password should be empty string', function() {
        expect(vm.password).toEqual('');
      });

      it('username should be empty string', function() {
        expect(vm.password).toEqual('');
      });

    });

    describe('function attemptLogin', function() {
      it('should call sesssion attemptLogin with username and password', function() {
        spyOn(vm.session, 'attemptLogin');

        vm.attemptLogin();

        expect(vm.session.attemptLogin).toHaveBeenCalledWith(vm.username, vm.password);
      });
    });
  });
})();
