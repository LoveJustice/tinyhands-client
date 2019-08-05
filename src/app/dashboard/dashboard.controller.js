class DashboardController {
    constructor($rootScope) {
        'ngInject';

        this.$rootScope = $rootScope;

        this.showEvents = true;
        this.showTally = true;
        this.showAddress2Layer = true;
        this.showBorderStationLocations = false;
    }

    toggleAddress2Layer() {
        this.$rootScope.$emit('toggleAddress2Layer', this.showAddress2Layer);
    }

    toggleBorderStationLocations() {
        this.$rootScope.$emit('toggleBorderStationLocations', this.showBorderStationLocations);
    }

}
export default DashboardController;
