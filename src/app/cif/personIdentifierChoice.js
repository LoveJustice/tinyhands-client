class PersonIdentifierChoice {
    constructor(origQuestions, identifierTypes) {
        this.origQuestions = origQuestions;
        this.identifierTypes = identifierTypes;
        this.questions = {};
    }
    
    manage(question_id) {
        if (this.identifierTypes.length < 1) {
            return;
        }
        let identifiers = this.origQuestions[question_id].response.identifiers;
        let radioValue = this.identifierTypes[0];
        let activeValue = this.identifierTypes[0];
        for (let key in identifiers) {
            if (identifiers[key].number.value !== '') {
                radioValue = identifiers[key].type.value;
                activeValue = radioValue;
            }
        }
        
        this.questions[question_id] = {'radioValue':radioValue, 'activeValue':activeValue};
    }
    
    getChoice(question_id) {
        if (question_id in this.questions) {
            if (this.questions[question_id].radioValue != this.questions[question_id].activeValue) {
                this.changedValue(question_id);
                this.questions[question_id].activeValue = this.questions[question_id].radioValue;
            }
            return this.questions[question_id].radioValue;
        } else {
            return '';
        }
    }
    
    changedValue(question_id) {
        if (question_id in this.questions) {
            let identifiers = this.origQuestions[question_id].response.identifiers;
            for (let key in identifiers) {
                if (key !== this.questions[question_id].radioValue) {
                    identifiers[key].number.value = '';
                    identifiers[key].location.value = '';
                }
            }
        }
    }
}

module.exports = PersonIdentifierChoice;