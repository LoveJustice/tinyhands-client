describe("EditEventCtrl", function() {
    var controller, scope, mockEventsService, mockWindow, $q, newEvent;
    var blankEvent = {
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
    var testCase1Event = {
        title: 'test1',
        location: '',
        start_date: '2016-03-15',
        start_time: '14:00',
        end_date: '2016-03-14',
        end_time: '16:00',
        description: '',
        is_repeat: false,
        repetition: '',
        ends: '',
    };
    var testCase2Event = {
        title: 'test2',
        location: '',
        start_date: '2016-03-15',
        start_time: '14:00',
        end_date: '2016-03-15',
        end_time: '13:00',
        description: '',
        is_repeat: true,
        repetition: '',
        ends: '2016-03-14',
    };

    beforeEach(module('EventsMod'));

    beforeEach(inject(function($rootScope, $controller, _$q_) {
        $q = _$q_;
        mockEventsService = jasmine.createSpyObj('mockEventsService', ['get', 'create', 'update']);
        mockEventsService.get.and.returnValue({$promise: $q.when([blankEvent])});

        mockWindow = {
            location: {
                href: '/events/1'
            },
            event_id: 1
        };

        scope = $rootScope.$new();
        controller = $controller('EditEventCtrl', {
            $scope: scope,
            Events: mockEventsService,
            $window: mockWindow
        });

        newEvent = {
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
    }));

    describe('when window.event_id set', function() {
        beforeEach(function() {
            mockWindow.event_id = 1;
            controller.activate();
        });

        it('should set vm.editing to true', function() {
            expect(controller.editing).toBe(true);
        });

        it('should get event from Events service', function() {
            expect(mockEventsService.get).toHaveBeenCalledWith({id: 1});
        })
    });

    describe('checkFields', function() {
        it('when vm.event.title is null, should set vm.titleError', function() {
            controller.event = blankEvent;

            controller.checkFields();

            expect(controller.titleError).toEqual('Title field is required');
        });
        it('when vm.event.title is null should return false', function () {
			controller.event = newEvent;
            controller.event.title = '';

			var result = controller.checkFields();

			expect(result).toEqual(false);
		});
		it('when vm.event.title is not null vm.titleError should not be set', function () {
			controller.event = newEvent;

			controller.checkFields();

			expect(controller.titleError).toEqual('');
		});


        it('when vm.event.start_date is null, should set vm.startDateError', function() {
            controller.event = blankEvent;

            controller.checkFields();

            expect(controller.startDateError).toEqual('Start date field is required');
        });
        it('when vm.event.start_date is null should return false', function () {
			controller.event = newEvent;
            controller.event.start_date = '';

			var result = controller.checkFields();

			expect(result).toEqual(false);
		});
		it('when vm.event.start_date is not null vm.startDateError should not be set', function () {
			controller.event = newEvent;

			controller.checkFields();

			expect(controller.startDateError).toEqual('');
		});


        it('when vm.event.start_time is null, should set vm.startTimeError', function() {
            controller.event = blankEvent;

            controller.checkFields();

            expect(controller.startTimeError).toEqual('Start time field is required');
        });
        it('when vm.event.start_time is null should return false', function () {
			controller.event = newEvent;
            controller.event.start_time = '';

			var result = controller.checkFields();

			expect(result).toEqual(false);
		});
		it('when vm.event.start_time is not null vm.startTimeError should not be set', function () {
			controller.event = newEvent;

			controller.checkFields();

			expect(controller.startTimeError).toEqual('');
		});


        it('when vm.event.end_date is null, should set vm.endDateError', function() {
            controller.event = blankEvent;

            controller.checkFields();

            expect(controller.endDateError).toEqual('End date field is required');
        });
        it('when vm.event.end_date is null should return false', function () {
			controller.event = newEvent;
            controller.event.end_date = '';

			var result = controller.checkFields();

			expect(result).toEqual(false);
		});
		it('when vm.event.end_date is not null vm.endDateError should not be set', function () {
			controller.event = newEvent;

			controller.checkFields();

			expect(controller.endDateError).toEqual('');
		});


        it('when vm.event.end_time is null, should set vm.endTimeError', function() {
            controller.event = blankEvent;

            controller.checkFields();

            expect(controller.endTimeError).toEqual('End time field is required');
        });
        it('when vm.event.end_time is null should return false', function () {
			controller.event = newEvent;
            controller.event.end_time = '';

			var result = controller.checkFields();

			expect(result).toEqual(false);
		});
		it('when vm.event.end_time is not null vm.endTimeError should not be set', function () {
			controller.event = newEvent;

			controller.checkFields();

			expect(controller.endTimeError).toEqual('');
		});


        it('when vm.event.start_date greater than vm.event.end_date, should set vm.dateError', function() {
            controller.event = testCase1Event;

            controller.checkFields();

            expect(controller.dateError).toEqual('Start date is not allowed to be greater than end date');
        });
        it('when vm.event.start_date greater than vm.event.end_date, should return false', function () {
			controller.event = testCase1Event;

			var result = controller.checkFields();

			expect(result).toEqual(false);
		});
		it('when vm.event.start_date not greater than vm.event.end_date, vm.dateError should not be set', function () {
			controller.event = newEvent;

			controller.checkFields();

			expect(controller.dateError).toEqual('');
		});


        it('when event starts and ends on the same day, vm.event.start_time > vm.event.end_time, should set vm.timeError', function() {
            controller.event = testCase2Event;

            controller.checkFields();

            expect(controller.timeError).toEqual('Start time must less than end time for same day');
        });
        it('when event starts and ends on the same day, vm.event.start_time > vm.event.end_time, should return false', function () {
			controller.event = newEvent;
            controller.event.end_time = '13:00';

			var result = controller.checkFields();

			expect(result).toEqual(false);
		});
		it('when event starts and ends on the same day, vm.event.start_time !> vm.event.end_time, vm.timeError should not be set', function () {
			controller.event = newEvent;

			controller.checkFields();

			expect(controller.timeError).toEqual('');
		});


        it('when vm.event.end_date > vm.event.ends, should set vm.endsError', function() {
            controller.event = testCase2Event;

            controller.checkFields();

            expect(controller.endsError).toEqual('Events repetition ends must be greater than first event end date');
        });
        it('when vm.event.end_date > vm.event.ends, should return false', function () {
			controller.event = newEvent;
            controller.event.ends = '2016-03-14';

			var result = controller.checkFields();

			expect(result).toEqual(false);
		});
		it('when vm.event.end_date !> vm.event.ends, vm.endsError should not be set', function () {
			controller.event = newEvent;

			controller.checkFields();

			expect(controller.endsError).toEqual('');
		});


        it('when vm.event.is_repeat equals true and vm.event.Repetition is null, should set vm.noRepetitionError', function() {
            controller.event = testCase2Event;

            controller.checkFields();

            expect(controller.noRepetitionError).toEqual('Repetition is required if event is repeated');
        });
        it('when vm.event.is_repeat equals true and vm.event.repetition is null, should return false', function () {
			controller.event = newEvent;
            controller.event.repetition = '';

			var result = controller.checkFields();

			expect(result).toEqual(false);
		});
		it('when vm.event.is_repeat equals true and vm.event.repetition is null, vm.noRepetitionError should not be set', function () {
			controller.event = newEvent;

			controller.checkFields();

			expect(controller.noRepetitionError).toEqual('');
		});

        it('when all the errors are not null, should return true', function() {
            controller.event = newEvent;

            var result = controller.checkFields();

            expect(result).toEqual(true);
        });
    });

    describe('getTitle', function() {
        describe('when controller.editing is true', function() {
            it('should return correct Title', function () {
                controller.editing = true;

                var title = controller.getTitle();

                expect(title).toBe('Edit Event');
            });
        });

        describe('when controller.editing is false', function() {
            it('should return correct Title', function () {
                controller.editing = false;

                var title = controller.getTitle();

                expect(title).toBe('Create Event');
            });
        })
    });
});
