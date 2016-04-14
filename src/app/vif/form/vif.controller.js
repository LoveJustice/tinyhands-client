export default class VIFController {
	constructor($state, VifBuilder) {
		'ngInject';
        this.$state = $state;
        this.VifBuilder = VifBuilder;
        this.sections = [
            {name: 'Info', state: 'vif.info'},
            {name: '1', state: 'vif.section1'},
            {name: '2', state: 'vif.section2'},
            {name: '3', state: 'vif.section3'},
            {name: '4', state: 'vif.section4'},
            {name: '5', state: 'vif.section5'},
            {name: '6', state: 'vif.section6'},
            {name: '7', state: 'vif.section7'},
            {name: '8', state: 'vif.section8'},
            {name: 'People', state: 'vif.people'},
            {name: 'Location', state: 'vif.locations'}, 
        ];
        this.sectionIndex = $state.current.data.index;
	}
    
    goToSection(index) {
        if(index < 0) {
            this.sectionIndex = 0;
            return;
        } else if(index >= this.sections.length) {
            this.sectionIndex = this.sections.length - 1;
            return;
        } else {
            this.sectionIndex = index;
        }
        this.$state.go(this.sections[this.sectionIndex].state);       
    }
    
    nextSection() {
        this.goToSection(this.sectionIndex + 1);
    }
    
    prevSection() {
        this.goToSection(this.sectionIndex - 1);
    }
}
