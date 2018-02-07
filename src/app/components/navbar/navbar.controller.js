export default class NavbarController {
    constructor($scope, $state, constants, BorderStationService, SessionService) {
        'ngInject';

        this.borderStationService = BorderStationService;
        this.session = SessionService;
        this.constants = constants;

        this.borderStations = [];
        this.nepalTime = window.moment.tz("Asia/Kathmandu").format("MMMM Do YYYY, h:mm:ssA");
        this.state = $state;

        $scope.$on('GetNavBarBorderStations', () => {
            this.getBorderStations();
        });
    }

    getBorderStations() {
        if (this.session.checkPermission('STATIONS','VIEW',null, null)) {
            this.borderStationService.getUserStations(this.session.user.id, 'STATIONS', 'VIEW').then((response) => {
                this.borderStations = response.data;
            });
        }
    }

    logout() {
        this.session.logout();
    }
}