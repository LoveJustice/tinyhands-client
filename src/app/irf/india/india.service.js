/*global FormData */
/* global jQuery */
export default class IndiaService {
    constructor(BaseService) {
        'ngInject';
        this.service = BaseService;
    }
    
    getIndiaIrf(countryId, stationId, id) {
    	if (id !== null) {
    		return this.service.get(`api/irfNew/${countryId}/${id}`);
    	} else {
    		return this.getBlankIndiaIrf(countryId, stationId);
    	}
    }
    
    getBlankIndiaIrf(countryId, stationId) {
    	return {
            then: (f) => f({
                data: {
                    "station_id": stationId,
                    "country_id": countryId,
                    "status": "in-progress",
                    "responses": [{
                            "question_id": 1,
                            "response": {
                                "value": ""
                            }
                        },
                        {
                            "question_id": 2,
                            "response": {
                                "value": null
                            }
                        },
                        {
                            "question_id": 3,
                            "response": {
                                "value": ""
                            }
                        },
                        {
                            "question_id": 4,
                            "response": {
                                "value": new Date()
                            }
                        },
                        {
                            "question_id": 5,
                            "response": {
                                "value": null
                            }
                        },
                        {
                            "question_id": 6,
                            "response": {
                                "value": ""
                            }
                        },
                        {
                            "question_id": 10,
                            "response": {
                                "value": false
                            }
                        },
                        {
                            "question_id": 12,
                            "response": {
                                "value": false
                            }
                        },
                        {
                            "question_id": 13,
                            "response": {
                                "value": false
                            }
                        },
                        {
                            "question_id": 14,
                            "storage_id": 4,
                            "response": {
                                "value": false
                            }
                        },
                        {
                            "question_id": 21,
                            "response": {
                                "value": false
                            }
                        },
                        {
                            "question_id": 22,
                            "response": {
                                "value": false
                            }
                        },
                        {
                            "question_id": 23,
                            "response": {
                                "value": false
                            }
                        },
                        {
                            "question_id": 24,
                            "response": {
                                "value": false
                            }
                        },
                        {
                            "question_id": 25,
                            "response": {
                                "value": false
                            }
                        },
                        {
                            "question_id": 26,
                            "response": {
                                "value": false
                            }
                        },
                        {
                            "question_id": 27,
                            "response": {
                                "value": false
                            }
                        },
                        {
                            "question_id": 28,
                            "response": {
                                "value": false
                            }
                        },
                        {
                            "question_id": 30,
                            "response": {
                                "value": false
                            }
                        },
                        {
                            "question_id": 31,
                            "response": {
                                "value": null
                            }
                        },
                        {
                            "question_id": 36,
                            "response": {
                                "value": false
                            }
                        },
                        {
                            "question_id": 37,
                            "response": {
                                "value": false
                            }
                        },
                        {
                            "question_id": 38,
                            "response": {
                                "value": false
                            }
                        },
                        {
                            "question_id": 39,
                            "response": {
                                "value": false
                            }
                        },
                        {
                            "question_id": 41,
                            "response": {
                                "value": false
                            }
                        },
                        {
                            "question_id": 51,
                            "response": {
                                "value": false
                            }
                        },
                        {
                            "question_id": 52,
                            "response": {
                                "value": false
                            }
                        },
                        {
                            "question_id": 53,
                            "response": {
                                "value": false
                            }
                        },
                        {
                            "question_id": 54,
                            "response": {
                                "value": false
                            }
                        },
                        {
                            "question_id": 55,
                            "response": {
                                "value": false
                            }
                        },
                        {
                            "question_id": 56,
                            "response": {
                                "value": false
                            }
                        },
                        {
                            "question_id": 57,
                            "response": {
                                "value": false
                            }
                        },
                        {
                            "question_id": 58,
                            "response": {
                                "value": false
                            }
                        },
                        {
                            "question_id": 59,
                            "response": {
                                "value": false
                            }
                        },
                        {
                            "question_id": 60,
                            "response": {
                                "value": false
                            }
                        },
                        {
                            "question_id": 61,
                            "response": {
                                "value": false
                            }
                        },
                        {
                            "question_id": 62,
                            "response": {
                                "value": false
                            }
                        },
                        {
                            "question_id": 63,
                            "response": {
                                "value": false
                            }
                        },
                        {
                            "question_id": 64,
                            "response": {
                                "value": false
                            }
                        },
                        {
                            "question_id": 69,
                            "response": {
                                "value": false
                            }
                        },
                        {
                            "question_id": 70,
                            "response": {
                                "value": false
                            }
                        },
                        {
                            "question_id": 73,
                            "response": {
                                "value": false
                            }
                        },
                        {
                            "question_id": 74,
                            "response": {
                                "value": false
                            }
                        },
                        {
                            "question_id": 77,
                            "response": {
                                "value": false
                            }
                        },
                        {
                            "question_id": 78,
                            "response": {
                                "value": false
                            }
                        },
                        {
                            "question_id": 79,
                            "response": {
                                "value": false
                            }
                        },
                        {
                            "question_id": 80,
                            "response": {
                                "value": false
                            }
                        },
                        {
                            "question_id": 81,
                            "response": {
                                "value": false
                            }
                        },
                        {
                            "question_id": 82,
                            "response": {
                                "value": ""
                            }
                        },
                        {
                            "question_id": 91,
                            "response": {
                                "value": null
                            }
                        },
                        {
                            "question_id": 92,
                            "response": {
                                "value": ""
                            }
                        },
                        {
                            "question_id": 102,
                            "response": {
                                "value": null
                            }
                        },
                        {
                            "question_id": 104,
                            "response": {
                                "value": ""
                            }
                        },
                        {
                            "question_id": 106,
                            "response": {
                                "value": ""
                            }
                        },
                        {
                            "question_id": 111,
                            "response": {
                                "value": false
                            }
                        },
                        {
                            "question_id": 112,
                            "response": {
                                "value": false
                            }
                        },
                        {
                            "question_id": 113,
                            "response": {
                                "value": false
                            }
                        },
                        {
                            "question_id": 114,
                            "response": {
                                "value": false
                            }
                        },
                        {
                            "question_id": 115,
                            "response": {
                                "value": false
                            }
                        },
                        {
                            "question_id": 116,
                            "response": {
                                "value": false
                            }
                        },
                        {
                            "question_id": 117,
                            "response": {
                                "value": false
                            }
                        },
                        {
                            "question_id": 118,
                            "response": {
                                "value": false
                            }
                        },
                        {
                            "question_id": 119,
                            "response": {
                                "value": false
                            }
                        },
                        {
                            "question_id": 120,
                            "response": {
                                "value": false
                            }
                        },
                        {
                            "question_id": 121,
                            "response": {
                                "value": false
                            }
                        },
                        {
                            "question_id": 122,
                            "response": {
                                "value": false
                            }
                        },
                        {
                            "question_id": 123,
                            "response": {
                                "value": false
                            }
                        },
                        {
                            "question_id": 124,
                            "response": {
                                "value": false
                            }
                        },
                        {
                            "question_id": 125,
                            "response": {
                                "value": false
                            }
                        },
                        {
                            "question_id": 126,
                            "response": {
                                "value": false
                            }
                        },
                        {
                            "question_id": 127,
                            "response": {
                                "value": false
                            }
                        },
                        {
                            "question_id": 128,
                            "response": {
                                "value": false
                            }
                        },
                        {
                            "question_id": 129,
                            "response": {
                                "value": false
                            }
                        },
                        {
                            "question_id": 130,
                            "response": {
                                "value": false
                            }
                        },
                        {
                            "question_id": 131,
                            "response": {
                                "value": false
                            }
                        },
                        {
                            "question_id": 132,
                            "response": {
                                "value": false
                            }
                        },
                        {
                            "question_id": 133,
                            "response": {
                                "value": false
                            }
                        },
                        {
                            "question_id": 134,
                            "response": {
                                "value": ""
                            }
                        },
                        {
                            "question_id": 141,
                            "response": {
                                "value": ""
                            }
                        },
                        {
                            "question_id": 143,
                            "response": {
                                "value": null
                            }
                        },
                        {
                            "question_id": 144,
                            "response": {
                                "value": null
                            }
                        },
                        {
                            "question_id": 147,
                            "response": {
                                "value": ""
                            }
                        },
                        {
                            "question_id": 148,
                            "response": {
                                "value": false
                            }
                        },
                        {
                            "question_id": 149,
                            "response": {
                                "value": false
                            }
                        },
                        {
                            "question_id": 150,
                            "response": {
                                "value": false
                            }
                        },
                        {
                            "question_id": 151,
                            "response": {
                                "value": false
                            }
                        },
                        {
                            "question_id": 152,
                            "response": {
                                "value": ""
                            }
                        },
                        {
                            "question_id": 242,
                            "response": {
                                "value": false
                            }
                        },
                        {
                            "question_id": 243,
                            "response": {
                                "value": false
                            }
                        },
                        {
                            "question_id": 244,
                            "response": {
                                "value": false
                            }
                        },
                        {
                            "question_id": 245,
                            "response": {
                                "value": ""
                            }
                        },
                        {
                            "question_id": 246,
                            "response": {
                                "value": false
                            }
                        },
                        {
                            "question_id": 247,
                            "response": {
                                "value": false
                            }
                        },
                        {
                            "question_id": 248,
                            "response": {
                                "value": false
                            }
                        },
                        {
                            "question_id": 249,
                            "response": {
                                "value": false
                            }
                        },
                        {
                            "question_id": 251,
                            "response": {
                                "value": false
                            }
                        },
                        {
                            "question_id": 252,
                            "response": {
                                "value": false
                            }
                        },
                        {
                            "question_id": 253,
                            "response": {
                                "value": false
                            }
                        },
                        {
                            "question_id": 254,
                            "response": {
                                "value": false
                            }
                        },
                        {
                            "question_id": 255,
                            "response": {
                                "value": false
                            }
                        },
                        {
                            "question_id": 256,
                            "response": {
                                "value": false
                            }
                        }
                    ],
                    "cards": [{
                        "category_id": 13,
                        "instances": []
                    }],
                }
            })
        };
    }
   
