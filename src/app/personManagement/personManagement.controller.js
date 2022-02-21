/* global Image */
/* global jQuery */
import './personManagement.less';
import {BaseMasterPersonCompare} from './baseMasterPersonCompare.js';
import detailsTemplate from './step-templates/details.html';
import confirmedMatchesTemplate from './step-templates/confirmedMatches.html';
import possibleMatchesTemplate from './step-templates/possibleMatches.html';
import suggestedMatchesTemplate from './step-templates/suggestedMatches.html';
import confirmedNonMatchesTemplate from './step-templates/confirmedNonMatches.html';
import createMatchTemplate from './step-templates/createMatch.html';
import attachmentsTemplate from './step-templates/attachments/attachment.html';

import NotesModalController from './notesModal.controller';
import notesTemplate from './step-templates/notesModal.html';

import MatchModalController from './matchModal.controller';
import matchTemplate from './step-templates/matchModal.html';

import attachmentTemplate from './step-templates/attachments/attachmentModal.html';
import AttachmentModalController from './step-templates/attachments/attachmentModal.controller';

export class PersonManagementController extends BaseMasterPersonCompare {
    constructor(StickyHeader, $scope, $uibModal, $timeout, personManagementService, personManagementListService, $stateParams, $state,
            SpinnerOverlayService, $uibModalStack, constants, toastr) {
        'ngInject';
        
        super(personManagementService, $stateParams);
        this.sticky = StickyHeader;
        this.$scope = $scope;
        this.$uibModal = $uibModal;
        this.$timeout = $timeout;
        this.personManagementListService = personManagementListService;
        this.$state = $state;
        this.spinnerOverlayService = SpinnerOverlayService;
        this.$uibModalStack = $uibModalStack;
        this.constants = constants;
        this.toastr = toastr;
        this.stepTemplates = [
            {template:detailsTemplate, name:"Details"},
            {template:confirmedMatchesTemplate, name:"Confirmed Matches"},
            {template:possibleMatchesTemplate, name:"Possible Matches"},
            {template:suggestedMatchesTemplate, name:"Suggested Matches"},
            {template:confirmedNonMatchesTemplate, name:"Confirmed Non-Matches"},
            {template:createMatchTemplate, name:"Create Match"},
            {template:attachmentsTemplate, name:"Attachments"},
        ];
        this.selectedStep = 0;
        this.isViewing = false;
        
        this.masterPerson = null;
        this.originalMasterPerson = null;
        this.originalPhotos = null;
        this.personCanvasUrl = null;
        
        this.phoneTypes = null;
        this.addressTypes = null;
        this.socialMediaTypes = null;
        this.documentTypes = null;
        this.photoDocumentType = null;
        this.attachmentTypes = null;
        this.matchTypes = null;
        this.details = {
             pvRelations:[],
             uniqueNames:[],
             uniquePhones:[],
             uniqueAddresses:[],
             uniqueSocialMedia:[],
             uniqueAppearance:[],
             uniqueId:[],
             believes:[],
             roles:[],
             forms:[],
             photos:[],
             birthdate:null,
             age:null,
        };
        
        this.forms = [];
        
        this.timer = {};
        this.stickyOptions = {top:140};
        
        this.getTypes();
        this.getPvRelations(this.stateParams.id, this.details);
    }
    
    getMatches() {
        this.service.getMatches(this.stateParams.id, this.possibleMatchType).then((response) => {
            this.possibleMatches = response.data;
        });
        this.service.getMatches(this.stateParams.id, this.suggestedMatchType).then((response) => {
            this.suggestedMatches = response.data;
        });
        this.service.getMatches(this.stateParams.id, this.nonMatchType).then((response) => {
            this.nonMatches = response.data;
        });
    }
    
