export class BaseMasterPersonCompare {
    constructor(service, $stateParams) {
        'ngInject';
        this.service = service;
        this.stateParams = $stateParams;
        this.getTypes();
    }
    
    getTypes() {
        this.service.getType('PhoneType').then((response) => {
            this.phoneTypes = response.data;
            if (this.phoneTypes && this.addressTypes && this.socialMediaTypes && this.documentTypes && this.stateParams.id) {
                this.getMasterPerson(this.stateParams.id);
            }
        });
        this.service.getType('AddressType').then((response) => {
            this.addressTypes = response.data;
            if (this.phoneTypes && this.addressTypes && this.socialMediaTypes && this.documentTypes && this.documentTypes && this.stateParams.id) {
                this.getMasterPerson(this.stateParams.id);
            }
        });
        this.service.getType('SocialMediaType').then((response) => {
            this.socialMediaTypes = response.data;
            if (this.phoneTypes && this.addressTypes && this.socialMediaTypes && this.documentTypes && this.documentTypes && this.stateParams.id) {
                this.getMasterPerson(this.stateParams.id);
            }
        });
        this.service.getType('DocumentType').then((response) => {
            this.documentTypes = response.data;
            this.attachmentTypes = [];
            for (let idx=0; idx < this.documentTypes.length; idx++) {
                if (this.documentTypes[idx].name.toLowerCase() === 'photo') {
                    this.photoDocumentType = this.documentTypes[idx].id;
                } else {
                    this.attachmentTypes.push(this.documentTypes[idx]);
                }
            }
            if (this.phoneTypes && this.addressTypes && this.socialMediaTypes && this.documentTypes && this.documentTypes && this.stateParams.id) {
                this.getMasterPerson(this.stateParams.id);
            }
        });
        
        this.service.getType('MatchType').then((response) => {
            this.matchTypes = response.data;
            for (let idx=0; idx < this.matchTypes.length; idx++) {
                if (this.matchTypes[idx].name.toLowerCase() === 'possible') {
                    this.possibleMatchType = this.matchTypes[idx].id;
                } else if (this.matchTypes[idx].name.toLowerCase() === 'suggested') {
                    this.suggestedMatchType = this.matchTypes[idx].id;
                } else if (this.matchTypes[idx].name.toLowerCase() === 'non-match') {
                    this.nonMatchType = this.matchTypes[idx].id;
                }
            }
            
            this.getMatches();
        });
    }
    addBelieves(text, interviewer, pv, container) {
        let found = false;
        for (let idx=0; idx < container.believes.length; idx++) {
            if (container.believes[idx].text === text) {
                container.believes[idx].interviewer += interviewer;
                container.believes[idx].pv += pv;
                found = true;
            }
        }
        
        if (!found) {
            container.believes.push({text:text, interviewer:interviewer, pv:pv});
        }
    }
    
    dateAsUTC(inDateString) {
        let parts = inDateString.split("-");
        let year = Number(parts[0]);
        let month = Number(parts[1]) - 1;
        let date = Number(parts[2]);
        let utcDate = new Date(Date.UTC(year, month, date, 0, 0, 0, 0));
        return utcDate;
    }
    
    calculateAge(birthdate) {
        let age = null;
        if (birthdate) {
            let now = new Date();
            age = now.getFullYear() - birthdate.getFullYear();
            if (now.getMonth() < birthdate.getMonth() || now.getMonth()===birthdate.getMonth() && now.getDate() < birthdate.getDate()) {
                age -= 1;
            }
        }
        return age;
    }
    
    computeAge(container){
        container.age = this.calculateAge(container.birthdate);
    }
    
