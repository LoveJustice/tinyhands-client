/* global jQuery */
import discussProjectRequestTemplate from './discussProjectRequestModal.html';
import DiscussProjectRequestModalController from './discussProjectRequestModal.controller.js';

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
			this.projectRequest.override_mdf_project = this.projectRequest.override_mdf_project + '';
			this.projectRequest.category = this.projectRequest.category + '';
			if (this.projectRequest.staff) {
				this.projectRequest.staff = this.projectRequest.staff + '';
			}
			this.requestDate = this.projectRequest.date_time_entered.substring(0,  this.projectRequest.date_time_entered.indexOf('T'));
			this.entryCost = this.projectRequest.cost + '';
			
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
		}, ()=> {
			this.spinner.hide();
			this.toastr.error("Failed to retrieve project request");
		});
	}
	
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
    
    decline() {
    	if (this.projectRequest.comment === '') {
    		this.toastr.warning('Must enter a comment to Decline');
    		return;
    	}
    	
    	let localRequest = jQuery.extend(true, {}, this.projectRequest);
    	localRequest.status = 'Declined';
    	this.spinner.show("Processing request...");   
    		this.service.putRequest(localRequest).then( () => {
    			this.spinner.hide();
    			this.state.go('projectRequestList',{});
    		}, () => {
    			this.spinner.hide();
    			this.toastr.error("Failed to decline request");
    		});
    }
    
    update() {
    	let localRequest = jQuery.extend(true, {}, this.projectRequest);
    	if (localRequest.status === 'Submitted') {
    		localRequest.status = 'Approved';
    	}
    	this.spinner.show("Processing request...");   
    		this.service.putRequest(localRequest).then( () => {
    			this.spinner.hide();
    			this.state.go('projectRequestList',{});
    		}, () => {
    			this.spinner.hide();
    			this.toastr.error("Failed to update request");
    		});
    }
    
    changeApprovedAmount() {
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
    			this.state.go('projectRequestList',{});
    		}, () => {
    			this.spinner.hide();
    			this.toastr.error("Failed to update request");
    		});
    }
}