/* global jQuery */
import discussProjectRequestTemplate from './discussProjectRequestModal.html?url';
import DiscussProjectRequestModalController from './discussProjectRequestModal.controller.js';
import attachProjectRequestTemplate from './attachProjectRequestModal.html?url';
import AttachProjectRequestModalController from './attachProjectRequestModal.controller.js';
import {dropDecimals} from  './dropDecimal.js';

export default class ReviewProjectRequestController {
    constructor(ProjectRequestService, SessionService, SpinnerOverlayService, $state, $stateParams,  $uibModal, toastr) {
        'ngInject';
        
        this.service = ProjectRequestService;
        this.session = SessionService;
        this.state = $state;
        this.stateParams = $stateParams;
        this.modal = $uibModal;
        this.toastr = toastr;
        this.toastr.options.timeOut = 3000;
        this.projectRequest = null;
        this.spinner = SpinnerOverlayService;
        
        this.canUpdate = false;
        this.budgetProjects = [];
        this.categories = null;
        this.staff = null;
        this.benefits = null;
        this.multipliers = null;
        this.salariesAndBenefitsId = null;
        this.multipliersId = null;
        this.changeAmount = false;
        this.showComment = false;
        this.reviewPriorUrl = null;
        
        this.getMultipliers();
        this.getProjectRequst();
	}
	
	getCategories(projectId) {
    	this.service.getProjectCategories(projectId).then((promise) => {
            this.categories = promise.data;
            for (let idx in this.categories) {
            	if (this.categories[idx].text === 'Salaries & Benefits') {
            		this.salariesAndBenefitsId = this.categories[idx].id + '';
            	}
            	if (this.categories[idx].text === 'Staff Travel') {
            		this.staffTravelId = this.categories[idx].id + '';
            	}
            	if (this.categories[idx].text === 'Multipliers') {
            		this.multipliersId = this.categories[idx].id + '';
            	}
            	if (this.categories[idx].text === 'Operational Expenses') {
            		this.operationalId = this.categories[idx].id + '';
            	}
            }
        }, ()=>{
        	this.toastr.error("Failed to retrieve categories");
        });
    }
    
    getStaff(projectId) {
    	this.service.getProjectStaff(projectId).then((promise) => {
            this.staff = promise.data.results;
        }, ()=>{
        	this.toastr.error("Failed to retrieve staff");
        });
    }
    
    getBenefitTypes(projectId) {
    	this.service.getProjectBenefits(projectId).then((promise) => {
            this.benefits = promise.data;
        });
    }
    
    getMultipliers() {
    	this.service.getProjectMultipliers().then((promise) => {
            this.multipliers = promise.data;
        });
    }
	
	getProjectRequst() {
		this.spinner.show("Retrieving Project Request");
		this.service.getRequest(this.stateParams.id).then((promise) => {
			this.projectRequest = promise.data;
			this.projectRequest.comment = '';
			dropDecimals([this.projectRequest]);
			this.projectRequest.override_mdf_project = this.projectRequest.override_mdf_project + '';
			this.projectRequest.category = this.projectRequest.category + '';
			if (this.projectRequest.staff) {
				this.projectRequest.staff = this.projectRequest.staff + '';
			}
			this.requestDate = this.projectRequest.date_time_entered.substring(0,  this.projectRequest.date_time_entered.indexOf('T'));
			this.entryCost = this.projectRequest.cost + '';
			this.entryOrig = this.projectRequest.originalCost + '';
			
			this.isAuthor = (this.session.user.id === this.projectRequest.author) &&
				(this.projectRequest.status === 'Submitted' || this.projectRequest.status === 'Approved');
			this.canApprove = this.session.checkPermission('PROJECT_REQUEST','APPROVE',this.projectRequest.country_id, this.projectRequest.project) &&
					this.projectRequest.status === 'Submitted';
			this.canModifyApproved = this.session.checkPermission('PROJECT_REQUEST','APPROVE',this.projectRequest.country_id, this.projectRequest.project) &&
					this.projectRequest.status === 'Approved';
			this.canUpdate = (this.isAuthor || this.canApprove || this.canModifyApproved) && (this.projectRequest.status === 'Submitted' || this.projectRequest.status === 'Approved');
			this.getBudgets();
			this.getCategories(this.projectRequest.project);
	        this.getStaff(this.projectRequest.project);
	        this.getBenefitTypes(this.projectRequest.project);
	        if (this.projectRequest.prior_request) {
	        	this.reviewPriorUrl = this.state.href('reviewProjectRequest', {
		            id: this.projectRequest.prior_request,
		            mdf_id: null,
		        });
	        }
		}, ()=> {
			this.spinner.hide();
			this.toastr.error("Failed to retrieve project request");
		});
	}
	
