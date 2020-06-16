/* global Image */
import './personManagement.less';
export default class MatchModalController {
    constructor($uibModalInstance, $scope, personManagementService, main, mainDetails, compare, compareDetails, modalActions, where, constants, phoneTypes, addressTypes,
                socialMediaTypes, possibleMatchType, nonMatchType) {
        'ngInject';
        this.$uibModalInstance = $uibModalInstance;
        this.$scope = $scope;
        this.service = personManagementService;
        this.main = main;
        this.mainDetails = mainDetails;
        this.compare = compare;
        this.compareDetails = compareDetails;
        this.modalActions = modalActions;
        this.where = where;
        this.constants = constants;
        this.status = "compare";
        this.possibleMatchType = possibleMatchType;
        this.nonMatchType = nonMatchType;
        
        this.phoneTypes = {};
        for (let idx=0; idx < phoneTypes.length; idx++) {
            this.phoneTypes[''+phoneTypes[idx].id] = phoneTypes[idx].name;
        }
        
        this.addressTypes = {};
        for (let idx=0; idx < addressTypes.length; idx++) {
            this.addressTypes[''+addressTypes[idx].id] = addressTypes[idx].name;
        }
        
        this.socialMediaTypes = {};
        for (let idx=0; idx < socialMediaTypes.length; idx++) {
            this.socialMediaTypes[''+socialMediaTypes[idx].id] = socialMediaTypes[idx].name;
        }
        
        this.getPvRelationsData(this.compare.master_person.id, this.compareDetails);
        
        if (this.mainDetails.photos.length > 0) {
            this.loadImage(new URL(this.mainDetails.photos[0].file_location, this.constants.BaseUrl).href, '#mainCanvas');
            this.mainPhotoUrl = new URL(this.mainDetails.photos[0].file_location, this.constants.BaseUrl).href;
            this.mainImageIndex = 0;
        } else {
            this.mainImageIndex = -1;
        }
        if (this.compareDetails.photos.length > 0) {
            this.loadImage(new URL(this.compareDetails.photos[0].file_location, this.constants.BaseUrl).href, '#compareCanvas');
            this.comparePhotoUrl = new URL(this.compareDetails.photos[0].file_location, this.constants.BaseUrl).href;
            this.compareImageIndex = 0;
        } else {
            this.compareImageIndex = -1;
        }
    }
    
    getPvRelationsData(id, container) {
        this.service.getPvRelations(id).then((response) => {
            container.pvRelations = response.data;
        });
    }
    
    getForms (masterPerson) {
        let forms = "";
        let sep = "";
        for (let idx=0; idx < masterPerson.person_set.length; idx++) {
            if (masterPerson.person_set[idx].form_number !== null && masterPerson.person_set[idx].form_number !== '') {
                forms += sep + masterPerson.person_set[idx].form_number;
                sep = ",";
            }
        }
        return forms;
    }
    
    getNames (details) {
        let names = "";
        let sep = "";
        for (let idx=0; idx < details.uniqueNames.length; idx++) {
            names += sep + details.uniqueNames[idx];
            sep = ",";
        }
        return names;
    }
    
    getGender (masterPerson) {
        let gender = 'Unknown';
        if (masterPerson.gender === 'F') {
            gender = 'Female';
        } else if (masterPerson.gender === 'M') {
            gender = 'Male';
        }
       
        return gender;
    }
    
