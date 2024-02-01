export default class MdfListService {
    constructor(BaseService) {
        'ngInject';
        this.service = BaseService;
    }

    deleteBorderStationMdf(id) {
        return this.service.delete(`api/mdf-pr/${id}/`);
    }

    getMdfList(searchTerm, sortValue, country_ids, nextPage) {
        let params = [{ name: "page_size", value: "25" }, { name: "search", value: searchTerm }, { name: "ordering", value: sortValue }];
        if (country_ids !== null && country_ids !== '') {
            params.push({name:"country_ids", value:country_ids});
        }
        if (nextPage !== null) {
            params.push({name:"page", value:nextPage});
        }
        return this.service.get('api/mdf-combined/', params);
    }

    getNextMdfPage(nextPageUrl) {
        return this.service.get(nextPageUrl);
    }

    getMdf(id) {
        return this.service.get(`api/mdf/${id}/`);
    }

    sendMdfEmails(people) {
        return this.service.post(`api/mdf/${people.mdf_id}/`, people);
    }
    
    getUserCountries(id) {
        return this.service.get(`api/user_permission/countries/${id}/?permission_group=MDF&form_present=true`);

    }
    
    getUserStationsForAdd(id) {
        return this.service.get(`api/user_permission/stations/${id}/?permission_group=MDF&form_type=MDF&form_present=true&action=ADD`);
    }
    
    getNewMdf(projectId, year, month) {
    	return this.service.get(`api/mdf-pr/new/${projectId}/${year}/${month}/`);
    }

}
