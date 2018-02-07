import constants from './../constants.js';

export default class DetailController {
    constructor($scope, BorderStationService, moment, UtilService, SessionService) {
        'ngInject';

        this.$scope = $scope;
        this.service = BorderStationService;
        this.moment = moment;
        this.utils = UtilService;
        this.session = SessionService;

        this.details = {};
        this.countryOptions = this.getAllCountries();

        if (this.service.borderStationId) {
            this.getDetails();
        }
        this.createListeners();
    }


    changeStationStatus() {
        this.details.open = !this.details.open;
    }

    create() {
        this.modifyDetails().then((response) => {
            this.details = response.data;
            this.service.borderStationId = this.details.id;
            this.$scope.$emit(constants.Events.Create.BorderStation.Done);
        }, (error) => {
            this.service.errors = this.utils.handleErrors(error);
            this.$scope.$emit(constants.Events.Create.BorderStation.Error);
        });
    }


    createListeners() {
        this.$scope.$on(constants.Events.Create.BorderStation.Start, () => { // POST listener
            this.create();
        });
        this.$scope.$on(constants.Events.Get.BorderStation, () => { // GET listener
            this.getDetails();
        });
        this.$scope.$on(constants.Events.Update.BorderStation, () => { // PUT listener
            this.update();
        });
    }


    // Date Formatting
    formatDate(dateToFormat) { // Formats date string to YYYY[-MM[-DD]]
        return dateToFormat ? this.moment(dateToFormat).format('YYYY-MM-DD') : this.moment().format('YYYY-MM-DD');
    }


    // GET Calls
    getDetails() {
        this.service.getDetails().then((response) => {
            this.details = response.data;
            let operating_country_id = response.data.operating_country;
            if(operating_country_id) {
              this.setOperatingCountry(operating_country_id);
            }
        });
    }


    // UPDATE calls
    update() {
        this.modifyDetails().then(() => {
            this.$scope.$emit(constants.Events.Update.Detail.Done);
        }, () => {
            this.$scope.$emit(constants.Events.Update.Detail.Error);
        });
    }

    modifyDetails() {
        this.details.date_established = this.formatDate(this.details.date_established);

        if (this.service.borderStationId) {
            return this.service.updateRelationship([this.details], 'updateDetails');
        }
        return this.service.createBorderStation(this.details);
    }

    getAllCountries() {
      this.service.getAllCountries().then((response) => {
          if (this.service.borderStationId) {
              this.countryOptions = response.data.results;
          } else{
              var tmpCountry = response.data.results;
              this.countryOptions = [];
              for (var idx=0; idx < tmpCountry.length; idx++) {
                  if (this.session.checkPermission('STATIONS','ADD',tmpCountry[idx].id, null)) {
                      this.countryOptions.push(tmpCountry[idx]);
                  }
              }
          }
      });
    }

    setOperatingCountry(countryId) {
      this.service.getCountry(countryId).then((response) => {
        let country = response.data;
        this.operating_country = {id: country.id, name: country.name};
      });
    }
}
