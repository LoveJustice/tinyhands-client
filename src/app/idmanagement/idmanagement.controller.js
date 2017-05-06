
class IdManagementController {
    constructor(StickyHeader, $rootScope, $scope, $http, $timeout, idManagementService, $uibModal, $state, $stateParams, $document) {
        'ngInject';

        this.state = $state;
        this.sticky = StickyHeader;
        this.rootScope = $rootScope;
        this.scope = $scope;
        this.stateParams = $stateParams;
        this.http = $http;
        this.timeout = $timeout;
        this.idManagementService = idManagementService;
        this.modal = $uibModal;

        this.loading = false;
        this.reverse = false;
        this.paginateBy = 25;
        this.knownPersons = [];
        this.searchValue = "";
        this.nextPageUrl = "";
        this.sortColumn = "";
        this.stickyOptions = this.sticky.stickyOptions;
        
        this.addSearchValue = "";
        
        this.showIdMgmt = true;
        this.showAddAlias = false;
        this.showRemoveAlias = false;
        
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

        this.getKnownPersons();
    }
    
    sortIcon(column) {
        if (column === this.sortColumn) {
            switch (column) {
                case "age":
                case "phone":
                    return this.reverse ? "glyphicon-sort-by-order-alt" : "glyphicon-sort-by-order";
                case "name":
                case "gender":
                case "address1":
                case "address2":
                    return this.reverse ? "glyphicon-sort-by-alphabet-alt" : "glyphicon-sort-by-alphabet";
                default:
                    return "glyphicon-sort";
            }
        }
        return "glyphicon-sort";
    }


    getKnownPersons() {
        this.loading = true;
        this.idManagementService.listKnownPersons(this.getQueryParams())
            .then((promise) => {
                this.knownPersons = promise.data.results;
                this.nextPageUrl = this.nextUrl(promise.data.next);
                this.loading = false;
            });
    }

    loadMoreKnownPersons() {
        this.loading = true;
        this.idManagementService.loadMoreKnownPersons(this.getQueryParams(true))
            .then((promise) => {
                this.knownPersons = this.knownPersons.concat(promise.data.results);
                this.nextPageUrl = this.nextUrl(promise.data.next);
                this.loading = false;
            });
    }

    searchKnownPersons() {
        this.loading = true;
        this.idManagementService.searchKnownPersons(this.getQueryParams())
            .then((promise) => {
                this.knownPersons = promise.data.results;
                this.nextPageUrl = this.nextUrl(promise.data.next);
                this.loading = false;
            });
    }

    getQueryParams(loadMore = false) {
        var params = [];
        params.push({ "name": "page_size", "value": this.paginateBy });
        if (this.nextPageUrl && loadMore) {
            params.push({ "name": "page", "value": this.nextPageUrl });
        }
        if (this.searchValue) {
            params.push({ "name": "search", "value": this.searchValue });
        }
        if (this.sortColumn) {
            if (this.reverse) {
                params.push({ "name": "ordering", "value": ("-" + this.sortColumn.replace(".", "__")) });
            } else {
                params.push({ "name": "ordering", "value": (this.sortColumn.replace(".", "__")) });
            }
        }
        return params;
    }

    nextUrl(url) {
        if (url) {
            url = url.match(/page=\d+/);
            if (url) {
                url = url[0].match(/\d+/)[0];
            }
        }
        return url;
    }
    
    aliasMgmt(knownperson) {
    	this.isViewing = false;
    	if (knownperson.alias_group === null) {
    		this.aliasMgmtAdd(knownperson);
    	} else {
    		this.aliasMgmtDelete(knownperson);
    	}
    }
    
    aliasMgmtAdd(knownperson) {
    	this.forms = [];
    	this.addCandidates = [];
    	this.knownperson = knownperson;
        this.addSearchValue = knownperson.full_name;
        
        this.showIdMgmt = false;
        this.showAddAlias = true;
        this.showremoveAlias = false;
        this.matchSelected = false;
        
        this.getFuzzyMatch();
        this.getForms(knownperson.id);
    }
    
    getFuzzyMatch() {
        this.loading = true;
        this.idManagementService.getFuzzyKnownPersons(this.addSearchValue)
            .then((promise) => {
                this.addCandidates = promise.data;
                this.loading = false;
            });
    }
    
    getForms(person_id) {
    	this.idManagementService.getKnownPersonForms(person_id)
	    	.then((promise) => {
	            this.forms = promise.data;
	        });
    }
    
    cancelAdd() {
    	if (this.isViewing) {
    		this.showIdMgmt = false;
    		this.showAddAlias = true;
    	} else {
    		this.showIdMgmt = true;
    		this.showAddAlias = false;
    	}
        this.showRemoveAlias = false; 
        this.isViewing = false;
    }
    
    enableMatch() {
    	this.matchSelected = true;
    }
    
    aliasGroupDetail(knownperson) {
    	this.delCandidates = [];
    	this.isViewing = true;
        
        this.showIdMgmt = false;
        this.showAddAlias = false;
        this.showRemoveAlias = true;
        
        this.getAliasGroup(knownperson.alias_group);	
    }
    
    aliasMgmtDelete(knownperson) {
    	this.delCandidates = [];
    	this.isViewing = false;
        
        this.showIdMgmt = false;
        this.showAddAlias = false;
        this.showRemoveAlias = true;
        
        this.getAliasGroup(knownperson.alias_group);
    }
    
    getAliasGroup(group_id) {
        this.loading = true;
        this.idManagementService.getAliasMembers(group_id)
            .then((promise) => {
                this.delCandidates = promise.data;
                this.loading = false;
            });
    }

}

export default IdManagementController;
