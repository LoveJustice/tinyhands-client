class IdManagementService {
    constructor(BaseService) {
        'ngInject';
        this.service = BaseService;
    }

    listKnownPersons(queryParams) {
        return this.service.get('api/idmgmt/', queryParams);
    }
    
    getKnownPerson(person_id) {
        return this.service.get('api/idmgmt/aperson/?person_id=' + person_id);
    }

    loadMoreKnownPersons(queryParams) {
        return this.service.get('api/idmgmt/', queryParams);
    }

    getFuzzyKnownPersons(val) {
        return this.service.get('api/idmgmt/fuzzy/?name=' + val);
    }
    
    getPhoneKnownPersons(val) {
        return this.service.get('api/idmgmt/phone/?phone=' + val);
    }
    
    getKnownPersonForms(val) {
        return this.service.get('api/idmgmt/forms/?person_id=' + val);
    }
    
    getAliasMembers(val) {
    	return this.service.get('api/idmgmt/group/?group_id=' + val);
    }
    
    addAliasGroup(id1, id2) {
    	return this.service.put(`api/idmgmt/${id1}/addgroup/${id2}/`);
    }
    
    removeAliasGroup(id1) {
    	 return this.service.put(`api/idmgmt/${id1}/removegroup/`);
    }
}

export default IdManagementService;
