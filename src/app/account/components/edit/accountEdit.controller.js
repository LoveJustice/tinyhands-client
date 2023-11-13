import profileForm from './components/profileForm.html?url';
import permissionForm from './components/permissionForm.html?url';
import {encodeGroup} from  '../../../encodeGroup.js';

class PermDropDown {
    constructor(validOptions, currentOptions, settings, customText, eventListener) {
        this.allOptions = validOptions.slice();
        this.options = this.allOptions.slice();
        this.selectedOptions = currentOptions.slice();
        this.settings = settings;
        this.customText = customText;
        this.settings = settings;
        this.eventListener = eventListener;
        this.eventListener.activeDropDown = this;
    }

    removeAllOptions() {
        this.selectedOptions = [];
        this.options = [];
    }

    restoreAllOptions() {
        this.options = this.allOptions.slice();
    }

    removeGroupOptions(country) {
        var idx=0;
        for (idx=this.selectedOptions.length -1; idx >= 0; idx--) {
            if (this.selectedOptions[idx].country === country) {
                this.selectedOptions.splice(idx,1);
            }
        }
        for (idx=this.options.length -1; idx >= 0; idx--) {
            if (this.options[idx].country === country) {
                this.options.splice(idx,1);
            }
        }
    }

    restoreGroupOptions(country) {
        for (var idx=0; idx < this.allOptions.length; idx++) {
            if (this.allOptions[idx].country === country) {
                this.options.push(this.allOptions[idx]);
            }
        }
    }
    
    setOption(label) {
    	let theOption = null;
    	for (let idx=0; idx < this.options.length; idx++) {
    		if (this.options[idx].label === label) {
    			theOption = this.options[idx];
    		}
    	}
    	
    	if (!theOption) {
    		return null;
    	}
    	
    	for (let idx=0; idx < this.selectedOptions.length; idx++) {
    		if (this.selectedOptions[idx].label === label) {
    			// already set
    			return null;
    		}
    	}
    	
    	this.selectedOptions.push(theOption);
    	return theOption;
    }
    
    clearOption(label) {
    	let theOption = null;
    	for (let idx=0; idx < this.selectedOptions.length; idx++) {
    		if (this.selectedOptions[idx].label === label) {
    			theOption = this.selectedOptions[idx];
    			this.selectedOptions.splice(idx,1);
    		}
    	}
    	
    	return theOption;
    }

    isSelected() {
        return this.selectedOptions.length > 0;
    }
}

