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
	
	updateResponses() {
		for (var property in this.questions) {
		    if (this.questions.hasOwnProperty(property)) {
		    	let dt = this.questions[property].value;
		    	let dateString = '';
		    	if (dt !== null && dt instanceof Date && !isNaN(dt.getTime())) {
		    		dateString = dt.getUTCFullYear() + '-' + (dt.getUTCMonth()+1) + "-" +dt.getUTCDate();
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