export default class AccountDefaultsController {
  constructor($q, $scope, $state, $uibModal, AccountService, PermissionsSetsService) {
    'ngInject';

    console.log("Accounts Defaults controller activated");

    this.$q = $q;
    this.$scope = $scope;
    this.$state = $state;
    this.permissionsSets = [];
    this.AccountService = AccountService;
    this.PermissionsSetsService = PermissionsSetsService;
    this.$uibModal = $uibModal;

    this.createListener();
    this.activate();
  }

  createListener() {
    this.$scope.$on('$stateChangeStart', (e, toState, toParams, fromState, fromParams) => {
      var unsavedChanges = false;

      this.permissionsSets.forEach( function (elm, idx) {
        if (elm.is_new || elm.is_modified) {
          unsavedChanges = true;
        }
      });

      if(unsavedChanges) {
        e.preventDefault();
        this.openModal(toState.name);
        unsavedChanges = false;
      }
    });
  }

  activate() {
    this.PermissionsSetsService.getPermissions().then((result) => {
      this.permissionsSets = result.data.results;
    });
  }

  delete(permissionsSetIndex) {
    var pSet = this.permissionsSets[permissionsSetIndex];
    if (pSet.is_used_by_accounts) return;
    if (pSet.is_new) {
        //local delete
        this.permissionsSets.splice(permissionsSetIndex, 1);
    } else {
        //database delete
        this.PermissionsSetsService.destroy(pSet.id).then(() => {
        this.permissionsSets.splice(permissionsSetIndex, 1);

      });
    }
  }

  addAnother() {
    this.permissionsSets.push({
      is_new: true,
      is_used_by_accounts: false,
      name: "",
      permission_accounts_manage: false,
      permission_border_stations_add: false,
      permission_border_stations_delete: false,
      permission_border_stations_edit: false,
      permission_border_stations_view: false,
      permission_budget_manage: false,
      permission_irf_add: false,
      permission_irf_delete: false,
      permission_irf_edit: false,
      permission_irf_view: false,
      permission_receive_email: false,
      permission_vdc_manage: false,
      permission_vif_add: false,
      permission_vif_delete: false,
      permission_vif_edit: false,
      permission_vif_view: false
    });
  }

  saveAll() {
    return this.$q((resolve) => {
      var promises = [];
      this.permissionsSets.forEach((elm,index) => {
        var promise = this.saveSet(index);
        promises.push(promise);
      });
      //Waiting for all permissions
      this.$q.all(promises).then(() => {
        resolve();
      });
    });

  }

  saveSet(index) {
      return this.$q((resolve, reject) => {
        var call = null;
        var pSet = this.permissionsSets[index];
        if (pSet.is_new) {
            call = this.PermissionsSetsService.create(pSet);
        } else if (pSet.is_modified) {
            call = this.PermissionsSetsService.update(pSet.id, pSet);
        } else {
            resolve();
            return;
        }
        call.then( (data) => {
            this.permissionsSets[index] = data.data;
            resolve();
        }, (error) => { // catch name error
            pSet.nameError = true;
            reject();
        });
      });
  }

  toggleModified(index) {
    var pSet = this.permissionsSets[index];
    pSet.is_modified = true;
  }

  openModal(toStateName) {
    var saveAndContinue = this.$uibModal.open({
      templateUrl:'app/account/components/defaults/unsavedChangesModal.html',
      controller: 'UnsavedChangesModalController',
      controllerAs: 'UnsavedChangesModalCtrl'
    });
    saveAndContinue.result.then(() => {
      var promise = this.saveAll();
      //Beginning chain of promises
      promise.then(() => {
        this.$state.go(toStateName);
      });
    });
  }

}
