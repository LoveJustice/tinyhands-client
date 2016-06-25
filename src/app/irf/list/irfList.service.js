export default class IrfListService {
    constructor(BaseService) {
        'ngInject';
        this.service = BaseService;
    }

    getIrfList(queryParameters) {
        return this.service.get('api/irf/', this.transform(queryParameters));
    }

    getMoreIrfs(queryParameters) {
        return this.service.get('api/irf/', this.transform(queryParameters));
    }

    deleteIrf(id){
        return this.service.delete(`/api/irf/${id}/`);
    }

    irfExists(irfNumber) {
        return $http.post('irfExists/' + irfNumber);
    }

    transform(queryParams) {
        var queryParameters = angular.copy(queryParams);
        if (queryParameters.reverse) {
            queryParameters.ordering = '-' + queryParameters.ordering;
        }
        delete queryParameters.reverse;
        var params = [];
        Object.keys(queryParameters).forEach( (name) => {

            params.push({"name": name, "value": queryParameters[name]});
        })
        return params;
    }
}
