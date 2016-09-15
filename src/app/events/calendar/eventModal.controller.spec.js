import EventModalController from './eventModal.controller';

describe('EventModalController', () => {
    let target,
        event, 
        mockUibModalInstance;

    beforeEach(()=> {
        event = {id:1, name: 'Foo'};
        mockUibModalInstance = jasmine.createSpyObj('MockUibModalInstance', ['close', 'dismiss'])

        target = new EventModalController(mockUibModalInstance, event);
    });

    describe('start', () => {
        it('should return correct start date and time', () => {
            event = {
                start_date: "2016-02-01",
                start_time: "12:34:56"    
            };
            target = new EventModalController(mockUibModalInstance, event);

            expect(target.start).toEqual(event.start_date + " at " + event.start_time);
        });
    });

    describe('end', () => {
        it('should return correct end date and time', () => {
            event = {
                end_date: "2016-02-01",
                end_time: "12:34:56"    
            };
            target = new EventModalController(mockUibModalInstance, event);

            expect(target.end).toEqual(event.end_date + " at " + event.end_time);
        });
    });

    describe('repetition', () => {
        describe("when event does not repeat", () => {
            it('should return empty string', () => {
                event = {
                    is_repeat: false
                };
                target = new EventModalController(mockUibModalInstance, event);

                expect(target.repetition).toEqual('');
            });
        });
        describe("when event does repeat", () => {
            describe('and has repetition end date', () => {
                it('should return correct repetition interval', () => {
                    event = {
                        is_repeat: true,
                        repetition: 'Weekly',
                        ends: "2016-02-01"
                    };
                    target = new EventModalController(mockUibModalInstance, event);

                    expect(target.repetition).toEqual(event.repetition + ' until ' + event.ends);
                });
            });

            describe('and has no repetition end date', () => {
                it('should return correct repetition interval', () => {
                    event = {
                        is_repeat: true,
                        repetition: 'Weekly',
                    };
                    target = new EventModalController(mockUibModalInstance, event);

                    expect(target.repetition).toEqual(event.repetition);
                });
            });
        });
    });

    describe('close', () => {
        it('should dismiss modal', () => {
            target.close();

            expect(mockUibModalInstance.dismiss).toHaveBeenCalled();
        });
    });

    describe('delete', () => {
        it('should close modal', () => {
            target.delete();

            expect(mockUibModalInstance.close).toHaveBeenCalled();
        });
    });

});

