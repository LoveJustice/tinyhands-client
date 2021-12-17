import _ from 'lodash';

export default class NavbarController {
    constructor($scope, $state, constants, BorderStationService, SessionService) {
        'ngInject';

        this.borderStationService = BorderStationService;
        this.session = SessionService;
        this.constants = constants;

        this.borderStationMap = {};
        this.countryNames = [];

       
        this.state = $state;

        $scope.$on('GetNavBarBorderStations', () => {
            this.getBorderStations();
        });
    }

    getBorderStations() {
        this.borderStationService.getUserStations(this.session.user.id, 'PROJECTS', 'VIEW').then(response => {
            this.borderStationMap = _.groupBy(response.data, bs => bs.country_name);
            this.countryNames = Object.keys(this.borderStationMap).sort();
            let categoryMap = _.groupBy(response.data, bs => bs.project_category_name);
            this.categoryNames = Object.keys(categoryMap).sort();
            this.countryCategoryMap = _.groupBy(response.data, bs => bs.country_name + ':' + bs.project_category_name);
            this.collapse = {};
            for (let key in Object.keys(this.countryCategoryMap)) {
                this.collapse[key] = false;
            }
        });
    }

    logout() {
        this.session.logout();
    }
}
