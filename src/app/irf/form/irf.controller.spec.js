import IrfController from './irf.controller';
import IrfService from './irf.service';

describe('IrfController', () => {
    let service, stateParams, vm, rootScope;

    beforeEach(inject(($http, $rootScope) => {
        stateParams = { id: 1 };
        rootScope = $rootScope;
        service = new IrfService($http);
        vm = new IrfController(rootScope, stateParams, service);
    }));


    describe('function constructor', () => {
        it('form should be an empty object', () => {
            expect(vm.form).toEqual({});
        });

        it('irfId should equal stateParams id', () => {
            expect(vm.irfId).toEqual(stateParams.id);
        });

        it('page9 how_sure_was_traficking_options should be an object for select options', () => {
            expect(vm.page9.how_sure_was_trafficking_options).toEqual([
                { name: '1 - Not at all sure', val: 1 },
                { name: '2 - Unsure but suspects it', val: 2 },
                { name: '3 - Somewhat sure', val: 3 },
                { name: '4 - Very sure', val: 4 },
                { name: '5 - Absolutely sure', val: 5 }
            ]);
        });

        it('sections should be an empty array', () => {
            vm.sections = [1, 2, 3, 4, 5, 6];
            spyOn(vm, 'addSections');

            vm.constructor(rootScope, stateParams, service);

            expect(vm.sections).toEqual([]);
        });

        it('selectedSectionIndex should be 0', () => {
            expect(vm.selectedSectionIndex).toEqual(0);
        });

        it('should call addSections', () => {
            spyOn(vm, 'addSections');

            vm.constructor(rootScope, stateParams, service);

            expect(vm.addSections).toHaveBeenCalled();
        });

        it('should call getIrf', () => {
            spyOn(vm, 'getIrf');

            vm.constructor(stateParams, service);

            expect(vm.getIrf).toHaveBeenCalled();
        });
    });


    describe('function addSections', () => {
        it('should urls to sections', () => {
            vm.sections = [];

            vm.addSections();

            expect(vm.sections).not.toEqual([]);
        });
    });


    describe('function getIrf', () => {
        it('should call service getIrf with irfId', () => {
            spyOn(vm.service, 'getIrf').and.returnValue({ then: () => { } });

            vm.getIrf();

            expect(vm.service.getIrf).toHaveBeenCalledWith(vm.irfId);
        });

        it('should set form to response data', () => {
            let response = { data: 'hi' };
            spyOn(vm.service, 'getIrf').and.returnValue({ then: (f) => { f(response) } });

            vm.getIrf();

            expect(vm.form).toEqual(response.data);
        });

        it('should set page9.how_sure_was_trafficking to the page9.how_sure_was_trafficking_options[0]', () => {
            let response = { data: { how_sure_was_trafficking: 1 } };
            spyOn(vm.service, 'getIrf').and.returnValue({ then: (f) => { f(response) } });
            vm.getIrf();

            expect(vm.page9.how_sure_was_trafficking).toEqual({ name: '1 - Not at all sure', val: 1 });
        });

        it('should set page9.how_sure_was_trafficking to the page9.how_sure_was_trafficking_options[1]', () => {
            let response = { data: { how_sure_was_trafficking: 2 } };
            spyOn(vm.service, 'getIrf').and.returnValue({ then: (f) => { f(response) } });
            vm.getIrf();

            expect(vm.page9.how_sure_was_trafficking).toEqual({ name: '2 - Unsure but suspects it', val: 2 });
        });

        it('should set page9.how_sure_was_trafficking to the page9.how_sure_was_trafficking_options[2]', () => {
            let response = { data: { how_sure_was_trafficking: 3 } };
            spyOn(vm.service, 'getIrf').and.returnValue({ then: (f) => { f(response) } });
            vm.getIrf();

            expect(vm.page9.how_sure_was_trafficking).toEqual({ name: '3 - Somewhat sure', val: 3 });
        });

        it('should set page9.how_sure_was_trafficking to the page9.how_sure_was_trafficking_options[3]', () => {
            let response = { data: { how_sure_was_trafficking: 4 } };
            spyOn(vm.service, 'getIrf').and.returnValue({ then: (f) => { f(response) } });
            vm.getIrf();

            expect(vm.page9.how_sure_was_trafficking).toEqual({ name: '4 - Very sure', val: 4 });
        });

        it('should set page9.how_sure_was_trafficking to the page9.how_sure_was_trafficking_options[4]', () => {
            let response = { data: { how_sure_was_trafficking: 5 } };
            spyOn(vm.service, 'getIrf').and.returnValue({ then: (f) => { f(response) } });
            vm.getIrf();

            expect(vm.page9.how_sure_was_trafficking).toEqual({ name: '5 - Absolutely sure', val: 5 });
        });
    });


    describe('function nextSection', () => {
        it('if selectedSectionIndex is less than the length of sections minus 1 should increment selectedSectionIndex by one', () => {
            vm.sections = [1, 2, 3, 4];
            vm.selectedSectionIndex = 0;

            vm.nextSection();

            expect(vm.selectedSectionIndex).toEqual(1);
        });

        it('if selectedSectionIndex is equal to the length of sections minus 1 should do nothing', () => {
            vm.sections = [1, 2, 3, 4];
            vm.selectedSectionIndex = 3;

            vm.nextSection();

            expect(vm.selectedSectionIndex).toEqual(3);
        });

        it('if selectedSectionIndex is greater than the length of sections minus 1 should do nothing', () => {
            vm.sections = [1, 2, 3, 4];
            vm.selectedSectionIndex = 13;

            vm.nextSection();

            expect(vm.selectedSectionIndex).toEqual(13);
        });
    });


    describe('function previousSection', () => {
        it('if selectedSectionIndex is greater than 0 should decrement selectedSectionIndex by one', () => {
            vm.sections = [1, 2, 3, 4];
            vm.selectedSectionIndex = 2;

            vm.previousSection();

            expect(vm.selectedSectionIndex).toEqual(1);
        });

        it('if selectedSectionIndex is equal to 0 should do nothing', () => {
            vm.sections = [1, 2, 3, 4];
            vm.selectedSectionIndex = 0;

            vm.previousSection();

            expect(vm.selectedSectionIndex).toEqual(0);
        });

        it('if selectedSectionIndex is less than 0 should do nothing', () => {
            vm.sections = [1, 2, 3, 4];
            vm.selectedSectionIndex = -13;

            vm.previousSection();

            expect(vm.selectedSectionIndex).toEqual(-13);
        });
    });
});