    dateAsString(inDate) {
        let dateString = '';
        dateString = inDate.getUTCFullYear() + '-';
        if (inDate.getUTCMonth() < 9) {
            dateString += '0';
        }
        dateString += (inDate.getUTCMonth()+1) + "-";
        if (inDate.getUTCDate() <= 9) {
            dateString += '0';
        }
        dateString += inDate.getUTCDate();
        return dateString;
    }
    
    hasBeenModified(obj1, obj2) {
        if(typeof(obj2)==='undefined') {
            return true;
        }
        for(let p in obj1) {
            if (p==='$$hashKey') {
                continue;
            }
            switch(typeof(obj1[p])) {
                case 'object':
                    if (this.hasBeenModified(obj1[p],obj2[p])) {
                        return true;
                    }
                    break;
                case 'function':
                    continue;
                default:
                    if (obj1[p] !== obj2[p]) {
                        return true;
                    }
            }
        }

        for(let p in obj2)
        {
            if(typeof(obj1[p])==='undefined') {
                return true;
            }
        }

        return false;
    }
    
    processMainMasterPersonData(theData) {
        this.masterPerson = theData;
        this.preProcess(this.masterPerson, this.details);
        this.originalMasterPerson = jQuery.extend(true, {}, this.masterPerson);
        this.originalPhotos= jQuery.extend(true, {}, this.details.photos);
        if (this.details.photos.length > 0) {
            this.loadImage(new URL(this.details.photos[0].file_location, this.constants.BaseUrl).href, '#personCanvas');
            this.personCanvasUrl = new URL(this.details.photos[0].file_location, this.constants.BaseUrl).href;
            this.imageIndex = 0;
        } else {
            this.imageIndex = -1;
        }
    }
    
    getCheckedClass (isChecked, otherClass) {
        if (isChecked) {
            return "checkedBackground " + otherClass;
        } else {
            return otherClass;
        }
    }
    
    getMasterPerson(id) {
        this.service.getMasterPerson(id).then((response) => {
            this.processMainMasterPersonData(response.data);
            this.searchValue = this.masterPerson.full_name;
            this.getKnownPersons();
        }, (error) => {
            this.toastr.error(error.data);
        });
    }
    
    getPvRelations(id, container) {
        this.service.getPvRelations(id).then((response) => {
            container.pvRelations = response.data;
        });
    }
    
    addPhone() {
        this.masterPerson.personphone_set.push({master_person:this.masterPerson.id, number:'',phone_verified:false,phone_type:null});
    }
    removePhone(index) {
        this.masterPerson.personphone_set.splice(index,1);
    }
    phoneChange(theData) {
        for (let idx=0; idx < theData.ids.length; idx++) {
            for (let idx1=0; idx1 < this.masterPerson.person_set.length; idx1++) {
                if (this.masterPerson.person_set[idx1].id === theData.ids[idx]) {
                    this.masterPerson.person_set[idx1].phone_verified = theData.phone_verified;
                    this.masterPerson.person_set[idx1].phone_type = theData.phone_type;
                }
            }
        }
    }
    phoneTypeString(theType) {
        let ret = '';
        if (this.phoneTypes) {
            for (let idx=0; idx < this.phoneTypes.length; idx++) {
                if (theType === '' + this.phoneTypes[idx].id) {
                    ret = this.phoneTypes[idx].name;
                    break;
                }
            }
        }
        return ret;
    }
    
    addAddress() {
        this.masterPerson.personaddress_set.push({master_person:this.masterPerson.id, address:null,address_verified:false, latitude:null,longitude:null,address_notes:'',address_type:null});
    }
    removeAddress(index) {
        this.masterPerson.personaddress_set.splice(index,1);
    }
    addressChange(theData) {
        for (let idx=0; idx < theData.ids.length; idx++) {
            for (let idx1=0; idx1 < this.masterPerson.person_set.length; idx1++) {
                if (this.masterPerson.person_set[idx1].id === theData.ids[idx]) {
                    this.masterPerson.person_set[idx1].address_verified = theData.address_verified;
                    this.masterPerson.person_set[idx1].address_type = theData.address_type;
                }
            }
        }
    }
    addressTypeString(theType) {
        let ret = '';
        if (this.addressTypes) {
            for (let idx=0; idx < this.addressTypes.length; idx++) {
                if (theType === '' + this.addressTypes[idx].id) {
                    ret = this.addressTypes[idx].name;
                    break;
                }
            }
        }
        return ret;
    }

