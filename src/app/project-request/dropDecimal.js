function dropDecimal (value) {
	let rv = value;
	let pos = value.indexOf('.')
	if (pos >= 0 && pos < value.length) {
		let decimal = value.substring(pos);
		if (!isNaN(decimal)) {
			rv = value.substring(0,pos);
		}
	}
	return rv;
}

export function dropDecimals(requestList) {
	for (let requestIdx in requestList) {
		let request = requestList[requestIdx];
		if (request.drop_decimal) {
			request.original_cost = dropDecimal(request.original_cost);
			request.cost = dropDecimal(request.cost);
		}
	}
};