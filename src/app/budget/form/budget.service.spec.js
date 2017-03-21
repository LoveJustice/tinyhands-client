// import BudgetService from './budget.service';

// describe('BudgetService', () => {
//     let mockBaseService, service;

//     let budgetId = 123,
//         borderStationId = 123,
//         id = 123,
//         otherItem = { id: 'aOtherItem' },
//         salaryData = { id: 'aSalData' },
//         formSection = 'formSect',
//         month = 'aMonth',
//         year = 'aYear',
//         form = 'aForm';


//     beforeEach(() => {
//         let mockUtilService = jasmine.createSpyObj('mockUtilService', ['handleErrors', 'validId']);
//         mockUtilService.validId.and.callFake(() => { return true; });
//         mockBaseService = jasmine.createSpyObj('mockBaseService', ['delete', 'get', 'post', 'put']);
//         service = new BudgetService(mockBaseService, mockUtilService);
//     });

//     describe('function createOtherItem', () => {
//         let url = `api/budget/${budgetId}/item/`;
//         it(`should get called with ${url} and'${otherItem}'`, () => {
//             service.createOtherItem(budgetId, otherItem);
//             expect(mockBaseService.post).toHaveBeenCalledWith(url, otherItem);
//         });
//     });

//     describe('functin createSalary', () => {
//         let url = `api/budget/staff_salary/`;
//         it(`should get called with ${salaryData}`, () => {
//             service.createSalary(salaryData);
//             expect(mockBaseService.post).toHaveBeenCalledWith(url, salaryData);
//         });
//     });

//     describe('function deleteOtherItem', () => {
//         let url = `api/budget/${budgetId}/item/${otherItem.id}/`;
//         it(`should be called with ${url}`, () => {
//             service.deleteOtherItem(budgetId, otherItem);
//             expect(mockBaseService.delete).toHaveBeenCalledWith(url);
//         });
//     });

//     describe('function getBorderStation', () => {
//         let url = `api/border-station/${id}/`;
//         it(`should be called with ${url}`, () => {
//             service.getBorderStation(id);
//             expect(mockBaseService.get).toHaveBeenCalledWith(url);
//         });
//     });

//     describe('function getBudgetForm', () => {
//         let url = `api/budget/${id}/`;
//         it(`should have been called with ${url}`, () => {
//             service.getBudgetForm(id);
//             expect(mockBaseService.get).toHaveBeenCalledWith(url);
//         });
//     });

//     describe('function getOtherItems', () => {
//         let url = `api/budget/${budgetId}/item/?form_section=${formSection}`;
//         it(`should be called with ${url}`, () => {
//             service.getOtherItems(budgetId, formSection);
//             expect(mockBaseService.get).toHaveBeenCalledWith(url);
//         });
//     });

//     describe('function getPreviousData', () => {
//         let url = `api/budget/previous_data/${borderStationId}/${month}/${year}/`;
//         it(`should be called with ${url}`, () => {
//             service.getPreviousData(borderStationId, month, year);
//             expect(mockBaseService.get).toHaveBeenCalledWith(url);
//         });
//     });

//     describe('function getStaff', () => {
//         let url = `api/staff/?border_station=${borderStationId}`;
//         it(`should have been called with ${url}`, () => {
//             service.getStaff(borderStationId);
//             expect(mockBaseService.get).toHaveBeenCalledWith(url);
//         });
//     });

//     describe('function getStaffSalaries', () => {
//         let url = `api/budget/${budgetId}/staff_salary/`;
//         it(`should have been called with ${url}`, () => {
//             service.getStaffSalaries(budgetId);
//             expect(mockBaseService.get).toHaveBeenCalledWith(url);
//         });
//     });

//     describe('function updateForm', () => {
//         let url = `api/budget/${budgetId}/`;
//         it(`should have been called with ${url} and ${form}`, () => {
//             service.updateForm(budgetId, form);
//             expect(mockBaseService.put).toHaveBeenCalledWith(url, form);
//         });
//     });

//     describe('function updateOtherItem', () => {
//         let url = `api/budget/${budgetId}/item/${otherItem.id}/`;
//         it(`should be called with ${url} and ${otherItem}`, () => {
//             service.updateOtherItem(budgetId, otherItem);
//             expect(mockBaseService.put).toHaveBeenCalledWith(url, otherItem);
//         });
//     });

//     describe('function updaterSalary', () => {
//         let url = `api/budget/${budgetId}/staff_salary/${salaryData.id}/`;
//         it(`should be have been called with ${url} and ${salaryData}`, () => {
//             service.updateSalary(budgetId, salaryData);
//             expect(mockBaseService.put).toHaveBeenCalledWith(url, salaryData);
//         });
//     });
// });









