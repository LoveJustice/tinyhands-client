export default class EventModalCtrl {
    constructor($uibModalInstance, event) {
        'ngInject';
        this.event = event;
        this.uibModalInstance = $uibModalInstance;
    }

    get start() {
        return this.event.start_date + ' at ' + this.event.start_time;
    }

    get end() {
        return this.event.end_date + ' at ' + this.event.end_time;
    }

    get repetition() {
        if(this.event.is_repeat) {
            var message = this.event.repetition;
            if(this.event.ends) {
                message += " until " + this.event.ends;
            }
            return message;
        } else {
            return '';
        }
    }

    close() {
        this.uibModalInstance.dismiss();
    }

    delete() {
        this.uibModalInstance.close();
    }
}
