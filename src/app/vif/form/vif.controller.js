export default class VIFController {
	constructor($state, VifBuilder) {
		'ngInject';
        this.$state = $state;
        this.VifBuilder = VifBuilder;
        this.sections = [
            'vif.info', 
            'vif.section1', 
            'vif.section2', 
            'vif.section3', 
            'vif.section4', 
            'vif.section5', 
            'vif.section6', 
            'vif.section7', 
            'vif.section8', 
            'vif.people', 
            'vif.locations'
        ];
        this.sectionIndex = 0;
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
        this.$state.go(this.sections[this.sectionIndex]);       
    }
    
    nextSection() {
        this.goToSection(this.sectionIndex + 1);
    }
    
    prevSection() {
        this.goToSection(this.sectionIndex - 1);
    }
}