	// get projects that can be used as override MDF projects
	getBudgets() {
		this.service.getBudgetProjects(this.projectRequest.country_id).then((promise) => {
			for(let idx in promise.data.results) {
				if (promise.data.results[idx].features.indexOf('hasMDF') >= 0) {
					this.budgetProjects.push(promise.data.results[idx]);
				}
			}
			this.spinner.hide();
		}, () => {
			this.spinner.hide();
			this.toastr.error("Failed to retrieve budgets");
		});
	}
	
	// If the category is not Salaries & Benefits or Operational Expenses, then we must use the
	// default MDF project
	categoryChange() {
		if (this.projectRequest.category !== this.salariesAndBenefitsId && this.projectRequest.category !== this.operationalId) {
			this.projectRequest.override_mdf_project = this.projectRequest.default_mdf_project_id + '';
		}
	}
	
	// When the author updates the original cost, then also update the cost.  The project request
	// will return the the submitted status and need to be approved.
	authorUpdate() {
		this.projectRequest.cost = this.projectRequest.original_cost;
	}
	
	discuss() {
		let request = this.projectRequest;
    	let theService = this.service;
    	let userId = this.session.user.id;
    	let modalInstance = this.modal.open({
            animation: true,
            templateUrl: discussProjectRequestTemplate,
            controller: DiscussProjectRequestModalController,
            size: 'lg',
            controllerAs: "vm",
            resolve: {
            	service() {return theService;},
                request() {return request;},
                userId() {return userId;},
            },
        });
        modalInstance.result.then(() => {
            if (request.projectrequestdiscussion_set.length < 1) {
            	// A discussion entry was added in the modal and it was
            	// the first entry.  Add a blank entry to the set to change
            	// the icon
            	request.projectrequestdiscussion_set.push({});
            }
        });
    }
    
    attach() {
	    let request = this.projectRequest;
    	let theService = this.service;
    	let modalInstance = this.modal.open({
            animation: true,
            templateUrl: attachProjectRequestTemplate,
            controller: AttachProjectRequestModalController,
            size: 'lg',
            controllerAs: "vm",
            resolve: {
            	service() {return theService;},
                request() {return request;},
            },
        });
        modalInstance.result.then(() => {
            if (request.projectrequestdiscussion_set.length < 1) {
            	// A discussion entry was added in the modal and it was
            	// the first entry.  Add a blank entry to the set to change
            	// the icon
            	request.projectrequestdiscussion_set.push({});
            }
        });
    }
    
    decline() {
    	this.showComment = true;
    	if (this.projectRequest.comment === '') {
    		if (this.projectRequest.approved_mdf) {
    			this.toastr.warning('Must enter a comment to Complete');
    		} else {
    			this.toastr.warning('Must enter a comment to Decline');
    		}
    		return;
    	}
    	
    	let localRequest = jQuery.extend(true, {}, this.projectRequest);
    	localRequest.status = 'Declined';
    	this.spinner.show("Processing request...");   
    		this.service.putRequest(localRequest).then( () => {
    			this.spinner.hide();
    			this.returnToSource();
    		}, () => {
    			this.spinner.hide();
    			this.toastr.error("Failed to decline request");
    		});
    }
    
    deleteRequest() {
        this.spinner.show("Processing request...");
        this.service.deleteRequest(this.projectRequest.id).then(() => {
            this.returnToSource();
        }, () => {
            this.spinner.hide();
            this.toastr.error("Failed to delete request");
        });
    }
    
    update() {
    	let localRequest = jQuery.extend(true, {}, this.projectRequest);
    	if (this.canApprove || this.canModifyApproved) {
    		localRequest.status = 'Approved';
    	} else {
    		if (this.isAuthor) {
    			localRequest.status = 'Submitted';
    		}
    	}
    	this.spinner.show("Processing request...");   
    		this.service.putRequest(localRequest).then( () => {
    			this.spinner.hide();
    			this.returnToSource();
    		}, () => {
    			this.spinner.hide();
    			this.toastr.error("Failed to update request");
    		});
    }
    
    changeApprovedAmount() {
    	this.enterApprovedAmount = true;
    	this.showComment = true;
    	if (this.projectRequest.comment === '' || this.entryCost === this.projectRequest.cost) {
    		this.toastr.warning('Must change the request amount and enter a comment to Change Approved Amount');
    		return;
    	}
    	
    	let localRequest = jQuery.extend(true, {}, this.projectRequest);
    	if (localRequest.status === 'Submitted') {
    		localRequest.status = 'Approved';
    	}
    	this.spinner.show("Processing request...");   
    		this.service.putRequest(localRequest).then( () => {
    			this.spinner.hide();
    			this.returnToSource();
    		}, () => {
    			this.spinner.hide();
    			this.toastr.error("Failed to update request");
    		});
    }
    
    returnToSource() {
    	if (this.stateParams.mdf_id) {
			this.state.go('mdf-pr',{id:this.stateParams.mdf_id, borderStationId: this.projectRequest.override_mdf_project, isViewing:false});
		} else {
			this.state.go('projectRequestList',{});
		}
    }
}