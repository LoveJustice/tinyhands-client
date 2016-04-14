import VifController from './vif.controller';

describe('VifController', () => {
   
    let controller, mockState, mockVifBuilder;
   
    beforeEach(() => {
        mockState = {
            go: function (state) {},
            current: {
                data: {
                    index: 0
                }
            }
        };
        spyOn(mockState, 'go');
        mockVifBuilder = jasmine.createSpyObj('VifBuilder', ['build']);
        controller = new VifController(mockState, mockVifBuilder);
    });
   
    describe('goToSection', () => {
        it('when index < 0 should set sectionIndex to 0', () => {
            let index = -1;
          
            controller.goToSection(index);
          
            expect(controller.sectionIndex).toEqual(0);
        }); 
      
        it('when index >= controller.sections.length should set sectionIndex to controller.sections.length - 1', () => {
            let index = 1000;
          
            controller.goToSection(index);
          
            expect(controller.sectionIndex).toEqual(controller.sections.length - 1);
        }); 
      
        describe('when index in valid range', () => {
            let index = 1;
          
            it('should set sectionIndex', () => {
                controller.goToSection(index);
              
                expect(controller.sectionIndex).toEqual(index);
            });
          
            it('should change state to corresponding section', () => {
                controller.goToSection(index);
              
                expect(mockState.go).toHaveBeenCalledWith(controller.sections[index].state);
            });
        });
    });
   
    describe('nextSection', () => {
        describe('when not on last page', () => {
            let index = 4;
            beforeEach(() => {
                 
                 mockState = {
                    go: function (state) {},
                    current: {
                        data: {
                            index: index
                        }
                    }
                };
                spyOn(mockState, 'go');
                controller = new VifController(mockState, mockVifBuilder);
            })
                      
            it('should increase sectionIndex by 1', () => {
                controller.nextSection();
              
                expect(controller.sectionIndex).toEqual(index + 1);
            });
          
            it('should change state to corresponding section', () => {
                controller.nextSection();
              
                expect(mockState.go).toHaveBeenCalledWith(controller.sections[index + 1].state);
            });
        });
        
        describe('when on last page', () => {
            let index = 10;
            beforeEach(() => {
                 mockState = {
                    go: function (state) {},
                    current: {
                        data: {
                            index: index
                        }
                    }
                };
                spyOn(mockState, 'go');
                controller = new VifController(mockState, mockVifBuilder);
            })
                      
            it('should not increase sectionIndex by 1', () => {
                controller.nextSection();
              
                expect(controller.sectionIndex).toEqual(index);
            });
          
            it('should change state to corresponding section', () => {
                controller.nextSection();
              
                expect(mockState.go).not.toHaveBeenCalled();
            });
        });       
    });
    
    describe('prevSection', () => {
        describe('when not on first page', () => {
            let index = 4;
            beforeEach(() => {
                 
                 mockState = {
                    go: function (state) {},
                    current: {
                        data: {
                            index: index
                        }
                    }
                };
                spyOn(mockState, 'go');
                controller = new VifController(mockState, mockVifBuilder);
            })
                      
            it('should descrease sectionIndex by 1', () => {
                controller.prevSection();
              
                expect(controller.sectionIndex).toEqual(index - 1);
            });
          
            it('should change state to corresponding section', () => {
                controller.prevSection();
              
                expect(mockState.go).toHaveBeenCalledWith(controller.sections[index - 1].state);
            });
        });
        
        describe('when on first page', () => {
            let index = 0;
            beforeEach(() => {
                 mockState = {
                    go: function (state) {},
                    current: {
                        data: {
                            index: index
                        }
                    }
                };
                spyOn(mockState, 'go');
                controller = new VifController(mockState, mockVifBuilder);
            })
                      
            it('should not increase sectionIndex by 1', () => {
                controller.prevSection();
              
                expect(controller.sectionIndex).toEqual(index);
            });
          
            it('should change state to corresponding section', () => {
                controller.prevSection();
              
                expect(mockState.go).not.toHaveBeenCalled();
            });
        });
    })
});