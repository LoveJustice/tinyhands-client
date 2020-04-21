class CheckboxGroup {
    constructor() {
        this.questions = {};
    }
    
    checkboxItem(questionId, value) {
        if (!this.questions.hasOwnProperty(questionId)) {
            this.questions[questionId] = {};
            this.questions[questionId].internalOther = '';
        }
        if (!this.questions[questionId].hasOwnProperty(value)) {
            this.questions[questionId][value] = false;
        }
        return this.questions[questionId][value];
    }
    checkboxOther(questionId) {
        if (!this.questions.hasOwnProperty(questionId)) {
            this.questions[questionId] = {};
            this.questions[questionId].internalOther = '';
        }
        return this.questions[questionId].internalOther;
    }
    
    initOriginalValues(originalQuestions) {
        this.originalQuestions = originalQuestions;
        for (let property in this.questions) {
            if (this.questions.hasOwnProperty(property)) {
                for (let entry in this.questions[property]) {
                    if (entry === 'internalOther') {
                        this.questions[property][entry] = '';
                    } else {
                        this.questions[property][entry] = false;
                    }
                }
                let values = this.originalQuestions[property].response.value.split(';');
                for (let idx=0; idx < values.length; idx++) {
                    if (this.questions[property].hasOwnProperty(values[idx])) {
                        this.questions[property][values[idx]] = true;
                    } else {
                        if (this.questions[property].internalOther.length > 0) {
                            this.questions[property].internalOther += ';';
                        }
                        this.questions[property].internalOther += values[idx];
                    }
                }
            }
        }
    }
    
    getValue(questionId) {
        if (!this.questions.hasOwnProperty(questionId)) {
            return null;
        }
        let value = this.questions[questionId].internalOther;
        for (let entry in this.questions[questionId]) {
            if (entry !== 'internalOther' && this.questions[questionId].hasOwnProperty(entry) && this.questions[questionId][entry]) {
                if (value.length > 0) {
                    value += ';';
                }
                value += entry;
            }
        }
        return value;
    }
    
    updateResponses() {
        for (var property in this.questions) {
            if (this.questions.hasOwnProperty(property)) {
                this.originalQuestions[property].response.value = this.getValue(property);
            }
        }
    }
}

module.exports = CheckboxGroup;