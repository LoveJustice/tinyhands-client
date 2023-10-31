import DashboardEventsController from './dashboardEvents.controller';
import dashboardEventsTemplate from './events.html?url';
import './events.less';

export default function DashboardEventsDirective() {
    'ngInject';

    let directive = {
        restrict: 'E',
        templateUrl: dashboardEventsTemplate,
        controller: DashboardEventsController,
        controllerAs: 'dasheventsCtrl'
    };

    return directive;
}
