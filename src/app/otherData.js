/* global _ */

class OtherData {
	constructor(origQuestions) {
		this.origQuestions = origQuestions;
		this.questions = {};
	}
	
	setRadioButton(items, valueId) {
		if  (!(valueId in this.questions)) {
    		this.questions[valueId] = {};
    	}
        let flattenedItems = _.flattenDeep(items);
        let value = '';
        if (this.origQuestions[valueId] !== null && this.origQuestions[valueId].response !== null &&
				this.origQuestions[valueId].response.value !== null) {
			value = this.origQuestions[valueId].response.value;
		}
        if (!_.includes(flattenedItems, value) && value !== '' && value !== null) {
        	this.questions[valueId].value = 'Other';
        	this.questions[valueId].otherValue = value;
        } else {
        	this.questions[valueId].value = value;
        	this.questions[valueId].otherValue = '';
        }
	}
	
	updateResponses() {
		for (var property in this.questions) {
		    if (this.questions.hasOwnProperty(property)) {
	        	let value = this.questions[property].value;
	        	if (value === 'Other') {
	        		this.origQuestions[property].response.value = this.questions[property].otherValue;
	        	} else {
	        		this.origQuestions[property].response.value =  value;
	        	}
		    }
		}
	}
}

module.exports = OtherData;