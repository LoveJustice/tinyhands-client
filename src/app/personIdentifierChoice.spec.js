import PersonIdentifierChoice from "./personIdentifierChoice";

describe ('PersonIdentifierChoice', () =>{
    let pic;
    beforeEach(() => {
        let origQuestions= {
                20: {
                    response: {
                        identifiers: {
                            TypeA: {
                                type:{value:"TypeA"},
                                number:{value:""},
                                location:{value:""}
                            },
                            TypeB:{
                                type:{value:"TypeB"},
                                number:{value:""},
                                location:{value:""}
                            }
                        }
                    }
                },
                21: {
                    response: {
                        identifiers: {
                            TypeA: {
                                type:{value:"TypeA"},
                                number:{value:""},
                                location:{value:""}
                            },
                            TypeB:{
                                type:{value:"TypeB"},
                                number:{value:"B-identifier"},
                                location:{value:"B-location"}
                            },
                            TypeC:{
                                type:{value:"TypeC"},
                                number:{value:"C-identifier"},
                                location:{value:"C-location"}
                            }
                        }
                    }
                },
                
        };
        let identifierTypes = ['TypeA', 'TypeB'];
        
        pic = new PersonIdentifierChoice(origQuestions, identifierTypes);
    });
    
    describe('function manage', () =>{
        it('when ID number is not set for any type, first type should default to the first type', () => {
            pic.manage(20);
            expect (pic.questions[20].radioValue).toEqual('TypeA');
            expect (pic.questions[20].activeValue).toEqual('TypeA');
        });
        it('when ID number for a type is set, radioValue should equal the type', () => {
            pic.manage(21);
            expect (pic.questions[21].radioValue).toEqual('TypeB');
            expect (pic.questions[21].activeValue).toEqual('TypeB');
        });
    });
    
    describe('function changeValue', () =>{
        it('changeValue should clear other default types', () => {
            pic.manage(21);
            expect (pic.origQuestions[21].response.identifiers['TypeB'].number.value).toEqual('B-identifier');
            expect (pic.origQuestions[21].response.identifiers['TypeB'].location.value).toEqual('B-location');
            expect (pic.questions[21].radioValue, 'TypeB');
            pic.questions[21].radioValue = 'TypeA';
            pic.origQuestions[21].response.identifiers['TypeA'].number.value = 'A-identifier';
            pic.changedValue(21);
            expect (pic.origQuestions[21].response.identifiers['TypeB'].number.value).toEqual('');
            expect (pic.origQuestions[21].response.identifiers['TypeB'].location.value).toEqual('');
            expect (pic.origQuestions[21].response.identifiers['TypeA'].number.value).toEqual('A-identifier');
            expect (pic.origQuestions[21].response.identifiers['TypeC'].number.value).toEqual('C-identifier');
        });
    });
    
    describe('function getChoice', () =>{
        
    });
});