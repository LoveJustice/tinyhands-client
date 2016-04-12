export default class ModalController {
    constructor($scope, $modalInstance, $eventTitle) {
        $scope.eventTitle = eventTitle;
    };

    this.delete() {
        $modalInstance.close(true);
    };

    this.cancel() {
        $modalInstance.dismiss("cancel");
    };
}
