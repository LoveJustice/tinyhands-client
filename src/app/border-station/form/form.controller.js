import constants from './../constants.js';

export default class FormController {
    constructor($scope, BorderStationService) {
        'ngInject';
        this.service = BorderStationService;
        this.$scope = $scope;
        
        this.formTypes = [];
        this.formOptions = {};
        this.formSelected = {};
        
        this.getFormTypes();
        this.createListeners();
    }
    
    createListeners() {
        this.$scope.$on(constants.Events.Create.BorderStation.Done, () => { // POST listener
            this.update();
        });
        this.$scope.$on(constants.Events.Update.BorderStation, () => { // UPDATE listener
            this.update();
        });
    }
    
    getFormTypes() {
        this.service.getFormTypes().then((response) => {
            this.formTypes = response.data.results;
            for (let idx=0; idx < this.formTypes.length; idx++) {
            	this.formOptions[this.formTypes[idx].name] = [];
            }
            this.getAvailableForms();
        });
    }
    
    getAvailableForms() {
    	this.service.getAvailableForms().then((response) => {
            let avail = response.data;
            for (let idx=0; idx < avail.length; idx++) {
            	this.formOptions[avail[idx].form_type.name].push(avail[idx]);
            }
            this.getCurrentForms();
        });
    }
    
    getCurrentForms() {
        this.service.getCurrentForms().then((response) => {
        	let forms = response.data;
            for (let idx=0; idx < forms.length; idx++) {
            	let name = forms[idx].form_type.name;
            	this.formSelected[name] = forms[idx].id;
            }
        });
    }
    
    update() {
    	let formList = [];
    	for (let key in this.formSelected) {
    		formList.push(this.formSelected[key]);
    	}
    	this.service.updateCurrentForms(formList).then((response) => {
    		
    	});
    }
}