import BaseService from '../../../base.service';

export default class PermissionsSetsService extends BaseService {
	constructor($http, $q) {
		'ngInject';
		super();


		this.$http = $http;
		this.$q = $q;
	}
}