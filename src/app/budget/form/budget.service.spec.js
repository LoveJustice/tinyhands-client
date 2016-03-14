import BudgetListService from './budget.service'

describe('BudgetListService', () => {
    let service;

    let budgetId = 123,
        borderStationId = 123,
        Id = 123,
        otherItem = 'asdff';


    beforeEach(inject(($http) => {
        service = new BudgetListService($http);
    }));

    describe('function createOtherItem', () => {
        it(`should get called with'${budgetId}'and'${otherItem}' `, () => {
            let url = `api/budget/${budgetId}/item`;
            spyOn(service, 'post');
            service.createOtherItem(url, otherItem);
            expect(service.createOtherItem).toHaveBeenCalledWith(budgetId, otherItem);
        });
    });
});