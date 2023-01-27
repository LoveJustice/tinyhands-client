class DateData {
	constructor(origQuestions) {
		this.origQuestions = origQuestions;
		this.questions = {};
	}
	
	dateAsUTC(inDateString) {
	    let parts = inDateString.split("-");
	    let year = Number(parts[0]);
	    let month = Number(parts[1]) - 1;
	    let date = Number(parts[2]);
	    let utcDate = new Date(Date.UTC(year, month, date, 0, 0, 0, 0));
	    return utcDate;
	}
	
	setDate(questionId, dateType) {
		if (dateType === 'basic') {
			let value = '';
			if (this.origQuestions[questionId] !== null && this.origQuestions[questionId].response !== null &&
					this.origQuestions[questionId].response.value !== null) {
				value = this.origQuestions[questionId].response.value;
			}
			let dateValue = '';
			if (value !== null && value !== '') {
				dateValue = this.dateAsUTC(value);
			}
			this.questions[questionId] = {dateType:dateType, value:dateValue};
		} else if (dateType === 'person') {
			let bdate = this.origQuestions[questionId].response.birthdate;
			let dateValue = '';
			if (bdate && bdate.value) {
				dateValue = this.dateAsUTC(bdate.value);
			}
			this.questions[questionId] = {dateType:dateType, value:dateValue};
		}
	}
	
	dateToString(dt) {
	    let dateString = '';
	    dateString = dt.getUTCFullYear() + '-';
            if (dt.getUTCMonth() < 9) {
                dateString += '0';
            }
            dateString += (dt.getUTCMonth()+1) + "-";
            if (dt.getUTCDate() <= 9) {
                dateString += '0';
            }
            dateString += dt.getUTCDate();
            return dateString;
	}
	
	getValue(questionId) {
	    if (this.questions.hasOwnProperty(questionId)) {
	        let dt = this.questions[questionId].value;
	        let dateString = null;
	        if (dt !== null && dt instanceof Date && !isNaN(dt.getTime())) {
                    dateString = this.dateToString(dt);
                }
	        return dateString;
	    } else {
	        return null;
	    }
	}
	
	updateResponses() {
		for (var property in this.questions) {
		    if (this.questions.hasOwnProperty(property)) {
		    	let dt = this.questions[property].value;
		    	let dateString = '';
		    	if (dt) {
		    		if (dt instanceof Date && !isNaN(dt.getTime())) {
		    			dateString = this.dateToString(dt);
		    		} else {
		    			// Date is invalid.  Set the value to a real
		    			// date so that the serializer will be able to parse
		    			// but very old so validation can recognize it as invalid
		    	    	dateString = '1800-01-01'
		    	    }
		    	}
		    	if (this.questions[property].dateType === 'person') {
		    		this.origQuestions[property].response.birthdate.value = dateString;
		    	} else {
		    		
		    		this.origQuestions[property].response.value =  dateString;
		    	}
		    }
		}
	}
}

module.exports = DateData;