    getPvRelations(details) {
        let value = '';
        let sep = '';
        for (let idx=0; idx < details.pvRelations.length; idx++) {
            value += sep + details.pvRelations[idx].relation + '(' + details.pvRelations[idx].count + ')';
            sep = ', ';
        }
        return value;
    }
    getRoles(details) {
        let value = '';
        let sep = '';
        for (let idx=0; idx < details.roles.length; idx++) {
            value += sep + details.roles[idx].name + '(' + details.roles[idx].count + ')';
            sep = ', ';
        }
        return value;
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
            canvas.width = 100;
            canvas.height = img.height * 100/img.width;
        } else {
            canvas.height = 100;
            canvas.width = img.width * 100.0/img.height;
        }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    }
    
    loadImage(imageUrl, imageTag) {
        let img = new Image();
        img.addEventListener('load', (e)=>{/*jshint unused: false */this.resizeImage(img, imageTag);});
        img.src = imageUrl;
    }
    
    photoMove(increment, imageTag) {
        if (imageTag === '#mainCanvas') {
            if (this.mainImageIndex + increment < 0 || this.mainImageIndex + increment > this.mainDetails.photos.length - 1) {
                return;
            }
            this.mainImageIndex += increment;
            this.photoDisplay(this.mainDetails.photos[this.mainImageIndex], imageTag, this.mainPhotoUrl);
        } else {
            if (this.compareImageIndex + increment < 0 || this.compareImageIndex + increment > this.compareDetails.photos.length - 1) {
                return;
            }
            this.compareImageIndex += increment;
            this.photoDisplay(this.compareDetails.photos[this.compareImageIndex], imageTag, this.comparePhotoUrl);
        }
        
    }
    
    photoDisplay(photo, imageTag, url) {
        if (photo.file_location) {
            this.loadImage(photo.file_location, imageTag);
            url = photo.file_location;
        } else if (photo.file) {
            this.loadImage(photo.file.$ngfBlobUrl, imageTag);
            url = photo.file.$ngfBlobUrl;
            
        }
    }
    
    setEstimatedBirthdate(value) {
        this.modalActions.estimate_birthdate = value;
    }
    
    compareElements(obj1, obj2, name, modalActions, defaultValue) {
        let result = false;
        modalActions[name] = defaultValue;
        if (obj1[name] === obj2[name]) {
            modalActions[name] = obj1[name];
            if (name === 'birthdate') {
                modalActions.estimated_birthdate = obj1.estimated_birthdate;
            }
        } else if (obj1[name] === null || obj1[name] === '') {
            if (obj2[name] !== null && obj2[name] !== '') {
                modalActions[name] = obj2[name];
                if (name === 'birthdate') {
                    modalActions.estimated_birthdate = obj2.estimated_birthdate;
                }
            }
        } else if (obj2[name] === null || obj2[name] === '') {
            modalActions[name] = obj1[name];
            if (name === 'birthdate') {
                modalActions.estimated_birthdate = obj1.estimated_birthdate;
            }
        } else {
            result = true;
        }
        
        return result;
    }
    
    canProceedWithMatch() {
        for (let prop in this.misMatch) {
            if (this.misMatch[prop] && (this.modalActions[prop] === null || this.modalActions[prop] === '')) {
                return false;
            }
        }
        return true;
    }
    
    proceedWithMatch() {
        this.$uibModalInstance.close();
    }
    
    confirmedMatch() {
        this.modalActions.action = 'merge';
        this.modalActions.estimated_birthdate = false;
        this.modalActions.notes = this.compare.notes;
        
        this.misMatch = {};
        this.misMatch.full_name = this.compareElements(this.main, this.compare.master_person, 'full_name', this.modalActions, null);
        this.misMatch.birthdate = this.compareElements(this.main, this.compare.master_person, 'birthdate', this.modalActions, null);
        this.misMatch.gender = this.compareElements(this.main, this.compare.master_person, 'gender', this.modalActions, '');
        this.misMatch.nationality = this.compareElements(this.main, this.compare.master_person, 'nationality', this.modalActions, '');
        this.status = 'match';
        
        this.modalActions.action = 'merge';
    }
    
    possibleMatch() {
        this.modalActions.action = 'update';
        this.modalActions.notes = this.compare.notes;
        this.modalActions.match_type = this.possibleMatchType;
        this.status = 'match';
    }
    
    confirmedNonMatch() {
        this.modalActions.action = 'update';
        this.modalActions.notes = this.compare.notes;
        this.modalActions.match_type = this.nonMatchType;
        this.status = 'match';
    }
    
    close() {
        this.$uibModalInstance.dismiss();
    }
}