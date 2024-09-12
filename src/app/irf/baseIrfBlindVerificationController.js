import {BaseIrfController} from './baseIrfController.js';
import './common/irf.less';

import topBoxTemplate from './common/step-templates/topBox.html';
import profileTemplate from './common/step-templates/profile.html';
import areaIndustryTemplate from './common/step-templates/areaIndustry.html';
import resourceSafetyTemplate from './common/step-templates/resourceSafety.html';
import controlTemplate from './common/step-templates/control.html';
import noticedTemplate from './common/step-templates/noticed.html';
import intercepteesTemplate from './common/step-templates/interceptees/people.html';
import finalProceduresTemplate from './common/step-templates/finalProcedures.html';
import attachmentsTemplate from './common/step-templates/attachments/attachment.html';
import complianceTemplate from './common/step-templates/compliance.html';
import verificationTemplate from './common/step-templates/verificationBlind.html';

var INITIAL = 1;
var TIE_BREAK = 2;
var TIE_BREAK_REVIEW = 3;
var OVERRIDE = 4;

export class BaseIrfBlindVerificationController extends BaseIrfController {
    constructor($scope, $uibModal, constants, IrfService, $stateParams, $state, SpinnerOverlayService, $uibModalStack, SessionService, BaseUrlService) {
        'ngInject';
        super($scope, $uibModal, constants, IrfService, $stateParams, $state, SpinnerOverlayService, $uibModalStack, SessionService, BaseUrlService);
        
        this.stepTemplates = [
            {template:topBoxTemplate, name:"Top"},
            {template:profileTemplate, name:"Profile"},
            {template:areaIndustryTemplate, name:"Area/Industry"},
            {template:resourceSafetyTemplate, name:"Resources"},
            {template:controlTemplate, name:"Control"},
            {template:noticedTemplate, name:"Contact/Staff"},
            {template:intercepteesTemplate, name:"People"},
            {template:finalProceduresTemplate, name:"Reason"},
            {template:attachmentsTemplate, name:"Attachments"},
            {template:complianceTemplate, name:"Compliance"},
            {template:verificationTemplate, name:"Verification"},
        ];
        
        this.verificationTypes = [
                '',
                'Initial Verification',
                'Tie Break',
                'Tie Break Review',
                'Override',
            ];
        
        this.userId = this.session.user.id;
        this.canVerify = false;
        this.nextVerification = INITIAL;
        this.showAllVerification = false;
        this.editingVerificationCard = null;
        this.tieVerificationCard = null;
        this.nameMap = {};
        this.nameMap[this.session.user.id] = this.session.user.first_name + ' ' + this.session.user.last_name;
    }
    
    setFindings() {
        if ((this.getCardInstances('Verification').length > 0 && this.questions[607].response.value) || !this.questions[1066].response.value || this.questions[1066].response.value.length < 10) {
            return;
        }
        let irfDate = new Date(this.questions[1066].response.value);
        let cutoff = new Date(2020,2,1);
        if (irfDate < cutoff) {
            return;
        }
        if (this.redFlagTotal >= 10) {
            this.questions[607].response.value = "Evidence of Trafficking";
        } else {
            this.questions[607].response.value = "High Risk of Trafficking";
        }
    }
    
    /*
     * The form has been submitted.  Check if the form has both a tie break and tie break review verifications.  If both
     * are present and the evidence categorization and the reason are the same, remove the tie break review as a duplicate.
     */
    removeDuplicateReview() {
        if (this.tieVerificationCard && this.editingVerificationCard && this.tieVerificationCard !== this.editingVerificationCard) {
            if (this.getResponseOfQuestionById(this.tieVerificationCard.responses, 1091).value === 
                this.getResponseOfQuestionById(this.editingVerificationCard.responses, 1091).value &&
                this.getResponseOfQuestionById(this.tieVerificationCard.responses, 1092).value ===
                    this.getResponseOfQuestionById(this.editingVerificationCard.responses, 1092).value) {
                let cards = this.getCardInstances('Verification');
                cards.pop();
                this.tieVerificationCard = null;
                this.editingVerificationCard = null;
            }
        }
    }
    
