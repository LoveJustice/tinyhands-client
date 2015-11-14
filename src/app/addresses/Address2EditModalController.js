    //.controller('ModalInstanceCtrl', function ($scope, $modalInstance, $http, address) {
    //    $scope.address = angular.copy(address);
    //
    //
    //    $scope.save = function () {
    //        // this is so we can save null cannon names
    //        if($scope.address.cannonical_name === "" || $scope.address.cannonical_name == undefined){
    //            $scope.address.cannonical_name = {id: -1, name: "Empty"};
    //        }
    //        $modalInstance.close($scope.address);
    //    };
    //
    //    $scope.cancel = function () {
    //        $modalInstance.dismiss('close');
    //    };
    //
    //    $scope.getFuzzyAddress1s = function(val) {
    //        return $http.get('/api/address1/fuzzy/?district=' + val)
    //            .then(function(response){
    //                return response.data;
    //            });
    //    };
    //
    //    $scope.getFuzzyAddress2s = function(val) {
    //        return $http.get('/api/address2/fuzzy/?vdc=' + val)
    //            .then(function(response){
    //                return response.data;
    //            });
    //    };
    //});