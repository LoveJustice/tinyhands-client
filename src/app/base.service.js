class BaseService {
	constructor($http, BASE_URL) {
		'ngInject';
		this.$http = $http;
		this.BASE_URL = 'http://craton.cse.taylor.edu:3389/';
	}
	
	/*
	* Function: get
	* Params: 
	*	url - string
	* headers - JSON object
	* params - Array of JSON objects formatted [ { name: "first", value: "Rick" }, { name: "last", value: "Astley" }, { name: "job", value: "Rock Star" } ]
	*/
	get(url, params=[], headers={}) {
		if(sessionStorage.getItem("token")) {
			headers.Authorization = sessionStorage.token;
		}


		params = params ? "?" + $.param(params) : "";
		return this.$http({
			method: 'GET',
			url: this.BASE_URL + url + params,
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
		if(sessionStorage.getItem("token")){
			headers.Authorization = sessionStorage.token;
		}

		return this.$http({
			method: 'POST',
			url: this.BASE_URL + url,
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
		if(sessionStorage.getItem("token")){
			headers.Authorization = sessionStorage.token;
		}

		return this.$http({
			method: 'PUT',
			url: this.BASE_URL + url,
			headers: headers,
			data: data
		});
	}
}

export default BaseService;