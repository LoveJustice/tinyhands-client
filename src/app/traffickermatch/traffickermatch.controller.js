class TraffickerMatchController {
    constructor(StickyHeader, $rootScope, $scope, $http, $timeout, traffickerMatchService, $uibModal, $state, $stateParams, $document, toastr) {
        'ngInject';

        this.state = $state;
        this.sticky = StickyHeader;
        this.rootScope = $rootScope;
        this.scope = $scope;
        this.stateParams = $stateParams;
        this.http = $http;
        this.timeout = $timeout;
        this.traffickerMatchService = traffickerMatchService;
        this.modal = $uibModal;
        this.toastr = toastr;

        this.loading = false;

        $scope.showPopup=false;
        $scope.displayPopup=function(event, photo){
        	if (photo !== null && $scope.showPopup === false) {
	        	var img = $document[0].getElementById('popupImageId');
	        	var div = $document[0].getElementById('popupDiv');
	        	div.style.position = "absolute";
	        	div.style.left = (event.currentTarget.offsetLeft + event.currentTarget.offsetParent.offsetLeft)+'px';
	        	div.style.top = (event.currentTarget.offsetTop + event.currentTarget.offsetParent.offsetTop + event.currentTarget.offsetHeight) + 'px';
	        	img.src = photo;
	            $scope.showPopup=true;
        	}
        };
        $scope.hidePopup=function(){
            $scope.showPopup=false;
        };
        
        this.searchValue = "";
    } 
    
    matchSearch() {
        this.loading = true;
        if (this.addSearchOption==="name") {
	        this.traffickerMatchService.getFuzzyKnownPersons(this.searchValue)
	            .then((promise) => {
	                this.matchCandidates = promise.data;
	                this.loading = false;
	            });
    	} else {
    		 this.traffickerMatchService.getPhoneKnownPersons(this.searchValue)
	            .then((promise) => {
	                this.matchCandidates = promise.data;
	                this.loading = false;
	            });
    	}
    }
    
    getForms(person_id) {
    	this.traffickerMatchService.getKnownPersonForms(person_id)
	    	.then((promise) => {
	            this.forms = promise.data;
	        });
    }
    
}

export default TraffickerMatchController;
