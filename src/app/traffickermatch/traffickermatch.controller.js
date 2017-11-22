class TraffickerMatchController {
    constructor(StickyHeader, traffickerMatchService, $uibModal, SpinnerOverlayService) {
        'ngInject';

        this.sticky = StickyHeader;
        this.traffickerMatchService = traffickerMatchService;
        this.spinnerOverlayService = SpinnerOverlayService;
        this.$uibModal = $uibModal;

        this.type = "name";
        this.searchValue = "";
    }

    showPictureInModal(photoUrl) {
        this.$uibModal.open({
            animation: true,
            template: `<div class="text-center"><img ng-src="${photoUrl}"/></div>`,
            size: 'sm',
        });
    }

    matchSearch() {
        this.spinnerOverlayService.show("Searching for matches");
        this.type = isNaN(this.searchValue.replace(/[\s-\(\)\.]+/g, "")) ? "name" : "phone";
        this.traffickerMatchService.getKnownPersons(this.searchValue, this.type)
            .then((promise) => {
                this.matchCandidates = promise.data;
                this.spinnerOverlayService.hide();
            });
    }
}

export default TraffickerMatchController;