export default class ModalController {
    constructor($scope, $modalInstance, $eventTitle) {
        $scope.eventTitle = eventTitle;
    };

    delete() {
        $modalInstance.close(true);
    }

    cancel() {
        $modalInstance.dismiss("cancel");
    }
}
