export default class CreateBudgetModalController {
    constructor(BudgetListService, SessionService, $uibModalInstance, $scope) {
        'ngInject';

        this.service = BudgetListService;
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
        this.scope.stationDropDown.eventListener = {};
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

    create() {
        this.$uibModalInstance.close(this.scope.stationDropDown.selectedOptions[0]);
    }

    cancel() {
        this.$uibModalInstance.dismiss();
    }
}