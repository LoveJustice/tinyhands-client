class BaseService {
	constructor($http) {
		'ngInject';
		this.$http = $http;
	}
	
	/*
	* Function: get
	* Params: 
	*	url - string
	* headers - JSON object
	* params - Array of JSON objects formatted [ { name: "first", value: "Rick" }, { name: "last", value: "Astley" }, { name: "job", value: "Rock Star" } ]
	*/
	get(url, headers={}, params=[]) {
		if(sessionStorage.getItem("token")) {
			headers.Authorization = sessionStorage.token;
		}

		return this.$http({
			method: 'GET',
			url: 'http://0.0.0.0:3389/' + url + $.param(params),
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
	post(url, userHeaders, data) {
		var headers = {};
		angular.copy(userHeaders, headers);
		if(sessionStorage.getItem("token")){
			headers.Authorization = sessionStorage.token;
		}
        
		return this.$http({
			method: 'POST',
			url: 'http://0.0.0.0:3389/' + url,
			headers: headers,
			data: data
		});
	}
}

export default BaseService;