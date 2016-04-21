export default class EventsController {
  constructor(EventsService, $uibModal) {
    "ngInject"
    this.events = [];
    this.Events = EventsService;
    this.Events.getAll().then((events) => {
      for (var i = 0; i < events.length; i++) {
          if (events[i].repetition == "D") {
              events[i].get_repetition_display = "Daily";
          } else if (events[i].repetition == "W") {
              events[i].get_repetition_display = "Weekly";
          } else if (events[i].repetition == "M") {
              events[i].get_repetition_display = "Monthly";
          }
      }
      this.events = events.data;
    })
    this.modal = $uibModal;
  }

  openModal(event) {
    var eventTitle = event.title;
    var deleteModal = this.modal.open({
      templateUrl: 'app/events/list/deleteModal.html',
      controller: 'ModalController',
      controllerAs: 'modalCtrl',
      bindToController: true,
      resolve: {
        eventTitle: function() {
          return eventTitle;
        }
      }
    });
    deleteModal.result.then( () => {
      this.Events.destroy({id: event.id}).then( () => {
        this.events = Events.all()
      })
    })
  }
}
