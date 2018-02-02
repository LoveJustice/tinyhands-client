
export default class AccessControlController {
    constructor(UserPermissionsService, StickyHeader, $q, $state, $stateParams, $uibModal, $scope, toastr) {
        'ngInject';

        this.UserPermissionsService = UserPermissionsService;
        this.sticky = StickyHeader;
        this.$q = $q;
        this.$state = $state;
        this.$uibModal = $uibModal;
        this.$scope = $scope;
        this.toastr = toastr;

        this.stickyOptions = this.sticky.stickyOptions;
        this.stickyOptions.zIndex = 1;
        this.accounts = [];
        
        this.acState = {};
        this.acState.permissions = [];
        this.acState.permissionGroups = [];
        this.acState.permissionDisplay = {};
        this.acState.countries = [];
        this.acState.stations = [];
         
        this.countryOptions = [{id: -1, label: "Global"}, {id: -2, label:"", disabled : true}];
        this.countrySelectedOptions = [this.countryOptions[0]];
        this.countrySettings = {smartButtonMaxItems:1, selectionLimit: 1, showCheckAll: false, closeOnSelect: true, showUncheckAll: false, scrollableHeight: '250px', scrollable: true,};
        this.countryCustomText = {};
        this.countryEventListener = {
                onItemSelect: this.countrySelect,
                onItemDeselect: this.countryDeselect,
                parent: this,
        };
        
        this.stationOptions = [];
        this.stationSelectedOptions = [];
        this.stationSettings = {smartButtonMaxItems:1, selectionLimit: 1, showCheckAll: false, closeOnSelect: true, showUncheckAll: false, scrollableHeight: '250px', scrollable: true,};
        this.stationCustomText = {buttonDefaultText: 'Station'};
        this.stationEventListener = {
                onItemSelect: this.stationSelect,
                onItemDeselect: this.stationDeselect,
                parent: this,
                countrySelect: this.countrySelect,
        };
        
        if ($stateParams && $stateParams.acState) {
            this.acState = JSON.parse($stateParams.acState);
            this.buildCountryOptions();
            
            for (var idx=0; idx < this.countryOptions.length; idx++) {
                if (this.countryOptions[idx].id === this.acState.selectedCountry) {
                    this.countrySelectedOptions = [this.countryOptions[idx]];
                }
            }
            if (this.acState.selectedCountry >=0) {
                this.setStationOptionsForCountry(this.acState.selectedCountry);
                
                if (this.acState.selectedStation !== null) {
                    for (var idx1=0; idx1 < this.stationOptions.length; idx1++) {
                        if (this.stationOptions[idx1].id === this.acState.selectedStation) {
                            this.stationSelectedOptions = [this.stationOptions[idx1]];
                        }
                    }
                }
            }
            
            if (this.acState.selectedStation !== null) {
                this.getAccounts(null, this.acState.selectedStation);
            } else if (this.acState.selectedCountry < 0) {
                this.getAccounts(null, null);
            } else {
                this.getAccounts(this.acState.selectedCountry, null);
            }
        } else {
            this.acState = {};
            this.acState.permissions = [];
            this.acState.permissionGroups = [];
            this.acState.permissionDisplay = {};
            this.acState.countries = [];
            this.acState.stations = [];
            this.acState.selectedCountry = -1;
            this.acState.selectedStation = null;
    
            this.loading = true;
            this.getCountries();
            this.getStations();
            this.getPermissions();
        }
    }
    
    getCountries() {
        this.UserPermissionsService.getAllCountries().then((result) => {
            this.acState.countries = result.data.results;
            
            this.buildCountryOptions();
        });
    }
    
    buildCountryOptions() {
        this.countryOptions = [{id: -1, label: "Global"}, {id: -2, label:"", disabled : true}];
        this.countrySelectedOptions = [this.countryOptions[0]];
        for (var idx=0; idx < this.acState.countries.length; idx++) {
            this.countryOptions.push({id: this.acState.countries[idx].id, label: this.acState.countries[idx].name});
        }
    }
    
    getStations() {
        this.UserPermissionsService.getBorderStations().then((result) => {
            this.acState.stations = result.data;
        });
    }

    getAccounts(countryId, stationId) {
        this.loading = true;
        this.$state.go('.', {acState: JSON.stringify(this.acState)});
        this.UserPermissionsService.getUserPermissionsList(countryId, stationId).then((response) => {
            var accts = response.data;
            this.accounts = [];
            for (var idx=0; idx < response.data.length; idx++) {
                var newAcct = { id: accts[idx].account_id, name : accts[idx].name, permissions: {}};
                for (var idx1=0; idx1 < this.acState.permissions.length; idx1++) {
                    newAcct.permissions[idx1] = 'X';
                }
                for (var idx2=0; idx2 < accts[idx].permissions.length; idx2++) {
                    var perm = accts[idx].permissions[idx2];
                    newAcct.permissions[this.acState.permissionDisplay[perm.id]] = perm.level;
                }
                this.accounts.push(newAcct);
            }
            this.loading = false;
        });
    }

    getPermissions() {
        this.UserPermissionsService.getPermissions().then((result) => {
            this.acState.permissions = result.data.results;
            for (var idx=0; idx < this.acState.permissions.length; idx++) {
                this.acState.permissionDisplay[this.acState.permissions[idx].id] = idx;
                var pg = this.acState.permissions[idx].permission_group;
                var found = false;
                for (var pgIdx=0; pgIdx < this.acState.permissionGroups.length; pgIdx++) {
                    if (this.acState.permissionGroups[pgIdx].name === pg) {
                        this.acState.permissionGroups[pgIdx].span += 1;
                        found = true;
                    }
                }
                if (!found) {

                    this.acState.permissionGroups.push({ name : pg, span : 1});
                }
            }
            this.getAccounts(null, null);
        });
    }
    
    setStationOptionsForCountry(countryId) {
        for (var idx=0; idx < this.acState.stations.length; idx++) {
            if (this.acState.stations[idx].operating_country === countryId) {
                this.stationOptions.push({id: this.acState.stations[idx].id, label: this.acState.stations[idx].station_name});
            }
        } 
    }
    
    countrySelect() {        
        this.parent.stationSelectedOptions = [];
        this.parent.stationOptions = [];
        this.parent.acState.selectedCountry = this.parent.countrySelectedOptions[0].id;
        this.parent.acState.selectedStation = null;
        
        if (this.parent.countrySelectedOptions[0].id < 0) {
            this.parent.getAccounts(null,null);
        } else {
            var countryId = this.parent.countrySelectedOptions[0].id;
            this.parent.setStationOptionsForCountry(countryId);
            this.parent.getAccounts(countryId, null);
        }
    }
    
    countryDeselect() { 
        if (this.parent.countrySelectedOptions.length < 1) {
            this.parent.countrySelectedOptions.push(this.parent.countryOptions[0]);
            this.parent.acState.selectedCountry = this.parent.countrySelectedOptions[0].id;
            this.onItemSelect();
        } else {
            this.parent.acState.selectedCountry = this.parent.countrySelectedOptions[0].id;
        }
    }
    
    stationSelect() {
        if (this.parent.stationSelectedOptions.length > 0) {
            var stationId = this.parent.stationSelectedOptions[0].id;
            this.parent.acState.selectedStation = this.parent.stationSelectedOptions[0].id;
            this.parent.getAccounts(null, stationId);
        }
    }
    
    stationDeselect() {
        if (this.parent.stationSelectedOptions.length === 0) {
            this.countrySelect();
        }
    }
}