/* global angular */
/* global Image */
import {BaseModalController} from '../baseModalController.js';

export default class IntercepteeModalController extends BaseModalController {
    constructor($uibModalInstance, constants, $scope, isAdd, card, isViewing, modalActions, config, options) {
        'ngInject';
        super($uibModalInstance, $scope, isAdd, card, isViewing, modalActions, config, constants);
        
        this.constants = constants;
        this.options = options;
        this.photoPresent = false;
    }
    
    delayedQuestionData() {
        if (this.options.hasOwnProperty('identificationTypes')) {
            this.identificationTypes = this.options.identificationTypes;
        }
        
        if (this.questions[9].response.arrested.value === 'Yes') {
            this.questions[9].response.arrested.value = true;
        } else {
            this.questions[9].response.arrested.value = false;
        }
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
        this.photoPresent = true;
        this.loadImage(this.file.$ngfBlobUrl);
        this.questions[9].response.photo.value = '';
    }
    
    getIntercepteeImage(url) {
        return new URL(url, this.constants.BaseUrl).href;
    }

    subclassSave() {
        if (this.questions[9].response.arrested.value === true) {
            this.questions[9].response.arrested.value = 'Yes';
        } else {
            this.questions[9].response.arrested.value = 'No';
        }
        if (this.file) {
            this.originalQuestions[9].response.photo.value = this.file;
        } else {
            this.originalQuestions[9].response.photo.value = this.initialPhoto;
        }
    }
}