    preProcess(masterPerson, container, photoDocumentType) {
        container.uniqueNames = [];
        container.uniquePhones = [];
        container.uniqueAddresses = [];
        container.uniqueSocialMedia = [];
        container.uniqueAppearance = [];
        container.uniqueId = [];
        container.roles = [];
        container.photos = [];
        container.attachments = [];
        container.believes = [];
        container.forms = [];
        container.selectedPerson = null;
        container.selectedFormId = null;
        container.birthdate = null;
        container.age = null;
        
        for (let idx=0; idx < masterPerson.person_set.length; idx++) {
            let person = masterPerson.person_set[idx];
            
            if (person.full_name) {
                let found = false;
                for (let idx1=0; idx1 < container.uniqueNames.length; idx1++) {
                    if (container.uniqueNames[idx1] === person.full_name) {
                        found = true;
                    }
                }
                if (!found) {
                    container.uniqueNames.push(person.full_name);
                }
            }
            
            // process phones
            if (person.phone_contact) {
                if (person.phone_type) {
                    person.phone_type = '' + person.phone_type;
                }
                let found = false;
                for (let idx1=0; idx1 < container.uniquePhones.length; idx1++) {
                    let phone = container.uniquePhones[idx1];
                    if (person.phone_contact === phone.number && person.phone_verified === phone.phone_verified && person.phone_type === phone.phone_type) {
                        phone.ids.push(person.id);
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    container.uniquePhones.push({number:person.phone_contact, phone_verified:person.phone_verified, phone_type:person.phone_type, ids:[person.id]});
                }
            }
            
            // process addresses
            if (person.address || person.address_notes) {
                if (person.address_type) {
                    person.address_type = '' + person.address_type;
                }
                let found = false;
                for (let idx1=0; idx1 < container.uniqueAddresses.length; idx1++) {
                    let address = container.uniqueAddresses[idx1];
                    if ((person.address === null && address.address === null || person.address && address.address && person.address.address === address.address.address) &&
                            person.address_verified === address.address_verified && 
                            person.address_notes === address.address_notes && person.address_type === address.address_type) {
                        address.ids.push(person.id);
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    container.uniqueAddresses.push({address:person.address, address_verified:person.address_verified, address_notes:person.address_notes,
                        address_type:person.address_type, ids:[person.id]});
                }
            }
            
            // process social media
            if (person.social_media) {
                if (person.social_media_type) {
                    person.social_media_type = '' + person.social_media_type;
                }
                let found = false;
                for (let idx1=0; idx1 < container.uniqueSocialMedia.length; idx1++) {
                    let social = container.uniqueSocialMedia[idx1];
                    if (person.social_media === social.social_media && person.social_media_verified === social.social_media_verified && 
                            person.social_media_type === social.social_media_type) {
                        social.ids.push(person.id);
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    container.uniqueSocialMedia.push({social_media:person.social_media, social_media_verified:person.social_media_verified,
                        social_media_type:person.social_media_type, ids:[person.id]});
                }
            }
        
            // process roles
            if (person.role) {
                let roleElements = person.role.split(';');
                for (let idx1=0; idx1 < roleElements.length; idx1++) {
                    let found = false;
                    for (let idx2=0; idx2 < container.roles.length; idx2++) {
                        if (roleElements[idx1] === container.roles[idx2].name) {
                            container.roles[idx2].count++;
                            found = true;
                            break;
                        }
                    }
                    if (!found) {
                        container.roles.push({name:person.role,count:1});
                    }
                }
            }
            
            if (person.personidentification_set) {
                for (let idx1=0; idx1 < person.personidentification_set.length; idx1++) {
                    let id = person.personidentification_set[idx1];
                    let found = false;
                    for (let idx2=0; idx2 < container.uniqueId.length; idx2++) {
                        if (id.type === container.uniqueId[idx2].type && id.number === container.uniqueId[idx2].number && id.location === container.uniqueId[idx2].location) {
                            found = true;
                            break;
                        }
                    }
                    if (!found) {
                        container.uniqueId.push({type:id.type, number:id.number, location:id.location});
                    }
                }
            }
            
            if (person.appearance) {
                let found = false;
                for (let idx1=0; idx1 < container.uniqueAppearance.length; idx1++) {
                    if (person.appearance === container.uniqueAppearance[idx1]) {
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    container.uniqueAppearance.push(person.appearance);
                }
            }
            
            if (person.photo) {
                container.photos.push({file_location:person.photo, canRemove:false, file:null});
            }
            
            if (person.interviewer_believes) {
                this.addBelieves(person.interviewer_believes, 1, 0, container);
            }
            
            if (person.pv_believes) {
                this.addBelieves(person.pv_believes, 0, 1, container);
            }
            
            if (person.form_number) {
                container.forms.push({id:person.form_id, number:person.form_number, type:person.form_type});
                if (container.selectedPerson  === null || container.selectedPerson && person.form_number < container.selectedPerson.form_number) {
                    container.selectedPerson = person;
                    container.selectedFormId = person.form_id;
                }
            }
        }
        
        container.forms.sort((a,b) => {
                if (a.number > b.number) { 
                    return 1;
                } else if (a.number < b.number) {
                    return -1;
                } else {
                    return 0;
                }
            });
        
        if (masterPerson.birthdate) {
            container.birthdate = this.dateAsUTC(masterPerson.birthdate);
            this.computeAge(container);
        } else {
            container.birthdate = null;
            container.age = null;
        }
        
        for (let idx=0; idx < masterPerson.personphone_set.length; idx++) {
            let phone = masterPerson.personphone_set[idx];
            if (phone.phone_type) {
                phone.phone_type = '' + phone.phone_type;
            }
        }
        
        for (let idx=0; idx < masterPerson.personaddress_set.length; idx++) {
            let address = masterPerson.personaddress_set[idx];
            if (address.address_type) {
                address.address_type = '' + address.address_type;
            }
        }
        
        for (let idx=0; idx < masterPerson.personsocialmedia_set.length; idx++) {
            let social_media = masterPerson.personsocialmedia_set[idx];
            if (social_media.social_media_type) {
                social_media.social_media_type = '' + social_media.social_media_type;
            }
        }
        
        for (let idx=0; idx < masterPerson.persondocument_set.length; idx++) {
            if (photoDocumentType && masterPerson.persondocument_set[idx].document_type &&
                    masterPerson.persondocument_set[idx].document_type === photoDocumentType) {
                container.photos.push({id:masterPerson.persondocument_set[idx].id ,file_location:masterPerson.persondocument_set[idx].file_location, 
                        document_type:masterPerson.persondocument_set[idx].document_type, master_person_id:masterPerson.id,
                            canRemove:true, file:null});
            } else {
                container.attachments.push({id:masterPerson.persondocument_set[idx].id ,file_location:masterPerson.persondocument_set[idx].file_location,
                        document_type:''+masterPerson.persondocument_set[idx].document_type, master_person_id:masterPerson.id,
                        canRemove:true, file:null});
            }
        }
        
        
        if (container.selectedFormId && this.formSelected) {
            this.formSelected();
        }
    }
}

export default {
    BaseMasterPersonCompare
};