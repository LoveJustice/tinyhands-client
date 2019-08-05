import _ from 'lodash';

export default class NavbarController {
    constructor($scope, $state, constants, BorderStationService, SessionService) {
        'ngInject';

        this.borderStationService = BorderStationService;
        this.session = SessionService;
        this.constants = constants;

        this.borderStationMap = {};
        this.countryNames = [];

        this.nepalTime = window.moment.tz('Asia/Kathmandu').format('MMMM Do YYYY, h:mm:ssA');
        this.state = $state;

        $scope.$on('GetNavBarBorderStations', () => {
            this.getBorderStations();
        });
    }

    getBorderStations() {
        this.borderStationService.getUserStations(this.session.user.id, 'STATIONS', 'VIEW').then(response => {
            this.borderStationMap = _.groupBy(response.data, bs => bs.country_name);
            this.countryNames = Object.keys(this.borderStationMap).sort();
        });
    }

    logout() {
        this.session.logout();
    }
}
