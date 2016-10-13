export default class DashboardEventsController {
    constructor($scope, $uibModal, EventsService) {
        'ngInject';
        this.eventService = EventsService;
        this.modal = $uibModal;

        this.loadEvents();
    }

    loadEvents() {
        this.eventService.getDashboard().then((promise) => {
            this.days = promise.data;
        });
    }

    showEventModal(event) {
        var modalPromise = this.modal.open({
            templateUrl: 'app/events/calendar/eventModal.html',
            controller: 'EventModalController',
            controllerAs: 'modalCtrl',
            bindToController: true,
            resolve: {
                event: function () {
                    return event;
                }
            }
        });

        modalPromise.result.then(() => {
            this.eventService.destroyEvent(event.id).then(() => {
                window.location.reload();
            });
        });
    }
}
