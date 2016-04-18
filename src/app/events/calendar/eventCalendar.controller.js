export default class EventCalendarController {
    constructor($uibModal, EventsService) {
        'ngInject';
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

        this.calendarConfig = {
            header: {
				left: 'prev,next today',
				center: 'title',
				right: 'month,agendaWeek,agendaDay'
			},
            defaultDate: this.getToday(),
			editable: false,
			eventLimit: true, // allow "more" link when too many events
            eventClick: this.onCalendarEventClicked,
        }
    }

    // functions
    getToday () {
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1; //January is 0!
        var yyyy = today.getFullYear();
        if(dd<10) {
            dd='0'+dd
        }
        if(mm<10) {
            mm='0'+mm
        }
        today = yyyy+'-'+mm+'-'+dd;
        return today;
    }

    onCalendarEventClicked (event) {
        $uibModal.open({
            templateUrl: 'modal.html',
            controller: 'EventModalCtrl',
            controllerAs: 'modalCtrl',
            bindToController: true,
            resolve: {
                event: function () {
                    return event;
                }
            }
        })
    }
}
