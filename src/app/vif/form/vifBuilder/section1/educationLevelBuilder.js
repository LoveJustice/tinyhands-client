export default class EducationLevelBuilder {
    constructor(vif = null) {
        if(vif == null) {
            this.clearAll();
        } else {
            this.setValues(vif);
        }
    }

    clearAll() {
        this._none = false;
        this._informal = false;
        this._primary = false;
        this._grade4to8 = false;
        this._grade9to10 = false;
        this._slc = false;
        this._grade11to12 = false;
        this._bachelors = false;
        this._masters = false;
    }

    setValues(vif) {
        this._none = vif.victim_education_level_none;
        this._informal = vif.victim_education_level_informal;
        this._primary = vif.victim_education_level_primary;
        this._grade4to8 = vif.victim_education_level_grade_4_8;
        this._grade9to10 = vif.victim_education_level_grade_9_10;
        this._slc = vif.victim_education_level_slc;
        this._grade11to12 = vif.victim_education_level_11_12;
        this._bachelors = vif.victim_education_level_bachelors;
        this._masters = vif.victim_education_level_masters;
    }

    build(vif) {
        vif.victim_education_level_none = this._none;
        vif.victim_education_level_informal = this._informal;
        vif.victim_education_level_primary = this._primary;
        vif.victim_education_level_grade_4_8 = this._grade4to8;
        vif.victim_education_level_grade_9_10 = this._grade9to10;
        vif.victim_education_level_slc = this._slc;
        vif.victim_education_level_11_12 = this._grade11to12;
        vif.victim_education_level_bachelors = this._bachelors;
        vif.victim_education_level_masters = this._masters;
    }
    
    get none() {
        return this._none;
    }
    
    set none(value) {
        this.clearAll();
        this._none = value;
    }

    get informal() {
        return this._informal;
    }
    
    set informal(value) {
        this.clearAll();
        this._informal = value;
    }
    
    get primary() {
        return this._primary;
    }
    
    set primary(value) {
        this.clearAll();
        this._primary = value;
    }
    
    get grade4to8() {
        return this._grade4to8;
    }
    
    set grade4to8(value) {
        this.clearAll();
        this._grade4to8 = value;
    }
    
    get grade9to10() {
        return this._grade9to10;
    }
    
    set grade9to10(value) {
        this.clearAll();
        this._grade9to10 = value;
    }
    
    get slc() {
        return this._slc;
    }
    
    set slc(value) {
        this.clearAll();
        this._slc = value;
    }
    
    get grade11to12() {
        return this._grade11to12;
    }
    
    set grade11to12(value) {
        this.clearAll();
        this._grade11to12 = value;
    }
    
    get bachelors() {
        return this._bachelors;
    }
    
    set bachelors(value) {
        this.clearAll();
        this._bachelors = value;
    }
    
    get masters() {
        return this._masters;
    }
    
    set masters(value) {
        this.clearAll();
        this._masters = value;
    }
}