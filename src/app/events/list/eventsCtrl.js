angular
  .module('EventsMod')
  .controller('EventsCtrl', ['Events', '$modal', function(Events, $modal) {
    var vm = this;
    vm.events = [];

    vm.activate = function () {
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
      vm.events = events;
  })
    }

    vm.openModal = function(event) {
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
          vm.events = Events.all()
        })
      })
  }

    vm.activate();
  }]);
