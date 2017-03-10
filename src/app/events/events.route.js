import calendarTemplate from './calendar/eventCalendar.html';
import './calendar/eventCalendar.less';
import './calendar/eventModal.less';
import eventsListTemplate from './list/event_list.html';
import './list/eventList.less';
import eventTemplate from './form/event_form.html';
import './form/eventFrom.less';

export default function routerConfig($stateProvider, RequireLogin) {
    'ngInject';

    $stateProvider
        .state('events', {
            url: '/events',
            templateUrl: calendarTemplate,
            controller: 'EventCalendarController',
            controllerAs: 'calendarCtrl',
            resolve: {
                requireLogin: RequireLogin
            }
        })
        .state('eventsList', {
            url: '/events/list',
            templateUrl: eventsListTemplate,
            controller: 'EventsController',
            controllerAs: 'eventsCtrl',
            resolve: {
                requireLogin: RequireLogin
            }
        })
        .state('eventsCreate', {
            url: '/events/create',
            templateUrl: eventTemplate,
            controller: 'EditEventController',
            controllerAs: 'editCtrl',
            resolve: {
                requireLogin: RequireLogin
            }
        })
        .state('eventsEdit', {
            url: '/events/update/:id',
            templateUrl: eventTemplate,
            controller: 'EditEventController',
            controllerAs: 'editCtrl',
            resolve: {
                requireLogin: RequireLogin
            }
        });
}
