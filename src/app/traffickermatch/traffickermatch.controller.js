/* global angular */
/* global Image */
class TraffickerMatchController {
    constructor(StickyHeader, traffickerMatchService, $uibModal, SpinnerOverlayService, constants) {
        'ngInject';

        this.sticky = StickyHeader;
        this.traffickerMatchService = traffickerMatchService;
        this.spinnerOverlayService = SpinnerOverlayService;
        this.constants = constants;
        this.$uibModal = $uibModal;
        this.language = 'Nepali';
        this.filter = "Suspect";

        this.type = "name";
        this.searchValue = "";
    }

    oldShowPictureInModal(photo) {
        let photoUrl = new URL(photo, this.constants.BaseUrl).href;
        this.$uibModal.open({
            animation: true,
            template: `<div class="text-center"><img ng-src="${photoUrl}"/></div>`,
            size: 'sm',
        });
    }
    
    resizeImage(img) {
        let photoSquare = 600.0;
        let temp = angular.element('#myCanvas');
        let canvas = temp.get(0);
        let ctx = canvas.getContext('2d');
        if (img.width > img.height) {
            canvas.width = photoSquare;
            canvas.height = img.height * photoSquare/img.width;
        } else {
            canvas.height = photoSquare;
            canvas.width = img.width * photoSquare/img.height;
        }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    }
    
    showPictureInModal(photo) {
        let img = new Image();
        img.addEventListener('load', (e)=>{/*jshint unused: false */this.resizeImage(img);});
        img.src = new URL(photo, this.constants.BaseUrl).href;
        this.$uibModal.open({
            animation: true,
            template: `<div class="text-center"><canvas id="myCanvas" width="150" height="150" style="border:1px solid #d3d3d3;"/></div>`,
            size: 'sm',
        });
    }

    matchSearch() {
        this.spinnerOverlayService.show("Searching for matches");
        this.type = isNaN(this.searchValue.replace(/[\s-\(\)\.]+/g, "")) ? "name" : "phone";
        this.traffickerMatchService.getKnownPersons(this.searchValue, this.type, this.filter)
            .then((promise) => {
                this.matchCandidates = promise.data;
                this.spinnerOverlayService.hide();
            });
    }
}

export default TraffickerMatchController;