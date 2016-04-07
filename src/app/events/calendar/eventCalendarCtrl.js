angular
    .module('EventsMod')
    .controller('CalendarCtrl', ['$modal', function($modal) {
        var vm = this;

        vm.eventSources = [
            {
                url: '/api/event/feed/calendar',
            }
        ];

        vm.getToday = function(){
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

        vm.onCalendarEventClicked = function(event) {
            $modal.open({
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

        vm.calendarConfig = {
            header: {
				left: 'prev,next today',
				center: 'title',
				right: 'month,agendaWeek,agendaDay'
			},
            defaultDate: vm.getToday(),
			editable: false,
			eventLimit: true, // allow "more" link when too many events
            eventClick: vm.onCalendarEventClicked,
        }
    }]);