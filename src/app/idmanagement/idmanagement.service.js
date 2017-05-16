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

    loadMoreKnownPersons(queryParams) {
        return this.service.get('api/knownperson/', queryParams);
    }

    getFuzzyKnownPersons(val) {
        return this.service.get('api/knownperson/fuzzy/?name=' + val);
    }
    
    getPhoneKnownPersons(val) {
        return this.service.get('api/knownperson/phone/?phone=' + val);
    }
    
    getKnownPersonForms(val) {
        return this.service.get('api/knownperson/forms/?person_id=' + val);
    }
    
    getAliasMembers(val) {
    	return this.service.get('api/knownperson/group/?group_id=' + val);
    }
    
    addAliasGroup(id1, id2) {
    	return this.service.put(`api/knownperson/${id1}/addgroup/${id2}/`);
    }
    
    removeAliasGroup(id1) {
    	 return this.service.put(`api/knownperson/${id1}/removegroup/`);
    }
}

export default IdManagementService;
