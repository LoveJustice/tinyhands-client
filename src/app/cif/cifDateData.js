class CifDateData {
	constructor(origQuestions) {
		this.origQuestions = origQuestions;
		this.questions = {};
	}
	
	setDate(questionId, dateType) {
		if (dateType === 'basic') {
			let value = this.origQuestions[questionId].response.value;
			let dateValue = '';
			if (value !== null && value !== '') {
				dateValue = new Date(value);
			}
			this.questions[questionId] = {dateType:dateType, value:dateValue};
		} else if (dateType === 'person') {
			let bdate = this.origQuestions[questionId].response.birthdate;
			let dateValue = '';
			if (bdate !== undefined && bdate !== null && bdate.value !== null && bdate.value !== '') {
				dateValue = new Date(bdate.value);
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

module.exports = CifDateData;