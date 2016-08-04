export default class PermissionsSetsService {
    constructor(BaseService) {
        'ngInject';
        this.service = BaseService;
    }

    getPermissions() {
        return this.service.get('api/defaultPermissionsSet/');
    }

    getPermission(id) {
        return this.service.get(`api/defaultPermissionsSet/${id}/`);
    }

    create(data) {
        return this.service.post('api/defaultPermissionsSet/', data);
    }

    update(id, data) {
        return this.service.put(`api/defaultPermissionsSet/${id}/`, data);
    }

    destroy(id) {
        return this.service.delete(`api/defaultPermissionsSet/${id}/`);
    }

}
