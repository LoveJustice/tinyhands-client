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
    }

    close() {
        this.$uibModalInstance.close();
    }

    dismiss() {
        this.$uibModalInstance.dismiss();
    }

    fileUpload() {
        this.questions[ImageQuestion].response.value = '';
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
        this.originalQuestions[DemographicQuestion].response.address1.id = this.questions[DemographicQuestion].response.address1.id;
        this.originalQuestions[DemographicQuestion].response.address1.name = this.questions[DemographicQuestion].response.address1.name;
        this.originalQuestions[DemographicQuestion].response.address2.id = this.questions[DemographicQuestion].response.address2.id;
        this.originalQuestions[DemographicQuestion].response.address2.name = this.questions[DemographicQuestion].response.address2.name;
        this.originalQuestions[DemographicQuestion].response.phone.value = this.questions[DemographicQuestion].response.phone.value;
        this.originalQuestions[CustodyQuestion].response.value = this.questions[CustodyQuestion].response.value;
        if (this.file) {
            this.originalQuestions[ImageQuestion].response.value = this.file;
        }
        this.close();
    }
}