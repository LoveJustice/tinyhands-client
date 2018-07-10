export default class NewIrfModalController {
    constructor($state, $uibModalInstance) {
        'ngInject';
        this.$state = $state;
        this.$uibModalInstance = $uibModalInstance;

        this.countries = ['Bangladesh', 'India', 'Malawi', 'Nepal', 'South Africa',];
        this.selectedCountry = this.countries[0];
    }

    close() {
        this.$uibModalInstance.close();
    }

    createNewIrf() {
        this.$state.go('irf' + this.selectedCountry.replace(' ', ''));
        this.close();
    }

    dismiss() {
        this.$uibModalInstance.dismiss();
    }
}