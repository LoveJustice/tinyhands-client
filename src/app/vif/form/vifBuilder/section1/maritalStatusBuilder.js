export default class MaritalStatusBuilder{
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
        this._divorced = false;
        this._husbandHasOtherWives = false;
        this._abandonedByHusband = false;
    }
    
    setValues(vif) {
        this._single = vif.victim_marital_status_single;
        this._married = vif.victim_marital_status_married;
        this._widow = vif.victim_marital_status_widow;
        this._divorced = vif.victim_marital_status_divorced;
        this._husbandHasOtherWives = vif.victim_marital_status_husband_has_other_wives;
        this._abandonedByHusband = vif.victim_marital_status_abandoned_by_husband;
    }
    
    build(vif) {
        vif.victim_marital_status_single = this._single;
        vif.victim_marital_status_married = this._married;
        vif.victim_marital_status_widow = this._widow;
        vif.victim_marital_status_divorced = this._divorced;
        vif.victim_marital_status_husband_has_other_wives = this._husbandHasOtherWives;
        vif.victim_marital_status_abandoned_by_husband = this._abandonedByHusband;
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
    
    get divorced() {
        return this._divorced;
    }
    
    set divorced(value) {
        this.clearAll();
        this._divorced = value;
    }
    
    get husbandHasOtherWives() {
        return this._husbandHasOtherWives;
    }
    
    set husbandHasOtherWives(value) {
        this.clearAll();
        this._husbandHasOtherWives = value;
    }
    
    get abandonedByHusband() {
        return this._abandonedByHusband;
    }
    
    set abandonedByHusband(value) {
        this.clearAll();
        this._abandonedByHusband = value;
    }
}