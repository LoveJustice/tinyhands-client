import constants from '../../constants';
import templateUrl from './india.html';
import topBoxTemplate from './step-templates/topBox.html';
import groupTemplate from './step-templates/group.html';
import destinationTemplate from './step-templates/destination.html';
import familyTemplate from './step-templates/family.html';
import signsTemplate from './step-templates/signs.html';
import intercepteesTemplate from './step-templates/interceptees/interceptees.html';
import finalProceduresTemplate from './step-templates/finalProcedures.html';
import './india.less';
import IntercepteeModalController from './step-templates/interceptees/intercepteeModal.controller';
import intercepteeModalTemplate from './step-templates/interceptees/intercepteeModal.html';


export class IrfIndiaController {
    constructor($uibModal, IndiaService) {
        'ngInject';
        this.$uibModal = $uibModal;
        this.IndiaService = IndiaService;

        this.otherWebsite = false;
        this.otherRedFlag = false;
        this.selectedStep = 5;
        this.stepTemplates = [
            topBoxTemplate,
            groupTemplate,
            destinationTemplate,
            familyTemplate,
            signsTemplate,
            intercepteesTemplate,
            finalProceduresTemplate
        ];

        this.getIndiaIrf();
        this.getLocation();
        this.getStaff();
    }

    formatDate(UfcDate) {
        return moment(UfcDate).toDate();
    }

    getIndiaIrf() {
        this.IndiaService.getIndiaIrf().then(response => {
            this.cards = response.data.cards[0].instances;
            this.responses = response.data.responses;
            this.questions = _.keyBy(this.responses, x => x.question_id);
            this.setValuesForOtherInputs();
        });
    }

    getIntercepteeImage(url) {
        return new URL(url, constants.BaseUrl).href;
    }

    getLocation() {
        this.IndiaService.getLocation().then(response => {
            this.location = response.data;
        });
    }

    getResponseOfQuestionById(responses, questionId) {
        return _.find(responses, x => x.question_id === questionId).response;
    }

    getStaff() {
        this.IndiaService.getStaff().then(response => {
            this.staff = response.data;
        });
    }

    openIntercepteeModal(responses = [], isAdd = false) {
        if (isAdd) {
            responses.push({
                question_id: 7,
                response: {}
            });
            responses.push({
                question_id: 8,
                response: {}
            });
            responses.push({
                question_id: 9,
                response: {
                    gender: {},
                    name: {},
                    age: {},
                    address1: {},
                    address2: {},
                    phone: {},
                    nationality: {},
                }
            });
        }
        this.$uibModal.open({
            bindToController: true,
            controller: IntercepteeModalController,
            controllerAs: 'IntercepteeModalController',
            resolve: {
                isAdd: () => isAdd,
                questions: () => _.keyBy(responses, x => x.question_id)
            },
            size: 'lg',
            templateUrl: intercepteeModalTemplate,
        }).result.then(() => {
            if (isAdd) {
                this.cards.push({
                    responses
                });
            }
        });
    }

    setValuesForOtherInputs() {
        const DateTimeId = 4;
        this.questions[DateTimeId].response.value = this.formatDate(this.questions[DateTimeId].response.value);
        const OtherRedFlagId = 31;
        const OtherWebsiteId = 244;
        let otherRedFlag = this.questions[OtherRedFlagId].response.value;
        let otherWebsite = this.questions[OtherWebsiteId].response.value;
        this.otherRedFlag = !!otherRedFlag;
        this.otherWebsite = !!otherWebsite;
        this.questions[OtherWebsiteId].response.value = otherWebsite === false ? '' : otherWebsite;
        this.questions[OtherRedFlagId].response.value = otherRedFlag === false ? '' : otherRedFlag;
    }
}

export default {
    templateUrl,
    controller: IrfIndiaController
};