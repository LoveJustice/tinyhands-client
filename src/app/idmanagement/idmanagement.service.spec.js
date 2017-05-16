import IdManagementService from './idmanagement.service';

describe('IdManagementService', () => {

    let mockBaseService, service;

    beforeEach(() => {
        mockBaseService = jasmine.createSpyObj('mockBaseService', ['get', 'put']);
        service = new IdManagementService(mockBaseService);
    });

    describe('function listKnownPersons with queryParams', () => {
        let url = 'api/knownperson/';
        let params = 'test param';
        it(`should call get with '${url}' and '${params}'`, () => {
            service.listKnownPersons(params);
            expect(mockBaseService.get).toHaveBeenCalledWith(url, params);
        });
    });
    
    describe('function getKnownPerson with val', () => {
    	let val = '123';
        let url = 'api/knownperson/aperson/?person_id=' + val;
        it(`should call get with '${url}'`, () => {
            service.getKnownPerson(val);
            expect(mockBaseService.get).toHaveBeenCalledWith(url);
        });
    });
    
    describe('function loadMoreKnownPersons with queryParams', () => {
        let url = 'api/knownperson/';
        let params = 'test param';
        it(`should call get with '${url}' and '${params}'`, () => {
            service.loadMoreKnownPersons(params);
            expect(mockBaseService.get).toHaveBeenCalledWith(url, params);
        });
    });
    
    describe('function getFuzzyKnownPersons with val', () => {
    	let val = 'John Smith';
        let url = 'api/knownperson/fuzzy/?name=' + val;
        it(`should call get with '${url}'`, () => {
            service.getFuzzyKnownPersons(val);
            expect(mockBaseService.get).toHaveBeenCalledWith(url);
        });
    });
    
    describe('function getPhoneKnownPersons with val', () => {
    	let val = '1234567890';
        let url = 'api/knownperson/phone/?phone=' + val;
        it(`should call get with '${url}'`, () => {
            service.getPhoneKnownPersons(val);
            expect(mockBaseService.get).toHaveBeenCalledWith(url);
        });
    });
    
    describe('function getKnownPersonForms with val', () => {
    	let val = '123';
        let url = 'api/knownperson/forms/?person_id=' + val;
        it(`should call get with '${url}'`, () => {
            service.getKnownPersonForms(val);
            expect(mockBaseService.get).toHaveBeenCalledWith(url);
        });
    });
    
    describe('function getAliasMembers with val', () => {
    	let val = '123';
        let url = 'api/knownperson/group/?group_id=' + val;
        it(`should call get with '${url}'`, () => {
            service.getAliasMembers(val);
            expect(mockBaseService.get).toHaveBeenCalledWith(url);
        });
    });
    
    describe('function addAliasGroup with val', () => {
    	let val = '123';
    	let val2 = '456';
        let url = 'api/knownperson/' + val + '/addgroup/' + val2 + '/';
        it(`should call put with '${url}'`, () => {
            service.addAliasGroup(val, val2);
            expect(mockBaseService.put).toHaveBeenCalledWith(url);
        });
    });
    
    describe('function removeAliasGroup with val', () => {
    	let val = '123';
        let url = 'api/knownperson/' + val + '/removegroup/';
        it(`should call put with '${url}'`, () => {
            service.removeAliasGroup(val);
            expect(mockBaseService.put).toHaveBeenCalledWith(url);
        });
    });

});