export default class EditEventCtrl {
    constructor($scope, $window, EventsService,$stateParams) {
        'ngInject';

        //variable declarations
        this.Events = EventsService;
        this.window = $window;
        this.stateParams = $stateParams;
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

        //for datepicker
        $scope.myStartDate = new Date();
        $scope.myEndDate = new Date();
        $scope.myEndRepeatDate = new Date();
        $scope.$watch('myStartDate', (newValue, oldValue) => {
            this.event.start_date = $scope.myStartDate;
        });
        $scope.$watch('myEndDate', (newValue, oldValue) => {
            this.event.end_date = $scope.myEndDate;
        });
        $scope.$watch('myEndRepeatDate', (newValue, oldValue) => {
            this.event.ends = $scope.myEndRepeatDate;
        });
        this.startDatePopup = {
            opened: false
        };
        this.endDatePopup = {
            opened: false
        };
        this.endRepeatPopup = {
            opened: false
        };

        //for timepicker
        $scope.myStartTime = new Date();
        $scope.myEndTime = new Date();
        this.displayStartTime = 'n/a';
        this.displayEndTime = 'n/a';
        this.hstep = 1;
        this.mstep = 1;
        this.ismeridian = false;
        $scope.$watch('myStartTime', (newValue, oldValue) => {
            this.displayStartTime = moment($scope.myStartTime).format('HH:mm');
            this.event.start_time = this.displayStartTime;
        });
        $scope.$watch('myEndTime', (newValue, oldValue) => {
            this.displayEndTime = moment($scope.myEndTime).format('HH:mm');
            this.event.end_time = this.displayEndTime;
        });

        //change the dates and times to correct values
        if(this.stateParams.id) { //Functional; possibly inefficient
          this.editing = true;
          var eventId = this.stateParams.id;
          this.Events.getEvent(eventId).then((event) => {
              this.event = event.data;
              $scope.myStartDate = moment(this.event.start_date).toDate();
              $scope.myEndDate = moment(this.event.end_date).toDate();
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
      if(!this.checkFields()) {
        return;
      }
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
      var call;
      if(this.editing) {
        call = this.Events.updateEvent(this.event.id, this.event);
      }else {
        call = this.Events.createEvent(this.event);
      }
      call.then(() => {
        this.window.location.href = '/#/events/list';
    }, (err) => {
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
