import constants from '../../../../constants';

export default class IntercepteeModalController {
    constructor($uibModalInstance, isAdd, questions) {
        'ngInject';
        this.$uibModalInstance = $uibModalInstance;

        this.isAdd = isAdd;
        this.originalQuestions = questions;
        this.questions = angular.copy(questions);
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

    save() {
        this.originalQuestions[7].response.value = this.questions[7].response.value;
        this.originalQuestions[8].response.value = this.questions[8].response.value;
        this.originalQuestions[9].response.gender.value = this.questions[9].response.gender.value;
        this.originalQuestions[9].response.name.value = this.questions[9].response.name.value;
        this.originalQuestions[9].response.age.value = this.questions[9].response.age.value;
        this.originalQuestions[9].response.address1.value = this.questions[9].response.address1.value;
        this.originalQuestions[9].response.address2.value = this.questions[9].response.address2.value;
        this.originalQuestions[9].response.phone.value = this.questions[9].response.phone.value;
        this.originalQuestions[9].response.nationality.value = this.questions[9].response.nationality.value;
        this.close();
    }
}