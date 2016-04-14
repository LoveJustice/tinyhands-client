export default class EditEventCtrl {
    constructor($scope, $window, Events) {
        'ngInject';

        //variable declarations
        this.titleError = '';
        this.startDateError = '';
        this.startTimeError = '';
        this.endDateError = '';
        this.endTimeError = '';
        this.dateError = '';
        this.timeError = '';
        this.noRepetitionError = '';
        this.endsError = '';
        this.event = {};
        this.format = 'yyyy-MM-dd';
        this.startDatePopup = {
            opened: false
        };
        this.endDatePopup = {
            opened: false
        };
        this.endRepeatPopup = {
            opened: false
        };
        $scope.myStartTime = new Date();
        $scope.myEndTime = new Date();
        this.displayStartTime = 'n/a';
        this.displayEndTime = 'n/a';
        this.hstep = 1;
        this.mstep = 1;
        this.ismeridian = false;

        $scope.$watch('myStartTime', function(newValue, oldValue) {
            this.displayStartTime = moment($scope.myStartTime).format('HH:mm');
            this.event.start_time = this.displayStartTime;
        });
        $scope.$watch('myEndTime', function(newValue, oldValue) {
            this.displayEndTime = moment($scope.myEndTime).format('HH:mm');
            this.event.end_time = this.displayEndTime;
        });

        if($window.event_id !== undefined && $window.event_id > -1) {
          this.editing = true;
          var eventId = $window.event_id;
          Events.get({id: eventId}).$promise.then(function(event) {
              this.event = event;
              $scope.myStartTime = moment(this.event.start_date +'T'+this.event.start_time).toDate();
              $scope.myEndTime = moment(this.event.end_date +'T'+this.event.end_time).toDate();
          });
        } else {
          this.editing = false;
          this.event = {
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
          $scope.myStartTime = moment('2016-01-01T12:00').toDate();
          $scope.myEndTime = moment('2016-01-01T13:00').toDate();
        }
    }

    // functions
    startDateOpen () {
        this.startDatePopup.opened = true;
    }

    endDateOpen () {
        this.endDatePopup.opened = true;
    }

    endRepeatOpen () {
        this.endRepeatPopup.opened = true;
    }

    updateEvent () {
        this.event.start_date = moment(this.event.start_date).format('YYYY-MM-DD');
        this.event.end_date = moment(this.event.end_date).format('YYYY-MM-DD');
        if(this.event.is_repeat) {
            if(this.event.ends != '') {
                this.event.ends = moment(this.event.ends).format('YYYY-MM-DD');
            } else {
                this.event.ends = null;
            }
        } else {
            this.event.repetition = '';
            this.event.ends = null;
        }
        console.log(this.event.ends)
      if(!this.checkFields()) {
        return;
      }
      var call;
      if(this.editing) {
        call = Events.update(this.event).$promise;
      }else {
        call = Events.create(this.event).$promise;
      }
      call.then(function() {
        $window.location.href = '/events/list/';
      }, function(err) {
        if(err.data.title) {
          this.titleError = err.data.title[0];
          this.startDateError = err.data.title[1];
          this.startTimeError = err.data.title[2];
          this.endDateError = err.data.title[3];
          this.endTimeError = err.data.title[4];
        }
      });
    }

    checkFields () {
      this.titleError = '';
      this.startDateError = '';
      this.startTimeError = '';
      this.endDateError = '';
      this.endTimeError = '';
      this.dateError = '';
      this.timeError = '';
      this.noRepetitionError = '';
      this.endsError = '';
      if(!this.event.title) {
        this.titleError = 'Title field is required';
      }
      if(!this.event.start_date) {
        this.startDateError = 'Start date field is required';
      }
      if(!this.event.start_time) {
        this.startTimeError = 'Start time field is required';
      }
      if(!this.event.end_date) {
        this.endDateError = 'End date field is required';
      }
      if(!this.event.end_time) {
        this.endTimeError = 'End time field is required';
      }
      if(this.event.start_date && this.event.end_date) {
          if(this.event.start_date > this.event.end_date) {
              this.dateError = 'Start date is not allowed to be greater than end date';
          }
          if(this.event.start_date == this.event.end_date) {
              if (this.event.start_time > this.event.end_time) {
                  this.timeError = 'Start time must less than end time for same day';
              }
          }
      }
      if(this.event.end_date && this.event.ends) {
          if(this.event.end_date > this.event.ends) {
              this.endsError = 'Events repetition ends must be greater than first event end date';
          }
      }
      if(this.event.is_repeat) {
          if(!this.event.repetition) {
              this.noRepetitionError = 'Repetition is required if event is repeated';
          }
      }
      if(this.titleError || this.startDateError || this.startTimeError || this.endDateError || this.endTimeError || this.dateError || this.timeError || this.noRepetitionError || this.endsError) {
        return false;
      }
      return true
    }

    getTitle () {
      if(this.editing) {
        return 'Edit Event';
      }
      return 'Create Event';
    }
}
