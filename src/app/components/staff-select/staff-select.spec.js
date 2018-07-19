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

    describe('function filterStaffByFirstAndLastName', () => {
        let staff;
        beforeEach(() => {
            staff = 'Johnalonny Jordanstinston';
        });

        it('when searchValue is in staff name should return true', () => {
            let value = 'alon';

            let isContained = vm.filterStaffByName(staff, value);

            expect(isContained).toBeTruthy();
        });


        it('when searchValue is not in staff name should return false', () => {
            let value = 'bob';

            let isContained = vm.filterStaffByName(staff, value);

            expect(isContained).toBeFalsy();
        });

        it('when staff is undefined, return false', () => {
            staff = undefined;
            let value = 'bob';

            let isContained = vm.filterStaffByName(staff, value);

            expect(isContained).toBeFalsy();
        });

        it('when value is undefined, return false', () => {
            let isContained = vm.filterStaffByName(staff, undefined);

            expect(isContained).toBeFalsy();
        });
    });

    describe('$onInit', () => {
        it('should set selectedStaffList by splitting selectedStaff by semicolon', () => {
            let bob = 'Bob Foo';
            let joe = 'Joe Bar';
            let selectedStaff = bob + ';' + joe;
            vm.selectedStaff = selectedStaff;

            vm.$onInit();

            expect(vm.selectedStaffList).toContain(bob);
            expect(vm.selectedStaffList).toContain(joe);
        });
    });

    describe('when selectedStaffList changed', () => {

        it('should update selectedStaff', () => {
            let bob = 'Bob Foo';
            let joe = 'Joe Bar';
        
            vm.selectedStaffList = [bob, joe];

            expect(vm.selectedStaff).toEqual(bob + ';' + joe);

        });
    });
});