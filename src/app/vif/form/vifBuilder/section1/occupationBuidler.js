export default class OccupationBuilder {
    constructor(vif = null) {
        if(vif == null) {
            this.clearAll()
            this._otherText = '';
        } else {
            this.setValues(vif);
        }
    }
    
    clearAll() {
        this._unemployed = false;
        this._animalHusbandry = false;
        this._farmer = false;
        this._domesticWork = false;
        this._wageLaborer = false;
        this._shopkeeper = false;
        this._businessOwner = false;
        this._hotel = false;
        this._migrantWorker = false;
        this._factory = false;
        this._tailoring = false;
        this._housewife = false;
        this._other = false;
    }
    
    build(vif) {
        vif.victim_occupation_unemployed = this._unemployed;
        vif.victim_occupation_animal_husbandry = this._animalHusbandry;
        vif.victim_occupation_farmer = this._farmer;
        vif.victim_occupation_domestic_work = this._domesticWork;
        vif.victim_occupation_wage_laborer = this._wageLaborer;
        vif.victim_occupation_shopkeeper = this._shopkeeper;
        vif.victim_occupation_bussiness_owner = this._businessOwner;
        vif.victim_occupation_hotel = this._hotel;
        vif.victim_occupation_migrant_worker = this._migrantWorker;
        vif.victim_occupation_factory = this._factory;
        vif.victim_occupation_tailoring = this._tailoring;
        vif.victim_occupation_other = this._other;
        vif.victim_occupation_other_value = this._otherText;        
    }
    
    setValues(vif) {
        this._unemployed = vif.victim_occupation_unemployed;
        this._animalHusbandry = vif.victim_occupation_animal_husbandry;
        this._farmer = vif.victim_occupation_farmer;
        this._domesticWork = vif.victim_occupation_domestic_work;
        this._wageLaborer = vif.victim_occupation_wage_laborer;
        this._shopkeeper = vif.victim_occupation_shopkeeper;
        this._businessOwner = vif.victim_occupation_bussiness_owner;
        this._hotel = vif.victim_occupation_hotel;
        this._migrantWorker = vif.victim_occupation_migrant_worker;
        this._factory = vif.victim_occupation_factory;
        this._tailoring = vif.victim_occupation_tailoring;
        this._other = vif.victim_occupation_other;
        this._otherText = vif.victim_occupation_other_value;
    }
    
    get unemployed() {
        return this._unemployed;
    }
    
    set unemployed(value) {
        this.clearAll()
        this._unemployed = value;
    }
    
    get animalHusbandry () {
        return this._animalHusbandry ;
    }
    
    set animalHusbandry (value) {
        this.clearAll()
        this._animalHusbandry = value;
    }
    
    get farmer() {
        return this._farmer;
    }
    
    set farmer(value) {
        this.clearAll()
        this._farmer = value;
    }
    
    get domesticWork() {
        return this._domesticWork;
    }
    
    set domesticWork(value) {
        this.clearAll()
        this._domesticWork = value;
    }
    
    get wageLaborer() {
        return this._wageLaborer;
    }
    
    set wageLaborer(value) {
        this.clearAll()
        this._wageLaborer = value;
    }
    
    get shopkeeper() {
        return this._shopkeeper;
    }
    
    set shopkeeper(value) {
        this.clearAll()
        this._shopkeeper = value;
    }
    
    get businessOwner() {
        return this._businessOwner;
    }
    
    set businessOwner(value) {
        this.clearAll()
        this._businessOwner = value;
    }
    
    get hotel() {
        return this._hotel;
    }
    
    set hotel(value) {
        this.clearAll()
        this._hotel = value;
    }
    
    get migrantWorker() {
        return this._migrantWorker;
    }
    
    set migrantWorker(value) {
        this.clearAll()
        this._migrantWorker = value;
    }
    
    get factory() {
        return this._factory;
    }
    
    set factory(value) {
        this.clearAll()
        this._factory = value;
    }
    
    get tailoring() {
        return this._tailoring;
    }
    
    set tailoring(value) {
        this.clearAll()
        this._tailoring = value;
    }
    
    get housewife() {
        return this._housewife;
    }
    
    set housewife(value) {
        this.clearAll()
        this._housewife = value;
    }
    
    get other() {
        return this._other;
    }
    
    set other(value) {
        this.clearAll()
        this._other = value;
    }
    
    get otherText() {
        return this._otherText;
    }
    
    set otherText(value) {
        this._otherText = value;
    }
}