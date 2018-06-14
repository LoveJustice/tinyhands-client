import {
    StaffSelectController
}
from './staff-select.component';

describe('StaffSelectController', () => {
    let vm;
    beforeEach(() => {
        let StaffService = {
            getStaff: () => ({
                then: () => {}
            })
        };
        vm = new StaffSelectController(StaffService);
    });

    describe('function filterStaff', () => {
        let staff;
        beforeEach(() => {
            staff = {
                'first_name': 'Johnalonny',
                'last_name': 'Jordanstinston'
            };
        });

        it('when searchValue is in staff.first_name should return true', () => {
            let value = 'alon';

            let isContained = vm.filterStaff(staff, value);

            expect(isContained).toBeTruthy();
        });

        it('when searchValue is in staff.last_name, return true', () => {
            let value = 'stinston';

            let isContained = vm.filterStaff(staff, value);

            expect(isContained).toBeTruthy();
        });

        it('when searchValue is in staff.first_name and staff.last_name, return true', () => {
            let value = 'jo';

            let isContained = vm.filterStaff(staff, value);

            expect(isContained).toBeTruthy();
        });

        it('when searchValue not in staff.first_name or staff.last_name, return false', () => {
            let value = 'bob';

            let isContained = vm.filterStaff(staff, value);

            expect(isContained).toBeFalsy();
        });

        it('when staff is undefined, return false', () => {
            staff = undefined;
            let value = 'bob';

            let isContained = vm.filterStaff(staff, value);

            expect(isContained).toBeFalsy();
        });

        it('when value is undefined, return false', () => {
            let isContained = vm.filterStaff(staff, undefined);

            expect(isContained).toBeFalsy();
        });
    });
});