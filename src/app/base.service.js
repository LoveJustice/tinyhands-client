class BaseService {
	constructor($http) {
		'ngInject';

		this.$http = $http;
		this.baseUrl = "http://craton.cse.taylor.edu:3389/";
	}
	
	/*
	* Function: get
	* Params: 
	*	url - string
	* headers - JSON object
	* params - Array of JSON objects formatted [ { name: "first", value: "Rick" }, { name: "last", value: "Astley" }, { name: "job", value: "Rock Star" } ]
	*/
	get(url, params=[], headers={}) {
		if(sessionStorage.getItem('token')) {
			headers.Authorization = sessionStorage.token;
		}

		if (params.length > 0) {
			params = params ? '?' + $.param(params) : '';
		} else {
			params = '';
		}
		
		return this.$http({
			method: 'GET',
			url: this.baseUrl + url + params,
			headers: headers
		});
	}


	/*
	* Function: post
	* Params:
	*	url - string
	* headers - JSON object
	* data - JSON object of data to post
	*/
	post(url, data, userHeaders) {
		var headers = {};
		angular.copy(userHeaders, headers);
		if(sessionStorage.getItem('token')){
			headers.Authorization = sessionStorage.token;
		}

		return this.$http({
			method: 'POST',
			url: this.baseUrl + url,
			headers: headers,
			data: data
		});
	}


	/*
	* Function: put
	* Params:
	*	url - string
	* headers - JSON object
	* data - JSON object of data to post
	*/
	put(url, data, userHeaders) {
		var headers = {};
		angular.copy(userHeaders, headers);
		if(sessionStorage.getItem('token')){
			headers.Authorization = sessionStorage.token;
		}

		return this.$http({
			method: 'PUT',
			url: this.baseUrl + url,
			headers: headers,
			data: data
		});
	}
}

export default BaseService;