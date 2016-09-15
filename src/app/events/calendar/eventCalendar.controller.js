export default class EventCalendarController {
    constructor($uibModal, uiCalendarConfig, EventsService) {
        'ngInject';
        this.modal = $uibModal;
        this.uiCalendarConfig = uiCalendarConfig;
        this.EventsService = EventsService;
    
        this.eventSources = [
            {
                events: (start, end, timezone, callback) => {
                    let formattedStart = start.format('YYYY-MM-DD');
                    let formattedEnd = end.format('YYYY-MM-DD');
                    EventsService.getCalendar(formattedStart, formattedEnd).then((results) => {
                        callback(results.data);
                    });
                }
            }
        ];
    }

    get calendarConfig() {
        return {
            header: {
				left: 'prev,next today',
				center: 'title',
				right: 'month,agendaWeek,agendaDay'
			},
			editable: false,
			eventLimit: true,
            eventClick: (event) => {
                this.onCalendarEventClicked(event);
            },
        };
    }

    onCalendarEventClicked(event) {
        let modalPromise = this.modal.open({
            templateUrl: 'app/events/calendar/eventModal.html',
            controller: 'EventModalController',
            controllerAs: 'modalCtrl',
            bindToController: true,
            resolve: {
                event: () => {
                    return event;
                }
            }
        });

        modalPromise.result.then(() => {
            this.EventsService.destroyEvent(event.id).then(() => {
                this.uiCalendarConfig.calendars.eventCalendar.fullCalendar('removeEvents', event.id);
            });
        });
    }
}
