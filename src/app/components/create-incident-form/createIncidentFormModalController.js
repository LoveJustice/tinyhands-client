import './create-incident-form.less';
import {encodeGroup} from  '../../encodeGroup.js';
const DateData = require('../../dateData.js');

export default class CreateIncidentFormModalController {
    constructor($uibModalInstance, $scope, incidentService, stationsAdd, useTitle, formType, selectOnly) {
        'ngInject';
        this.$uibModalInstance = $uibModalInstance;
        this.scope = $scope;
        this.incidentService = incidentService;
        this.stationsAdd = stationsAdd;
        this.useTitle = useTitle;
        this.formType = formType;
        this.selectOnly = selectOnly;
        this.incidentType = 'Existing';
        this.incidentNumber = '';
        this.incident = null;
        this.errorText = null;
        
        this.incidentSearch = null;
        
        this.newDate = null;
        this.newSummary = "";
        
        this.scope.stationDropDown = {};
        this.scope.stationDropDown.options = [];
        this.scope.stationDropDown.selectedOptions = [];
        this.scope.stationDropDown.settings = {smartButtonMaxItems:1, showCheckAll: false, showUncheckAll: false, selectionLimit:1,
                groupByTextProvider(groupValue) { return encodeGroup(groupValue); }, groupBy:'encoded', closeOnSelect: true,
                scrollableHeight: '250px', scrollable: true,};
        this.scope.stationDropDown.customText = {};
        this.scope.stationDropDown.eventListener = {};
        for (var idx=0; idx < stationsAdd.length; idx++) {
            this.scope.stationDropDown.options.push({"id":stationsAdd[idx].id, "label":stationsAdd[idx].station_name,
                "country":stationsAdd[idx].country_name, "encoded":encodeGroup(stationsAdd[idx].country_name),
                "country_id":stationsAdd[idx].country_id, "station_code":stationsAdd[idx].station_code});
        }
    }
    
    changeIncidentType() {
    	this.incidentNumber = null;
    	this.incident = null;
    	this.newDate = null;
        this.newSummary = "";
        this.scope.stationDropDown.selectedOptions = [];
    }
    
    findIncident() {
    	this.errorText = null;
    	let code = this.incidentNumber.substr(0,3);
    	let foundCode = false;
    	for (let idx=0; idx < this.stationsAdd.length; idx++) {
    		if (this.stationsAdd[idx].station_code === code) {
    			foundCode = true;
    			break;
    		}
    	}
    	if (!foundCode  && !this.selectOnly) {
    		this.errorText = "You do not have permission to add forms for the project with code " + code;
    		return;
    	}
    	this.incidentService.searchIncident(this.incidentNumber).then((promise) => {
    		this.incident = null;
    		this.incidentDate = null;
    		this.scope.stationDropDown.selectedOptions = [];
    		// Might have matched substring of a different incident
        	for (let idx=0; idx < promise.data.results.length; idx++) {
        		if (promise.data.results[idx].incident_number === this.incidentNumber) {
        			this.station_name = promise.data.results[idx].station_name;
        			this.incident = promise.data.results[idx];
        			if (this.incident.incident_date) {
                        let dateData = new DateData([]);
                        this.incidentDate = dateData.dateAsUTC(this.incident.incident_date);
        			}
        			
        			for (let optionIdx=0; optionIdx < this.scope.stationDropDown.options.length; optionIdx++) {
        				if (this.incident.station === this.scope.stationDropDown.options[optionIdx].id) {
        					this.scope.stationDropDown.selectedOptions.push(this.scope.stationDropDown.options[optionIdx]);
        				}
        			}
        			
        			break;
        		}
        	}
        	if (!this.incident) {
        		this.errorText = "Unable to find an incident with the number " + this.incidentNumber;
        	}
        });
    }
    
    createForm() {
    	if (this.incidentType === 'New') {
    	    let dateString = this.newDate.getUTCFullYear() + '-';
    	    if (this.newDate.getUTCMonth() < 9) {
    	    	dateString += '0';
    	    }
    	    dateString += (this.newDate.getUTCMonth() + 1) + '-';
    	    if (this.newDate.getUTCDate() < 10) {
    	    	dateString += '0'
    	    }
    	    dateString += (this.newDate.getUTCDate());
    		let newIncident = {
    			id: null,
    			status:'approved',
    			incident_number: this.scope.stationDropDown.selectedOptions[0].station_code,		// Replaced by server with the real incident number
    			incident_date: dateString,
    			summary: this.newSummary,
    			station: this.scope.stationDropDown.selectedOptions[0].id
    		};
    		this.incidentService.submitIncident(newIncident).then ((response) => {
    			this.$uibModalInstance.close(response.data);
    		}, () => {alert('Failed to save incident');});

    	} else {
    		this.$uibModalInstance.close(this.incident);
    	}
    }
    
    cancel() {
        this.$uibModalInstance.dismiss();
    }
}