export class PermDropDownGroup {
    constructor(permission, managePermission, allCountries, allStations, allCurrentPermissions, accountId, editController, position) {
        this.permissionId = permission.id;
        this.permissionName = permission.action;
        this.minLevel = permission.min_level;
        this.accountId = accountId;
        this.editController = editController;
        this.position = position;

        var idx = 0;
        var idx1 = 0;
        var idx2 = 0;
        var toDisable = false;
        
        this.unmanagedPermissions = [];
        let hasGlobal = this.globalManagePermission(managePermission);
        let currentPermissions = this.displayedPermissions(allCurrentPermissions, managePermission, allStations);
        let filteredStations = this.filterStations(allStations, currentPermissions, managePermission);
        let filteredCountries = this.filterCountries(allCountries, currentPermissions, managePermission, filteredStations);
        

        this.stationValidOptions = [];
        for (idx=0; idx < filteredStations.length; idx++) {
            for (idx1=0; idx1 < filteredCountries.length; idx1++) {
                if (filteredStations[idx].operating_country === filteredCountries[idx1].id) {
                    toDisable = true;
                    for (idx2=0; idx2 < managePermission.length; idx2++) {
                        if ((managePermission[idx2].country === null && managePermission[idx2].station === null) ||
                                (managePermission[idx2].country === filteredCountries[idx1].id) ||
                                (managePermission[idx2].station === filteredStations[idx].id)) {
                            toDisable = false;
                            break;
                        }
                    }
                    this.stationValidOptions.push({
                        id: filteredStations[idx].id,
                        label: filteredStations[idx].station_name,
                        country: filteredCountries[idx1].name,
                        encoded:encodeGroup(filteredCountries[idx1].name),
                        disabled: toDisable});
                    break;
                }
            }
        }
        this.stationSettings = {smartButtonMaxItems:1, showCheckAll: false, showUncheckAll: hasGlobal, groupByTextProvider(groupValue) { return encodeGroup(groupValue); }, groupBy: 'encoded', scrollableHeight: '250px', scrollable: true, };
        this.stationCustomTexts = {buttonDefaultText: 'None'};
        this.stationEventListeners = {
        	onItemSelect: this.stationSelect,
            onItemDeselect: this.stationDeselect,
            onSelectAll: this.stationSelectAll,
            onDeselectAll: this.stationDeselectAll,
            editController: this.editController,
            position: this.position,
        };

        var selectedOptions = [];
        for (idx=0; idx < currentPermissions.length; idx++) {
                if (currentPermissions[idx].station !== null) {
                    for (idx1=0; idx1 < this.stationValidOptions.length; idx1++) {
                        if (currentPermissions[idx].station === this.stationValidOptions[idx1].id) {
                            selectedOptions.push(this.stationValidOptions[idx1]);
                            break;
                        }
                    }
                }
        }

        this.stationDropDown = new PermDropDown(this.stationValidOptions, selectedOptions, this.stationSettings, this.stationCustomTexts, this.stationEventListeners);

        this.countryValidOptions = [];
        for (idx=0; idx < filteredCountries.length; idx++) {
                toDisable = true;
            for (idx2=0; idx2 < managePermission.length; idx2++) {
                if ((managePermission[idx2].country === null && managePermission[idx2].station === null) ||
                        (managePermission[idx2].country === filteredCountries[idx].id)) {
                    toDisable = false;
                    break;
                }
            }
            this.countryValidOptions.push({id: filteredCountries[idx].id, label: filteredCountries[idx].name, disabled: toDisable,});
        }
        this.countrySettings = {smartButtonMaxItems:1, showCheckAll: false, showUncheckAll: hasGlobal,};
        this.countryCustomTexts = {buttonDefaultText: 'None'};
        this.countryEventListeners = {
                onItemSelect: this.countrySelect,
                onItemDeselect: this.countryDeselect,
                onSelectAll: this.countrySelectAll,
                onDeselectAll: this.countryDeselectAll,
                stationDropDown: this.stationDropDown,
                editController: this.editController,
                position: this.position,
        };

        selectedOptions = [];
        for (idx=0; idx < currentPermissions.length; idx++) {
                if (currentPermissions[idx].station === null && currentPermissions[idx].country !== null) {
                    for (idx1=0; idx1 < this.countryValidOptions.length; idx1++) {
                        if (currentPermissions[idx].country === this.countryValidOptions[idx1].id) {
                            selectedOptions.push(this.countryValidOptions[idx1]);
                            this.stationDropDown.removeGroupOptions(this.countryValidOptions[idx1].label);
                            break;
                        }
                    }
                }
        }

        this.countryDropDown = new PermDropDown(this.countryValidOptions, selectedOptions, this.countrySettings, this.countryCustomTexts, this.countryEventListeners);
        
        toDisable = true;
        for (idx2=0; idx2 < managePermission.length; idx2++) {
            if (managePermission[idx2].country === null && managePermission[idx2].station === null) {
                toDisable = false;
                break;
            }
        }
        this.globalValidOptions = [ {id: 1, label: "Global", disabled: toDisable}];
        this.globalSettings = {smartButtonMaxItems:1, selectionLimit: 1, showCheckAll: false, showUncheckAll: false};
        this.globalCustomTexts = {buttonDefaultText: 'None'};
        this.globalEventListeners = {
                onItemSelect: this.globalSelect,
                onItemDeselect: this.globalDeselect,
                onSelectAll: this.globalSelect,
                onDeselectAll: this.globalDeselect,
                countryDropDown: this.countryDropDown,
                stationDropDown: this.stationDropDown,
                editController: this.editController,
                position: this.position,
        };

        selectedOptions = [];
        for (idx=0; idx < currentPermissions.length; idx++) {
                if (currentPermissions[idx].country === null && currentPermissions[idx].station === null) {
                    selectedOptions.push(this.globalValidOptions[0]);
                    this.countryDropDown.removeAllOptions();
                    this.stationDropDown.removeAllOptions();
                    break;
                }
        }

        this.globalDropDown = new PermDropDown(this.globalValidOptions, selectedOptions, this.globalSettings, this.globalCustomTexts, this.globalEventListeners);
    }
    
