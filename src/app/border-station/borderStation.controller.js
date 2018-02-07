import constants from './constants.js';

export default class BorderStationController {
    constructor($scope, $state, $stateParams, $timeout, BorderStationService, SessionService, toastr) {
        'ngInject';
        this.$scope = $scope;
        this.$state = $state;
        this.$stateParams = $stateParams;
        this.$timeout = $timeout;
        this.service = BorderStationService;
        this.session = SessionService;
        this.toastr = toastr;
        this.isViewing = false;

        BorderStationService.borderStationId = $stateParams.id;
        this.loading = false;
        this.modifyDetailDone = false;
        this.updateLocationDone = false;
        this.updatePeopleDone = false;
        this.updateStatusText = $stateParams.id ? constants.UpdateButtonText.Default : constants.UpdateButtonText.Create;

        SessionService.me().then((response) => {
            this.authorize(response, this.$stateParams.id, this.$stateParams.countryId);
        }).then(() => {
            this.createListeners();
        });
    }

    authorize(user, id, countryId) {
        if (this.session.checkPermission('STATIONS','ADD',null, null) === false && id === "") { 
           
            this.$state.go("dashboard");
            this.toastr.error("You do not have permission to create a border station");
        }
        if (id !== "" && this.session.checkPermission('STATIONS','EDIT',parseInt(countryId, 10), parseInt(id, 10)) === false) {
            this.isViewing = true;
        }
    }

    checkDone() {
        if (this.modifyDetailDone && this.updateLocationDone && this.updatePeopleDone) {
            this.updateStatusText = constants.UpdateButtonText.Saved;
            this.$timeout(() => {
                this.updateStatusText = constants.UpdateButtonText.Default;
                this.$state.go('dashboard');
            }, 1000);
        }
    }

	/*  Create Listeners to signal an update/create for the borderstation.
	 *  It only broadcasts to 'child' controllers (detail, location, person) and visa versa.
	 */
    createListeners() {
        this.createModifyDoneListeners();
        this.createUpdateErrorListeners();
    }

    createModifyDoneListeners() {
        let listenerData = [
            {
                name: constants.Events.Create.BorderStation.Done,
                status: 'modifyDetailDone'
            },
            {
                name: constants.Events.Update.Detail.Done,
                status: 'modifyDetailDone'
            },
            {
                name: constants.Events.Update.Location.Done,
                status: 'updateLocationDone'
            },
            {
                name: constants.Events.Update.People.Done,
                status: 'updatePeopleDone'
            },
        ];
        angular.forEach(listenerData, (listener) => {
            this.$scope.$on(listener.name, () => {
                this[listener.status] = true;
                this.checkDone();
            });
        });
    }

    createUpdateErrorListeners() {
        let listenerData = [constants.Events.Create.BorderStation.Error, constants.Events.Update.Detail.Error, constants.Events.Update.Location.Error, constants.Events.Update.People.Error];

        angular.forEach(listenerData, (listener) => {
            this.$scope.$on(listener, () => {
                this.updateStatusText = constants.UpdateButtonText.Error;
                this.errors = this.service.errors;
            });
        });
    }


    getBorderStationData() {
        this.loading = true;

        this.$scope.$broadcast(constants.Events.Get.BorderStation);
    }


    updateStation() {
        this.updateStatusText = constants.UpdateButtonText.Saving;

        if (this.service.borderStationId) {
            this.$scope.$broadcast(constants.Events.Update.BorderStation);
        } else {
            this.$scope.$broadcast(constants.Events.Create.BorderStation.Start);
        }
    }
}