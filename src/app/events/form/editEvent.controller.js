export default class EditEventCtrl {
    constructor($state, $stateParams, toastr, moment, EventsService) {
        'ngInject';

        //variable declarations
        this.state = $state;
        this.stateParams = $stateParams;
        this.toastr = toastr
        this.moment = moment;        
        this.Events = EventsService;
        this.saveButtonClicked = false;

        //for datepicker
        this.startDatePopupOpened = false;
        this.endDatePopupOpened = false;
        this.endRepeatPopupOpened = false;

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
        };

        if (this.stateParams.id) {
            this.editing = true;
            this.Events.getEvent(this.stateParams.id).then((response) => {
                this.event = response.data;
                this.setDatesAndTimes(this.event);
            });
        } else {
            this.editing = false;
            this.setDatesAndTimes();
        }
    }

    get startDate() {
        return this._startDate;
    }
    
    set startDate(newDate) {
        this.event.start_date = this.moment(newDate).format('YYYY-MM-DD');
        this._startDate = newDate;
    }

    get startTime() {
        return this._startTime;
    }
    
    set startTime(newTime) {
        this.event.start_time = this.moment(newTime).format('HH:mm');
        this._startTime = newTime;
    }

    get endDate() {
        return this._endDate;
    }
    
    set endDate(newDate) {
        this.event.end_date = this.moment(newDate).format('YYYY-MM-DD');
        this._endDate = newDate;
    }

    get endTime() {
        return this._endTime;
    }
    
    set endTime(newTime) {
        this.event.end_time = this.moment(newTime).format('HH:mm');
        this._endTime = newTime;
    }

    get repetitionEndDate() {
        return this._repetitionEndDate;
    }

    set repetitionEndDate(newDate) {
        this.event.ends = this.moment(newDate).format('YYYY-MM-DD');
        this._repetitionEndDate = newDate;
    }

    //Error checking
    get isFormValid() {
        return !this.hasTitleError
            && !this.hasStartDateError
            && !this.hasStartTimeError
            && !this.hasEndDateError
            && !this.hasEndTimeError
            && !this.hasRepetitionError;
    }

    get hasTitleError() {
        return !this.event.title;
    }

    get hasDateTimeError() {
        return this.hasStartDateError 
            || this.hasStartTimeError
            || this.hasEndDateError
            || this.hasEndTimeError;
    }

    get hasStartDateError() {
        return this.startDateIsBlank || this.startDateIsAfterEndDate;
    }

    get startDateIsBlank() {
        return !this._startDate;
    }

    get startDateIsAfterEndDate() {
        return this._startDate 
            && this._endDate 
            && moment(this._startDate).isAfter(this._endDate, 'day');
    }

    get hasStartTimeError() {
        return this.startTimeIsBlank || this.startTimeIsAfterEndTimeOnSameDay;
    }

    get startTimeIsBlank() {
        return !this._startTime;
    }

    get startTimeIsAfterEndTimeOnSameDay() {
        return this._startDate
            && this._endDate
            && moment(this._startDate).isSame(this._endDate, 'day')
            && this.isStartTimeAfterEndTime;
    }

    get isStartTimeAfterEndTime() {
        return this._startTime 
            && this._endTime
            && (this._startTime.getHours() > this._endTime.getHours()
                || (this._startTime.getHours() === this._endTime.getHours() && this._startTime.getMinutes() >= this._endTime.getMinutes()));
    }

    get hasEndDateError() {
        return !this._endDate;
    }

    get hasEndTimeError() {
        return !this._endTime;
    }

    get hasRepetitionError() {
        return this.noRepetitionIntervalSelected || this.repetitionSelectedWithNoEndDate || this.repetitionEndsBeforeEndDate;
    }

    get noRepetitionIntervalSelected() {
        return this.event.is_repeat && !this.event.repetition;
    }

    get repetitionSelectedWithNoEndDate() {
        return this.event.is_repeat && !this._repetitionEndDate;
    }

    get repetitionEndsBeforeEndDate() {
        return this._endDate 
            && this._repetitionEndDate
            && moment(this._repetitionEndDate).isBefore(this._endDate, 'day');
    }

    // functions
    setDatesAndTimes(event = null) {
        if(event) {
            this.startDate = this.moment(event.start_date, 'YYYY-MM-DD').toDate();
            this.startTime = this.moment(event.start_time, 'HH:mm').toDate();
            this.endDate = this.moment(event.end_date, 'YYYY-MM-DD').toDate();
            this.endTime = this.moment(event.end_time, 'HH:mm').toDate();
            this.repetitionEndDate = this.moment(event.ends, 'YYYY-MM-DD').toDate();            
        } else {
            this.startDate = new Date();
            this.startTime = this.moment('2016-01-01T12:00').toDate();
            this.endDate = new Date();
            this.endTime = this.moment('2016-01-01T13:00').toDate();
            this.repetitionEndDate = new Date();
        }
    }

    startDateOpen() {
        this.startDatePopupOpened = true;
    }

    endDateOpen() {
        this.endDatePopupOpened = true;
    }

    endRepeatOpen() {
        this.endRepeatPopupOpened = true;
    }

    saveChanges() {
        this.saveButtonClicked = true;
        if(!this.isFormValid) {
            return;
        }
        if (!this.event.is_repeat) {
            this.event.repetition = '';
            this.event.ends = null;
        }
        let call;
        if (this.editing) {
            call = this.Events.updateEvent(this.event.id, this.event);
        } else {
            call = this.Events.createEvent(this.event);
        }
        call.then(() => {
            this.toastr.success(`Event ${this.editing ? 'Updated' : 'Created'}!`);
            this.state.go('eventsList');
        }, (err) => {
            if (err.data.title) {
                this.titleError = err.data.title[0];
                this.startDateError = err.data.title[1];
                this.startTimeError = err.data.title[2];
                this.endDateError = err.data.title[3];
                this.endTimeError = err.data.title[4];
            }
        });
    }

    getTitle() {
        if (this.editing) {
            return 'Edit Event';
        }
        return 'Create Event';
    }
}
