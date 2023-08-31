/* global angular */
/* global Image */
import {BaseModalController} from '../baseModalController.js';

export default class IntercepteeModalController extends BaseModalController {
    constructor($uibModalInstance, constants, $scope, isAdd, card, isViewing, modalActions, config, parentController, options) {
        'ngInject';
        super($uibModalInstance, $scope, isAdd, card, isViewing, modalActions, config, constants, parentController);
        
        this.constants = constants;
        this.options = options;
        this.photoPresent = false;
        this.initialPhoto = null;
    }
    
    delayedQuestionData() {
        if (this.options.hasOwnProperty('identificationTypes')) {
            this.identificationTypes = this.options.identificationTypes;
        }
        
        this.formVerified = (this.parentController.questions[821].response.value !== '' && this.parentController.questions[821].response.value !== null);
        
        if (this.questions[9].response.photo.value !== null &&
                this.questions[9].response.photo.value !== '') {
            this.initialPhoto = this.questions[9].response.photo.value;
            this.photoPresent = true;
            var t = Object.prototype.toString.call(this.questions[9].response.photo.value);
            if (t !== '[object String]') {
                if (this.questions[9].response.photo.value) {
                    this.file = this.questions[9].response.photo.value;
                    this.loadImage(this.file.$ngfBlobUrl);
                } else {
                	this.photoPresent = false;
                }
            } else {
                this.loadImage(this.getIntercepteeImage(this.questions[9].response.photo.value));
            }
        } else {
            this.photoPresent = false;
        }
    }
    
    init() {
    }
    
    resizeImage(img) {
        let temp = angular.element('#myCanvas');
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
    
    loadImage(imageUrl) {
        this.questions[9].response.photo.value = '';
        let img = new Image();
        img.addEventListener('load', (e)=>{/*jshint unused: false */this.resizeImage(img);});
        img.src = imageUrl;
    }
    
    fileUpload() {
        if (this.parentController.doesUploadFileExceedLimit(this.file)) {
            alert('The size of this photo is greater than the maximum allowed size');
            this.file = this.initialPhoto;
        } else if (this.parentController.willUploadExceedLimit(this.file)){
            alert ('Adding this photo to those photos and attachments already being added would exceed the upload limit.  ' +
                    'Please save or submit the form to upload the photos and attachments that were already added.  ' +
                    'Then you may reopen the form to add the photo.');
            this.file = this.initialPhoto;
        }
        this.photoPresent = true;
        this.loadImage(this.file.$ngfBlobUrl);
        this.questions[9].response.photo.value = '';
    }
    
    getIntercepteeImage(url) {
        return new URL(url, this.constants.BaseUrl).href;
    }

    subclassSave() {
        if (this.file) {
            this.originalQuestions[9].response.photo.value = this.file;
        } else {
            this.originalQuestions[9].response.photo.value = this.initialPhoto;
        }
        if (!this.questions[1331].response.value) {
        	this.questions[1331].response.value = '';
        }
    }
}
