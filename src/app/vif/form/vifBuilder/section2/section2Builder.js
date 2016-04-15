import MigrationPlansBuilder from './migrationPlansBuilder';

export default class Section2Builder {
    constructor(vif = null) {
       this.migrationPlans = new MigrationPlansBuilder(vif);
    }

    build(vif) {
        this.migrationPlans.build(vif);
    }

}