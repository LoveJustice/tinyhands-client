import './staff.less';
const DateData = require('../dateData.js');

import generalTemplate from './step-templates/general.html';
import AddProjectModalTemplate from './step-templates/addProjectModal.html';

class AddProjectModalController {
	constructor($uibModalInstance, staff, projects, coordinator) {
		this.$uibModalInstance = $uibModalInstance;
		this.staff = staff;
		this.projects = projects;
		this.coordinator= coordinator;
		
		this.displayProjects = [];
		for (let projIdx in this.projects) {
			if (this.projects[projIdx].operating_country + '' !== this.staff.country) {
				continue;
			}
			let found = false;
			for (let staffIdx in this.staff.staffproject_set) {
				if (this.projects[projIdx].id === this.staff.staffproject_set[staffIdx].border_station) {
					found = true;
				}
			}
			if (!found) {
				this.displayProjects.push({"project":this.projects[projIdx], "toAdd":false});
			}
		}
	}
	
	addedProjectCount() {
		let count = 0;
		for (let projIdx in this.displayProjects) {
			if (this.displayProjects[projIdx].toAdd) {
				count += 1;
			}
		}
		return count;
	}
	
	addProjects() {
		for (let projIdx in this.displayProjects) {
			if (this.displayProjects[projIdx].toAdd) {
				this.staff.staffproject_set.push(
					{
						"id": null,
						"staff": this.staff.id,
						"border_station": this.displayProjects[projIdx].project.id,
						"receives_money_distribution_form": false,
						"coordinator":""
					});
				this.coordinator[this.displayProjects[projIdx].project.id] = {
            		options: [
            			{label:"Accounting"},
            			{label:"Awareness"},
            			{label:"Care"},
            			{label:"Investigations"},
            			{label:"Legal"},
            			{label:"Records"},
            			{label:"Security"},
            			{label:"Shelter"}
            		],
            		selectedOptions:[],
            		settings: {smartButtonMaxItems:2, showCheckAll: false, showUncheckAll: false},
            	};
			}
		}
		this.$uibModalInstance.close();
	}
	
	cancel() {
		this.$uibModalInstance.dismiss();
	}
}

export default class StaffController {
    constructor($uibModal, constants, StaffService, $stateParams, $state, SpinnerOverlayService, $uibModalStack, SessionService) {
        'ngInject';
        
        this.stateParams = $stateParams;
        this.modalStack = $uibModalStack;
        this.$uibModal = $uibModal;
        this.constants = constants;
        this.service = StaffService;
        this.state = $state;
        this.spinner = SpinnerOverlayService;
        this.relatedUrl = null;
        this.session = SessionService;
        this.isViewing = this.stateParams.isViewing === 'true';
        this.staff = null;
        this.projectsById=[];
        this.countries = [];
        
        this.coordinator = {
        	"Records": false,
        	"Security": false,
        	"Care":false,
        	"Legal":false,
        	"Awareness": false,
        	"Accounting": false,
        	"Investigations": false,
        	"Shelter":false,
        };
        
        this.stepTemplates = [
            {template:generalTemplate, name:"General"},
        ];
        this.selectedStep = 0;
        
        this.getUserCountries();
        this.getUserProjects();
    }
    
    getUserProjects() {
    	this.spinner.show("Get Staff..."); 
    	this.projectsById=[];
        this.service.getUserStations(this.session.user.id).then((response) => {
           	this.projects = response.data;
           	this.projectsById = _.keyBy(this.projects, (x) => x.id);
           	this.getStaff();
        }, () => {
        	this.spinner.hide();
        });
    }
    
    getUserCountries() {
    	this.projectsById=[];
        this.service.getUserCountries(this.session.user.id).then((response) => {
           	this.countries = response.data;
        });
    }

    getStaff() {
        this.service.getStaff(this.stateParams.id).then((response) => {
            this.staff = response.data;
            this.staff.country = this.staff.country + '';
            let dateData = new DateData();
            this.start_date = dateData.dateAsUTC(this.staff.first_date);
            this.spinner.hide();
            this.coordinators = {};
            for (let projIdx in this.staff.staffproject_set) {
            	let project = this.staff.staffproject_set[projIdx];
            	this.coordinator[project.border_station] = {
            		options: [
            			{label:"Accounting"},
            			{label:"Awareness"},
            			{label:"Care"},
            			{label:"Investigations"},
            			{label:"Legal"},
            			{label:"Records"},
            			{label:"Security"},
            			{label:"Shelter"}
            		],
            		selectedOptions:[],
            		settings: {smartButtonMaxItems:2, showCheckAll: false, showUncheckAll: false},
            	};
            	
            	let selOptions = project.coordinator.split(';');
            	for (let selIdx in selOptions) {
            		for (let opIdx in this.coordinator[project.border_station].options) {
            			if (selOptions[selIdx] === this.coordinator[project.border_station].options[opIdx].label) {
            				this.coordinator[project.border_station].selectedOptions.push(this.coordinator[project.border_station].options[opIdx]);
            			}
            		}
            	}
            }
        }, (error) => {this.spinner.hide();alert(error);});
    }
    
    getProjectName(project_id) {
    	let projectName = 'Unknown';
    	for (let projIdx in this.projects) {
    		if (project_id === this.projects[projIdx].id) {
            	projectName = this.projects[projIdx].station_name;
            	break;
            }
         }
 		return projectName;
    }
    
    getProjectRef(project_id) {
    	return this.state.href('border-station', {id:project_id, isViewing:false });
    }
    
    addProject() {
    	this.$uibModal.open({
            bindToController: true,
            controller: AddProjectModalController,
            controllerAs: 'vm',
            resolve: {
                staff: () => this.staff,
                projects: () => this.projects,
                coordinator: () => this.coordinator,
            },
            size: 'lg',
            templateUrl: AddProjectModalTemplate,
        }).result.then(() => {
        });
    }
    
    removeProject(project) {
		for (let worksOnIdx in this.staff.staffproject_set) {
			if (this.staff.staffproject_set[worksOnIdx].border_station === project.border_station) {
				this.staff.staffproject_set.splice(worksOnIdx, 1);
			}
		}
	}
	
    
    submit() {
    	let dateData = new DateData();
    	this.staff.first_date = dateData.dateToString(this.start_date);
    	for (let projIdx in this.staff.staffproject_set) {
    		let project = this.staff.staffproject_set[projIdx];
    		let tmp = '';
    		let sep = '';
    		for (let selIdx in this.coordinator[project.border_station].selectedOptions) {
    			tmp += sep + this.coordinator[project.border_station].selectedOptions[selIdx].label;
    			sep = ';'
            			
            }
            project.coordinator = tmp;
    	}
        this.service.submitStaff(this.staff).then((response) => {
             this.staff = response.data;
             this.state.go('staffList');
         }, (error) => {
             this.set_errors_and_warnings(error.data);
             this.response.status = this.saved_status;
            });
        
        this.messagesEnabled = true;
    }
}
