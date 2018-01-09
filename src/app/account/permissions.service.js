export default class PermissionsService {
    constructor(BaseService) {
        'ngInject';
        this.service = BaseService;
    }

    getPermissions() {
        return this.service.get('api/permission/');
    }
}