import AccountController from './account.controller';

describe('AccountController', () => {

    let controller,
        mockScope,
        mockState;

    beforeEach(() => {
        mockScope = jasmine.createSpyObj('mockScope', ['$on']);
        mockState = jasmine.createSpyObj('mockState', ['go']);
        mockState.current = {
            data: {
                index: 1
            }
        };

        controller = new AccountController(mockState, mockScope);
    });

    describe('setActiveTab', () => {
        it('should set active tab to equal current state index', () => {
            let index = 2;
            mockState.current.data.index = index;

            controller.setActiveTab();

            expect(controller.activeTabIndex).toEqual(index);
        });
    });

    describe('switchTab', () => {
        it('should go to correct tab state at the index', () => {
            let index = 0;

            controller.switchTab(index);

            expect(mockState.go).toHaveBeenCalledWith(controller.tabs[index].state);
        });

        describe('when trying to switch to the current tab', () => {
            it('should not switch states', () => {
                let index = 0;
                controller.activeTabIndex = index;

                controller.switchTab(index);

                expect(mockState.go).not.toHaveBeenCalled();
            });
        });
    });
});