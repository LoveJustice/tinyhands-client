const ImageQuestion = 7;
const TypeQuestion = 8;
const DemographicQuestion = 9;

export default class IntercepteeModalController {
    constructor($uibModalInstance, constants, isAdd, questions) {
        'ngInject';
        this.$uibModalInstance = $uibModalInstance;
        this.constants = constants;

        this.isAdd = isAdd;
        this.originalQuestions = questions;
        this.questions = angular.copy(questions);
        this.questions[DemographicQuestion].response.age.value = this.formatDate(this.questions[DemographicQuestion].response.age.value);
    }

    close() {
        this.$uibModalInstance.close();
    }

    dismiss() {
        this.$uibModalInstance.dismiss();
    }

    fileUpload($file) {
        this.questions[ImageQuestion].response.value = '';
    }

    formatDate(UfcDate) {
        return moment(UfcDate).toDate();
    }

    getIntercepteeImage(url) {
        return new URL(url, this.constants.BaseUrl).href;
    }

    save() {
        this.originalQuestions[ImageQuestion].response.value = this.questions[ImageQuestion].response.value;
        this.originalQuestions[TypeQuestion].response.value = this.questions[TypeQuestion].response.value;
        this.originalQuestions[DemographicQuestion].response.gender.value = this.questions[DemographicQuestion].response.gender.value;
        this.originalQuestions[DemographicQuestion].response.name.value = this.questions[DemographicQuestion].response.name.value;
        this.originalQuestions[DemographicQuestion].response.age.value = this.questions[DemographicQuestion].response.age.value;
        this.originalQuestions[DemographicQuestion].response.address1.name = this.questions[DemographicQuestion].response.address1.name;
        this.originalQuestions[DemographicQuestion].response.address2.name = this.questions[DemographicQuestion].response.address2.name;
        this.originalQuestions[DemographicQuestion].response.phone.value = this.questions[DemographicQuestion].response.phone.value;
        this.originalQuestions[DemographicQuestion].response.nationality.value = this.questions[DemographicQuestion].response.nationality.value;
        if (this.file) {
            this.originalQuestions[ImageQuestion].response.value = this.file;
        }
        this.close();
    }
}