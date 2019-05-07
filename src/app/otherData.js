/* global _ */

class OtherData {
	constructor(origQuestions) {
		this.origQuestions = origQuestions;
		this.questions = {};
	}
	
	setRadioButton(items, valueId, dataType='basic') {
		if  (!(valueId in this.questions)) {
    		this.questions[valueId] = {dataType:dataType};
    	}
        let flattenedItems = _.flattenDeep(items);
        let value = '';
        if (dataType === 'basic') {
            if (this.origQuestions[valueId] !== null && this.origQuestions[valueId].response !== null &&
    				this.origQuestions[valueId].response.value !== null) {
    			value = this.origQuestions[valueId].response.value;
    		}  
        } else if (dataType === 'person') {
            if (this.origQuestions[valueId] && this.origQuestions[valueId].response && this.origQuestions[valueId].response.nationality &&
                    this.origQuestions[valueId].response.nationality.value) {
                value = this.origQuestions[valueId].response.nationality.value;
            }
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
	        		value = this.questions[property].otherValue;
	        	}
	        	
	        	if (this.questions[property].dataType === 'basic') {
	        	    this.origQuestions[property].response.value = value;
	        	} else if (this.questions[property].dataType === 'person') {
	        	    this.origQuestions[property].response.nationality.value = value;
	        	}
		    }
		}
	}
}

module.exports = OtherData;