    addSocialMedia() {
        this.masterPerson.personsocialmedia_set.push({master_person:this.masterPerson.id, social_media:null,social_media_verified:false, social_media_type:null});
    }
    removeSocialMedia(index) {
        this.masterPerson.personsocialmedia_set.splice(index,1);
    }
    socialChange(theData) {
        for (let idx=0; idx < theData.ids.length; idx++) {
            for (let idx1=0; idx1 < this.masterPerson.person_set.length; idx1++) {
                if (this.masterPerson.person_set[idx1].id === theData.ids[idx]) {
                    this.masterPerson.person_set[idx1].social_media_verified = theData.social_media_verified;
                    this.masterPerson.person_set[idx1].social_media_type = theData.social_media_type;
                }
            }
        }
    }
    socialTypeString(theType) {
        let ret = '';
        if (this.socialMediaTypes) {
            for (let idx=0; idx < this.socialMediaTypes.length; idx++) {
                if (theType === '' + this.socialMediaTypes[idx].id) {
                    ret = this.socialMediaTypes[idx].name;
                    break;
                }
            }
        }
        return ret;
    }
    
    init() {
        if (this.details.photos.length > 0) {
            this.loadImage(new URL(this.details.photos[0], this.constants.BaseUrl).href, '#personCanvas');
            this.personCanvasUrl = new URL(this.details.photos[0].file_location, this.constants.BaseUrl).href;
        }
    }
    