    appendImages(formData, card_instances) {
    	let cnt=0;
    	for (let idx=0; idx < card_instances.length; idx++) {
    		for (let r_idx=0; r_idx < card_instances[idx].responses.length; r_idx++) {
    			let t = Object.prototype.toString.call(card_instances[idx].responses[r_idx].response.value);
    			if (t === '[object Blob]') {
    				formData.append('images[' + cnt + ']', card_instances[idx].responses[r_idx].response.value, card_instances[idx].responses[r_idx].response.value.$ngfName);
    				card_instances[idx].responses[r_idx].response.value = {'name': card_instances[idx].responses[r_idx].response.value.$ngfName};
    				cnt += 1;
    			} else if (t === '[object File]') {
    				formData.append('images[' + cnt + ']', card_instances[idx].responses[r_idx].response.value, card_instances[idx].responses[r_idx].response.value.name);
    				card_instances[idx].responses[r_idx].response.value = {'name': card_instances[idx].responses[r_idx].response.value.name};
    				cnt += 1;
    			}
    		}
    	}
    }
    
    appendScannedForm(formData, responses) {
    	let cnt = 0;
    	for (let idx=0; idx < responses.length; idx++) {
    		if (responses[idx].question_id === 152) {
    			let t = Object.prototype.toString.call(responses[idx].response.value);
    			if (t === '[object Blob]') {
    				formData.append('scanned[' + cnt + ']', responses[idx].response.value, responses[idx].response.value.$ngfName);
    				responses[idx].response.value = {'name': responses[idx].response.value.$ngfName};
    				cnt += 1;
    			} else if (t === '[object File]') {
    				formData.append('scanned[' + cnt + ']', responses[idx].response.value, responses[idx].response.value.name);
    				responses[idx].response.value = {'name': responses[idx].response.value.name};
    				cnt += 1;
    			}
    		}
    	}
    }
    
