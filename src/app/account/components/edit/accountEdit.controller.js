import profileForm from './components/profileForm.html';
import permissionForm from './components/permissionForm.html';

class PermDropDown {
    constructor(validOptions, currentOptions, settings, customText, eventListener) {
        this.allOptions = validOptions.slice();
        this.options = this.allOptions.slice();
        this.selectedOptions = currentOptions.slice();
        this.settings = settings;
        this.customText = customText;
        this.settings = settings;
        this.eventListener = eventListener;
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

    isSelected() {
        return this.selectedOptions.length > 0;
    }
}

class PermDropDownGroup {
    constructor(permission, managePermission, allCountries, allStations, currentPermissions, accountId) {
        this.permissionId = permission.id;
        this.permissionName = permission.action;
        this.minLevel = permission.min_level;
        this.accountId = accountId;

        var idx = 0;
        var idx1 = 0;
        var idx2 = 0;
        var toDisable = false;

        this.stationValidOptions = [];
        for (idx=0; idx < allStations.length; idx++) {
            for (idx1=0; idx1 < allCountries.length; idx1++) {
                if (allStations[idx].operating_country === allCountries[idx1].id) {
                    toDisable = true;
                    for (idx2=0; idx2 < managePermission.length; idx2++) {
                        if ((managePermission[idx2].country === null && managePermission[idx2].station === null) ||
                                (managePermission[idx2].country === allCountries[idx1].id) ||
                                (managePermission[idx2].station === allStations[idx].id)) {
                            toDisable = false;
                            break;
                        }
                    }
                    this.stationValidOptions.push({
                        id: allStations[idx].id,
                        label: allStations[idx].station_name,
                        country: allCountries[idx1].name,
                        disabled: toDisable});
                    break;
                }
            }
        }
        this.stationSettings = {smartButtonMaxItems:1, showCheckAll: false, groupByTextProvider: function(groupValue) { return groupValue; }, groupBy: 'country', scrollableHeight: '250px', scrollable: true, };
        this.stationCustomTexts = {buttonDefaultText: 'None'};
        this.stationEventListeners = {};

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
        for (idx=0; idx < allCountries.length; idx++) {
                toDisable = true;
            for (idx2=0; idx2 < managePermission.length; idx2++) {
                if ((managePermission[idx2].country === null && managePermission[idx2].station === null) ||
                        (managePermission[idx2].country === allCountries[idx].id)) {
                    toDisable = false;
                    break;
                }
            }
            this.countryValidOptions.push({id: allCountries[idx].id, label: allCountries[idx].name, disabled: toDisable });
        }
        this.countrySettings = {smartButtonMaxItems:1, showCheckAll: false,};
        this.countryCustomTexts = {buttonDefaultText: 'None'};
        this.countryEventListeners = {
                onItemSelect: this.countrySelect,
                onItemDeselect: this.countryDeselect,
                onSelectAll: this.countrySelectAll,
                onDeselectAll: this.countryDeselectAll,
                stationDropDown: this.stationDropDown,
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

    globalSelect() {
        this.countryDropDown.removeAllOptions();
        this.stationDropDown.removeAllOptions();
    }

    globalDeselect() {
        this.countryDropDown.restoreAllOptions();
        this.stationDropDown.restoreAllOptions();
    }

    countrySelect(property) {
        this.stationDropDown.removeGroupOptions(property.label);
    }
    countryDeselect(property) {
        this.stationDropDown.restoreGroupOptions(property.label);
    }
    countrySelectAll() {
        this.stationDropDown.removeAllOptions();
    }
    countryDeselectAll() {
        this.stationDropDown.restoreAllOptions();
    }

    getSelectedPermissions() {
        var selectedPermissions = [];
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
    constructor($state, $stateParams, AccountService, SessionService, PermissionsSetsService, UserPermissionsService, toastr) {
        'ngInject';
        this.$state = $state;
        this.AccountService = AccountService;
        this.session = SessionService;
        this.PermissionsSetsService = PermissionsSetsService;
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
        this.managePermissions = [];
        this.existingUserPermissions = [];
        this.permdd = [];

        this.saveButtonClicked = false;

            this.havePermissions = false;
            this.haveManagementPermissions = false;
            this.haveStations = false;
            this.haveCountries = false;

            if (this.isEditingAccount) {
            this.getPermissions();   
            this.getStations();
            this.getCountries();
            }
            this.getPermissionsSets();
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
            for (var idx=0; idx < this.permissions.length; idx++) {
                var pg = this.permissions[idx].permission_group;
                if (this.permissionGroups.indexOf(pg) < 0) {
                    this.permissionGroups.push(pg);
                }
                if (this.permissions[idx].permission_group === 'ACCOUNTS' && this.permissions[idx].action === 'MANAGE') {
                    this.getManagementPermissions(this.permissions[idx].id);
                }
            }
            this.havePermissions = true;
            this.checkAndGeneratePermissions();
        });
    }

    getManagementPermissions(permId) {
            this.UserPermissionsService.getUserPermissions(this.session.user.id).then((result) => {
            var tmpPerm = result.data;
            this.managePermissions = [];
            for (var idx=0; idx < tmpPerm.length; idx++) {
                if (tmpPerm[idx].permission === permId) {
                    this.managePermissions.push(tmpPerm[idx]);
                }
            }
            this.haveManagementPermissions = true;
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

    getPermissionsSets() {
        this.PermissionsSetsService.getPermissions().then((result) => {
            this.permissionsSets = result.data.results;
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
            if (this.active === 0 || ! (this.haveUserPermissions && this.havePermissions && this.haveCountries && this.haveStations &&     this.haveManagementPermissions)) {
                return;
            }

            var grp = this.permissionGroups[this.active];
            this.permdd = [];

            for (var idx=0; idx < this.permissions.length; idx++) {
                if (this.permissions[idx].permission_group === grp) {
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
                            this.accountId);
                    this.permdd.push(p);
                }
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

    onUserDesignationChanged(permissionSetId) {
        if (permissionSetId) {
            this.PermissionsSetsService.getPermission(permissionSetId).then((permissionsSets) => {
                this.applyDesignationToAccount(this.account, permissionsSets.data);
            });
        }
    }

    applyDesignationToAccount(account, designation) {
        var designationKeys = Object.keys(designation);
        designationKeys.forEach((attribute) => {
            if (attribute.substring(0, 10) === "permission") {
                account[attribute] = designation[attribute];
            }
        });
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
                this.UserPermissionsService.setUserPermissions(this.account.id, newPerms).then((result1) => {
                this.toastr.success("Account Updated");
                this.saveButtonClicked = false;
                this.$state.go('accounts.list');
                }, (err1) => {
                this.saveButtonClicked = false;
                if (err1.data.email) {
                    this.emailError = err1.data.email[0];
                }
                });
                } else {
                    this.toastr.success("Account Created");
                    this.saveButtonClicked = false;
                    this.$state.go('accounts.list');
                }
        }, (err) => {
            this.saveButtonClicked = false;
            if (err.data.email) {
                this.emailError = err.data.email[0];
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
        if (!this.account.user_designation) {
            this.userDesignationError = 'A user designation is required.';
            areRequiredFieldsFilledIn = false;
        }
        return areRequiredFieldsFilledIn;
    }

    resetErrors() {
        this.emailError = '';
        this.userDesignationError = '';
    }
}
