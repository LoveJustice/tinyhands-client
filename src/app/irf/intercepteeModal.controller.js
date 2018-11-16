/* global angular */
import {BaseModalController} from '../baseModalController.js';

export default class IntercepteeModalController extends BaseModalController {
    constructor($uibModalInstance, $scope, isAdd, card, isViewing, modalActions, config) {
        'ngInject';
        super($uibModalInstance, $scope, isAdd, card, isViewing, modalActions, config);
        
        
        var t = Object.prototype.toString.call(this.questions[this.config.ImageQuestion].response.value);
        if (t === '[object Blob]') {
        	this.file = this.questions[this.config.ImageQuestion].response.value;
        } 
    }
    
    fileUpload() {
        this.questions[this.config.ImageQuestion].response.value = '';
    }
    
    getIntercepteeImage(url) {
        return new URL(url, this.config.BaseUrl).href;
    }

    subclassSave() {
        if (this.file) {
            this.originalQuestions[this.config.ImageQuestion].response.value = this.file;
        }
    }
}