export default function routerConfig ($stateProvider, RequireLogin) {
  'ngInject';

  $stateProvider
    .state('events', {
      url: '/events',
      templateUrl: 'app/events/calendar/eventCalendar.html',
      controller: 'EventCalendarController',
      controllerAs: 'calendarCtrl',
      resolve: {
        requireLogin: RequireLogin
      }
    })
    .state('eventsList', {
      url: '/events/list',
      templateUrl: 'app/events/list/event_list.html',
      controller: 'EventsController',
      controllerAs: 'eventsCtrl',
      resolve: {
        requireLogin: RequireLogin
      }
    })
    .state('eventsCreate', {
      url: '/events/create',
      templateUrl: 'app/events/form/event_form.html',
      controller: 'EditEventController',
      controllerAs: 'editCtrl',
      resolve: {
        requireLogin: RequireLogin
      }
    })
    .state('eventsEdit', {
      url: '/events/update/:id',
      templateUrl: 'app/events/form/event_form.html',
      controller: 'EditEventController',
      controllerAs: 'editCtrl',
      resolve: {
        requireLogin: RequireLogin
      }
    });
}
