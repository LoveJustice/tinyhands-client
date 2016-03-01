class BaseService {
	constructor($http) {
		'ngInject';

		this.$http = $http;

		this.baseUrl = "http://edwards.cse.taylor.edu:80/";
		this.errors = [];
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

		return this.$http.get(this.baseUrl + url + params, { headers: headers });
	}


	// Error Handling
	handleErrors(error) {
		var errorData = error.data;
		for (var key in errorData) {
			this.errors.push({
				field: key,
				messages: errorData[key]
			});
		}
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

		return this.$http.post(this.baseUrl + url, data, { headers: headers });
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

		return this.$http.put(this.baseUrl + url, data, { headers: headers });
  }

  delete(url, data, userHeaders) {
    var headers = {};
    angular.copy(userHeaders, headers);
    if (sessionStorage.getItem('token')) {
      headers.Authorization = sessionStorage.token;
    }

    return this.$http.delete(this.baseUrl + url, data, { headers: headers });
  }
}

export default BaseService;