    findStationCountry(station_id, stations) {
        let country = null;
        
        for (let idx=0; idx < stations.length; idx++) {
            if (stations[idx].id === station_id) {
                country = stations[idx].operating_country;
                break;
            }
        }
        
        return country;
    }
    
    // Determine if a userPermission for the account being edited should be displayed based on the current user's account management permissions
    displayPermission(userPermission, managePermissions, stations) {
        if (userPermission.country === null && userPermission.station === null) {
            return true;
        }

        for (let idx=0; idx < managePermissions.length; idx++) {
            if (    (userPermission.country && managePermissions[idx].country && managePermissions[idx].country === userPermission.country)  ||
                    (userPermission.country && managePermissions[idx].station && userPermission.country === this.findStationCountry(managePermissions[idx].station, stations)) ||
                    (userPermission.station && managePermissions[idx].station && userPermission.station === managePermissions[idx].station) ||
                    (userPermission.station && managePermissions[idx].country && this.findStationCountry(userPermission.station, stations) === managePermissions[idx].country)) {
                return true;
            }
        }
        return false;
    }
    
    globalManagePermission(managePermissions) {
        for (let idx=0; idx < managePermissions.length; idx++) {
            if (managePermissions[idx].country === null && managePermissions[idx].station === null) {
                return true;
            }
        }
        return false;
    }
    
    // Determine the set of existing account permissions that should be displayed based on the user's account management permissions
    displayedPermissions (allCurrentPermissions, managePermissions, stations) {
        this.unmanagedPermissions = [];
        if (this.globalManagePermission(managePermissions)) {
            return allCurrentPermissions;
        }
        for (let idx=0; idx < allCurrentPermissions.length; idx++) {
            if (allCurrentPermissions[idx].country === null && allCurrentPermissions[idx].station === null) {
                return allCurrentPermissions;
            }
        }
        let displayed = [];
        for (let idx=0; idx < allCurrentPermissions.length; idx++) {
            if (this.displayPermission(allCurrentPermissions[idx], managePermissions, stations)) {
                displayed.push(allCurrentPermissions[idx]);
            } else {
                this.unmanagedPermissions.push(allCurrentPermissions[idx]);
            }
        }
        
        return displayed;
    }
    
    // Determine the set of stations that should be included for the dropdown based on the existing account permissions
    // and the user's account management permissions
    filterStations(allStations, currentPermissions, managePermissions) {
        if (this.globalManagePermission(managePermissions)) {
            return allStations;
        }
        
        let filteredStations = [];
        for (let idx=0; idx < allStations.length; idx++) {
            let found = false;
            for (let idx1=0; idx1 < currentPermissions.length; idx1++) {
                if (currentPermissions[idx1].station && currentPermissions[idx1].station === allStations[idx].id) {
                    found = true;
                    break;
                }
                
                if (currentPermissions[idx1].country && currentPermissions[idx1].country === allStations[idx].operating_country) {
                    found = true;
                    break;
                }
            }
            if (!found) {
                for (let idx1=0; idx1 < managePermissions.length; idx1++) {
                    if (managePermissions[idx1].station && managePermissions[idx1].station === allStations[idx].id) {
                        found = true;
                        break;
                    }
                    
                    if (managePermissions[idx1].country && managePermissions[idx1].country === allStations[idx].operating_country) {
                        found = true;
                        break;
                    }
                }
            }
            
            if (found) {
                filteredStations.push(allStations[idx]);
            }
            
        }
        
        return filteredStations;
    }
    
