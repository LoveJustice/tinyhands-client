angular
    .module('EventsMod')
    .controller('ModalCtrl', function($scope, $modalInstance, eventTitle) {
        var vm = this;

        vm.activate = function () {
          $scope.eventTitle = eventTitle;
        }

        vm.delete = function() {
          $modalInstance.close(true);
        };

        vm.cancel = function () {
          $modalInstance.dismiss("cancel");
        };

        vm.activate();
    });
