import templateUrl from './nepal.html';
import topBoxTemplate from './step-templates/topBox.html';
import groupTemplate from './step-templates/group.html';
import destinationTemplate from './step-templates/destination.html';
import familyTemplate from './step-templates/family.html';
import signsTemplate from './step-templates/signs.html';
import intercepteesTemplate from './step-templates/interceptees/interceptees.html';
import finalProceduresTemplate from './step-templates/finalProcedures.html';
import './nepal.less';
import IntercepteeModalController from './step-templates/interceptees/intercepteeModal.controller';
import intercepteeModalTemplate from './step-templates/interceptees/intercepteeModal.html';

const DateTimeId = 4;
const OtherFamilyId = 82;
const OtherContactId = 92;
const OtherRedFlagId = 31;
const OtherSignId = 134;
const OtherWebsiteId = 244;
const StaffConvincedId = 149;

export class IrfNepalController {
    constructor($uibModal, constants, NepalService) {
        'ngInject';
        this.$uibModal = $uibModal;
        this.constants = constants;
        this.NepalService = NepalService;

        this.contacts = [
            ['Hotel owner', 'Rickshaw driver', 'Taxi driver'],
            ['Bus driver', 'Church member', 'Other NGO'],
            ['Police', 'Subcomittee member']
        ];
        this.family = [
            ['Own brother', 'Own father', 'Own grandparent'],
            ['Own sister', 'Own mother', 'Own aunt/uncle']
        ];
        this.otherContactString = '';
        this.otherFamilyString = '';
        this.otherRedFlag = false;
        this.otherSign = false;
        this.otherWebsite = false;
        this.selectedStep = 0;
        this.staffConvinced = false;
        this.stepTemplates = [
            topBoxTemplate,
            groupTemplate,
            destinationTemplate,
            familyTemplate,
            signsTemplate,
            intercepteesTemplate,
            finalProceduresTemplate
        ];

        this.getNepalIrf();
        this.getLocation();
        this.getStaff();
    }

    formatDate(UfcDate) {
        return moment(UfcDate).toDate();
    }

    getNepalIrf() {
        this.NepalService.getNepalIrf().then(response => {
            this.cards = response.data.cards[0].instances;
            this.responses = response.data.responses;
            this.questions = _.keyBy(this.responses, x => x.question_id);
            this.setValuesForOtherInputs();
        });
    }

    getIntercepteeImage(url) {
        return new URL(url, this.constants.BaseUrl).href;
    }

    getLocation() {
        this.NepalService.getLocation().then(response => {
            this.location = response.data;
        });
    }

    getResponseOfQuestionById(responses, questionId) {
        return _.find(responses, x => x.question_id === questionId).response;
    }

    getStaff() {
        this.NepalService.getStaff().then(response => {
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

    setRadio(items, valueId) {
        let flattenedItems = _.flattenDeep(items);
        let value = this.questions[valueId].response.value;
        if (!_.includes(flattenedItems, value) && value !== '') {
            this.questions[valueId].response.value = 'Other';
            return value;
        }
    }

    setOtherQuestionValues(valueId) {
        let valueSet = this.questions[valueId].response.value;
        this.questions[valueId].response.value = valueSet || '';
        return !!valueSet;
    }

    setValuesForOtherInputs() {
        this.questions[DateTimeId].response.value = this.formatDate(this.questions[DateTimeId].response.value);
        this.otherRedFlag = this.setOtherQuestionValues(OtherRedFlagId);
        this.otherSign = this.setOtherQuestionValues(OtherSignId);
        this.otherWebsite = this.setOtherQuestionValues(OtherWebsiteId);
        this.otherContactString = this.setRadio(this.contacts, OtherContactId);
        this.otherFamilyString = this.setRadio(this.family, OtherFamilyId);
        this.staffConvinced = this.setOtherQuestionValues(StaffConvincedId);
    }
}
export default {
    templateUrl,
    controller: IrfNepalController
};