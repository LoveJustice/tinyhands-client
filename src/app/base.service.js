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
	get(url, headers, params) {
		return this.$http({
			method: 'GET',
			url: url,
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
	post(url, headers, data) {
		return this.$http({
			method: 'POST',
			url: url,
			headers: headers,
			data: data
		});
	}
}

export default BaseService;