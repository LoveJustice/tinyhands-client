import constants from './constants';

/**
 * Base class that all services should extend.
 *
 * @class BaseService
 */
class BaseService {
	/**
	 * Creates an instance of BaseService.
	 *
	 * @param $http Angular http service
	 */
  constructor($http) {
    'ngInject';

    this.$http = $http;

    this.baseUrl = constants.BaseUrl;
    this.errors = [];
  }


  /**
   * Function to add the token to the header.
   *
   * @param {Object} [headers] JSON object containing header options.
   */
  addToken(headers) {
    if (sessionStorage.getItem('token')) {
      headers.Authorization = sessionStorage.token;
    }
  }


  /**
   * HTTP delete function
   *
	 * @param {string} url Url string for api endpoint
	 * @param data Data that is being updated.
	 * @param {Object} [headers] JSON object containing header options.
	 * @returns Promise of http response.
   */
  delete(url, data, headers = {}) {
    if (sessionStorage.getItem('token')) {this.addToken(headers);}

    return this.$http.delete(this.baseUrl + url, data, { headers: headers });
  }


	/**
	 * HTTP get function
	 *
	 * @param {string} url Url string for api endpoint
	 * @param {Array} [params] Array of JSON objects formatted [ { name: "first", value: "Rick" }, { name: "last", value: "Astley" }, { name: "job", value: "Rock Star" } ]
	 * @param {Object} [headers] JSON object containing header options.
	 * @returns Promise of http response.
	 */
  get(url, params = [], headers = {}) {
    this.addToken(headers);

    if (params.length > 0) {
      params = params ? '?' + $.param(params) : '';
    } else {
      params = '';
    }

    return this.$http.get(this.baseUrl + url + params, { headers: headers });
  }


  // Error Handling
	/**
	 * Function to handle errors.
	 *
	 * @param {Object} error JSON object that contains the error response from the http endpoint.
	 */
  handleErrors(error) {
    var errorData = error.data;
    for (var key in errorData) {
      this.errors.push({
        field: key,
        messages: errorData[key]
      });
    }
  }


	/**
	 * HTTP post function
	 *
	 * @param {string} url Url string for api endpoint.
	 * @param data Data that is being created.
	 * @param {Object} [headers] JSON object containing header options.
	 * @returns Promise of http response.
	 */
  post(url, data, headers = {}) {
    this.addToken(headers);

    return this.$http.post(this.baseUrl + url, data, { headers: headers });
  }


	/**
	 * HTTP put function
	 *
	 * @param {string} url Url string for api endpoint
	 * @param data Data that is being updated.
	 * @param {Object} [headers] JSON object containing header options.
	 * @returns Promise of http response.
	 */
  put(url, data, headers = {}) {
    this.addToken(headers);

    return this.$http.put(this.baseUrl + url, data, { headers: headers });
  }
}

export default BaseService;
