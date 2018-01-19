
export default class AccessControlController {
    constructor(UserPermissionsService, StickyHeader, $q, $state, $uibModal, $scope, toastr) {
        'ngInject';

        this.UserPermissionsService = UserPermissionsService;
        this.sticky = StickyHeader;
        this.$q = $q;
        this.$state = $state;
        this.$uibModal = $uibModal;
        this.$scope = $scope;
        this.toastr = toastr;

        this.accounts = [];
        this.permissions = [];
        this.permissionGroups = [];
        this.permissionDisplay = {};
        this.countries = [];
        this.stations = [];
        this.stickyOptions = this.sticky.stickyOptions;
        
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

        this.loading = true;
        this.getCountries();
        this.getStations();
        this.getPermissions();
    }
    
    getCountries() {
        this.UserPermissionsService.getAllCountries().then((result) => {
            this.countries = result.data.results;
            
            for (var idx=0; idx < this.countries.length; idx++) {
                this.countryOptions.push({id: this.countries[idx].id, label: this.countries[idx].name});
            }
        });
    }
    
    getStations() {
        this.UserPermissionsService.getBorderStations().then((result) => {
            this.stations = result.data;
        });
    }

    getAccounts(countryId, stationId) {
        this.loading = true;
        this.UserPermissionsService.getUserPermissionsList(countryId, stationId).then((response) => {
            var accts = response.data;
            this.accounts = [];
            for (var idx=0; idx < response.data.length; idx++) {
                var newAcct = { id: accts[idx].account_id, name : accts[idx].name, permissions: {}};
                for (var idx1=0; idx1 < this.permissions.length; idx1++) {
                    newAcct.permissions[idx1] = 'X'
                }
                for (var idx2=0; idx2 < accts[idx].permissions.length; idx2++) {
                    var perm = accts[idx].permissions[idx2];
                    newAcct.permissions[this.permissionDisplay[perm.id]] = perm.level;
                }
                this.accounts.push(newAcct);
            }
            this.loading = false;
        });
    }

    getPermissions() {
        this.UserPermissionsService.getPermissions().then((result) => {
            this.permissions = result.data.results;
            for (var idx=0; idx < this.permissions.length; idx++) {
                this.permissionDisplay[this.permissions[idx].id] = idx;
                var pg = this.permissions[idx].permission_group;
                var found = false;
                for (var pgIdx=0; pgIdx < this.permissionGroups.length; pgIdx++) {
                    if (this.permissionGroups[pgIdx].name === pg) {
                        this.permissionGroups[pgIdx].span += 1;
                        found = true;
                    }
                }
                if (!found) {

                    this.permissionGroups.push({ name : pg, span : 1});
                }
            }
            this.getAccounts(null, null);
        });
    }
    
    countrySelect() {        
        this.parent.stationSelectedOptions = [];
        this.parent.stationOptions = [];
        
        if (this.parent.countrySelectedOptions[0]['id'] < 0) {
            this.parent.getAccounts(null,null);
        } else {
            var country_id = this.parent.countrySelectedOptions[0]['id'];
            this.parent.getAccounts(country_id, null);
            for (var idx=0; idx < this.parent.stations.length; idx++) {
                if (this.parent.stations[idx].operating_country === country_id) {
                    this.parent.stationOptions.push({id: this.parent.stations[idx].id, label: this.parent.stations[idx].station_name});
                }
            }
            
        }
    }
    
    countryDeselect() { 
        if (this.parent.countrySelectedOptions.length < 1) {
            this.parent.countrySelectedOptions.push(this.parent.countryOptions[0]);
            this.onItemSelect();
        }
    }
    
    stationSelect() {
        if (this.parent.stationSelectedOptions.length > 0) {
            var station_id = this.parent.stationSelectedOptions[0]['id'];
            this.parent.getAccounts(null, station_id);
        }
    }
    
    stationDeselect() {
        if (this.parent.stationSelectedOptions.length === 0) {
            this.countrySelect();
        }
    }
}