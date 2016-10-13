class DashboardController {
    constructor($rootScope) {
        'ngInject';

        this.$rootScope = $rootScope;

        this.showEvents = true;
        this.showTally = true;
        this.showAddress2Layer = true;
    }

    toggleAddress2Layer() {
        this.$rootScope.$emit('toggleAddress2Layer', this.showAddress2Layer);
    }

}
export default DashboardController;