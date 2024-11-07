/**
 * Service to manage dataflow of budget form information between the client and
 * the backend.
 *
 * @export
 * @class MdfService
 */
export default class MdfService {
    constructor(BaseService, UtilService) {
        'ngInject';
        this.service = BaseService;
        this.utils = UtilService;
    }

    getMdf(id) {
    	return this.service.get(`api/mdf-pr/${id}/`);
    }
    
    updateMdf(mdf) {
    	return this.service.put(`api/mdf-pr/${mdf.id}/`, mdf);
    }
    
    deleteMdf(mdf) {
    	return this.service.delete(`api/mdf-pr/${mdf.id}/`);
    }
    
    createMdfItem(item) {
    	return this.service.post(`api/mdf-item/`, item);
    }
    
    updateMdfItem(item) {
    	return this.service.put(`api/mdf-item/${item.id}/`, item);
    }
    
    deleteMdfItem(item) {
    	return this.service.delete(`api/mdf-item/${item.id}/`);
    }
    
    approveMdf(mdf) {
    	return this.service.put(`api/mdf-pr/approve/${mdf.id}/`, mdf);
    }
    
    getMdfTrend(id) {
    	return this.service.get(`api/mdf-pr/trend/${id}/`);
    }
    
    attachFile(id, mdf, file_obj) {
		if (file_obj === null) {
			return;
		}
		
		let formData = new FormData();
		let fileName = mdf.station_name + '_' + mdf.month_year.substring(0,7);
		fileName = fileName.replace('-','_');
		fileName = fileName.replace(' ','_');
		fileName = fileName.replace(',','_');
		let t = Object.prototype.toString.call(file_obj);
        if (t === '[object Blob]') {
        	let origFile = file_obj.$ngfName;
        	let lastIdx = origFile.lastIndexOf('.');
        	if (lastIdx >= 0) {
        		fileName += origFile.substring(lastIdx);
        	}
            formData.append('attachment_file', file_obj, fileName);
        } else if (t === '[object File]') {
        	let origFile = file_obj.name;
        	let lastIdx = origFile.lastIndexOf('.');
        	if (lastIdx >= 0) {
        		fileName += origFile.substring(lastIdx);
        	}
        	formData.append('attachment_file', file_obj, fileName);
        }
        
        return this.service.put(`api/mdf-pr/attach/${id}/`, formData, {'Content-Type': undefined});
	}
}