    // Determine the set of countries that should be included for the dropdown based on the existing account permissions
    // and the user's account management permissions
    filterCountries(allCountries, currentPermissions, managePermissions, filteredStations) {
        if (this.globalManagePermission(managePermissions)) {
            return allCountries;
        }
        
        let filteredCountries = [];
        for (let idx=0; idx < allCountries.length; idx++) {
            let found = false;
            for (let idx1=0; idx1 < currentPermissions.length; idx1++) {
                if (currentPermissions[idx1].country && currentPermissions[idx1].country === allCountries[idx].id) {
                    found = true;
                    break;
                }
                
                if (!found && currentPermissions[idx1].station) {
                    let country = this.findStationCountry(currentPermissions[idx1].station, filteredStations);
                    if (country === allCountries[idx].id) {
                        found = true;
                    }
                }
            }
            if (!found) {
                for (let idx1=0; idx1 < managePermissions.length; idx1++) {
                    if (managePermissions[idx1].country && managePermissions[idx1].country === allCountries[idx].id) {
                        found = true;
                        break;
                    }
                    
                    if (!found && managePermissions[idx1].station) {
                        let country = this.findStationCountry(managePermissions[idx1].station, filteredStations);
                        if (country === allCountries[idx].id) {
                            found = true;
                        }
                    }
                }
            }
            if (found) {
                filteredCountries.push(allCountries[idx]);
            }
        }
        
        return filteredCountries;
    }

    globalSelect() {
        this.countryDropDown.removeAllOptions();
        this.stationDropDown.removeAllOptions();
        this.editController.globalSelect(this.position);
    }

    globalDeselect() {
        this.countryDropDown.restoreAllOptions();
        this.stationDropDown.restoreAllOptions();
        this.editController.globalDeselect(this.position);
    }
    
    setGlobal() {
    	this.globalDropDown.setOption('Global');
    	this.globalSelect();
    }
    
    clearGlobal() {
    	this.globalDropDown.clearOption('Global');
    	this.globalDeselect();
    }

    countrySelect(property) {
        this.stationDropDown.removeGroupOptions(property.label);
        this.editController.countrySelect(property.label, this.position);
    }
    countryDeselect(property) {
        this.stationDropDown.restoreGroupOptions(property.label);
        this.editController.countryDeselect(property.label, this.position);
    }
    countrySelectAll() {
        this.stationDropDown.removeAllOptions();
        let selected = this.activeDropDown.selectedOptions;
        for (let idx=0; idx < selected.length; idx++) {
        	this.editController.countrySelect(selected[idx].label, this.position);
        }
    }
    countryDeselectAll() {
        this.stationDropDown.restoreAllOptions();
        let cleared = this.activeDropDown.options;
        for (let idx=0; idx < cleared.length; idx++) {
        	this.editController.countryDeselect(cleared[idx].label, this.position);
        }
    }
    
    setCountry(label) {
    	let property = this.countryDropDown.setOption(label);
    	if (property) {
    		this.countrySelect(property);
    	}
    }
    
    clearCountry(label) {
    	let property = this.countryDropDown.clearOption(label);
    	if (property) {
    		this.countryDeselect(property);
    	}
    }
    
    stationSelect(property) {
    	this.editController.stationSelect(property.label, this.position);
    }
    stationDeselect(property) {
    	this.editController.stationDeselect(property.label, this.position);
    }
    stationSelectAll() {
        let selected = this.activeDropDown.selectedOptions;
        for (let idx=0; idx < selected.length; idx++) {
        	this.editController.stationSelect(selected[idx].label, this.position);
        }
    }
    stationDeselectAll() {
        let cleared = this.activeDropDown.options;
        for (let idx=0; idx < cleared.length; idx++) {
        	this.editController.stationDeselect(cleared[idx].label, this.position);
        }
    }
    
    setStation(label) {
    	this.stationDropDown.setOption(label);
    }
    
    clearStation(label) {
    	this.stationDropDown.clearOption(label);
    }
    
