import InfoSectionBuilder from './infoSectionBuilder';

export default class VifBuilder {
    constructor() {
        this.clearVif();
    }
    
    build() {
        vif = {};
        this.infoSection.build(vif);
        return vif;
    }
    
    setVif(vif) {
        this.infoSection = new InfoSectionBuilder(vif);
    }
    
    clearVif() {
       this.setVif(null);
    }
    
}