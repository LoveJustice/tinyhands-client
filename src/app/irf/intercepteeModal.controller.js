/* global angular */
/* global Image */
import {BaseModalController} from '../baseModalController.js';

export default class IntercepteeModalController extends BaseModalController {
    constructor($uibModalInstance, constants, $scope, isAdd, card, isViewing, modalActions, config) {
        'ngInject';
        super($uibModalInstance, $scope, isAdd, card, isViewing, modalActions, config);
        
        this.constants = constants;
        this.photoPresent = false;
    }
    
    init() {
        if (this.questions[this.config.ImageQuestion].response.value !== null &&
                this.questions[this.config.ImageQuestion].response.value !== '') {
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
        }
    }
}