    removeTimeZoneAdjustment(irf) {
    	let dateTimeQuestions = [4];
    	for (let idx=0; idx < irf.responses.length; idx++) {
    		let t1 = dateTimeQuestions.indexOf(irf.responses[idx].question_id);
    		if (t1 > -1) {
    			let dt = irf.responses[idx].response.value;
	    		if (dt instanceof  Date) {
	    			let tzo = dt.getTimezoneOffset();
	    			dt.setMinutes(dt.getMinutes() - tzo);
	    		}
    		}
    	}
    }
    
    submitIndiaIrf(countryId, id, irf) {
    	if (id === null) {
    		return this.postIndiaIrf(irf);
    	} else {
    		return this.putIndiaIrf(countryId, id, irf);
    	}
    }
    
    putIndiaIrf(countryId, id, irf) {
    	let myIrf = jQuery.extend(true, {}, irf);
    	//let myIrf = angular.copy(irf);
    	let formData = new FormData();
    	this.appendImages(formData, myIrf.cards[0].instances);
    	this.removeTimeZoneAdjustment(myIrf);
    	this.appendScannedForm(formData, myIrf.responses);
    	formData.append("main", JSON.stringify(myIrf));
    	return this.service.put(`api/irfNew/${countryId}/${id}`, formData, {'Content-Type': undefined});
    }
    
    postIndiaIrf(irf) {
    	let myIrf = jQuery.extend(true, {}, irf);
    	let formData = new FormData();
    	this.appendImages(formData, myIrf.cards[0].instances);
    	this.removeTimeZoneAdjustment(myIrf);
    	this.appendScannedForm(formData, myIrf.responses);  	
    	formData.append("main", JSON.stringify(myIrf));
    	return this.service.post(`api/irfNew/`, formData, {'Content-Type': undefined});
    }
}