'use strict';

angular
  .module('EventsMod')
  .controller('EditEventCtrl',['Events', '$window', '$scope', function EditEventCtrl(Events,$window,$scope) {
    var vm = this;
    vm.titleError = '';
    vm.startDateError = '';
    vm.startTimeError = '';
    vm.endDateError = '';
    vm.endTimeError = '';
    vm.dateError = '';
    vm.timeError = '';
    vm.noRepetitionError = '';
    vm.endsError = '';
    vm.event = {};

    vm.format = 'yyyy-MM-dd';
    vm.start_date_popup = {
        opened: false
    };
    vm.end_date_popup = {
        opened: false
    };
    vm.end_repeat_popup = {
        opened: false
    };
    vm.start_date_open = function() {
        vm.start_date_popup.opened = true;
    };
    vm.end_date_open = function() {
        vm.end_date_popup.opened = true;
    };
    vm.end_repeat_open = function() {
        vm.end_repeat_popup.opened = true;
    };

    $scope.my_start_time = new Date();
    $scope.my_end_time = new Date();
    vm.display_start_time = 'n/a';
    vm.display_end_time = 'n/a';
    vm.hstep = 1;
    vm.mstep = 1;
    vm.ismeridian = false;

    $scope.$watch('my_start_time', function(newValue, oldValue) {
        vm.display_start_time = moment($scope.my_start_time).format('HH:mm');
        vm.event.start_time = vm.display_start_time;
    });
    $scope.$watch('my_end_time', function(newValue, oldValue) {
        vm.display_end_time = moment($scope.my_end_time).format('HH:mm');
        vm.event.end_time = vm.display_end_time;
    });

    vm.activate = function() {


      if($window.event_id !== undefined && $window.event_id > -1) {
        vm.editing = true;
        var eventId = $window.event_id;
        Events.get({id: eventId}).$promise.then(function(event) {
            vm.event = event;
            $scope.my_start_time = moment(vm.event.start_date +'T'+vm.event.start_time).toDate();
            $scope.my_end_time = moment(vm.event.end_date +'T'+vm.event.end_time).toDate();
        });
      } else {
        vm.editing = false;
        vm.event = {
          title: '',
          location: '',
          start_date: '',
          start_time: '',
          end_date: '',
          end_time: '',
          description: '',
          is_repeat: false,
          repetition: '',
          ends: '',
        }
        $scope.my_start_time = moment('2016-01-01T12:00').toDate();
        $scope.my_end_time = moment('2016-01-01T13:00').toDate();
      }
    }

    vm.update = function() {
        vm.event.start_date = moment(vm.event.start_date).format('YYYY-MM-DD');
        vm.event.end_date = moment(vm.event.end_date).format('YYYY-MM-DD');
        if(vm.event.is_repeat) {
            if(vm.event.ends != '') {
                vm.event.ends = moment(vm.event.ends).format('YYYY-MM-DD');
            } else {
                vm.event.ends = null;
            }
        } else {
            vm.event.repetition = '';
            vm.event.ends = null;
        }
        console.log(vm.event.ends)
      if(!vm.checkFields()) {
        return;
      }
      var call;
      if(vm.editing) {
        call = Events.update(vm.event).$promise;
      }else {
        call = Events.create(vm.event).$promise;
      }
      call.then(function() {
        $window.location.href = '/events/list/';
      }, function(err) {
        if(err.data.title) {
          vm.titleError = err.data.title[0];
          vm.startDateError = err.data.title[1];
          vm.startTimeError = err.data.title[2];
          vm.endDateError = err.data.title[3];
          vm.endTimeError = err.data.title[4];
        }
      });
    }

    vm.checkFields = function() {
      vm.titleError = '';
      vm.startDateError = '';
      vm.startTimeError = '';
      vm.endDateError = '';
      vm.endTimeError = '';
      vm.dateError = '';
      vm.timeError = '';
      vm.noRepetitionError = '';
      vm.endsError = '';
      if(!vm.event.title) {
        vm.titleError = 'Title field is required';
      }
      if(!vm.event.start_date) {
        vm.startDateError = 'Start date field is required';
      }
      if(!vm.event.start_time) {
        vm.startTimeError = 'Start time field is required';
      }
      if(!vm.event.end_date) {
        vm.endDateError = 'End date field is required';
      }
      if(!vm.event.end_time) {
        vm.endTimeError = 'End time field is required';
      }
      if(vm.event.start_date && vm.event.end_date) {
          if(vm.event.start_date > vm.event.end_date) {
              vm.dateError = 'Start date is not allowed to be greater than end date';
          }
          if(vm.event.start_date == vm.event.end_date) {
              if (vm.event.start_time > vm.event.end_time) {
                  vm.timeError = 'Start time must less than end time for same day';
              }
          }
      }
      if(vm.event.end_date && vm.event.ends) {
          if(vm.event.end_date > vm.event.ends) {
              vm.endsError = 'Events repetition ends must be greater than first event end date';
          }
      }
      if(vm.event.is_repeat) {
          if(!vm.event.repetition) {
              vm.noRepetitionError = 'Repetition is required if event is repeated';
          }
      }
      if(vm.titleError || vm.startDateError || vm.startTimeError || vm.endDateError || vm.endTimeError || vm.dateError || vm.timeError || vm.noRepetitionError || vm.endsError) {
        return false;
      }
      return true
    }

    vm.getTitle = function() {
      if(vm.editing) {
        return 'Edit Event';
      }
      return 'Create Event';
    }

    vm.activate();
}]);
