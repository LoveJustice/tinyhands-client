export default class MigrationPlansBuilder {
    constructor(vif = null) {
        if(vif == null) {
            this.clearAll();
            this._otherText = '';
            this._jobOtherText = '';
        } else {
            this.setValues(vif);
        }
    }

    clearAll() {
        this._education = false;
        this._travelTour = false;
        this._shopping = false;
        this._eloping = false;
        this._arrangedMarriage = false;
        this._meetOwnFamily = false;
        this._visitBrokersHome = false;
        this._medicalTreatment = false;
        this._jobBrokerDidntSay = false;
        this._jobBabyCare = false;
        this._jobFactory = false;
        this._jobHotel = false;
        this._jobShop = false;
        this._jobLaborer = false;
        this._jobBrothel = false;
        this._jobHousehold = false;
        this._jobOther = false;
        this._other = false;
    }

    setValues(vif) {
        this._education = vif.migration_plans_education;
        this._travelTour = vif.migration_plans_travel_tour;
        this._shopping = vif.migration_plans_shopping;
        this._eloping = vif.migration_plans_eloping;
        this._arrangedMarriage = vif.migration_plans_arranged_marriage;
        this._meetOwnFamily = vif.migration_plans_meet_own_family;
        this._visitBrokersHome = vif.migration_plans_visit_brokers_home;
        this._medicalTreatment = vif.migration_plans_medical_treatment;
        this._jobBrokerDidntSay = vif.migration_plans_job_broker_didnt_say;
        this._jobBabyCare = vif.migration_plans_job_baby_care;
        this._jobFactory = vif.migration_plans_job_factory;
        this._jobHotel = vif.migration_plans_job_hotel;
        this._jobShop = vif.migration_plans_job_shop;
        this._jobLaborer = vif.migration_plans_job_laborer;
        this._jobBrothel = vif.migration_plans_job_brothel;
        this._jobHousehold = vif.migration_plans_job_household;
        this._jobOther = vif.migration_plans_job_other;
        this._other = vif.migration_plans_other;
        this._otherText = vif.migration_plans_other_value;
        this._jobOtherText = vif.migration_plans_job_other_value;
    }

    build(vif) {
        vif.migration_plans_education = this._education;
        vif.migration_plans_travel_tour = this._travelTour;
        vif.migration_plans_shopping = this._shopping;
        vif.migration_plans_eloping = this._eloping;
        vif.migration_plans_arranged_marriage = this._arrangedMarriage;
        vif.migration_plans_meet_own_family = this._meetOwnFamily;
        vif.migration_plans_visit_brokers_home = this._visitBrokersHome;
        vif.migration_plans_medical_treatment = this._medicalTreatment;
        vif.migration_plans_job_broker_didnt_say = this._jobBrokerDidntSay;
        vif.migration_plans_job_baby_care = this._jobBabyCare;
        vif.migration_plans_job_factory = this._jobFactory;
        vif.migration_plans_job_hotel = this._jobHotel;
        vif.migration_plans_job_shop = this._jobShop;
        vif.migration_plans_job_laborer = this._jobLaborer;
        vif.migration_plans_job_brothel = this._jobBrothel;
        vif.migration_plans_job_household = this._jobHousehold;
        vif.migration_plans_job_other = this._jobOther;
        vif.migration_plans_other = this._other;
        vif.migration_plans_other_value = this._otherText;
        vif.migration_plans_job_other_value = this._jobOtherText;
    }
    
    get education() {
        return this._education;
    }
    
    set education(value) {
        this.clearAll();
        this._education = value;
    }

    get traveTour() {
        return this._traveTour;
    }
    
    set traveTour(value) {
        this.clearAll();
        this._traveTour = value;
    }
    
    get shopping() {
        return this._shopping;
    }
    
    set shopping(value) {
        this.clearAll();
        this._shopping = value;
    }
    
    get eloping() {
        return this._eloping;
    }
    
    set eloping(value) {
        this.clearAll();
        this._eloping = value;
    }
    
    get arrangedMarriage() {
        return this._arrangedMarriage;
    }
    
    set arrangedMarriage(value) {
        this.clearAll();
        this._arrangedMarriage = value;
    }
    
    get meetOwnFamily() {
        return this._meetOwnFamily;
    }
    
    set meetOwnFamily(value) {
        this.clearAll();
        this._meetOwnFamily = value;
    }
    
    get visitBrokersHome() {
        return this._visitBrokersHome;
    }
    
    set visitBrokersHome(value) {
        this.clearAll();
        this._visitBrokersHome = value;
    }
    
    get medicalTreatment() {
        return this._medicalTreatment;
    }
    
    set medicalTreatment(value) {
        this.clearAll();
        this._medicalTreatment = value;
    }
    
    get jobBrokerDidntSay() {
        return this._jobBrokerDidntSay;
    }
    
    set jobBrokerDidntSay(value) {
        this.clearAll();
        this._jobBrokerDidntSay = value;
    }
    
    get jobBabyCare() {
        return this._jobBabyCare;
    }
    
    set jobBabyCare(value) {
        this.clearAll();
        this._jobBabyCare = value;
    }
    
    get jobFactory() {
        return this._jobFactory;
    }
    
    set jobFactory(value) {
        this.clearAll();
        this._jobFactory = value;
    }
    
    get jobHotel() {
        return this._jobHotel;
    }
    
    set jobHotel(value) {
        this.clearAll();
        this._jobHotel = value;
    }
    
    get jobShop() {
        return this._jobShop;
    }
    
    set jobShop(value) {
        this.clearAll();
        this._jobShop = value;
    }
    
    get jobLaborer() {
        return this._jobLaborer;
    }
    
    set jobLaborer(value) {
        this.clearAll();
        this._jobLaborer = value;
    }
    
    get jobBrothel() {
        return this._jobBrothel;
    }
    
    set jobBrothel(value) {
        this.clearAll();
        this._jobBrothel = value;
    }
    
    get jobHousehold() {
        return this._jobHousehold;
    }
    
    set jobHousehold(value) {
        this.clearAll();
        this._jobHousehold = value;
    }
    
    get jobOther() {
        return this._jobOther;
    }
    
    set jobOther(value) {
        this.clearAll();
        this._jobOther = value;
    }
    
    get jobOtherText() {
        return this._jobOtherText;
    }
    
    set jobOtherText(value) {
        this.clearAll();
        this._jobOtherText = value;
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