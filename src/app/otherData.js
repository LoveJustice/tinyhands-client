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
        let parts = ('' + valueId).split('-');
        if (parts.length === 1) {
            if (this.origQuestions[valueId] !== null && this.origQuestions[valueId].response !== null &&
                    this.origQuestions[valueId].response.value !== null) {
                value = this.origQuestions[valueId].response.value;
            }  
        } else if (parts.length === 2) {
            if (this.origQuestions[Number(parts[0])] && this.origQuestions[Number(parts[0])].response && this.origQuestions[Number(parts[0])].response[parts[1]] &&
                    this.origQuestions[Number(parts[0])].response[parts[1]].value) {
                value = this.origQuestions[Number(parts[0])].response[parts[1]].value;
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
	
	getValue(valueId) {
	    if (!this.questions.hasOwnProperty(valueId)) {
	        return null;
	    }
	    if (this.questions[valueId].value === 'Other') {
	        return this.questions[valueId].otherValue;
	    } else {
	        return this.questions[valueId].value;
	    }
	}
	
	updateResponses() {
		for (var property in this.questions) {
		    if (this.questions.hasOwnProperty(property)) {
	        	let value = this.questions[property].value;
	        	if (value === 'Other') {
	        		value = this.questions[property].otherValue;
	        	}
	        	
	        	let parts = ('' + property).split('-');
	        	if (parts.length === 1) {
	        	    this.origQuestions[property].response.value = value;
	        	} else if (parts.length === 2 && this.origQuestions.hasOwnProperty(parts[0]) &&
	        	        this.origQuestions[parts[0]].response.hasOwnProperty(parts[1])) {
	        	    this.origQuestions[parts[0]].response[parts[1]].value = value;
	        	}
		    }
		}
	}
}

module.exports = OtherData;