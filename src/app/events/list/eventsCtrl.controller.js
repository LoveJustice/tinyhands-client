export default class EventsController {
  constructor(Events, $modal) {
    "ngInject"
    this.events = [];
    Events.all().$promise.then(function(events) {
      for (var i = 0; i < events.length; i++) {
          if (events[i].repetition == "D") {
              events[i].get_repetition_display = "Daily";
          } else if (events[i].repetition == "W") {
              events[i].get_repetition_display = "Weekly";
          } else if (events[i].repetition == "M") {
              events[i].get_repetition_display = "Monthly";
          }
      }
      this.events = events;
    })
  }

    openModal(event) {
      var eventTitle = event.title;
      var deleteModal = $modal.open({
        templateUrl: 'modal.html',
        controller: 'ModalCtrl',
        controllerAs: 'modalCtrl',
        resolve: {
          eventTitle: function() {
            return eventTitle;
          }
        }
      });
      deleteModal.result.then( function() {
        Events.destroy({id: event.id}).$promise.then( function() {
          this.events = Events.all()
        })
      })
    }
  }
