import calendarTemplate from './calendar/eventCalendar.html?url';
import './calendar/eventCalendar.less';
import './calendar/eventModal.less';
import eventsListTemplate from './list/event_list.html?url';
import './list/eventList.less';
import eventTemplate from './form/event_form.html?url';
import './form/eventFrom.less';

export default function routerConfig($stateProvider) {
    'ngInject';

    $stateProvider
        .state('events', {
            url: '/events',
            templateUrl: calendarTemplate,
            controller: 'EventCalendarController',
            controllerAs: 'calendarCtrl',
        })
        .state('eventsList', {
            url: '/events/list',
            templateUrl: eventsListTemplate,
            controller: 'EventsController',
            controllerAs: 'eventsCtrl',
        })
        .state('eventsCreate', {
            url: '/events/create',
            templateUrl: eventTemplate,
            controller: 'EditEventController',
            controllerAs: 'editCtrl',
        })
        .state('eventsEdit', {
            url: '/events/update/:id',
            templateUrl: eventTemplate,
            controller: 'EditEventController',
            controllerAs: 'editCtrl',
        });
}
