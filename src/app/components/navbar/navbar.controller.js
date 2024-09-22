import _ from 'lodash';

export default class NavbarController {
    constructor($scope, $state, constants, BorderStationService, SessionService, BaseUrlService) {
        'ngInject';

        this.borderStationService = BorderStationService;
        this.session = SessionService;
        this.constants = constants;

        this.borderStationMap = {};
        this.countryNames = [];

        this.getReactUrl = function(path) {
           return BaseUrlService.getReactUrl(path);
        };

        this.state = $state;

        $scope.$on('GetNavBarBorderStations', () => {
            this.getBorderStations();
        });

        // Function to track button clicks with Google Analytics
        this.trackButtonClick = (buttonName) => {
            gtag('event', 'button_click', {
                'event_category': 'Button Clicks',
                'event_action': 'click',
                'event_label': buttonName,
                'user_id': this.session.user.id,
                'user_role': this.session.user.role,
                'user_country': this.session.user.country_name
            });
        };
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
    
    showForms() {
    	 return (
    	 		this.session.checkPermission('IRF','VIEW',null, null) || 
    	 		this.session.checkPermission('VDF','VIEW',null, null) ||
    	 		this.session.checkPermission('PVF','VIEW',null, null) ||
    	 		this.session.checkPermission('SF','VIEW',null, null) ||
    	 		this.session.checkPermission('LF','VIEW',null, null) ||
    	 		this.session.checkPermission('MONTHLY_REPORT','VIEW',null, null) ||
    	 		this.session.checkPermission('BUDGETS','VIEW',null, null) ||
    	 		this.session.checkPermission('EMP','VIEW',null, null) ||
    	 		this.session.checkPermission('GSP','VIEW',null, null) ||
    	 		this.session.checkPermission('PROJECT_REQUEST','VIEW',null, null));
    	 		
    }

    logout() {
        this.session.logout();
    }
}
