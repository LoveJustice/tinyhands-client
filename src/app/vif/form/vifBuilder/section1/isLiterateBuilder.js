export default class IsLiterateBuilder {
    constructor(vif = null) {
        if(vif == null) {
            this.clearAll();
        } else {
            this.setValues(vif);
        }
    }

    clearAll() {
        this._isLiterate = false;
        this._isNotLiterate = false;
    }

    setValues(vif) {
        this.clearAll();
        if(vif.victim_is_literate === true) {
            this._isLiterate = true;
        } else if(vif.victim_is_literate === false) {
            this._isNotLiterate = true;
        }
    }

    build(vif) {
        let value = null;
        if(this._isLiterate === true) {
            value = true;
        } else if(this._isNotLiterate === false) {
            value = false;
        }
        vif.victim_is_literate = value;
    }
    
    get isLiterate() {
        return this._isLiterate === true;
    }
    
    set isLiterate(value) {
        if(value === true && this._isNotLiterate === true) {
            this._isNotLiterate = false;
        }
        this._isLiterate = value;
    }
    
    get isNotLiterate() {
        return this._isNotLiterate === true;
    }
    
    set isNotLiterate(value) {
        if(value === true && this._isLiterate === true) {
            this._isLiterate = false;
        }
        this._isNotLiterate = value;
    }

}