    determineSubmitStatus() {
        this.removeDuplicateReview();
        let status = this.response.status;
        if (status === 'verified' || status === 'invalid') {
            return status;
        } else if (status === 'in-progress') {
            status = 'approved';
        }
        
        let cards = this.getCardInstances('Verification');
        let firstInitial = null;
        let evidenceCategorization = '';
        for (let idx = 0; idx < cards.length; idx++) {
            let verificationType = this.getResponseOfQuestionById(cards[idx].responses, 1088).value;
            if (verificationType === TIE_BREAK_REVIEW) {
                status = 'verified';
                evidenceCategorization = this.getResponseOfQuestionById(cards[idx].responses, 1091).value;
                break;
            } else if (verificationType === TIE_BREAK) {
                status = 'verified';
                evidenceCategorization = this.getResponseOfQuestionById(cards[idx].responses, 1091).value;
            } else if (verificationType === INITIAL && status !== 'verified' && status !== 'invalid') {
                if (firstInitial === null) {
                    firstInitial = cards[idx];
                } else {
                    if (this.getResponseOfQuestionById(cards[idx].responses, 1091).value ===
                        this.getResponseOfQuestionById(firstInitial.responses, 1091).value) {
                        evidenceCategorization = this.getResponseOfQuestionById(cards[idx].responses, 1091).value;
                        if (this.getResponseOfQuestionById(cards[idx].responses, 1091).value === 'Should not count as an Intercept') {
                            status = 'invalid';
                        } else {
                            status = 'verified';
                        }
                    } else {
                        status = 'verification-tie';
                    }
                }
            }
        }
        
        if (status === 'invalid' || status === 'verified') {
            this.questions[819].response.value = evidenceCategorization;
            if (!this.dateData.questions[821].value) {
                this.dateData.questions[821].value = new Date();
            }
        }
        
        return status;
    }
    
    initializeVerification() {
        let cards = this.getCardInstances('Verification');
        this.canVerify = !this.isViewing && (this.response.status === 'approved' ||
                this.response.status === 'verification-tie');
        this.nextVerification = INITIAL;
        this.hasTieBreakReview = false;
        let matchCategory = null;
        let initialCount = 0;
        for (let idx = 0; idx < cards.length; idx++) {
            let verifierId = this.getResponseOfQuestionById(cards[idx].responses, 1094).value;
            if (this.userId === verifierId) {
                // Current user already verified this IRF
                this.canVerify = false;
            }
            let verificationType = this.getResponseOfQuestionById(cards[idx].responses, 1088).value;
            if (verificationType === TIE_BREAK || verificationType === TIE_BREAK_REVIEW || verificationType === OVERRIDE) {
                // No more verifications needed for this IRF
                this.canVerify = false;
                this.showAllVerification = true;
                break;
            }
            if (verificationType === INITIAL && this.nextVerification === INITIAL) {
                initialCount += 1;
                let category = this.getResponseOfQuestionById(cards[idx].responses, 1091).value;
                if (initialCount > 1) {
                    if (category === matchCategory) {
                        // First two verifications match - no more verificatins needed
                        this.canVerify = false;
                        this.showAllVerification = true;
                        break;
                    } else {
                        // First two verifications differ - need tie break
                        this.nextVerification = TIE_BREAK;
                    }
                } else {
                    // Only one initial verification so far - still need second initial verification
                    matchCategory = category;
                }
            }
        }
        
        for (let idx = 0; idx < cards.length; idx++) {
            let verificationType = this.getResponseOfQuestionById(cards[idx].responses, 1088).value;
            if (verificationType === TIE_BREAK_REVIEW) {
                this.hasTieBreakReview = true;
            }
            this.getAccountName(this.getResponseOfQuestionById(cards[idx].responses, 1094).value);
        }
    }
    
    getAccountName(accountId) {
        this.service.getAccountName(accountId).then ((response) => {
            this.nameMap[accountId] = response.data;
        });
    }
    
    verificationTypeText(card) {
        let verificationType = this.getResponseOfQuestionById(card.responses, 1088).value;
        return this.verificationTypes[verificationType];
    }
    
    addVerification() {
        let card = this.createCard('Verification');
        this.getResponseOfQuestionById(card.responses, 1088).value = this.nextVerification;
        this.getResponseOfQuestionById(card.responses, 1089).value = '';
        this.getResponseOfQuestionById(card.responses, 1090).value = '';
        this.getResponseOfQuestionById(card.responses, 1094).value = this.userId;
        this.getResponseOfQuestionById(card.responses, 1093).value = this.dateData.dateToString(new Date());
        
        this.editingVerificationCard = card;
        let cards = this.getCardInstances('Verification');
        cards.push(card);
        this.canVerify = false;
    }
    
    reviewTieBreak() {
        let card = this.createCard('Verification');
        this.getResponseOfQuestionById(card.responses, 1088).value = TIE_BREAK_REVIEW;
        this.getResponseOfQuestionById(card.responses, 1089).value = '';
        this.getResponseOfQuestionById(card.responses, 1090).value = '';
        this.getResponseOfQuestionById(card.responses, 1094).value = this.userId;
        this.getResponseOfQuestionById(card.responses, 1093).value = this.dateData.dateToString(new Date());
        
        this.getResponseOfQuestionById(card.responses, 1091).value = this.getResponseOfQuestionById(this.editingVerificationCard.responses, 1091).value;
        this.getResponseOfQuestionById(card.responses, 1092).value = this.getResponseOfQuestionById(this.editingVerificationCard.responses, 1092).value;
        
        this.tieVerificationCard = this.editingVerificationCard;
        this.editingVerificationCard = card;
        let cards = this.getCardInstances('Verification');
        cards.push(card);
        this.showAllVerification = true;
        this.hasTieBreakReview = true;
    }
}

export default {
    BaseIrfBlindVerificationController
};