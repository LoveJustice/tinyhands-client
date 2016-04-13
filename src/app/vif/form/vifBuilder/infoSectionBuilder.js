export default class InfoSectionBuilder {
    constructor(vif = null) {
        if(vif == null) {
            this.vifNumber = '';
            this.date = '';
            this.numberOfVictims = 0;
            this.numberOfTraffickers = 0;
            this.location = '';
            this.interviewer = '';
            this.statementReadBeforeInterview = false;
            this.photoPermission = false;
        } else {
            this.vifNumber = vif.vif_number;
            this.data = vif.date;
            this.numberOfVictims = vif.number_of_victims;
            this.numberOfTraffickers = vif.number_of_traffickers;
            this.location = vif.location;
            this.interviewer = vif.interviewer;
            this.statementReadBeforeInterview = vif.statement_read_before_beginning;
            this.photoPermission = vif.permission_to_use_photo;
        }
    }
    
    build(vif) {
        vif.vif_number = this.vifNumber;
        vif.date = this.date;
        vif.number_of_victims = this.numberOfVictims;
        vif.number_of_traffickers = this.numberOfTraffickers;
        vif.location = this.location;
        vif.interviewer = this.interviewer;
        vif.statement_read_before_beginning = this.statementReadBeforeInterview;
        vif.permission_to_use_photo = this.photoPermission; 
    }
}