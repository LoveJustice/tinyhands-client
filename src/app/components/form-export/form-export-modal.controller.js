import constants from '../../constants.js';

export default class FormExportModalController {
    constructor($uibModalInstance, $window, BaseService, SessionService, formType, countryList) {
        'ngInject';
        this.uibModalInstance = $uibModalInstance;

        this.window = $window;
        this.service = BaseService;
        this.session = SessionService;
        this.formType = formType;
        this.countryList = countryList;

        this.fromDate = new Date();
        this.toDate = new Date();
        this.canExportPrivateInformation = false;
        
        this.params = {
        	form:this.formType,
        	start:new Date(),
        	end: new Date(),
        	country:'all',
        	status:'all',
        	include_pi:'No',
        	sample:100,
        	remove_suspects:'Yes',
        	red_flags:0,
        	case_notes:'No',
        	evidence_category:'No',
        	follow_up:'No'
        };
        
        this.checkPrivatePermission();
    }
    
    checkPrivatePermission() {
    	if (this.params.country !== 'all') {
    		this.canExportPrivateInformation = this.session.checkPermission(this.formType,'VIEW PI', parseInt(this.params.country), null);
    		if (!this.canExportPrivateInformation) {
    			this.params.include_pi = 'No';
    			this.noPermissionText = 'No Permission';
    		} else {
    			this.noPermissionText = 'No';
    		}
    	} else {
    		let canExport = true;
    		for (let idx in this.countryList) {
    			if (!this.session.checkPermission(this.formType,'VIEW PI', this.countryList[idx].id, null)) {
    				canExport = false;
    				break;
    			}
    		}
    		this.canExportPrivateInformation = canExport;
    		if (!canExport) {
    			this.params.include_pi = 'No';
    			this.noPermissionText = 'No Permission';
    		} else {
    			this.noPermissionText = 'No';
    		}
    	}
    }

    getExportUrl() {
    	let url = constants.BaseUrl + 'api/forms/csv/';
    	let sep = '?';
    	for (let param in this.params) {
    		let value = this.params[param];
    		if (param==='start' || param==='end') {
    			value = this.params[param].getFullYear() + '-' +
    					(this.params[param].getMonth() + 1) + '-' +
    					this.params[param].getDate();
    		}
    		url += sep + param + '=' + value;
    		sep = '&';
    	}
        return url;
       }

    exportForms() {
        var url = this.getExportUrl(this.fromDate, this.toDate);
        this.window.open(url, '_blank');
    }

    parseDate(date) {
        return (date.getMonth() + 1) + '-' + date.getDate() + '-' + date.getFullYear();
    }

    validDate() {
        if (this.fromDate instanceof Date && this.toDate instanceof Date) {
            return (this.params.start.getTime() < this.params.end.getTime());
        }
        return false;
    }
}