    getSelectedCountryLabels() {
    	let labels = [];
    	let selected = this.countryDropDown.selectedOptions;
    	for (let idx=0; idx < selected.length; idx++) {
        	labels.push(selected[idx].label);
        }
        return labels;
    }
    
    getSelectedStationLabels() {
    	let labels = [];
    	let selected = this.stationDropDown.selectedOptions;
    	for (let idx=0; idx < selected.length; idx++) {
        	labels.push(selected[idx].label);
        }
        return labels;
    }

    getSelectedPermissions() {
        var selectedPermissions = this.unmanagedPermissions.slice();
        var idx=0;
        if (this.globalDropDown.selectedOptions.length > 0) {
            selectedPermissions.push({
                    account: this.accountId, 
                    country: null, 
                    station: null, 
                    permission: this.permissionId});
        }

        for (idx=0; idx < this.countryDropDown.selectedOptions.length; idx++) {
            selectedPermissions.push({
                    account: this.accountId, 
                    country: this.countryDropDown.selectedOptions[idx].id, 
                    station: null, 
                    permission: this.permissionId});
        }

        for (idx=0; idx < this.stationDropDown.selectedOptions.length; idx++) {
            selectedPermissions.push({
                    account: this.accountId, 
                    country: null, 
                    station: this.stationDropDown.selectedOptions[idx].id, 
                    permission: this.permissionId});
        }
        return selectedPermissions;
    }
}



export default class AccountEditController {
    constructor($state, $stateParams, AccountService, SessionService, UserPermissionsService, toastr) {
        'ngInject';
        this.$state = $state;
        this.AccountService = AccountService;
        this.session = SessionService;
        this.UserPermissionsService = UserPermissionsService;
        this.toastr = toastr;
        this.account = null;
        this.resetErrors();
        if ($stateParams.id !== 'create') {
            this.isEditingAccount = true;
            this.retrieveAccount($stateParams.id);
            this.haveUserPermissions = false;
            this.getUserPermissions($stateParams.id);
            this.accountId = $stateParams.id;
        } else {
            this.isEditingAccount = false;
            this.account = {};
            this.haveUserPermissions = true;
            this.existingUserPermissions = [];
            this.accountId = null;
        }
        this.active= 0;
        this.sectionTemplateUrl = profileForm;
        this.permissions = [];
        this.permissionGroups = ['PROFILE'];
        this.permissionsSets = [];
        this.countries = [];
        this.stations = [];
        this.managePermissions = this.session.getUserPermissionList('ACCOUNTS', 'MANAGE');
        this.existingUserPermissions = [];
        this.permdd = [];
        this.maxPermissionsPerGroup = 0;
        this.fill = [];
        this.errorText = '';
        this.unlinked = true;
        this.updating = false;

        this.saveButtonClicked = false;

            this.havePermissions = false;
            this.haveStations = false;
            this.haveCountries = false;

            if (this.isEditingAccount) {
            this.getPermissions();   
            this.getStations();
            this.getCountries();
            }
    }

    get title() {
        if (this.isEditingAccount && this.account) {
            return `Edit ${this.account.first_name} ${this.account.last_name}'s Account`;
        } else if (this.isEditingAccount) {
            return '';
        } else {
            return 'Create Account';
        }
    }

    get saveButtonText() {
        if (this.isEditingAccount && this.saveButtonClicked) {
            return 'Updating';
        } else if (this.isEditingAccount) {
            return 'Update';
        } else if (this.saveButtonClicked) {
            return 'Creating';
        } else {
            return 'Create';
        }
    }

    get saveButtonStyle() {
        if (this.saveButtonClicked) {
            return 'btn-success';
        } else {
            return 'btn-primary';
        }
    }

    getPermissions() {
            this.UserPermissionsService.getPermissions().then((result) => {
            this.permissions = result.data.results;
            let groupCount = {};
            for (let idx=0; idx < this.permissions.length; idx++) {
                var pg = this.permissions[idx].permission_group;
                if (this.permissionGroups.indexOf(pg) < 0) {
                    this.permissionGroups.push(pg);
                    groupCount[pg] = 1;
                } else {
                    groupCount[pg] += 1;
                }
            }
            for (let key in groupCount) {
                if (groupCount[key] > this.maxPermissionsPerGroup) {
                    this.maxPermissionsPerGroup = groupCount[key];
                }
            }
            this.havePermissions = true;
            this.checkAndGeneratePermissions();
        });
    }