    clearCanvas(imageTag) {
        let temp = angular.element(imageTag);
        let canvas = temp.get(0);
        let ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height); 
    }
    
    resizeImage(img, imageTag) {
        let temp = angular.element(imageTag);
        let canvas = temp.get(0);
        let ctx = canvas.getContext('2d');
        if (img.width > img.height) {
            canvas.width = 200;
            canvas.height = img.height * 200/img.width;
        } else {
            canvas.height = 200;
            canvas.width = img.width * 200.0/img.height;
        }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    }
    
    loadImage(imageUrl, imageTag) {
        let img = new Image();
        img.addEventListener('load', (e)=>{/*jshint unused: false */this.resizeImage(img, imageTag);});
        img.src = imageUrl;
    }
    
    fileUpload() {
        this.photoPresent = true;
        this.details.photos.push({file_location:null, document_type:this.photoDocumentType, master_person_id:this.masterPerson.id, canRemove:true, file:this.file});
        this.imageIndex = this.details.photos.length - 1;
        this.loadImage(this.file.$ngfBlobUrl, '#personCanvas');
        this.personCanvasUrl = this.file.$ngfBlobUrl;
        this.file = null;
    }
    
    photoMove(increment) {
        if (this.imageIndex + increment < 0 || this.imageIndex + increment > this.details.photos.length - 1) {
            return;
        }
        this.imageIndex += increment;
        this.photoDisplay();
    }
    
    photoDisplay() {
        if (this.details.photos[this.imageIndex].file_location) {
            this.loadImage(this.details.photos[this.imageIndex].file_location, '#personCanvas');
            this.personCanvasUrl = this.details.photos[this.imageIndex].file_location;
        } else if (this.details.photos[this.imageIndex].file) {
            this.loadImage(this.details.photos[this.imageIndex].file.$ngfBlobUrl, '#personCanvas');
            this.personCanvasUrl = this.details.photos[this.imageIndex].file.$ngfBlobUrl;
        }
    }
    
    removePhoto() {
        if (this.imageIndex > -1 && this.details.photos[this.imageIndex].canRemove) {
            this.details.photos.splice(this.imageIndex,1);
            if (this.imageIndex > this.details.photos.length - 1) {
                this.imageIndex -= 1;
            }
            if (this.imageIndex < 0) {
                this.clearCanvas('#personCanvas');
                this.personCanvasUrl = null;
            } else {
                this.photoDisplay();
            }
        }
    }
    
    saveDetails() {
        if (this.details.birthdate !== null) {
            this.masterPerson.birthdate = this.dateAsString(this.details.birthdate);
        }
        
        this.save(this.masterPerson, this.details.photos, this.details.attachments, 'Saving details ...');
    }
    
    save(masterPerson, photos, attachments, message) {
        this.spinnerOverlayService.show(message);
        this.service.saveMasterPerson(masterPerson, photos, attachments).then((response) => {
            this.processMainMasterPersonData(response.data);
            this.spinnerOverlayService.hide();
        }, (error) => {
            this.spinnerOverlayService.hide();
            this.toastr.error(error.data.errors);
           });
    }
    
    
    formSelected() {
        this.details.selectedPerson = null;
        if (this.details.selectedFormId) {
            for (let idx=0; idx < this.masterPerson.person_set.length; idx++) {
                if (this.masterPerson.person_set[idx].form_id === this.details.selectedFormId) {
                    this.details.selectedPerson = this.masterPerson.person_set[idx];
                }
            }
            
            if (this.details.selectedPerson && this.details.selectedPerson.photo) {
                this.loadImage(new URL(this.details.selectedPerson.photo, this.constants.BaseUrl).href, '#confirmedCanvas');
                this.confirmedCanvasUrl = new URL(this.details.selectedPerson.photo, this.constants.BaseUrl).href;
            } else {
                this.clearCanvas('#confirmedCanvas');
                this.confirmedCanvasUrl = null;
            }
        } else {
            this.clearCanvas('#confirmedCanvas');
        }
    }
    
    getMatchAge(match) {
        if (match.master_person.birthdate) {
            return this.calculateAge(this.dateAsUTC(match.master_person.birthdate));
        }
        return "";
    }
    getMatchPhone(match) {
        let phone = null;
        for (let idx=0; idx < match.master_person.personphone_set.length; idx++) {
            if (match.master_person.personphone_set[idx].number === null || match.master_person.personphone_set[idx].number === '') {
                continue;
            }
            if (match.master_person.personphone_set[idx].phone_verified) {
                return match.master_person.personphone_set[idx].number;
            }
            if (phone === null) {
                phone = match.master_person.personphone_set[idx].number;
            }
        }
        
        for (let idx=0; idx < match.master_person.person_set.length; idx++) {
            if (match.master_person.person_set[idx].phone_contact === null || match.master_person.person_set[idx].phone_contact === '') {
                continue;
            }
            if (match.master_person.person_set[idx].phone_verified) {
                return match.master_person.person_set[idx].phone_contact;
            }
            if (phone === null) {
                phone = match.master_person.person_set[idx].phone_contact;
            }
        }
        
        return phone;
    }
    getMatchAddress(match) {
        let address = null;
        for (let idx=0; idx < match.master_person.personaddress_set.length; idx++) {
            if (match.master_person.personaddress_set[idx].address === null || match.master_person.personaddress_set[idx].address === '') {
                continue;
            }
            if (match.master_person.personaddress_set[idx].address_verified) {
                return match.master_person.personaddress_set[idx].address.address;
            }
            if (address === null) {
                address = match.master_person.personphone_set[idx].number;
            }
        }
        
        for (let idx=0; idx < match.master_person.person_set.length; idx++) {
            if (match.master_person.person_set[idx].address === null || match.master_person.person_set[idx].address === '') {
                continue;
            }
            if (match.master_person.person_set[idx].address_verified) {
                return match.master_person.person_set[idx].address.address;
            }
            if (address === null) {
                address = match.master_person.person_set[idx].address.address;
            }
        }
        
        return address;
        
    }
    
    masterPersonRef(masterPerson) {
        let ref =  this.$state.href('personManagement', {
            id: masterPerson.id
        });
        return ref;
    }
    
    compare(match, where) {
        let compareDetails = {};
        this.preProcess(match.master_person, compareDetails);
        this.modalActions = {};
        this.$uibModal.open({
            bindToController: true,
            controller: MatchModalController,
            controllerAs: 'vm',
            resolve: {
                main: () => this.masterPerson,
                mainDetails:() => this.details,
                compare: () => match,
                compareDetails: () => compareDetails,
                modalActions: () => this.modalActions,
                where: () => where,
                constants: () => this.constants,
                phoneTypes: () => this.phoneTypes,
                addressTypes: () => this.addressTypes,
                socialMediaTypes: () => this.socialMediaTypes,
                possibleMatchType: () => this.possibleMatchType,
                nonMatchType: () => this.nonMatchType,
                detailsModified: () => this.hasBeenModified(this.masterPerson, this.originalMasterPerson),
            },
            size: 'lg',
            templateUrl: matchTemplate,
            windowClass: 'match-modal-popup',
        }).result.then(() => {
            if (this.modalActions.action === 'update') {
                this.modalActions.master1 = this.masterPerson.id;
                this.modalActions.master2 = match.master_person.id;
                if (where === 'create') {
                    this.service.createMatch(this.modalActions.match_type, this.modalActions).then(() => {
                        this.getMatches();
                        this.getKnownPersons();
                    }, (error) => {
                    this.toastr.error(error.data.errors);
                    });
                } else {
                    this.service.updateMatch(match.id, this.modalActions.match_type, this.modalActions).then(() => {
                        this.getMatches();
                        this.getKnownPersons();
                    });
                }
            } else if (this.modalActions.action === 'merge') {
                this.service.merge(this.masterPerson.id, match.master_person.id, this.modalActions).then((response) => {
                    this.processMainMasterPersonData(response.data);
                    this.getMatches();
                    this.getKnownPersons();
                }, (error) => {
                    this.toastr.error(error.data.errors);
                    });
            }
        });
    }
    
    openAttachmentModal(attachment, attachmentIndex) {
        let isAdd = false;
        if (attachment === null) {
            isAdd = true;
            attachment = {
                    file_location:'',
                    document_type:'',
                    master_person_id:this.masterPerson.id, 
                    file:null
                };
        }
        this.modalActions = [];
        this.$uibModal.open({
            bindToController: true,
            controller: AttachmentModalController,
            controllerAs: 'AttachmentModalController',
            resolve: {
                isAdd: () => isAdd,
                attachment: () => attachment,
                attachmentTypes:() => this.attachmentTypes,
                isViewing: () => this.isViewing,
                modalActions: () => this.modalActions,
                constants: () => this.constants,
            },
            size: 'lg',
            templateUrl: attachmentTemplate,
        }).result.then(() => {
            if (this.modalActions.indexOf('removeCard') > -1 && attachmentIndex !== null) {
                this.details.attachments.splice(attachmentIndex, 1);
            } else {
                if (isAdd) {
                    this.details.attachments.push(attachment);
                }
            }
            this.save(this.originalMasterPerson, this.originalPhotos, this.details.attachments, 'Saving attachments ...');
        });
    }
    removePerson() {
        if (this.hasBeenModified(this.masterPerson, this.originalMasterPerson) && !window.confirm("Information on the Details tab has unsaved changes.\nContinuing with the removal this person will lose those detail changes.\n\nWould you like to proceed?")) {
            return;
        }
        this.modalActions = {};
        this.$uibModal.open({
            bindToController: true,
            controller: NotesModalController,
            controllerAs: 'vm',
            resolve: {
                modalActions: () => this.modalActions,
            },
            size: 'lg',
            templateUrl: notesTemplate,
        }).result.then(() => {
            this.spinnerOverlayService.show('Removing person ...');
            if (!this.modalActions.notes) {
                this.modalActions.notes = 'No value entered';
            }
            this.service.removePerson(this.masterPerson.id, this.details.selectedPerson.id, this.modalActions).then((response) => {
                this.processMainMasterPersonData(response.data);
                this.spinnerOverlayService.hide();
            }, (error) => {
                this.spinnerOverlayService.hide();
                this.toastr.error(error.data.errors);
               });
        });
    }
    
    sortIcon(column) {
        if (column === this.sortColumn) {
            switch (column) {
                case "age":
                case "phone":
                    return this.reverse ? "glyphicon-sort-by-order-alt" : "glyphicon-sort-by-order";
                case "name":
                case "gender":
                case "address1":
                case "address2":
                    return this.reverse ? "glyphicon-sort-by-alphabet-alt" : "glyphicon-sort-by-alphabet";
                default:
                    return "glyphicon-sort";
            }
        }
        return "glyphicon-sort";
    }

    searchKnownPersons() {
        if (this.timer.hasOwnProperty('$$timeoutId')) {
            this.$timeout.cancel(this.timer);
        }
        sessionStorage.setItem('personManagement-create', this.searchValue);
        this.timer = this.$timeout(() => {
            this.$state.go('.', {
                search: this.searchValue,
            });
            this.getKnownPersons();
        }, 500);
    }

    getKnownPersons() {
        this.personManagementListService.listKnownPersons(this.getQueryParams())
            .then((promise) => {
                this.knownPersons = promise.data.results;
                for (let idx in this.knownPersons) {
                    if (this.knownPersons[idx].form_name) {
                        this.knownPersons[idx].viewUrl = this.$state.href(this.knownPersons[idx].form_name, {id:this.knownPersons[idx].form_id, 
                            stationId:this.knownPersons[idx].station_id, countryId:this.knownPersons[idx].country_id, isViewing:true,
                            formName:this.knownPersons[idx].form_name});
                    }
                }
                this.nextPageUrl = this.nextUrl(promise.data.next);
                this.loading = false;
            });
    }

    loadMoreKnownPersons() {
        this.loading = true;
        this.personManagementListService.loadMoreKnownPersons(this.getQueryParams(true))
            .then((promise) => {
                this.knownPersons = this.knownPersons.concat(promise.data.results);
                this.nextPageUrl = this.nextUrl(promise.data.next);
                this.loading = false;
            });
    }

    getQueryParams(loadMore = false) {
        var params = [];
        params.push({ "name": "page_size", "value": this.paginateBy });
        params.push({"name": "exclude_master_person_id", "value": this.stateParams.id});
        if (this.nextPageUrl && loadMore) {
            params.push({ "name": "page", "value": this.nextPageUrl });
        }
        if (this.searchValue) {
            params.push({ "name": "search", "value": this.searchValue });
        }
        if (this.sortColumn) {
            if (this.reverse) {
                params.push({ "name": "ordering", "value": ("-" + this.sortColumn.replace(".", "__")) });
            } else {
                params.push({ "name": "ordering", "value": (this.sortColumn.replace(".", "__")) });
            }
        }
        return params;
    }

    nextUrl(url) {
        if (url) {
            url = url.match(/page=\d+/);
            if (url) {
                url = url[0].match(/\d+/)[0];
            }
        }
        return url;
    }
    
    keyPress(event) {
        if(event.keyCode === 13) {
            this.searchKnownPersons();
        }
    }
    
    createCompare(knownPerson) {
        this.service.getMasterPerson(knownPerson.master_person).then((response) => {
            let tmpCompare = {
                    id:null,
                    match_type:null,
                    match_date:null,
                    matched_by:null,
                    notes:null,
                    master_person:response.data
            };
            this.compare(tmpCompare, 'create');
        }, (error) => {
            this.toastr.error(error.data);
        });
    }
}

export default PersonManagementController;
