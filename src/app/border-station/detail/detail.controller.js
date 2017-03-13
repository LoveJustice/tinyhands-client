import constants from './../constants.js';

export default class DetailController {
    constructor($scope, BorderStationService, moment) {
        'ngInject';

        this.$scope = $scope;
        this.service = BorderStationService;
        this.moment = moment;

        this.details = {};

        if (this.service.borderStationId) {
            this.getDetails();
        }
        this.createListeners();
    }


    changeStationStatus() {
        this.details.open = !this.details.open;
    }

    create() {
        this.modifyDetails().then((response) => {
            this.details = response.data;
            this.service.borderStationId = this.details.id;
            this.$scope.$emit(constants.Events.Create.BorderStation.Done);
        }, () => {
            this.$scope.$emit(constants.Events.Create.BorderStation.Error);
        });
    }


    createListeners() {
        this.$scope.$on(constants.Events.Create.BorderStation.Start, () => { // POST listener
            this.create();
        });
        this.$scope.$on(constants.Events.Get.BorderStation, () => { // GET listener
            this.getDetails();
        });
        this.$scope.$on(constants.Events.Update.BorderStation, () => { // PUT listener
            this.update();
        });
    }


    // Date Formatting
    formatDate(dateToFormat) { // Formats date string to YYYY[-MM[-DD]]
        return dateToFormat ? this.moment(dateToFormat).format('YYYY-MM-DD') : this.moment().format('YYYY-MM-DD');
    }


    // GET Calls	
    getDetails() {
        this.service.getDetails().then((response) => {
            this.details = response.data;
        });
    }


    // UPDATE calls
    update() {
        this.modifyDetails().then(() => {
            this.$scope.$emit(constants.Events.Update.Detail.Done);
        }, () => {
            this.$scope.$emit(constants.Events.Update.Detail.Error);
        });
    }

    modifyDetails() {
        this.details.date_established = this.formatDate(this.details.date_established);

        if (this.service.borderStationId) {
            return this.service.updateRelationship([this.details], 'updateDetails');
        }
        return this.service.createBorderStation(this.details);
    }
}