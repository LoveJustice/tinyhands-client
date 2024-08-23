export default class CreateMdfModalController {
    constructor(MdfListService, SessionService, $uibModalInstance, $scope) {
        'ngInject';

        this.service = MdfListService;
        this.session = SessionService;
        this.$uibModalInstance = $uibModalInstance;
        this.scope = $scope;
        
        this.scope.stationDropDown = {};
        this.scope.stationDropDown.options = [];
        this.scope.stationDropDown.selectedOptions = [];
        this.scope.stationDropDown.settings = {smartButtonMaxItems:1, showCheckAll: false, showUncheckAll: false, selectionLimit:1,
                groupByTextProvider(groupValue) { return groupValue; }, groupBy:'country', closeOnSelect: true,
                scrollableHeight: '250px', scrollable: true,};
        this.scope.stationDropDown.customText = {};
        this.scope.stationDropDown.eventListener = {onItemSelect: this.stationChangeInner, ctrl: this,};
        
        this.months = [
            { name: 'January', value: 1 },
            { name: 'February', value: 2 },
            { name: 'March', value: 3 },
            { name: 'April', value: 4 },
            { name: 'May', value: 5 },
            { name: 'June', value: 6 },
            { name: 'July', value: 7 },
            { name: 'August', value: 8 },
            { name: 'September', value: 9 },
            { name: 'October', value: 10 },
            { name: 'November', value: 11 },
            { name: 'December', value: 12 },
        ];
        this.month = parseInt(window.moment().format('M'));
        this.year = parseInt(window.moment().format('YYYY'));
        
        this.lastMdfInfo = null;
        this.error = null;
    }
    
    $onInit() {
        this.service.getUserStationsForAdd(this.session.user.id).then((resp) => {
            let stations = resp.data;
            for (var idx=0; idx < stations.length; idx++) {
                if (stations[idx].features.indexOf('hasMDF') !== -1) {
                    this.scope.stationDropDown.options.push({"id":stations[idx].id, "label":stations[idx].station_name,
                        "country":stations[idx].country_name, "country_id":stations[idx].country_id});
                }
            }
        });
    }
    
    stationChangeInner() {
    	this.ctrl.stationChange();
    }
    
    stationChange() {
    	this.service.getLastMdfDate(this.scope.stationDropDown.selectedOptions[0].id).then((promise) => {
    		this.lastMdfInfo = promise.data;
    		if (this.lastMdfInfo.status === null) {
    			let tmp = window.moment().add(7,'days');
    			this.month = parseInt(tmp.format('M'));
    			this.year = parseInt(tmp.format('YYYY'));
    		} else if (this.lastMdfInfo.status !== 'Approved') {
    			this.error = 'There is already an active MDF for this project.  Only one active (not Approved) my be present for a project.';
    			this.lastMdfInfo = null;
    		} else {
    			this.year = Math.floor(this.lastMdfInfo.month / 100);
    			this.month = this.lastMdfInfo.month % 100 + 1;
    			if (this.month > 12) {
    				this.month = 1;
    				this.year += 1;
    			}
    			
    		}
    	});
    }
    
    create() {
    	this.service.getNewMdf(this.scope.stationDropDown.selectedOptions[0].id, this.year, this.month).then((promise) => {
    		this.$uibModalInstance.close(promise.data);
    	}, (error) => {
    		this.error = error.data.error;
    	});
    }

    cancel() {
        this.$uibModalInstance.dismiss();
    }
}