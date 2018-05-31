import constants from '../../../../constants';

export default class IntercepteeModalController {
    constructor($uibModalInstance, isAdd, questions) {
        'ngInject';
        this.$uibModalInstance = $uibModalInstance;

        this.isAdd = isAdd;
        this.questions = questions;
    }

    close() {
        this.$uibModalInstance.close();
    }

    dismiss() {
        this.$uibModalInstance.dismiss();
    }

    getIntercepteeImage(url) {
        return new URL(url, constants.BaseUrl).href;
    }
}