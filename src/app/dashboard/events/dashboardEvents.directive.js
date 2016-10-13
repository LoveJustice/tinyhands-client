import DashboardEventsController from './dashboardEvents.controller';

export default function DashboardEventsDirective() {
    'ngInject';

    let directive = {
        restrict: 'E',
        templateUrl: 'app/dashboard/events/events.html',
        controller: DashboardEventsController,
        controllerAs: 'dasheventsCtrl'
    };

    return directive;
}
