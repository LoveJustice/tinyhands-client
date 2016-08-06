import InfoSectionBuilder from './infoSectionBuilder';
import Section1Builder from './section1/section1Builder';
import Section2Builder from './section2/section2Builder';

export default class VifBuilder {
    constructor() {
        this.clearVif();
    }
    
    build() {
        vif = {};
        this.infoSection.build(vif);
        this.section1.build(vif);
        this.section2.build(vif);
        return vif;
    }
    
    setVif(vif) {
        this.infoSection = new InfoSectionBuilder(vif);
        this.section1 = new Section1Builder(vif);
        this.section2 = new Section2Builder(vif);
    }
    
    clearVif() {
       this.setVif(null);
    }
    
}