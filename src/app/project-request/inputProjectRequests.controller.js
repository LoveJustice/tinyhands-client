import './projectRequest.less';

export default class InputProjectRequestController {
    constructor(ProjectRequestService, SessionService, SpinnerOverlayService, StickyHeader, $state, $stateParams, $uibModal, $timeout,  toastr) {
        'ngInject';
        this.service = ProjectRequestService;
        this.session = SessionService;
        this.stateParams = $stateParams;
        this.modal = $uibModal;
        this.sticky = StickyHeader;
        this.spinnerOverlayService = SpinnerOverlayService;
        this.state = $state;
        this.timeout = $timeout;
        this.toastr = toastr;
        this.countries = [];
        this.projects = [];
        this.stationsForAdd = [];

        this.timer = {};
        this.requests = [];
        
        this.stickyOptions = this.sticky.stickyOptions;
        this.stickyOptions.zIndex = 1;
        
        this.categories = null;
        this.staff = null;
        this.benefits = null;
        this.multipliers = null;
        this.newBenefit = '';

		this.getCategories();
        this.getStaff();
        this.getBenefitTypes();
        this.getMultipliers();
        this.addingType = null;
    }
    
    createRequest() {
        this.requests.push({
        	id:null,
        	author: this.session.user.id,
        	project: this.stateParams.id,
        	status: 'Submitted',
        	category:null,
        	original_cost: null,
        	cost:null,
        	description:'',
        	monthly:false,
        	staff:null,
        	benefit_type_name:'',
        	override_mdf_project:this.stateParams.mdfProject,
        	comment:'',
        });
    }
    
    getCategories() {
    	this.service.getProjectCategories(this.stateParams.id).then((promise) => {
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
            	if (this.categories[idx].text === 'Guides') {
            		this.guidesId = this.categories[idx].id + '';
            	}
            	if (this.categories[idx].text === 'Potential Victim Care') {
            		this.pvCareId = this.categories[idx].id + '';
            	}
            	if (this.categories[idx].text === 'Supplies & Awareness') {
            		this.awarenessId = this.categories[idx].id + '';
            	}
            }
        }, ()=>{
        	this.toastr.error('Failed to retrieve categories');
        });
    }
    
    getStaff() {
    	this.service.getProjectStaff(this.stateParams.id).then((promise) => {
            this.staff = promise.data.results;
        }, ()=>{
 			this.toastr.error('Failed to retrieve staff');

        });
    }
    
    getBenefitTypes() {
    	this.service.getProjectBenefits(this.stateParams.id).then((promise) => {
            this.benefits = promise.data;
        });
    }
    
    getMultipliers() {
    	this.service.getProjectMultipliers().then((promise) => {
            this.multipliers = promise.data;
        });
    }
    
    changeCategory(index) {
    	this.requests[index].staff = null;
    	this.requests[index].benefit_type_name = '';
    	if (this.requests[index].category === this.staffTravelId) {
    		this.requests[index].benefit_type_name = "STAFF TRAVEL";
    	}
    }
    
    addBenefit(index) {
    	this.benefits.push(this.newBenefit);
    	this.requests[index].benefit_type_name = this.newBenefit;
    	this.newBenefit = '';
    }
    
    validRequests() {
    	let response = this.requests.length > 0;
    	for (let idx in this.requests) {
    		let fields = [];
    		if (this.requests[idx].category === this.salariesAndBenefitsId) {
				fields = ['cost', 'staff', 'benefit_type_name'];
    		} else {
    			fields = ['category','cost','description'];
    		}
    		for (let fieldIdx in fields) {
    			if (this.requests[idx][fields[fieldIdx]] === null || this.requests[idx][fields[fieldIdx]] === '') {
    				response = false;
    			}
    		}
    	}
    	
    	return response;
    }
    
    deleteRequest(request, index) {
        if (request.confirmedDelete) {
        	this.requests.splice(index, 1);
        } else {
            request.confirmedDelete = true;
        }
    }
    
    submit() {
    	this.submitIndex = 0;
    	this.submitNext();
    }
    
    submitNext() {
    	if (this.submitIndex >= this.requests.length) {
    		if (this.requests.length > 0) {
    			this.toastr.error('The remaining requests failed to be saved on the server');
    			return;
    		} else {
    			this.state.go('projectRequestList', {});
    			return;
    		}
    	}
    	
    	this.requests[this.submitIndex].original_cost = this.requests[this.submitIndex].cost;
    	this.service.postRequest(this.requests[this.submitIndex]).then(() => {
    		this.requests.splice(this.submitIndex, 1);
    		this.submitNext();
    	}, () => {
    		// Failed to post request.  Increment index and try the next
    		this.submitIndex += 1;
    		this.submitNext();
    	});
    }
}
