angular
    .module('EventsMod')
    .controller('EventModalCtrl', function($scope, $modalInstance, event) {
        var vm = this;

        vm.close = function() {
            $modalInstance.dismiss("cancel");
        }

        vm.activate = function() {
            vm.event = event;
        }

        vm.activate();
    });