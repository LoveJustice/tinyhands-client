/* global angular */
/* global Image */
import {BaseModalController} from '../baseModalController.js';
const PersonIdentifierChoice = require('../personIdentifierChoice.js');

export default class IntercepteeModalController extends BaseModalController {
    constructor($uibModalInstance, constants, $scope, isAdd, card, isViewing, modalActions, config, options) {
        'ngInject';
        super($uibModalInstance, $scope, isAdd, card, isViewing, modalActions, config, constants);
        
        this.constants = constants;
        this.options = options;
        this.photoPresent = false;
        
        if (options.hasOwnProperty('identificationTypes')) {
            this.identificationTypes = options['identificationTypes'];
            this.personIdentifierChoice = new PersonIdentifierChoice(this.questions, this.identificationTypes);
            if (this.identificationTypes.length > 0 && this.config.hasOwnProperty('Person')) {
                this.processPersonResponses(this.questions, this.config.Person);
            }
        }
    }
    
    processPersonResponses(questions, personConfigList) {
        for (let question_id in questions) {
            if (personConfigList.indexOf(parseInt(question_id)) > -1) {
                if (this.personIdentifierChoice) {
                    this.personIdentifierChoice.manage(parseInt(question_id));
                }
            }
        }
    }
    
    init() {
        if (this.questions[this.config.ImageQuestion].response.value !== null &&
                this.questions[this.config.ImageQuestion].response.value !== '') {
            this.initialPhoto = this.questions[this.config.ImageQuestion].response.value;
            this.photoPresent = true;
            var t = Object.prototype.toString.call(this.questions[this.config.ImageQuestion].response.value);
            if (t !== '[object String]') {
                this.file = this.questions[this.config.ImageQuestion].response.value;
                this.loadImage(this.file.$ngfBlobUrl);
            } else {
                this.loadImage(this.getIntercepteeImage(this.questions[this.config.ImageQuestion].response.value));
            }
        } else {
            this.photoPresent = false;
        }
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
        this.questions[this.config.ImageQuestion].response.value = '';
        let img = new Image();
        img.addEventListener('load', (e)=>{/*jshint unused: false */this.resizeImage(img);});
        img.src = imageUrl;
    }
    
    fileUpload() {
        this.photoPresent = true;
        this.loadImage(this.file.$ngfBlobUrl);
        this.questions[this.config.ImageQuestion].response.value = '';
    }
    
    getIntercepteeImage(url) {
        return new URL(url, this.constants.BaseUrl).href;
    }

    subclassSave() {
        if (this.file) {
            this.originalQuestions[this.config.ImageQuestion].response.value = this.file;
        } else {
            this.originalQuestions[this.config.ImageQuestion].response.value = this.initialPhoto;
        }
    }
}