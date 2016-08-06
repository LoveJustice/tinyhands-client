export default class LivesWithBuilder {
    constructor(vif = null) {
        this.living = ["Own Parent(s)", "Husband", "Husband's Family", "Friends", "Alone", "Other Relative"];
        if(vif == null) {
            this.clearAll();
            this._otherText = '';
        } else {
            this.setValues(vif);
        }
    }

    clearAll() {
        this._parents = false;
        this._husband = false;
        this._husbandsFamily = false;
        this._friends = false;
        this._alone = false;
        this._otherRelative = false;
        this._other = false;
    }

    setValues(vif) {
        this._parents = vif.victim_lives_with_own_parents;
        this._husband = vif.victim_lives_with_husband;
        this._husbandsFamily = vif.victim_lives_with_husbands_family;
        this._friends = vif.victim_lives_with_friends;
        this._alone = vif.victim_lives_with_alone;
        this._otherRelative = vif.victim_lives_with_other_relative;
        this._other = vif.victim_lives_with_other;
        this._otherText = vif.victim_lives_with_other_value;
    }

    build(vif) {
        vif.victim_lives_with_own_parents = this._parents;
        vif.victim_lives_with_husband = this._husband;
        vif.victim_lives_with_husbands_family = this._husbandsFamily;
        vif.victim_lives_with_friends = this._friends;
        vif.victim_lives_with_alone = this._alone;
        vif.victim_lives_with_other_relative = this._otherRelative;
        vif.victim_lives_with_other = this._other;
        vif.victim_lives_with_other_value = this._otherText;
    }
    
    get parents() {
        return this._parents;
    }
    
    set parents(value) {
        this.clearAll();
        this._parents = value;
    }
    
    get husband() {
        return this._husband;
    }
    
    set husband(value) {
        this.clearAll();
        this._husband = value;
    }
    
    get husbandsFamily() {
        return this._husbandsFamily;
    }
    
    set husbandsFamily(value) {
        this.clearAll();
        this._husbandsFamily = value;
    }
    
    get friends() {
        return this._friends;
    }
    
    set friends(value) {
        this.clearAll();
        this._friends = value;
    }
    
    get alone() {
        return this._alone;
    }
    
    set alone(value) {
        this.clearAll();
        this._alone = value;
    }
    
    get otherRelative() {
        return this._otherRelative;
    }
    
    set otherRelative(value) {
        this.clearAll();
        this._otherRelative = value;
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
    
    set otherText(value) {
        this._otherText = value;
    }
}