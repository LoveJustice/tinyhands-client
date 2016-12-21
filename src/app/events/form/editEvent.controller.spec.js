import EditEventCtrl from './editEvent.controller';

describe('EditEventCtrl', () => {
    let controller, state, stateParams, mockToastr, moment, mockEventsService, $rootScope, $q;

    let event = {
        id: 1,
        title: 'studio',
        location: 'lab',
        start_date: '2016-03-15',
        start_time: '14:00',
        end_date: '2016-03-15',
        end_time: '16:00',
        description: 'do karma test',
        is_repeat: true,
        repetition: 'W',
        ends: '2016-03-22',
    };
    
    let nonRepeatingEvent = {
        id: 2,
        title: 'Non repeating event',
        location: 'No where',
        start_date: '2016-03-15',
        start_time: '14:00',
        end_date: '2016-03-15',
        end_time: '16:00',
        description: 'do not repeat',
        is_repeat: false,
        repetition: 'W',
        ends: '2016-03-22',
    };

    let defaultEvent;

    beforeEach(angular.mock.module('tinyhands.Events'))

    beforeEach(inject((_$rootScope_, _$q_, _moment_) => {

        $rootScope = _$rootScope_;
        $q = _$q_;
        moment = _moment_;

        defaultEvent = {
            title: '',
            location: '',
            start_date: moment().format('YYYY-MM-DD'),
            start_time: '12:00',
            end_date: moment().format('YYYY-MM-DD'),
            end_time: '13:00',
            description: '',
            is_repeat: false,
            repetition: '',
            ends: moment().format('YYYY-MM-DD'),
        };

        state = jasmine.createSpyObj('state', ['go']);

        stateParams = {};

        mockToastr = jasmine.createSpyObj('mockToastr', ['success']);

        mockEventsService = jasmine.createSpyObj('mockEventsService', ['getEvent', 'createEvent', 'updateEvent']);
        mockEventsService.getEvent.and.callFake(() => {
            return $q.resolve({data: event});
        });
        mockEventsService.createEvent.and.callFake((event) => {
            return $q.resolve(event);
        });
        mockEventsService.updateEvent.and.callFake((id, event) => {
            return $q.resolve(event);
        });

        controller = new EditEventCtrl(state, stateParams, mockToastr, moment, mockEventsService);

    }));

    describe('title', () => {
        describe('when editing an event', () => {
            it('should return "Edit Event"', () => {
                controller.editing = true;

                expect(controller.title).toBe("Edit Event");
            });
        });

        describe('when creating an event', () => {
            it('should return "Create Event"', () => {
                controller.editing = false;

                expect(controller.title).toBe("Create Event");
            });
        });
    });

    describe('startDate', () => {
        describe('when set', () => {
            it('should set event start date to date string', () => {
                let date = new Date();
                
                controller.startDate = date;

                expect(controller.event.start_date).toBe(moment(date).format('YYYY-MM-DD'));
            });

            it('should return date from getter', () => {
                let date = new Date();

                controller.startDate = date;

                expect(controller.startDate).toBe(date);
            });
        });
    });

    describe('startTime', () => {
        describe('when set', () => {
            it('should set event start time to time string', () => {
                let date = new Date();
                
                controller.startTime = date;

                expect(controller.event.start_time).toBe(moment(date).format('HH:mm'));
            });

            it('should return time from getter', () => {
                let date = new Date();

                controller.startTime = date;

                expect(controller.startTime).toBe(date);
            });
        });
    });

    describe('endDate', () => {
        describe('when set', () => {
            it('should set event end date to date string', () => {
                let date = new Date();
                
                controller.endDate = date;

                expect(controller.event.end_date).toBe(moment(date).format('YYYY-MM-DD'));
            });

            it('should return date from getter', () => {
                let date = new Date();

                controller.endDate = date;

                expect(controller.endDate).toBe(date);
            });
        });
    });

     describe('endTime', () => {
        describe('when set', () => {
            it('should set event start time to time string', () => {
                let date = new Date();
                
                controller.endTime = date;

                expect(controller.event.end_time).toBe(moment(date).format('HH:mm'));
            });

            it('should return time from getter', () => {
                let date = new Date();

                controller.endTime = date;

                expect(controller.endTime).toBe(date);
            });
        });
    });

    describe('repetitionEndDate', () => {
        describe('when set', () => {
            it('should set event ends to date string', () => {
                let date = new Date();
                
                controller.repetitionEndDate = date;

                expect(controller.event.ends).toBe(moment(date).format('YYYY-MM-DD'));
            });

            it('should return date from getter', () => {
                let date = new Date();

                controller.repetitionEndDate = date;

                expect(controller.repetitionEndDate).toBe(date);
            });
        });
    });

    describe('isStartDateBeforeOrSameAsEndDate', () => {
        describe('when start date is before end date', () => {
            it('should return true', () => {
                controller.startDate = moment().weekday(0).toDate();
                controller.endDate = moment().weekday(1).toDate();

                expect(controller.isStartDateBeforeOrSameAsEndDate).toBe(true);
            });
        });

        describe('when start date is same as end date', () => {
            it('should return true', () => {
                controller.startDate = moment().weekday(0).toDate();
                controller.endDate = moment().weekday(0).toDate();

                expect(controller.isStartDateBeforeOrSameAsEndDate).toBe(true);
            });
        });

        describe('when start date is after end date', () => {
            it('should return false', () => {
                controller.startDate = moment().weekday(1).toDate();
                controller.endDate = moment().weekday(0).toDate();

                expect(controller.isStartDateBeforeOrSameAsEndDate).toBe(false);
            });
        });
    });

    describe('isStartTimeBeforeEndTime', () => {
        describe('when start date and end date are different', () => {
            it('should return true', () => {
                controller.startDate = moment().weekday(0).toDate();
                controller.endDate = moment().weekday(1).toDate();

                expect(controller.isStartTimeBeforeEndTime).toBe(true);
            });
        });

        describe('when start date and end date are same', () => {
            beforeEach(() => {
                controller.startDate = moment().weekday(0).toDate();
                controller.endDate = moment().weekday(0).toDate();
            });

            describe('and start time is before end time', () => {
                it('should return true', () => {
                    controller.startTime = moment().hours(11).minutes(0).toDate();
                    controller.endTime = moment().hours(12).minutes(0).toDate();
                    
                    expect(controller.isStartTimeBeforeEndTime).toBe(true);
                });
            });

            describe('and start time is same as end time', () => {
                it('should return false', () => {
                    controller.startTime = moment().hours(12).minutes(0).toDate();
                    controller.endTime = moment().hours(12).minutes(0).toDate();
                    
                    expect(controller.isStartTimeBeforeEndTime).toBe(false);
                });
            });

            describe('and start time is after end time', () => {
                it('should return false', () => {
                    controller.startTime = moment().hours(13).minutes(0).toDate();
                    controller.endTime = moment().hours(12).minutes(0).toDate();

                    expect(controller.isStartTimeBeforeEndTime).toBe(false);
                });
            });
        });
    });

    describe('isRepetitionEndAfterEndDate', () => {
        describe('when event does not repeat', () => {
            it('should return true', () => {
                controller.event.is_repeat = false;

                expect(controller.isRepetitionEndAfterEndDate).toBe(true);
            });
        });

        describe('when event does repeat', () => {
            beforeEach(() => {
                controller.event.is_repeat = true;
            });

            describe('and repetition ends before end date', () => {
                it('should return false', () => {
                    controller.repetitionEndDate = moment().weekday(0).toDate();
                    controller.endDate = moment().weekday(1).toDate();

                    expect(controller.isRepetitionEndAfterEndDate).toBe(false);
                });
            });

            describe('and repetition ends on end date', () => {
                it('should return false', () => {
                    controller.repetitionEndDate = moment().weekday(0).toDate();
                    controller.endDate = moment().weekday(0).toDate();

                    expect(controller.isRepetitionEndAfterEndDate).toBe(false);
                });
            });

            describe('and repetition ends is after end date', () => {
                it('should return true', () => {
                    controller.repetitionEndDate = moment().weekday(1).toDate();
                    controller.endDate = moment().weekday(0).toDate();

                    expect(controller.isRepetitionEndAfterEndDate).toBe(true);
                });
            });
        });
    });

    describe('setupEvent', () => {
        describe('when stateParams has id', () => {
            it('should set editing to true', () => {
                controller.stateParams.id = 1;

                controller.setupEvent();

                expect(controller.editing).toBe(true);
            });

            it('should get event through EventService', () => {
                let id = 1;
                controller.stateParams.id = id;

                controller.setupEvent();

                expect(mockEventsService.getEvent).toHaveBeenCalledWith(id);
            });

            describe('and event retrieved successful', () => {
                it('should set event to event from EventService', () => {
                    controller.stateParams.id = 1;

                    controller.setupEvent();
                    $rootScope.$apply();

                    expect(controller.event).toBe(event);
                });
            });
        });

        describe('when stateParams has no id', () => {
            it('should set editing to false', () => {
                controller.setupEvent();

                expect(controller.editing).toBe(false);
            });

            it('should set event to have default', () => {
                controller.setupEvent();

                expect(controller.event).toEqual(defaultEvent);
            });
        });
    });

    describe('setDatesAndTimes', () => {
        describe('when event is null', () => {
            it('should set startDate to today', () => {
                controller.setDatesAndTimes();

                let isSameDay = moment(controller.startDate).isSame(new Date(), 'day');
                expect(isSameDay).toBe(true);
            });

            it('should set startTime to 12:00', () => {
                controller.setDatesAndTimes();

                expect(moment(controller.startTime).format('HH:mm')).toBe('12:00');
            });

            it('should set endDate to today', () => {
                controller.setDatesAndTimes();

                let isSameDay = moment(controller.endDate).isSame(new Date(), 'day');
                expect(isSameDay).toBe(true);
            });

            it('should set endTime to 13:00', () => {
                controller.setDatesAndTimes();

                expect(moment(controller.endTime).format('HH:mm')).toBe('13:00');
            });

            it('should set repetitionEndDate to today', () => {
                controller.setDatesAndTimes();

                let isSameDay = moment(controller.repetitionEndDate).isSame(new Date(), 'day');
                expect(isSameDay).toBe(true);
            });
        });

        describe('when event is given', () => {
            it('should set startDate to event start date', () => {
                controller.setDatesAndTimes(event);

                expect(moment(controller.startDate).format('YYYY-MM-DD')).toBe(event.start_date);
            });

            it('should set startTime to event start time', () => {
                controller.setDatesAndTimes(event);

                expect(moment(controller.startTime).format('HH:mm')).toBe(event.start_time);
            });

            it('should set endDate to event end date', () => {
                controller.setDatesAndTimes(event);

                expect(moment(controller.endDate).format('YYYY-MM-DD')).toBe(event.end_date);
            });

            it('should set endTime to event end date', () => {
                controller.setDatesAndTimes(event);

                expect(moment(controller.endTime).format('HH:mm')).toBe(event.end_time);
            });

            it('should set repetitionEndDate to event repetition end date', () => {
                controller.setDatesAndTimes(event);

                expect(moment(controller.repetitionEndDate).format('YYYY-MM-DD')).toBe(event.ends);
            });
        });
    });

    describe('openStartDatePopup', () => {
        it('should set startDatePopupOpened to true', () => {
            controller.openStartDatePopup();

            expect(controller.startDatePopupOpened).toBe(true);
        });
    });

    describe('openEndDatePopup', () => {
        it('should set endDatePopupOpened to true', () => {
            controller.openEndDatePopup();

            expect(controller.endDatePopupOpened).toBe(true);
        });
    });

    describe('openEndRepeatPopup', () => {
        it('should set endRepeatPopupOpened to true', () => {
            controller.openEndRepeatPopup();

            expect(controller.endRepeatPopupOpened).toBe(true);
        });
    });

    describe('saveChanges', () => {
        describe('when event info is not valid', () => {
            beforeEach(() => {
                controller.form = {$valid: false};
            });

            it('should not create or update event', () => {
                controller.saveChanges();

                expect(mockEventsService.createEvent).not.toHaveBeenCalled();
                expect(mockEventsService.updateEvent).not.toHaveBeenCalled();
            });
        });

        describe('when event info is valid', () => {
            beforeEach(() => {
                controller.form = {$valid: true};
            });

            describe('and event does not repeat', () => {
                it('should set event repetition and end date to be blank', () => {
                    controller.event = nonRepeatingEvent;

                    controller.saveChanges();

                    expect(controller.event.repetition).toBe('');
                    expect(controller.event.ends).toBe(null);
                });
            });

            describe('and creating event', () => {

                beforeEach(() => {
                    controller.event = event;
                });

                it('should create event through EventService', () => {
                    controller.saveChanges();

                    expect(mockEventsService.createEvent).toHaveBeenCalledWith(event);
                });

                describe('and creation successful', () => {
                    it('should give successful toastr message', () => {
                        controller.saveChanges();
                        $rootScope.$apply();

                        expect(mockToastr.success).toHaveBeenCalledWith('Event Created!');
                    });

                    it('should navigate to the events list', () => {
                        controller.saveChanges();
                        $rootScope.$apply();
                        
                        expect(state.go).toHaveBeenCalledWith('eventsList');
                    });
                });
            });

            describe('and updating event', () => {

                beforeEach(() => {
                    controller.editing = true;
                    controller.event = event;
                });
                
                it('should update event through EventService', () => {
                    controller.saveChanges();

                    expect(mockEventsService.updateEvent).toHaveBeenCalledWith(event.id, event);
                });

                describe('and update successful', () => {
                    it('should give successful toastr message', () => {
                        controller.saveChanges();
                        $rootScope.$apply();
                        
                        expect(mockToastr.success).toHaveBeenCalledWith('Event Updated!');
                    });

                    it('should navigate to the events list', () => {
                        controller.saveChanges();
                        $rootScope.$apply();
                        
                        expect(state.go).toHaveBeenCalledWith('eventsList');
                    });
                });
            });
        });
    });
});
