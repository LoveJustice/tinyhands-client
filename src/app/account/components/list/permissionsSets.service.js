import BaseService from '../../../base.service';

export default class PermissionsSetsService extends BaseService {
	constructor($http, $q) {
		'ngInject';
		super();


		this.$http = $http;
		this.$q = $q;
	}

  getPermissions() {
    return this.get('/api/defaultPermissionsSet/')
  }

	getPermission(id) {
		return this.get('/api/defaultPermissionsSet/:'+id+'/')
	}

	create() {
		return this.post('/api/defaultPermissionsSet/')
	}

	update(id) {
		return this.put('/api/defaultPermissionsSet/:'+id+'/')
	}

	delete(id) {
		return this.delete('/api/defaultPermissionsSet/:'+id+'/')
	}

}