class IdManagementService {
    constructor(BaseService) {
        'ngInject';
        this.service = BaseService;
    }

    listKnownPersons(queryParams) {
        return this.service.get('api/knownperson/', queryParams);
    }
    
    getKnownPerson(person_id) {
        return this.service.get('api/knownperson/aperson/?person_id=' + person_id);
    }
    
    searchKnownPersons(queryParams) {
        return this.listKnownPersons(queryParams);
    }

    loadMoreKnownPersons(queryParams) {
        return this.service.get('api/knownperson/', queryParams);
    }

    saveAddress(knownPerson) {
        return this.service.put('api/knownperson/' + knownPerson.id + '/', knownPerson);
    }

    getFuzzyKnownPersons(val) {
        return this.service.get('api/knownperson/fuzzy/?name=' + val);
    }
    
    getKnownPersonForms(val) {
        return this.service.get('api/knownperson/forms/?person_id=' + val);
    }
    
    getAliasMembers(val) {
    	return this.service.get('api/knownperson/group/?group_id=' + val);
    }
}

export default IdManagementService;
