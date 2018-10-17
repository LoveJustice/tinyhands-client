/* global angular */
const ImageQuestion = 7;
const TypeQuestion = 8;
const DemographicQuestion = 9;
const CustodyQuestion = 11;

export default class IntercepteeModalController {
    constructor($uibModalInstance, constants, isAdd, questions, isViewing, modalActions) {
        'ngInject';
        this.$uibModalInstance = $uibModalInstance;
        this.constants = constants;

        this.isAdd = isAdd;
        this.originalQuestions = questions;
        this.questions = angular.copy(questions);
        this.isViewing = isViewing;
        this.modalActions = modalActions;

        var t = Object.prototype.toString.call(this.questions[ImageQuestion].response.value);
        if (t === '[object Blob]') {
            this.file = this.questions[ImageQuestion].response.value;
        }

        this.initializeDateOfBirth();
    }

    close() {
        this.$uibModalInstance.close();
    }

    dismiss() {
        this.$uibModalInstance.dismiss();
    }

    delete() {
        this.modalActions.push('removeCard');
        this.$uibModalInstance.close();
    }

    fileUpload() {
        this.questions[ImageQuestion].response.value = '';
    }

    getIntercepteeImage(url) {
        var newUrl = new URL(url, this.constants.BaseUrl).href;
        return newUrl;
    }

    formatDate(UfcDate) {
        return moment(UfcDate).toDate();
    }

    initializeDateOfBirth() {
        let birthdate = this.questions[DemographicQuestion].response.birthdate.value;
        let dateValue = birthdate === null ? null : birthdate;
        this.questions[DemographicQuestion].response.birthdate.value = this.formatDate(dateValue);
    }

    formatDateString(theDate) {
        return moment(theDate).format('YYYY-MM-DD');
    }

    save() {
        this.originalQuestions[ImageQuestion].response.value = this.questions[ImageQuestion].response.value;
        this.originalQuestions[TypeQuestion].response.value = this.questions[TypeQuestion].response.value;
        this.originalQuestions[DemographicQuestion].response.gender.value = this.questions[DemographicQuestion].response.gender.value;
        this.originalQuestions[DemographicQuestion].response.name.value = this.questions[DemographicQuestion].response.name.value;
        this.originalQuestions[DemographicQuestion].response.birthdate.value =
            this.questions[DemographicQuestion].response.birthdate.value === null ? null : this.formatDateString(this.questions[DemographicQuestion].response.birthdate.value);
        this.originalQuestions[DemographicQuestion].response.address1.id = this.questions[DemographicQuestion].response.address1.id;
        this.originalQuestions[DemographicQuestion].response.address1.name = this.questions[DemographicQuestion].response.address1.name;
        this.originalQuestions[DemographicQuestion].response.address2.id = this.questions[DemographicQuestion].response.address2.id;
        this.originalQuestions[DemographicQuestion].response.address2.name = this.questions[DemographicQuestion].response.address2.name;
        this.originalQuestions[DemographicQuestion].response.phone.value = this.questions[DemographicQuestion].response.phone.value;
        this.originalQuestions[DemographicQuestion].response.nationality.value = this.questions[DemographicQuestion].response.nationality.value;
        this.originalQuestions[DemographicQuestion].response.passport.value = this.questions[DemographicQuestion].response.passport.value;
        this.originalQuestions[CustodyQuestion].response.value = this.questions[CustodyQuestion].response.value;
        if (this.file) {
            this.originalQuestions[ImageQuestion].response.value = this.file;
        }
        this.close();
    }
}
