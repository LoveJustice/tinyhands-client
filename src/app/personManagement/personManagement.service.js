/*global FormData */
/* global jQuery */
class PersonManagementService {
    constructor(BaseService) {
        'ngInject';
        this.service = BaseService;
    }
    
    appendDocuments(formData, documents) {
        let cnt = 0;
        for (let idx=0; idx < documents.length; idx++) {
            let t = Object.prototype.toString.call(documents[idx].file);
            if (t === '[object Blob]') {
                let fileName = documents[idx].file.$ngfName;
                formData.append('document[' + cnt + ']', documents[idx].file, fileName);
                documents[idx].file_location = fileName;
                delete documents[idx].file;
                cnt += 1;
            } else if (t === '[object File]') {
                let fileName = documents[idx].file.name;
                formData.append('document[' + cnt + ']', documents[idx].file, fileName);
                documents[idx].file_location = fileName;
                delete documents[idx].file;
                cnt += 1;
            }
        }
    }
    
    getMasterPerson(id) {
        return this.service.get(`api/master-person/${id}/`);
    }
    
    saveMasterPerson(mpData, photos, attachments) {
        let myMasterPerson = jQuery.extend(true, {}, mpData);
        
        let documents = [];
        for (let idx=0; idx < myMasterPerson.persondocument_set.length; idx++) {
            let matchId = myMasterPerson.persondocument_set[idx].id;
            for (let idx1=0; idx1 < photos.length; idx1++) {
                if (photos[idx1].hasOwnProperty('id') && photos[idx1].id === matchId) {
                    documents.push(photos[idx1]);
                }
            }
            for (let idx1=0; idx1 < attachments.length; idx1++) {
                if (attachments[idx1].hasOwnProperty('id') && attachments[idx1].id === matchId) {
                    documents.push(attachments[idx1]);
                }
            }
        }
        for (let idx=0; idx < photos.length; idx++) {
            if (!photos[idx].hasOwnProperty('id') && photos[idx].canRemove) {
                documents.push(photos[idx]);
            }
        }
        for (let idx=0; idx < attachments.length; idx++) {
            if (!attachments[idx].hasOwnProperty('id')) {
                documents.push(attachments[idx]);
            }
        }
        myMasterPerson.persondocument_set = documents;
        
        let formData = new FormData();
        this.appendDocuments(formData, myMasterPerson.persondocument_set);
        formData.append("main", JSON.stringify(myMasterPerson));
        return this.service.put(`api/master-person/${mpData.id}/`, formData, {'Content-Type': undefined});
    }
    
    getType(the_type) {
        return this.service.get(`api/master-person/type/${the_type}/`);
    }
    
    getPvRelations(id) {
        return this.service.get(`api/master-person/pv-relations/${id}/`);
    }
    
    getMatches(id,typeId) {
        return this.service.get(`api/master-person/match/${id}/${typeId}/`);
    }
    
    removePerson(masterId, personId, data) {
        return this.service.put(`api/master-person/remove/${masterId}/${personId}/`, data);
    }
    
    merge(id1, id2, data) {
        return this.service.put(`api/master-person/merge/${id1}/${id2}/`, data);
    }
    
    updateMatch(matchId, typeId, data) {
        return this.service.put(`api/master-person/update-match/${matchId}/`, data);
    }
    
    createMatch(typeId, data) {
        return this.service.put(`api/master-person/create-match/`, data);
    }
}

export default PersonManagementService;