    getUserPermissions(id) {
            this.UserPermissionsService.getUserPermissions(id).then((result) => {
                this.existingUserPermissions = result.data;
                this.haveUserPermissions = true;
                this.checkAndGeneratePermissions();
            });
    }

    getCountries() {
            this.UserPermissionsService.getAllCountries().then((result) => {
                this.countries = result.data.results;
                 this.haveCountries = true;
                this.checkAndGeneratePermissions();
            });
    }

    getStations() {
            this.UserPermissionsService.getBorderStations().then((result) => {
                this.stations = result.data;
                this.haveStations = true;
                this.checkAndGeneratePermissions();
            });
    }

    checkAndGeneratePermissions() {
            if (this.active === 0 || ! (this.haveUserPermissions && this.havePermissions && this.haveCountries && this.haveStations)) {
                return;
            }

            var grp = this.permissionGroups[this.active];
            this.permdd = [];
            this.unlinked = false;

            for (var idx=0; idx < this.permissions.length; idx++) {
                if (this.permissions[idx].permission_group === grp) {
                	if (this.permissions[idx].display_order < 0) {
                		this.unlinked = true;
                	}
                    var userPerm = [];
                    for (var idx1=0; idx1 < this.existingUserPermissions.length; idx1++) {
                        if (this.existingUserPermissions[idx1].permission === this.permissions[idx].id) {
                            userPerm.push(this.existingUserPermissions[idx1]);
                        }
                    }

                    var p = new PermDropDownGroup(this.permissions[idx],
                            this.managePermissions,
                            this.countries,
                            this.stations,
                            userPerm,
                            this.accountId,
                            this,
                            this.permdd.length);
                    this.permdd.push(p);
                }
            }
            
            this.fill = [];
            for (var idx2=0; idx2 < this.maxPermissionsPerGroup - this.permdd.length; idx2++) {
                this.fill.push(idx2);
            }
    }

    captureGropPermssions() {
            if (this.active === 0) {
                return;
            }

            var idx=0;

            var newGroupPerms = [];
            for (idx=0; idx < this.permdd.length; idx++) {
                newGroupPerms = newGroupPerms.concat(this.permdd[idx].getSelectedPermissions());
            }

            // remove the old permissions for the permissions
            for (idx=this.existingUserPermissions.length - 1; idx >=0; idx--) {
                for (var idx1=0; idx1 < this.permdd.length; idx1++) {
                    if (this.existingUserPermissions[idx].permission === this.permdd[idx1].permissionId) {
                        this.existingUserPermissions.splice(idx,1);
                        break;
                    }
                }
            }

            this.existingUserPermissions = this.existingUserPermissions.concat(newGroupPerms);
    }

    retrieveAccount(id) {
        this.AccountService.getAccount(id).then((result) => {
            this.account = result.data;
        }, (error) => {
            if (error.status === 404) {
                this.$state.go('accountNotFound');
            }
        });
    }

    genUrl(grp) {
            if (grp === 'PROFILE') {
                return profileForm;
            } else {
                return permissionForm;
            }
    }

