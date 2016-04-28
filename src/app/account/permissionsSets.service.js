import BaseService from '../base.service';

export default class PermissionsSetsService extends BaseService {
  constructor($http, $q) {
	'ngInject';
	super();

	this.$http = $http;
	this.$q = $q;
  }

  getPermissions() {
    return this.get('api/defaultPermissionsSet/');
  }

  getPermission(id) {
    return this.get(`api/defaultPermissionsSet/${id}/`);
  }

  create(data) {
	return this.post('api/defaultPermissionsSet/', data);
  }

  update(id, data) {
	return this.put(`api/defaultPermissionsSet/${id}/`, data);
  }

  destroy(id) {
	return this.delete(`api/defaultPermissionsSet/${id}/`);
  }

}