export default function routerConfig ($stateProvider) {
  'ngInject';

  $stateProvider
    .state('events', {
      url: '/events',
      templateUrl: 'app/events/calendar/event_calendar.html',
      controller: 'EventCalendarController',
      controllerAs: 'calendarCtrl',
      data: {
        requireLogin: true
      }
    })
    .state('eventsList', {
      url: '/events/list',
      templateUrl: 'app/events/list/event_list.html',
      controller: 'EventsController',
      controllerAs: 'eventsCtrl',

      data: {
        requireLogin: true
      }
    })
    .state('eventsForm', {
      url: '/events/create',
      templateUrl: 'app/events/form/event_form.html',
      controller: 'EditEventController',
      controllerAs: 'editCtrl',
      data: {
        requireLogin: true
      }
    });
}