    updateOrCreate() {
        this.captureGropPermssions();
        if (!this.checkRequiredFieldsHaveValue()) {
            return;
        }
        this.saveButtonClicked = true;
        var call;
        if (this.isEditingAccount) {
            call = this.AccountService.update(this.account.id, this.account);
        } else {
            call = this.AccountService.create(this.account);
        }
        
        call.then(() => {
                if (this.isEditingAccount) {
                var newPerms = {
                        permissions: this.existingUserPermissions    
                };
                this.UserPermissionsService.setUserPermissions(this.account.id, newPerms).then(() => {
                this.toastr.success("Account Updated");
                this.saveButtonClicked = false;
                this.$state.go('accounts.list');
                this.session.refreshPermissions();
                }, (err1) => {
                this.saveButtonClicked = false;
                if (err1.data.error_text) {
                    this.errorText = err1.data.error_text;
                    this.toastr.error(err1.data.error_text);
                }
                });
                } else {
                    this.toastr.success("Account Created");
                    this.saveButtonClicked = false;
                    this.$state.go('accounts.list');
                    this.session.refreshPermissions();
                }
        }, (err) => {
            this.saveButtonClicked = false;
            if (err.data.error_text) {
                this.errorText = err.data.error_text;
                this.toastr.error(err.data.error_text);
            }
        });
    }

    checkRequiredFieldsHaveValue() {
        this.resetErrors();
        let areRequiredFieldsFilledIn = true;
        if (!this.account.email) {
            this.emailError = 'An email is required.';
            areRequiredFieldsFilledIn = false;
        }
        return areRequiredFieldsFilledIn;
    }

    resetErrors() {
        this.emailError = '';
    }
    
    stationSelect(label, position) {
    	if (this.unlinked || this.updating) {
    		return;
    	}
    	this.updating = true;
    	for (let idx=position-1; idx >= 0; idx--) {
    		this.permdd[idx].setStation(label);
    	}
    	this.updating = false;
    }
    stationDeselect(label, position) {
    	if (this.unlinked || this.updating) {
    		return;
    	}
    	this.updating = true;
    	for (let idx=position+1; idx < this.permdd.length; idx++) {
    		this.permdd[idx].clearStation(label);
    	}
    	this.updating = false;
    }
    countrySelect(label, position) {
    	if (this.unlinked || this.updating) {
    		return;
    	}
    	this.updating = true;
    	for (let idx=position-1; idx >= 0; idx--) {
    		this.permdd[idx].setCountry(label);
    	}
    	this.updating = false;
    }
    countryDeselect(label, position) {
    	if (this.unlinked || this.updating) {
    		return;
    	}
    	this.updating = true;
    	for (let idx=position+1; idx < this.permdd.length; idx++) {
    		this.permdd[idx].clearCountry(label);
    	}
    	
    	for (let permIdx=this.permdd.length-1; permIdx > position; permIdx--) {
	    	let labels = this.permdd[permIdx].getSelectedStationLabels();
	    	for (let idx=permIdx-1; idx >= 0; idx--) {
	    		for (let labelIdx=0; labelIdx < labels.length; labelIdx++) {
	    			this.permdd[idx].setStation(labels[labelIdx]);
	    		}
	    	}
	    }
    	this.updating = false;
    }
    globalSelect(position) {
    	if (this.unlinked || this.updating) {
    		return;
    	}
    	this.updating = true;
    	for (let idx=position-1; idx >= 0; idx--) {
    		this.permdd[idx].setGlobal();
    	}
    	this.updating = false;
    }
    globalDeselect(position) {
    	if (this.unlinked || this.updating) {
    		return;
    	}
    	this.updating = true;
    	for (let idx=position+1; idx < this.permdd.length; idx++) {
    		this.permdd[idx].clearGlobal();
    	}
    	for (let permIdx=this.permdd.length-1; permIdx > position; permIdx--) {
	    	let labels = this.permdd[permIdx].getSelectedCountryLabels();
	    	for (let idx=permIdx-1; idx >= 0; idx--) {
	    		for (let labelIdx=0; labelIdx < labels.length; labelIdx++) {
	    			this.permdd[idx].setCountry(labels[labelIdx]);
	    		}
	    	}
	    }
    	
    	for (let permIdx=this.permdd.length-1; permIdx > position; permIdx--) {
	    	let labels = this.permdd[permIdx].getSelectedStationLabels();
	    	for (let idx=permIdx-1; idx >= 0; idx--) {
	    		for (let labelIdx=0; labelIdx < labels.length; labelIdx++) {
	    			this.permdd[idx].setStation(labels[labelIdx]);
	    		}
	    	}
	    }
    	this.updating = false;
    }
}
