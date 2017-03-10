import deleteModalTemplate from './deleteModal.html';

export default class EventsController {
    constructor(EventsService, $uibModal) {
        "ngInject";
        this.events = [];
        this.Events = EventsService;
        this.getAllEvents();
        this.modal = $uibModal;
    }

    openModal(event) {
        var eventTitle = event.title;
        var deleteModal = this.modal.open({
            templateUrl: deleteModalTemplate,
            controller: 'ModalController',
            controllerAs: 'modalCtrl',
            bindToController: true,
            resolve: {
                eventTitle: function () {
                    return eventTitle;
                }
            }
        });
        deleteModal.result.then(() => {
            this.Events.destroyEvent(event.id).then(() => {
                this.getAllEvents();
            });
        });
    }

    getAllEvents() {
        this.Events.getAll().then((events) => {
            for (var i = 0; i < events.data.length; i++) {
                if (events.data[i].repetition === "D") {
                    events.data[i].get_repetition_display = "Daily";
                } else if (events.data[i].repetition === "W") {
                    events.data[i].get_repetition_display = "Weekly";
                } else if (events.data[i].repetition === "M") {
                    events.data[i].get_repetition_display = "Monthly";
                }
            }
            this.events = events.data;
        });
    }
}
