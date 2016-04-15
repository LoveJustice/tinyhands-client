export default class ParentMaritalStatusBuilder {
    constructor(vif = null) {
        if(vif == null) {
            this.clearAll();
        } else {
            this.setValues(vif);
        }
    }

    clearAll() {
        this._single = false;
        this._married = false;
        this._widow = false;
        this._fatherHasOtherWives = false;
        this._seperated = false;
        this._divorced = false;
    }

    setValues(vif) {
        this._single = vif.victim_parents_marital_status_single;
        this._married = vif.victim_parents_marital_status_married;
        this._widow = vif.victim_parents_marital_status_widow;
        this._fatherHasOtherWives = vif.victim_parents_marital_status_father_has_other_wives;
        this._seperated = vif.victim_parents_marital_separated;
        this._divorced = vif.victim_parents_marital_divorced;
    }

    build(vif) {
        vif.victim_parents_marital_status_single = this._single;
        vif.victim_parents_marital_status_married = this._married;
        vif.victim_parents_marital_status_widow = this._widow;
        vif.victim_parents_marital_status_father_has_other_wives = this._fatherHasOtherWives;
        vif.victim_parents_marital_separated = this._seperated;
        vif.victim_parents_marital_divorced = this._divorced;
    }
    
    get single() {
        return this._single;
    }
    
    set single(value) {
        this.clearAll();
        this._single = value;
    }

    get married() {
        return this._married;
    }
    
    set married(value) {
        this.clearAll();
        this._married = value;
    }

    get widow() {
        return this._widow;
    }
    
    set widow(value) {
        this.clearAll();
        this._widow = value;
    } 
    
    get fatherHasOtherWives() {
        return this._fatherHasOtherWives;
    }
    
    set fatherHasOtherWives(value) {
        this.clearAll();
        this._fatherHasOtherWives = value;
    }
    
    get separated() {
        return this._separated;
    }
    
    set separated(value) {
        this.clearAll();
        this._separated = value;
    }
    
    get divorced() {
        return this._divorced;
    }
    
    set divorced(value) {
        this.clearAll();
        this._divorced = value;
    }
}