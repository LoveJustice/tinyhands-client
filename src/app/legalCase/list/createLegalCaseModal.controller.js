import {encodeGroup} from  '../../encodeGroup.js';
import './legalCaseList.less';

export default class CreateLegalCaseModalController {
    constructor($uibModalInstance, stations, $scope) {
        'ngInject';

        this.$uibModalInstance = $uibModalInstance;
        this.scope = $scope;
        
        this.scope.stationDropDown = {};
        this.scope.stationDropDown.options = [];
        this.scope.stationDropDown.selectedOptions = [];
        this.scope.stationDropDown.settings = {smartButtonMaxItems:1, showCheckAll: false, showUncheckAll: false, selectionLimit:1,
                groupByTextProvider(groupValue) { return encodeGroup(groupValue); }, groupBy:'encoded', closeOnSelect: true,
                scrollableHeight: '250px', scrollable: true,};
        this.scope.stationDropDown.customText = {};
        this.scope.stationDropDown.eventListener = {};
        
        for (var idx=0; idx < stations.length; idx++) {
            this.scope.stationDropDown.options.push({"id":stations[idx].id, "label":stations[idx].station_name,
                "country":stations[idx].country_name, "encoded":encodeGroup(stations[idx].country_name), "country_id":stations[idx].country_id});
        }
    }
    
    create() {
        this.$uibModalInstance.close(this.scope.stationDropDown.selectedOptions[0]);
    }

    cancel() {
        this.$uibModalInstance.dismiss();
    }
}