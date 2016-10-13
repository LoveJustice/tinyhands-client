export default class NavbarController {
    constructor($scope, constants, BorderStationService, SessionService) {
        'ngInject';

        this.borderStationService = BorderStationService;
        this.session = SessionService;
        this.constants = constants;

        this.borderStations = [];
        this.nepalTime = window.moment.tz("Asia/Kathmandu").format("MMMM Do YYYY, h:mm:ssA");


        $scope.$on('GetNavBarBorderStations', () => {
            this.getBorderStations();
        });
    }

    getBorderStations() {
        if (this.session.user.permission_border_stations_view) {
            this.borderStationService.getBorderStations().then((response) => {
                this.borderStations = response.data;
            });
        }
    }

    logout() {
        this.session.logout();
    }
}
