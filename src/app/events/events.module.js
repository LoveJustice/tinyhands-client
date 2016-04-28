import EventsRoutes from './events.route';

import EventCalendarController from './calendar/eventCalendar.controller';
import EventModalController from './calendar/eventModal.controller';
import EditEventController from './form/editEvent.controller';
import EventsController from './list/events.controller';
import ModalController from './list/modal.controller';

import EventsService from './events.service'

import timepicker from '../../../bower_components/ngTimepicker/src/js/ngTimepicker.js';

export default angular.module('tinyhands.Events', ['ui.router', 'ui.bootstrap', 'ui.calendar', 'tinyhands.Shared','jkuri.timepicker'])
    .config(EventsRoutes)

    .controller('EventCalendarController', EventCalendarController)
    .controller('EventModalController', EventModalController)
    .controller('EditEventController', EditEventController)
    .controller('EventsController', EventsController)
    .controller('ModalController', ModalController)

    .service('EventsService', EventsService);
