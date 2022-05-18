import constants from '../../constants.js';

export default class AttachmentExportModalController {
    constructor($uibModalInstance, $window, BaseService) {
        'ngInject';
        this.uibModalInstance = $uibModalInstance;

        this.window = $window;
        this.service = BaseService;

        this.fromDate = new Date();
        this.toDate = new Date();
    }
    
    getExportUrl(fromDate, toDate) {
        return constants.BaseUrl + 'api/irfNew/attachments/' + this.parseDate(fromDate) + '/' + this.parseDate(toDate) + '/';
    }

    getAttachmentCountUrl(fromDate, toDate) {
        return `api/irfNew/attachments/${this.parseDate(fromDate)}/${this.parseDate(toDate)}/count/`;
    }

    exportAttachments() {
        var url = this.getExportUrl(this.fromDate, this.toDate);
        this.window.open(url, '_blank');
    }

    attachmentCount() {
        this.numberOfattachments = null;
        var url = this.getAttachmentCountUrl(this.fromDate, this.toDate);
        this.service.get(url).then((promise) => {
            this.numberOfattachments = promise.data.count;
        });
    }

    parseDate(date) {
        return (date.getMonth() + 1) + '-' + date.getDate() + '-' + date.getFullYear();
    }

    validDate() {
        if (this.fromDate instanceof Date && this.toDate instanceof Date) {
            return (this.fromDate.getTime() < this.toDate.getTime()) && this.numberOfattachments > 0;
        }
        return false;
    }
}