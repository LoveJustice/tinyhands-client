import constants from '../../constants.js';

export default class PhotoExportModalController {
	constructor ($uibModalInstance, $window, BaseService) {
		'ngInject';
        this.uibModalInstance = $uibModalInstance;

        this.window = $window;
        this.service = BaseService;

        this.fromDate = new Date();
        this.toDate = new Date();
	}

    getExportUrl(fromDate, toDate) {
        return constants.BaseUrl + 'api/photos/' + this.parseDate(fromDate) + '/' + this.parseDate(toDate) + '/';
    }

    getPhotoCountUrl(fromDate, toDate) {
        return `api/photos/${this.parseDate(fromDate)}/${this.parseDate(toDate)}/count/`;
    }

    exportPhotos() {
        var url = this.getExportUrl(this.fromDate, this.toDate);
        this.window.open(url, '_blank');
    }

    photoCount() {
        var url = this.getPhotoCountUrl(this.fromDate, this.toDate);
        this.service.get(url).then( (promise) => {
            this.numberOfPhotos = promise.data.count;
        });
    }

    parseDate(date) {
        return (date.getMonth() + 1) + '-' + date.getDate() + '-' + date.getFullYear();
    }

    validDate() {
        if(this.fromDate instanceof Date && this.toDate instanceof Date) {
            return (this.fromDate.getTime() < this.toDate.getTime()) && this.numberOfPhotos > 0;
        }
        return false;
    }
}
