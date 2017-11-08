import uiBootstrap from 'angular-ui-bootstrap';
import 'fullcalendar';
import 'angular-ui-calendar';
import sharedModule from '../shared/shared.module';

import EventsRoutes from './events.route';

import EventCalendarController from './calendar/eventCalendar.controller';
import EventModalController from './calendar/eventModal.controller';
import EditEventController from './form/editEvent.controller';
import EventsController from './list/events.controller';
import ModalController from './list/modal.controller';

import EventsService from './events.service';


export default angular.module('tinyhands.Events', [uiBootstrap, 'ui.calendar', sharedModule])
    .config(EventsRoutes)

    .controller('EventCalendarController', EventCalendarController)
    .controller('EventModalController', EventModalController)
    .controller('EditEventController', EditEventController)
    .controller('EventsController', EventsController)
    .controller('ModalController', ModalController)

    .service('EventsService', EventsService)
    .name;
