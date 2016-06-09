import UtilService from './util.service';

describe('UtilService', () => {

    let service;

    beforeEach(() => {
        service = new UtilService();
    });


    describe('function handleErrors', () => {
        let error = { data: { a: 1, b: 2, c: 3 } };
        let expectedErrors = [{ field: 'a', messages: 1 }, { field: 'b', messages: 2 }, { field: 'c', messages: 3 }];

        it(`should set errors ${expectedErrors}`, () => {
            let result = service.handleErrors(error);
            expect(result).toEqual(expectedErrors);
        });
    });
});