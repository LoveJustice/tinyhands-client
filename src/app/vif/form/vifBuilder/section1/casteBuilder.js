export default class CasteBuilder {
    constructor(vif = null) {
        if(vif == null) {
            this.clearAll();
            this._otherText = '';
        } else {
            this.setValues(vif);
        }
    }
    
    clearAll() {
        this._magar = false;
        this._brahmin = false;
        this._tamang = false;
        this._jaisi = false;
        this._chhetri = false;
        this._mongolian = false;
        this._thakuri = false;
        this._newar = false;
        this._muslim = false;
        this._madeshiTerai = false;
        this._dalitUnderPriviledged = false;
        this._other = false;
    }
    
    setValues(vif) {
        this._magar = vif.victim_caste_magar;
        this._brahmin = vif.victim_caste_brahmin;
        this._tamang = vif.victim_caste_tamang;
        this._jaisi = vif.victim_caste_jaisi;
        this._chhetri = vif.victim_caste_chhetr;
        this._mongolian = vif.victim_caste_mongolian;
        this._thakuri = vif.victim_caste_thakuri;
        this._newar = vif.victim_caste_newar;
        this._muslim = vif.victim_caste_muslim;
        this._madeshiTerai = vif.victim_caste_madeshiTerai;
        this._dalitUnderPriviledged = vif.victim_caste_dalit;
        this._other = vif.victim_caste_other;
        this._otherText = vif.victim_caste_other_value;
    }
    
    build(vif) {
        vif.victim_caste_magar = this._magar;
        vif.victim_caste_brahmin = this._brahmin;
        vif.victim_caste_tamang = this._tamang;
        vif.victim_caste_jaisi = this._jaisi;
        vif.victim_caste_chhetr = this._chhetri;
        vif.victim_caste_mongolian = this._mongolian;
        vif.victim_caste_thakuri = this._thakuri;
        vif.victim_caste_newar = this._newar;
        vif.victim_caste_muslim = this._muslim;
        vif.victim_caste_madeshiTerai = this._madeshiTerai;
        vif.victim_caste_dalit = this._dalitUnderPriviledged;
        vif.victim_caste_other = this._other;
        vif.victim_caste_other_value = this._otherText;
    }
    
    get magar() {
        return this._magar;
    }
    
    set magar(value) {
        this.clearAll();
        this._magar = value;
    }
    
    get brahmin() {
        return this._brahmin;
    }
    
    set brahmin(value) {
        this.clearAll();
        this._brahmin = value;
    }
    
    get tamang() {
        return this._tamang;
    }
    
    set tamang(value) {
        this.clearAll();
        this._tamang = value;
    }
    
    get jaisi() {
        return this._jaisi;
    }
    
    set jaisi(value) {
        this.clearAll();
        this._jaisi = value;
    }
    
    get chhetri() {
        return this._chhetri;
    }
    
    set chhetri(value) {
        this.clearAll();
        this._chhetri = value;
    }
    
    get mongolian() {
        return this._mongolian;
    }
    
    set mongolian(value) {
        this.clearAll();
        this._mongolian = value;
    }
    
    get thakuri() {
        return this._thakuri;
    }
    
    set thakuri(value) {
        this.clearAll();
        this._thakuri = value;
    }
    
    get newar() {
        return this._newar;
    }
    
    set newar(value) {
        this.clearAll();
        this._newar = value;
    }
    
    get muslim() {
        return this._muslim;
    }
    
    set muslim(value) {
        this.clearAll();
        this._muslim = value;
    }
    
    get madeshiTerai() {
        return this._madeshiTerai;
    }
    
    set madeshiTerai(value) {
        this.clearAll();
        this._madeshiTerai = value;
    }
    
    get dalitUnderPriviledged() {
        return this._dalitUnderPriviledged;
    }
    
    set dalitUnderPriviledged(value) {
        this.clearAll();
        this._dalitUnderPriviledged = value;
    }
    
    get other() {
        return this._other;
    }
    
    set other(value) {
        this.clearAll();
        this._other = value;
    }
    
    get otherText() {
        return this._otherText;
    }
    
    set otherValue(value) {
        this._otherText = value;
    }
}