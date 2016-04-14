export default class ModalController {
    constructor($scope, $modalInstance, $eventTitle) {
	'ngInject';
        $scope.eventTitle = $eventTitle;
    };

    delete() {
        $modalInstance.close(true);
    }

    cancel() {
        $modalInstance.dismiss("cancel");
    }
}
