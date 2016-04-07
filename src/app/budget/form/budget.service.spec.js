import BudgetService from './budget.service';
import UtilService from '../../util/util.service';

describe('BudgetService', () => {
    let service;

    let budgetId = 123,
        borderStationId = 123,
        id = 123,
        otherItem = { id: 'aOtherItem' },
        salaryData = { id: 'aSalData' },
        formSection = 'formSect',
        month = 'aMonth',
        year = 'aYear',
        form = 'aForm';


    beforeEach(inject(($http) => {
        let utils = new UtilService();
        service = new BudgetService($http, utils);
    }));

    describe('function createOtherItem', () => {
        let url = `api/budget/${budgetId}/item/`;
        it(`should get called with ${url} and'${otherItem}'`, () => {
            spyOn(service, 'post');
            service.createOtherItem(budgetId, otherItem);
            expect(service.post).toHaveBeenCalledWith(url, otherItem);
        });
    });

    describe('functin createSalary', () => {
        let url = `api/budget/staff_salary/`;
        it(`should get called with ${salaryData}`, () => {
            spyOn(service, 'post');
            service.createSalary(salaryData);
            expect(service.post).toHaveBeenCalledWith(url, salaryData);
        });
    });

    describe('function deleteOtherItem', () => {
        let url = `api/budget/${budgetId}/item/${otherItem.id}/`;
        it(`should be called with ${url}`, () => {
            spyOn(service, 'delete');
            service.deleteOtherItem(budgetId, otherItem);
            expect(service.delete).toHaveBeenCalledWith(url, otherItem);
        });
    });

    describe('function getBorderStation', () => {
        let url = `api/border-station/${id}/`;
        it(`should be called with ${url}`, () => {
            spyOn(service, 'get');
            service.getBorderStation(id);
            expect(service.get).toHaveBeenCalledWith(url);
        });
    });

    describe('function getBudgetForm', () => {
        let url = `api/budget/${id}/`;
        it(`should have been called with ${url}`, () => {
            spyOn(service, 'get');
            service.getBudgetForm(id);
            expect(service.get).toHaveBeenCalledWith(url);
        });
    });

    describe('function getOtherItems', () => {
        let url = `api/budget/${budgetId}/item/?form_section=${formSection}`;
        it(`should be called with ${url}`, () => {
            spyOn(service, 'get');
            service.getOtherItems(budgetId, formSection);
            expect(service.get).toHaveBeenCalledWith(url);
        });
    });

    describe('function getPreviousData', () => {
        let url = `api/budget/previous_data/${borderStationId}/${month}/${year}/`;
        it(`should be called with ${url}`, () => {
            spyOn(service, 'get');
            service.getPreviousData(borderStationId, month, year);
            expect(service.get).toHaveBeenCalledWith(url);
        });
    });

    describe('function getStaff', () => {
        let url = `api/staff/?border_station=${borderStationId}`;
        it(`should have been called with ${url}`, () => {
            spyOn(service, 'get');
            service.getStaff(borderStationId);
            expect(service.get).toHaveBeenCalledWith(url);
        });
    });

    describe('function getStaffSalaries', () => {
        let url = `api/budget/${budgetId}/staff_salary/`;
        it(`should have been called with ${url}`, () => {
            spyOn(service, 'get');
            service.getStaffSalaries(budgetId);
            expect(service.get).toHaveBeenCalledWith(url);
        });
    });

    describe('function updateForm', () => {
        let url = `api/budget/${budgetId}/`;
        it(`should have been called with ${url} and ${form}`, () => {
            spyOn(service, 'put');
            service.updateForm(budgetId, form);
            expect(service.put).toHaveBeenCalledWith(url, form);
        });
    });

    describe('function updateOtherItem', () => {
        let url = `api/budget/${budgetId}/item/${otherItem.id}/`;
        it(`should be called with ${url} and ${otherItem}`, () => {
            spyOn(service, 'put');
            service.updateOtherItem(budgetId, otherItem);
            expect(service.put).toHaveBeenCalledWith(url, otherItem);
        });
    });

    describe('function updaterSalary', () => {
        let url = `api/budget/${budgetId}/staff_salary/${salaryData.id}/`;
        it(`should be have been called with ${url} and ${salaryData}`, () => {
            spyOn(service, 'put');
            service.updateSalary(budgetId, salaryData);
            expect(service.put).toHaveBeenCalledWith(url, salaryData);
        });
    });
});









