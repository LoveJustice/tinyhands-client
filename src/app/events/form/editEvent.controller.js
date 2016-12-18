export default class EditEventCtrl {
    constructor($state, $stateParams, toastr, moment, EventsService) {
        'ngInject';

        //variable declarations
        this.state = $state;
        this.stateParams = $stateParams;
        this.toastr = toastr
        this.moment = moment;        
        this.EventsService = EventsService;
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
            this.EventsService.getEvent(this.stateParams.id).then((response) => {
                this.event = response.data;
                this.setDatesAndTimes(this.event);
            });
        } else {
            this.editing = false;
            this.setDatesAndTimes();
        }
    }

    get title() {
        if (this.editing) {
            return 'Edit Event';
        }
        return 'Create Event';
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
    get isStartDateBeforeOrSameAsEndDate() {
        return this.moment(this._startDate).isSameOrBefore(this._endDate, 'day');
    }

    get isStartTimeAfterEndTimeOnSameDay() {
        if(this.moment(this._startDate).isSame(this._endDate, 'day') && this._startTime && this._endTime) {
            return this._startTime.getHours() < this._endTime.getHours()
            || (this._startTime.getHours() === this._endTime.getHours() && this._startTime.getMinutes() < this._endTime.getMinutes());
        } //possible improvements by using same date obj for start date and time
        return true; 
    }

    get isRepetitionEndAfterEndDate() {
        if(this.event.is_repeat) {
            return this.moment(this._repetitionEndDate).isAfter(this._endDate, 'day');
        }
        return true;
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

    openStartDatePopup() {
        this.startDatePopupOpened = true;
    }

    openEndDatePopup() {
        this.endDatePopupOpened = true;
    }

    openEndRepeatPopup() {
        this.endRepeatPopupOpened = true;
    }

    saveChanges() {
        if(!this.form.$valid) {
            return;
        }
        if (!this.event.is_repeat) {
            this.event.repetition = '';
            this.event.ends = '';
        }
        let call;
        if (this.editing) {
            call = this.EventsService.updateEvent(this.event.id, this.event);
        } else {
            call = this.EventsService.createEvent(this.event);
        }
        call.then(() => {
            this.toastr.success(`Event ${this.editing ? 'Updated' : 'Created'}!`);
            this.state.go('eventsList');
        }, (err) => {
            
        });
    }
}
