/*global FormData */
/* global jQuery */
// Common service used for all IRF forms
export default class ProjectRequestService {
    constructor(BaseService) {
        'ngInject';
        this.service = BaseService;
    }
    
    getRequestList(queryParameters) {
    	return this.service.get(`api/project-request/`, queryParameters);
    }

    getRequest(id) {
        if (id !== null) {
            return this.service.get(`api/project-request/${id}/`);
        } else {
            return this.service.get(`api/project-request/blank/`);
        }
    }
    
    getBudgetProjects(country_id) {
    	return this.service.get(`api/border-station/list/?country_ids=${country_id}`);
    }
    
    submitRequest(request) {
        if (request.id === null) {
            return this.postRequest(request);
        } else {
            return this.putRequest(request);
        }
    }
    
    putRequest(request) {
        return this.service.put(`api/project-request/${request.id}/`, request);
    }
    
    postRequest(request) {
        return this.service.post(`api/project-request/`, request);
    }
    
    changeDiscussionStatus(request) {
    	return this.service.put(`api/project-request/discussion-status/${request.id}/`, request);
    }
    
    getUserCountries(userId) {
        return this.service.get(`api/user_permission/countries/${userId}/?permission_group=PROJECT_REQUEST`);
    }
    
    getUserStationsForAdd(userId) {
        return this.service.get(`api/user_permission/stations/${userId}/?permission_group=PROJECT_REQUEST&action=ADD`);
    }
    
    getUserStations(userId) {
        return this.service.get(`api/user_permission/stations/${userId}/?permission_group=PROJECT_REQUEST`);
    }
    
    getProjectCategories(projectId) {
    	return this.service.get(`api/project-request/category/${projectId}/`);
    }
    
    getProjectStaff(projectId) {
    	return this.service.get(`api/staff/?project_id=${projectId}`);
    }
    
    getProjectBenefits(projectId) {
    	return this.service.get(`api/project-request/benefits/${projectId}/`);
    }
    getProjectMultipliers() {
    	return this.service.get(`api/project-request/multipliers/`);
    }
    
    getDiscussion(id) {
    	return this.service.get(`api/project-request/discussion/?request_id=${id}`);
    }
    
    getDiscussionAccounts(id) {
    	return this.service.get(`api/project-request/account/${id}/`);
    }
    
    postDiscussionEntry(entry) {
    	return this.service.post(`api/project-request/discussion/`, entry);
    }
    
    getAttachment(id) {
    	return this.service.get(`api/project-request/attachment/?request_id=${id}`);
    }
    
    postAttachment(attachment) {
    	let myAttachment = jQuery.extend(true, {}, attachment);
        let formData = new FormData();
        formData.append("main", JSON.stringify(myAttachment));
        let t = Object.prototype.toString.call(myAttachment.attachment);
        if (t === '[object Blob]') {
            let fileName =  myAttachment.request + '_' + myAttachment.attachment.$ngfName;
            formData.append('scanned', myAttachment.attachment, fileName);
            myAttachment.attachment = {'name': fileName};
        } else if (t === '[object File]') {
            let fileName = myAttachment.request + '_' + myAttachment.attachment.name;
            formData.append('scanned', myAttachment.attachment, fileName);
            myAttachment.attachment = {'name': fileName};
        }
        return this.service.post(`api/project-request/attachment/`, formData, {'Content-Type': undefined});
    }
    
    deleteAttachment(id) {
    	return this.service.delete(`api/project-request/attachment/${id}/`);
    }
}