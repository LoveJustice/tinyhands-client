export default class UtilService {
    // Error Handling
	/**
	 * Function to handle errors.
	 *
	 * @param {Object} error JSON object that contains the error response from the http endpoint.
	 */
    handleErrors(error) {
        var errorData = error.data;
        var errors = [];
        for (var key in errorData) {
            errors.push({
                field: key,
                messages: errorData[key]
            });
        }
        return errors;
    }


    validId(id) {
        if (typeof id !== undefined && parseInt(id) >= 0) {
            return true;
        }
        return false;
    }
}