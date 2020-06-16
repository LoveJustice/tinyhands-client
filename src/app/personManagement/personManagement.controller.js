/* global Image */
/* global jQuery */
import './personManagement.less';
import detailsTemplate from './step-templates/details.html';
import confirmedMatchesTemplate from './step-templates/confirmedMatches.html';
import possibleMatchesTemplate from './step-templates/possibleMatches.html';
import suggestedMatchesTemplate from './step-templates/suggestedMatches.html';
import confirmedNonMatchesTemplate from './step-templates/confirmedNonMatches.html';
import attachmentsTemplate from './step-templates/attachments/attachment.html';

import MatchModalController from './matchModal.controller';
import matchTemplate from './step-templates/matchModal.html';

import attachmentTemplate from './step-templates/attachments/attachmentModal.html';
import AttachmentModalController from './step-templates/attachments/attachmentModal.controller';

export class PersonManagementController {
    constructor($scope, $uibModal, personManagementService, $stateParams, $state, SpinnerOverlayService, $uibModalStack, constants) {
        'ngInject';
        
        this.$scope = $scope;
        this.$uibModal = $uibModal;
        this.service = personManagementService;
        this.stateParams = $stateParams;
        this.$state = $state;
        this.spinnerOverlayService = SpinnerOverlayService;
        this.$uibModalStack = $uibModalStack;
        this.constants = constants;
        this.stepTemplates = [
            {template:detailsTemplate, name:"Details"},
            {template:confirmedMatchesTemplate, name:"Confirmed Matches"},
            {template:possibleMatchesTemplate, name:"Possible Matches"},
            {template:suggestedMatchesTemplate, name:"Suggested Matches"},
            {template:confirmedNonMatchesTemplate, name:"Confirmed Non-Matches"},
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
        
        this.getTypes();
        this.getPvRelations(this.stateParams.id, this.details);
    }
    
    getTypes() {
        this.service.getType('PhoneType').then((response) => {
            this.phoneTypes = response.data;
            if (this.phoneTypes && this.addressTypes && this.socialMediaTypes && this.documentTypes) {
                this.getMasterPerson(this.stateParams.id);
            }
        });
        this.service.getType('AddressType').then((response) => {
            this.addressTypes = response.data;
            if (this.phoneTypes && this.addressTypes && this.socialMediaTypes && this.documentTypes) {
                this.getMasterPerson(this.stateParams.id);
            }
        });
        this.service.getType('SocialMediaType').then((response) => {
            this.socialMediaTypes = response.data;
            if (this.phoneTypes && this.addressTypes && this.socialMediaTypes && this.documentTypes) {
                this.getMasterPerson(this.stateParams.id);
            }
        });
        this.service.getType('DocumentType').then((response) => {
            this.documentTypes = response.data;
            this.attachmentTypes = [];
            for (let idx=0; idx < this.documentTypes.length; idx++) {
                if (this.documentTypes[idx].name.toLowerCase() === 'photo') {
                    this.photoDocumentType = this.documentTypes[idx].id;
                } else {
                    this.attachmentTypes.push(this.documentTypes[idx]);
                }
            }
            if (this.phoneTypes && this.addressTypes && this.socialMediaTypes && this.documentTypes) {
                this.getMasterPerson(this.stateParams.id);
            }
        });
        
        this.service.getType('MatchType').then((response) => {
            this.matchTypes = response.data;
            for (let idx=0; idx < this.matchTypes.length; idx++) {
                if (this.matchTypes[idx].name.toLowerCase() === 'possible') {
                    this.possibleMatchType = this.matchTypes[idx].id;
                } else if (this.matchTypes[idx].name.toLowerCase() === 'suggested') {
                    this.suggestedMatchType = this.matchTypes[idx].id;
                } else if (this.matchTypes[idx].name.toLowerCase() === 'non-match') {
                    this.nonMatchType = this.matchTypes[idx].id;
                }
            }
            
            this.getMatches();
        });
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
    
    dateAsUTC(inDateString) {
        let parts = inDateString.split("-");
        let year = Number(parts[0]);
        let month = Number(parts[1]) - 1;
        let date = Number(parts[2]);
        let utcDate = new Date(Date.UTC(year, month, date, 0, 0, 0, 0));
        return utcDate;
    }
    
    dateAsString(inDate) {
        let dateString = '';
        dateString = inDate.getUTCFullYear() + '-';
        if (inDate.getUTCMonth() < 9) {
            dateString += '0';
        }
        dateString += (inDate.getUTCMonth()+1) + "-";
        if (inDate.getUTCDate() < 9) {
            dateString += '0';
        }
        dateString += inDate.getUTCDate();
        return dateString;
    }
    
    addBelieves(text, interviewer, pv, container) {
        let found = false;
        for (let idx=0; idx < container.believes.length; idx++) {
            if (container.believes[idx].text === text) {
                container.believes[idx].interviewer += interviewer;
                container.believes[idx].pv += pv;
                found = true;
            }
        }
        
        if (!found) {
            container.believes.push({text:text, interviewer:interviewer, pv:pv});
        }
    }
    
    preProcess(masterPerson, container) {
        container.uniqueNames = [];
        container.uniquePhones = [];
        container.uniqueAddresses = [];
        container.uniqueSocialMedia = [];
        container.uniqueAppearance = [];
        container.uniqueId = [];
        container.roles = [];
        container.photos = [];
        container.attachments = [];
        container.believes = [];
        container.forms = [];
        container.selectedPerson = null;
        container.selectedFormId = null;
        container.birthdate = null;
        container.age = null;
        
        for (let idx=0; idx < masterPerson.person_set.length; idx++) {
            let person = masterPerson.person_set[idx];
            
            if (person.full_name) {
                let found = false;
                for (let idx1=0; idx1 < container.uniqueNames.length; idx1++) {
                    if (container.uniqueNames[idx1] === person.full_name) {
                        found = true;
                    }
                }
                if (!found) {
                    container.uniqueNames.push(person.full_name);
                }
            }
            
            // process phones
            if (person.phone_contact) {
                if (person.phone_type) {
                    person.phone_type = '' + person.phone_type;
                }
                let found = false;
                for (let idx1=0; idx1 < container.uniquePhones.length; idx1++) {
                    let phone = container.uniquePhones[idx1];
                    if (person.phone_contact === phone.number && person.phone_verified === phone.phone_verified && person.phone_type === phone.phone_type) {
                        phone.ids.push(phone.id);
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    container.uniquePhones.push({number:person.phone_contact, phone_verified:person.phone_verified, phone_type:person.phone_type, ids:[person.id]});
                }
            }
            
            // process addresses
            if (person.address || person.address_notes) {
                if (person.address_type) {
                    person.address_type = '' + person.address_type;
                }
                let found = false;
                for (let idx1=0; idx1 < container.uniqueAddresses.length; idx1++) {
                    let address = container.uniqueAddresses[idx1];
                    if ((person.address === null && address.address === null || person.address && address.address && person.address.address === address.address.address) &&
                            person.address_verified === address.address_verified && 
                            person.address_notes === address.address_notes && person.address_type === address.address_type) {
                        address.ids.push(person.id);
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    container.uniqueAddresses.push({address:person.address, address_verified:person.address_verified, address_notes:person.address_notes,
                        address_type:person.address_type, ids:[person.id]});
                }
            }
            
            // process social media
            if (person.social_media) {
                if (person.social_media_type) {
                    person.social_media_type = '' + person.social_media_type;
                }
                let found = false;
                for (let idx1=0; idx1 < container.uniqueSocialMedia.length; idx1++) {
                    let social = container.uniqueSocialMedia[idx1];
                    if (person.social_media === social.social_media && person.social_media_verified === social.social_media_verified && 
                            person.social_media_type === social.social_media_type) {
                        social.ids.push(person.id);
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    container.uniqueSocialMedia.push({social_media:person.social_media, social_media_verified:person.social_media_verified,
                        social_media_type:person.social_media_type, ids:[person.id]});
                }
            }
        
            // process roles
            if (person.role) {
                let roleElements = person.role.split(';');
                for (let idx1=0; idx1 < roleElements.length; idx1++) {
                    let found = false;
                    for (let idx2=0; idx2 < container.roles.length; idx2++) {
                        if (roleElements[idx1] === container.roles[idx2].name) {
                            container.roles[idx2].count++;
                            found = true;
                            break;
                        }
                    }
                    if (!found) {
                        container.roles.push({name:person.role,count:1});
                    }
                }
            }
            
            if (person.personidentification_set) {
                for (let idx1=0; idx1 < person.personidentification_set.length; idx1++) {
                    let id = person.personidentification_set[idx1];
                    let found = false;
                    for (let idx2=0; idx2 < container.uniqueId.length; idx2++) {
                        if (id.type === container.uniqueId[idx2].type && id.number === container.uniqueId[idx2].number && id.location === container.uniqueId[idx2].location) {
                            found = true;
                            break;
                        }
                    }
                    if (!found) {
                        container.uniqueId.push({type:id.type, number:id.number, location:id.location});
                    }
                }
            }
            
            if (person.appearance) {
                let found = false;
                for (let idx1=0; idx1 < container.uniqueAppearance.length; idx1++) {
                    if (person.appearance === container.uniqueAppearance[idx1]) {
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    container.uniqueAppearance.push(person.appearance);
                }
            }
            
            if (person.photo) {
                container.photos.push({file_location:person.photo, canRemove:false, file:null});
            }
            
            if (person.interviewer_believes) {
                this.addBelieves(person.interviewer_believes, 1, 0, container);
            }
            
            if (person.pv_believes) {
                this.addBelieves(person.pv_believes, 0, 1, container);
            }
            
            if (person.form_number) {
                container.forms.push({id:person.form_id, number:person.form_number, type:person.form_type});
                if (container.selectedPerson  === null || container.selectedPerson && person.form_number < container.selectedPerson.form_number) {
                    container.selectedPerson = person;
                    container.selectedFormId = person.form_id;
                }
            }
        }
        
        container.forms.sort((a,b) => {
                if (a.number > b.number) { 
                    return 1;
                } else if (a.number < b.number) {
                    return -1;
                } else {
                    return 0;
                }
            });
        
        if (masterPerson.birthdate) {
            container.birthdate = this.dateAsUTC(masterPerson.birthdate);
            this.computeAge(container);
        } else {
            container.birthdate = null;
            container.age = null;
        }
        
        for (let idx=0; idx < masterPerson.personphone_set.length; idx++) {
            let phone = masterPerson.personphone_set[idx];
            if (phone.phone_type) {
                phone.phone_type = '' + phone.phone_type;
            }
        }
        
        for (let idx=0; idx < masterPerson.personaddress_set.length; idx++) {
            let address = masterPerson.personaddress_set[idx];
            if (address.address_type) {
                address.address_type = '' + address.address_type;
            }
        }
        
        for (let idx=0; idx < masterPerson.personsocialmedia_set.length; idx++) {
            let social_media = masterPerson.personsocialmedia_set[idx];
            if (social_media.social_media_type) {
                social_media.social_media_type = '' + social_media.social_media_type;
            }
        }
        
        for (let idx=0; idx < masterPerson.persondocument_set.length; idx++) {
            if (this.photoDocumentType && masterPerson.persondocument_set[idx].document_type &&
                    masterPerson.persondocument_set[idx].document_type === this.photoDocumentType) {
                container.photos.push({id:masterPerson.persondocument_set[idx].id ,file_location:masterPerson.persondocument_set[idx].file_location, 
                        document_type:masterPerson.persondocument_set[idx].document_type, master_person_id:masterPerson.id,
                            canRemove:true, file:null});
            } else {
                container.attachments.push({id:masterPerson.persondocument_set[idx].id ,file_location:masterPerson.persondocument_set[idx].file_location,
                        document_type:''+masterPerson.persondocument_set[idx].document_type, master_person_id:masterPerson.id,
                        canRemove:true, file:null});
            }
        }
        
        
        if (container.selectedFormId) {
            this.formSelected();
        }
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
    
    getMasterPerson(id) {
        this.service.getMasterPerson(id).then((response) => {
            this.processMainMasterPersonData(response.data);
        }, (error) => {
            alert(error.data);
        });
    }
    
    getPvRelations(id, container) {
        this.service.getPvRelations(id).then((response) => {
            container.pvRelations = response.data;
        });
    }
    
    calculateAge(birthdate) {
        let age = null;
        if (birthdate) {
            let now = new Date();
            age = now.getFullYear() - birthdate.getFullYear();
            if (now.getMonth() < birthdate.getMonth() || now.getMonth()===birthdate.getMonth() && now.getDate() < birthdate.getDate()) {
                age -= 1;
            }
        }
        return age;
    }
    
    computeAge(container){
        container.age = this.calculateAge(container.birthdate);
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
            alert(error.data.errors);
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
    
    removePerson() {
        if (this.hasBeenModified(this.masterPerson, this.originalMasterPerson) && !window.confirm("Information on the Details tab has been modified.\nContinuing with the removal this person will lose those changes.\n\nWould you like to proceed?")) {
            return;
        }

        this.spinnerOverlayService.show('Removing person ...');
        this.service.removePerson(this.masterPerson.id, this.details.selectedPerson.id).then((response) => {
            this.processMainMasterPersonData(response.data);
            this.spinnerOverlayService.hide();
        }, (error) => {
            this.spinnerOverlayService.hide();
            alert(error.data.errors);
           });
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
            },
            size: 'lg',
            templateUrl: matchTemplate,
            windowClass: 'match-modal-popup',
        }).result.then(() => {
            if (this.modalActions.action === 'update') {
                this.service.updateMatch(match.id, this.modalActions['match_type'], this.modalActions).then((response) => {
                    this.getMatches();
                });  
            } else if (this.modalActions.action === 'merge') {
                this.service.merge(this.masterPerson.id, match.master_person.id, this.modalActions).then((response) => {
                    this.processMainMasterPersonData(response.data);
                    this.getMatches();
                }, (error) => {
                    alert(error.data.errors);
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
}

export default PersonManagementController;
