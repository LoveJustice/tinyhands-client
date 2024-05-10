import Constants from './constants.js';

import salariesForm from './components/salariesForm.html';
import travelForm from './components/travelForm.html';
import administrationForm from './components/administrationForm.html';
import potentialVictimCareForm from './components/potentialVictimCareForm.html';
import suppliesAwarenessForm from './components/suppliesAwarenessForm.html';
import pastMonth from './components/pastMonthSentMoneyForm.html';
import moneyNotSpentForm from './components/moneyNotSpent.html';
import impactMultiplyingForm from './components/impactMultiplying.html';
import rentUtilitiesForm from './components/rentUtilities.html';

class Tracking {
    constructor(shouldFinalize=false) {
        this.count = 0;
        this.errors = 0;
        this.finalize = shouldFinalize;
    }
    
    startRequest() {
        this.count += 1;
    }
    
    completeRequest(error=false) {
        this.count -= 1;
        if (error) {
            this.errors += 1;
        }
    }
    
    allRequestsCompleted() {
        return this.count === 0;
    }
    
    hasErrors() {
        return this.errors !== 0;
    }
    
    shouldFinalize() {
        return this.count === 0 && this.errors === 0 && this.finalize;
    }
}

export default class MdfPrController {
    constructor($state, $stateParams,  $uibModal, MdfService, SessionService, UtilService, SpinnerOverlayService, toastr, $scope) {
        'ngInject';

        this.$state = $state;
        this.$stateParams = $stateParams;
        this.$uibModal = $uibModal;
        this.service = MdfService;
        this.session = SessionService;
        this.utils = UtilService;
        this.spinner = SpinnerOverlayService;
        this.toastr = toastr;
        this.currencyType = 'local';
        this.currency = "";
        this.localCurrency = "";
        this.usdCurrency = "$";
        this.decimalDigits = 2;
        this.dropDecimal = false;
        this.localDropDecimal = false;
        this.usdDropDecimal = false;
        this.localDecimalDigits = 2;
        this.usdDecimalDigits = 2;
        this.modified = false;
        this.scope = $scope;

		this.constants = Constants;
        this.sections = {
            allSections: [
                { name: 'Salaries & Benefits', templateUrl: salariesForm, value: Constants.FormSections.Salaries, include:true },
                { name: 'Rent & Utilities', templateUrl: rentUtilitiesForm, value: Constants.FormSections.RentUtilities, include:true },
                { name: 'Administration', templateUrl: administrationForm, value: Constants.FormSections.Administration, include:true },
                { name: 'Supplies & Awareness', templateUrl: suppliesAwarenessForm, value: Constants.FormSections.Awareness, include:true },
                { name: 'Staff Travel', templateUrl: travelForm, value: Constants.FormSections.Travel, include:true },
                { name: 'PV Care', templateUrl: potentialVictimCareForm, value: Constants.FormSections.PotentialVictimCare, include:true },
            ],
            excludeFromDropDown: [
                'Past Month Sent Money',
                'Money Not Spent',
                'Impact Multiplying',
            ]
        };

        this.months = [
            { name: 'January', value: 1 },
            { name: 'February', value: 2 },
            { name: 'March', value: 3 },
            { name: 'April', value: 4 },
            { name: 'May', value: 5 },
            { name: 'June', value: 6 },
            { name: 'July', value: 7 },
            { name: 'August', value: 8 },
            { name: 'September', value: 9 },
            { name: 'October', value: 10 },
            { name: 'November', value: 11 },
            { name: 'December', value: 12 },
        ];

		this.dropDecimal = false;
        this.active = null;
        this.borderMonitoringStationTotal = 0;
        this.limboPvCount = 0;
        this.pvFooodSnacks = '';
        this.LimboPVCost = '';
        this.mdfId = $stateParams.id;
        if ($stateParams.borderStationId) {
            this.borderStationId = parseInt($stateParams.borderStationId);
        }

        this.month = parseInt(window.moment().format('M'));
        this.year = parseInt(window.moment().format('YYYY'));

        this.deletedItems = [];
        this.form = null;
        this.reviewProject = null;
        this.reviewStaff = null;
        
        let tmp = sessionStorage.getItem('mdfState');
        if (tmp) {
        	let parts = tmp.split('|');
        	if (parts[0] + '' !== this.mdfId + '') {
        		this.updateSessionData();
        	}
        } else {
        	this.updateSessionData();
        }
        
        this.tracking = null;

        this.isCreating = !this.mdfId && this.borderStationId >= 0;
        this.isViewing = $stateParams.isViewing === 'true';
        
        this.reviewProject = null;
        this.reviewStaff = null;

        this.sectionTemplateUrl = null;
        this.safeHouseTotal = 0;
        this.total = 0;
        this.projectTotal = {};
        this.projectNames = {};

        this.getMdfForm();
    }
    
    tabButtonClass(section) {
    	let result = 'btn btn-default';
    	if (section === 'Past Month Sent Money' && this.form && !this.form.past_month_sent_reviewed) {
    		result += ' notCompleted';
    	} else if (section === 'Money Not Spent' && this.form && !this.form.money_not_spent_reviewed) {
    		result += ' notCompleted';
    	}
    	return result;
    }
    
    reviewCompleteClass(baseCss, isDone) {
    	if (isDone) {
    		return baseCss;
    	} else {
    		return baseCss + ' notCompleted';
    	}
    }
    
    strToPennies(strValue) {
        let cents = 0;
        let dollars = 0;
        let pennies = 0;
        if (strValue) {
            let pos = strValue.indexOf(".");
            if (pos < 0) {
                dollars = parseInt(strValue);
            } else {
                dollars= parseInt(strValue.substring(0,pos));
                let decimalDigits = strValue.length - (pos+1);
                if (decimalDigits === 1) {
                    cents = parseInt(strValue.substring(pos+1));
                    cents *= 10;
                } else if (decimalDigits === 2) {
                    cents = parseInt(strValue.substring(pos+1));
                }
            }
            pennies = dollars * 100 + cents;
        }
        return pennies;
    }
    
    penniesToStr(pennies) {
    	let value = pennies;
    	if (this.currencyType === 'USD') {
    		value = Math.round(value / this.form.exchange_rate);
    	}
        let dollars = Math.floor(value / 100);
        let cents = value - dollars * 100;
        let str = '';
        if (!this.dropDecimal || cents !== 0 || this.currencyType === 'USD') {
	        str = cents + '';
	        if (cents < 10) {
	            str = '0' + str;
	        }
	        str = dollars + '.' + str;
        } else {
        	str = dollars + '';
        }
        return str;
    }
    
    currencyChange() {
    	this.updateCurrencyDisplay();
    }
    
    updateCurrencyDisplay() {
    	this.updateSessionData();
    	if (this.currencyType === 'USD') {
    		this.currency = this.usdCurrency;
        	this.decimalDigits = this.usdDecimalDigits;
       		this.dropDecimal = this.usdDropDecimal;
       		this.isViewing = true;
    	} else {
    		this.currency = this.localCurrency;
        	this.decimalDigits = this.localDecimalDigits;
       		this.dropDecimal = this.localDropDecimal;
       		this.isViewing = this.$stateParams.isViewing === 'true';
    	}
    	this.requestDisplay();
    	this.totalsDisplay();
    	this.itemDisplay();
    }
    
    setTotals() {
    	for (let projIndex in this.allProjects) {
    		this.setProjectTotals(this.allProjects[projIndex].id);
    	}
    }
    
    getRequestTotal(project, section) {
    	let value = 0;
    	if (project in this.totals) {
    		if (section in this.totals[project]) {
    			let entry = this.totals[project][section];
    			value += entry.requestTotal;
    		}
    	}
    	return value;
    }
    
    getItemTotal(project, section, toDeduct=null) {
    	let value = 0;
    	for (let itemIndex in this.form.mdfitem_set) {
    		let item = this.form.mdfitem_set[itemIndex];
    		if (item.work_project===project && item.category===section &&
    				(toDeduct === null || this.form.mdfitem_set[itemIndex].deduct===toDeduct)) {
    			value += this.strToPennies(this.form.mdfitem_set[itemIndex].cost);
    		}
    	}
    	return value;
    }
    
    verifyTotalPresent(project, section) {
    	if (!this.totals[project]) {
    		this.totals[project] = {requestTotal:0, total:0, display:''};
    	}
    	if (!this.totals[project][section]) {
    		this.totals[project][section] = {requestTotal:0, total:0, display:''};
    	}
    }
    
    setProjectTotals(project) {
    	let amount = this.getRequestTotal(project, Constants.FormSections.Salaries);
    	if (project === this.form.border_station) {
    		amount += this.getRequestTotal(project, Constants.FormSections.RentUtilities);
    		amount += this.getRequestTotal(project, Constants.FormSections.Administration);
    		amount += this.totals[project][Constants.FormSections.Awareness].total;
    		amount +=this.getRequestTotal(project, Constants.FormSections.Travel);
    		amount += this.setPVCareTotal();
    	} else {
    		amount += this.getRequestTotal(project, Constants.FormSections.ImpactMultiplying);
    	}
    	this.setPastMoneySentTotal(project);
    	amount += this.setMoneyNotSpentTotal(project);
    	
    	this.totals[project].total = amount;
    	this.totals[project].display = this.penniesToStr(amount);
    	return amount;
    }
    
	setPVCareTotal() {
		let project = this.form.border_station;
		let amount = this.getRequestTotal(project, Constants.FormSections.PotentialVictimCare);
		
		/****
		let totalFoodSnacks = this.strToPennies(this.multiplierByLocation[this.constants.FormSections.PotentialVictimCare].cost) * this.form.number_of_pv_days;
		this.totalFoodSnacks = this.penniesToStr(totalFoodSnacks);
		amount += totalFoodSnacks;
		
		this.limboPvDays = this.getItemTotal(project,this.constants.FormSections.Limbo)/100;
		let limboCost = this.strToPennies(this.multiplierByLocation[this.constants.FormSections.Limbo].cost) * this.limboPvDays;
		
		this.limboCost = this.penniesToStr(limboCost);
		amount += limboCost;
		*/
		
		this.verifyTotalPresent(project, this.constants.FormSections.PotentialVictimCare);
		this.totals[project][this.constants.FormSections.PotentialVictimCare].total = amount;
		this.totals[project][this.constants.FormSections.PotentialVictimCare].display = this.penniesToStr(amount);
		return amount;
    }
	
	setPastMoneySentTotal(project) {
		let amount = this.getItemTotal(project,this.constants.FormSections.PastMonth);
		
		this.verifyTotalPresent(project, this.constants.FormSections.PastMonth);
		this.totals[project][this.constants.FormSections.PastMonth].total = amount;
		this.totals[project][this.constants.FormSections.PastMonth].display = this.penniesToStr(amount);
		return amount;
	}
	
	setMoneyNotSpentTotal(project) {
		this.verifyTotalPresent(project, this.constants.FormSections.MoneyNotSpent);
		let toDeduct = this.getItemTotal(project,this.constants.FormSections.MoneyNotSpent, 'Yes');
		this.totals[project][this.constants.FormSections.MoneyNotSpent].toDeductTotal = toDeduct;
		this.totals[project][this.constants.FormSections.MoneyNotSpent].toDeductDisplay = this.penniesToStr(toDeduct);
		
		let notDeduct = this.getItemTotal(project,this.constants.FormSections.MoneyNotSpent, 'No');
		this.totals[project][this.constants.FormSections.MoneyNotSpent].notDeductTotal = notDeduct;
		this.totals[project][this.constants.FormSections.MoneyNotSpent].notDeductDisplay = this.penniesToStr(notDeduct);
		
		return -toDeduct;
		
	}

    validAmount(amount) {
        if (amount) {
            return amount;
        }
        return 0;
    }
    
    formatSection(section) {
    	let result = '';
        for (let sectionIndex in this.sections.allSections) {
        	if (this.sections.allSections[sectionIndex].value + '' === section + '') {
        		result = this.sections.allSections[sectionIndex].name;
        	}
        }
    	return result;
    }
    
    flattenRequests() {
    	let requests = [];
    	for (let benefitIndex in this.salary.benefits) {
    		let benefit = this.salary.benefits[benefitIndex];
    		for (let requestIndex in this.salary.requests[this.getSalaryKey(this.reviewProject, this.reviewStaff.id, benefit)]) {
    			requests.push(this.salary.requests[this.getSalaryKey(this.reviewProject, this.reviewStaff.id, benefit)][requestIndex]);
    		}
    	}
    	return requests;
    }
    
    getCostColor(existing, requests) {
    	let css_class = existing + ' text-right';
	    for (let requestIndex in requests) {
	    	let request = requests[requestIndex];
	    	if (request.monthly) {
	    		if (request.first_mdf_id === this.form.id) {
	    			if (request.prior_request) {
	    				css_class += ' costMonthlyChange';
	    				break;
	    			} else {
	    				css_class += ' costMonthlyNew';
	    				break;
	    			}
	    		}
	    	} else {
	    		css_class += ' costSingleNew';
	    	}
    	}
    	return css_class;
    }
    
    getMultiplierColor(existing, multiplier) {
    	let css_class = existing;
    	if (multiplier.request === null) {
    		css_class += ' multiplierUnset';
    	} else {
    		css_class = this.getCostColor(existing, [multiplier.request]);
    	}
    	
    	return css_class;
    }
    
    getReviewColor(existing, requests) {
    	let cssClass = existing;
    	let isOpen = false;
    	for (let requestIndex in requests) {
    		if (requests[requestIndex].discussion_status === 'Open') {
    			isOpen = true;
    			break;
    		}
    	}
    	if (isOpen) {
    		cssClass += ' reviewOpenIcon';
    	} else {
    		cssClass += ' reviewIcon';
    	}
    	
    	return cssClass;
    }
    
    getBenefitCost(project, staff, benefit) {
    	let key = this.getSalaryKey(project,staff,benefit);
    	if (key in this.salary.requests) {
    		return this.penniesToStr(this.strToPennies(this.salary.requests[key][0].cost));
    	} else {
    		return null;
    	}
    }
    
    getBenefitRequests(project, staff) {
    	let staffRequests = [];
    	for (let requestIndex in this.form.requests) {
    		let request = this.form.requests[requestIndex];
    		if (request.project === project && request.staff === staff && request.category === Constants.FormSections.Salaries) {
    			staffRequests.push(request);
    		}
    	}
    	return staffRequests;
    }
    
    getSalaryKey(project, staff, benefit) {
    	let theKey = project + '|' + staff + '|' + benefit;
    	return theKey;
    }
    
    
    
    getProject(projectId) {
    	if (this.form) {
	    	for (let projectIndex in this.form.related_projects) {
	    		if (this.form.related_projects[projectIndex].id === projectId) {
	    			return this.form.related_projects[projectIndex];
	    		}
	    	}
    	}
    	
    	return null;
    }
    
    buildData() {
    	this.initializeMultipliers();
    	this.initializeBaseTotals();
    	this.buildGeneralTotals();
    	this.buildSalaryData();
    	
    	this.suppliesAwarenessTotals();
    }
    
    initializeBaseTotals() {
    	this.totals = {};
    	this.projectNames = {};
    	this.projectNames[this.form.border_station] = this.form.station_name;
    	this.projects = [this.form.border_station];
    	this.totals[this.form.border_station] = {requestTotal:0, total:0, display:'', declined_count:0, completed_count:0, changed_count:0};
    	for (let requestIndex in this.form.requests) {
    		let request = this.form.requests[requestIndex];
    		if (this.projects.indexOf(request.project) < 0) {
    			this.projects.push(request.project);
    			this.totals[request.project] = {total:0, display:''};
    			this.projectNames[request.project] = request.project_name;
    			this.totals[request.project] = {requestTotal:0, total:0, display:'', declined_count:0, completed_count:0, changed_count:0};
    		}
    	}
    	
    	for (let sectionIndex in Constants.FormSections) {
    		this.totals[this.form.border_station][Constants.FormSections[sectionIndex]] = {requestTotal:0, total:0, display:'', declined_count:0, completed_count:0, changed_count:0};
    	}
    	let impactMultiplyingSections = [Constants.FormSections.Salaries, Constants.FormSections.ImpactMultiplying];
    	for (let projIndex in this.projects) {
    		for (let sectionIndex in impactMultiplyingSections) {
    			this.totals[this.projects[projIndex]][impactMultiplyingSections[sectionIndex]] = {requestTotal:0, total:0, display:'', declined_count:0, completed_count:0, changed_count:0};
    		}
    	}
    	
    	
    }
    
    initializeMultipliers() {
    	this.multiplierByName = {};
    	this.multiplierByLocation = {};
    	for (let multiplierIndex in this.form.multiplier_types) {
    		let multiplier = this.form.multiplier_types[multiplierIndex];
    		this.multiplierByName[multiplier.name] = {cost:0, display:'0', multiplier:multiplier, request:null};
    		this.multiplierByLocation[multiplier.category] = this.multiplierByName[multiplier.name];
    	}
    }
    
    amountChanged(request) {
    	if (request.cost !== request.original_cost &&
        			(!request.monthly || request.monthly && request.first_mdf_id === this.form.id ||
        			request.monthly && request.prior_request)) {
        	return true;
        } else {
        	return false;
        }
    	
    }
    
    buildGeneralTotals() {
    	this.openDiscussions = 0;
    	for (let requestIndex in this.form.requests) {
    		let request = this.form.requests[requestIndex];
    		
    		if (request.discussion_status === 'Open') {
    			this.openDiscussions += 1;
    		}
    		
    		if (request.status !== 'Approved') {
        		if (request.status === 'Declined') {
        			this.totals[request.project][request.category].declined_count += 1;
        			this.totals[request.project].declined_count += 1;
        		}
        		if (request.status === 'Approved-Completed') {
        			this.totals[request.project][request.category].completed_count += 1;
        			this.totals[request.project].completed_count += 1;
        		}
        		continue;
        	}
        	if (this.amountChanged(request)) {
        		this.totals[request.project][request.category].changed_count += 1;
        		this.totals[request.project].changed_count += 1;
        	}
        	if (request.category === Constants.FormSections.Salaries) {
    			continue;
    		}
    		if (request.category === Constants.FormSections.Multipliers) {
    			if (request.description !== '' && request.description in this.multiplierByName) {
    				this.multiplierByName[request.description].cost = request.cost;
    				this.multiplierByName[request.description].display = this.penniesToStr(this.strToPennies(request.cost));
    				this.multiplierByName[request.description].request = request;
    			}
    			continue;
    		}
    		
    		let pennies = this.strToPennies(request.cost);
    		this.totals[request.project][request.category].requestTotal += pennies;
    		this.totals[request.project][request.category].total += pennies;
        	this.totals[request.project][request.category].display = 
        			this.penniesToStr(this.totals[request.project][request.category].total);
    	}
    
    }
    
    // Supplies and awareness is dependent on number of PVs last month and a multiplier
    // Total can be computed when form is loaded and cannot change
    suppliesAwarenessTotals() {
    	/*
    	let stationary s.validAmo= (thiunt(this.form.last_month_number_of_intercepted_pvs) *
                this.strToPennies(this.multiplierByLocation[Constants.FormSections.Awareness].cost));
        this.stationaryTotalDisplay = this.penniesToStr(stationary);
        */
        let supplyTotal = this.totals[this.form.border_station][Constants.FormSections.Awareness];
        supplyTotal.total = supplyTotal.requestTotal;
        supplyTotal.display = this.penniesToStr(supplyTotal.total);
    }
    
    buildSalaryData() {
    	this.salary = {
        	projects:[this.form.border_station],
        	benefits:['Salary', 'Deductions'],
        	staffByProject:{},
        	requests:{}
        };
        this.totals[this.form.border_station][Constants.FormSections.Salaries].Salary = {total:0,display:''};
        this.totals[this.form.border_station][Constants.FormSections.Salaries].Deductions = {total:0,display:''};
        
        if (!(this.form.border_station in this.projectNames)) {
        	this.projectNames[this.form.border_station] = this.form.station_name;
        }
        this.salary.staffByProject[this.form.border_station] = [];
        let newBenefits = [];
        for (let requestIndex in this.form.requests) {
        	let request = this.form.requests[requestIndex];
        	
        	if (this.salary.projects.indexOf(request.project) < 0) {
        		this.salary.projects.push(request.project);
        		this.salary.staffByProject[request.project] = [];
        		this.totals[request.project][Constants.FormSections.Salaries].Salary = {total:0,display:''};
        		this.totals[request.project][Constants.FormSections.Salaries].Deductions = {total:0,display:''};
        	}
        	
        	if (request.category !== Constants.FormSections.Salaries || request.status !== 'Approved') {
        		continue;
        	}
        	
        	if (this.salary.benefits.indexOf(request.benefit_type_name) < 0 && newBenefits.indexOf(request.benefit_type_name) < 0) {
        		newBenefits.push(request.benefit_type_name);
        	}
        	if (!this.totals[request.project][Constants.FormSections.Salaries][request.benefit_type_name]) {
        		this.totals[request.project][Constants.FormSections.Salaries][request.benefit_type_name] = {total:0,display:''};
        	}
        	if (this.salary.staffByProject[request.project].indexOf(request.staff) < 0) {
        		this.salary.staffByProject[request.project].push(request.staff);
        	}
        	let key = this.getSalaryKey(request.project, request.staff, request.benefit_type_name);
        	if (key in this.salary.requests) {
        		this.salary.requests[key].push(request);
        	} else {
        		this.salary.requests[key] = [request];
        	}
        	
        	let pennies = this.strToPennies(request.cost);
        	
        	if (request.benefit_type_name === 'Deductions') {
        		pennies = -pennies;
        	} 
        	this.totals[request.project][Constants.FormSections.Salaries].total += pennies;
        	this.totals[request.project][Constants.FormSections.Salaries].requestTotal =
        		this.totals[request.project][Constants.FormSections.Salaries].total;
        	this.totals[request.project][Constants.FormSections.Salaries].display =
        			this.penniesToStr(this.totals[request.project][Constants.FormSections.Salaries].total);
        	this.totals[request.project][Constants.FormSections.Salaries][request.benefit_type_name].total += pennies;
        	this.totals[request.project][Constants.FormSections.Salaries][request.benefit_type_name].display = 
        			this.penniesToStr(this.totals[request.project][Constants.FormSections.Salaries][request.benefit_type_name].total);
        }
        this.salary.benefits = this.salary.benefits.concat(newBenefits.sort());
    }
    
    totalsDisplay() {
    	for (let projectIndex in this.projects) {
    		let project = this.projects[projectIndex];
    		if (this.totals[project].total) {
    			this.totals[project].display = this.penniesToStr(this.totals[project].total);
    		}
    		for (let sectionIndex in Constants.FormSections) {
    			let section = Constants.FormSections[sectionIndex];
    			if (this.totals[project][section] && this.totals[project][section].total) {
    				this.totals[project][section].display = this.penniesToStr(this.totals[project][section].total);
    			}
    			if (section === Constants.FormSections.Salaries) {
    				for (let benefitIndex in this.salary.benefits) {
    					let benefit = this.salary.benefits[benefitIndex];
    					if (this.totals[project][section] && this.totals[project][section][benefit] && this.totals[project][section][benefit].total) {
    						this.totals[project][section][benefit].display = this.penniesToStr(this.totals[project][section][benefit].total);
    					}
    				}
    			}
    			if (section === Constants.FormSections.MoneyNotSpent) {
    				if (this.totals[project][section] && this.totals[project][section].toDeductTotal) {
    					this.totals[project][section].toDeductDisplay = this.penniesToStr(this.totals[project][section] && this.totals[project][section].toDeductTotal);
    				}
    				if (this.totals[project][section] && this.totals[project][section].notDeductTotal) {
    					this.totals[project][section].notDeductDisplay = this.penniesToStr(this.totals[project][section] && this.totals[project][section].notDeductTotal);
    				}
    			}
    		}
    	}
    }
    
    requestDisplay() {
    	for (let requestIndex in this.form.requests) {
        	let request = this.form.requests[requestIndex];
        	request.costDisplay = this.penniesToStr(this.strToPennies(request.cost));
        	request.originalCostDisplay = this.penniesToStr(this.strToPennies(request.original_cost));
        }
        
        for (let multiplier in this.multiplierByName) {
        	if (this.multiplierByName[multiplier].cost) {
        		this.multiplierByName[multiplier].display = this.penniesToStr(this.strToPennies(this.multiplierByName[multiplier].cost));
        	}
        }
    }
    
    itemDisplay() {
    	for (let itemIndex in this.form.mdfitem_set) {
    		let item = this.form.mdfitem_set[itemIndex];
    		if (item.cost) {
    			item.display = this.penniesToStr(this.strToPennies(item.cost));
    		}
    	}
    }

    getMdfForm() {
    	this.spinner.show("Opening MDF.");
        this.service
            .getMdf(this.mdfId)
            .then(response => {
                this.form = response.data;
                this.month = parseInt(window.moment(this.form.month_year).format('M'));
                this.year = parseInt(window.moment(this.form.month_year).format('YYYY'));
                this.borderStationId = response.data.border_station;
                this.localCurrency = decodeURI(this.form.country_currency);
                if (this.form.drop_decimal) {
                	this.localDropDecimal = true;
                	this.localDecimalDigits = 0;
                }
                for (let idx in this.form.mdfitem_set) {
                	let mdfItem = this.form.mdfitem_set[idx];
                	if (mdfItem.associated_section !== null && mdfItem.associated_section !== '') {
                		mdfItem.associated_section += '';
                	}
                }
                if (this.form.impact_projects.length > 0) {
                	this.sections.allSections.push({ name: 'Impact Multiplying', templateUrl: impactMultiplyingForm, value: Constants.FormSections.ImpactMultiplying, include:false });
                }
                if (this.form.past_month_sent) {
                	this.sections.allSections.push({ name: 'Past Month Sent Money', templateUrl: pastMonth, value: Constants.FormSections.PastMonth, include: false});
                }
                for (let itemIndex in this.form.mdfitem_set) {
                    let mdfItem = this.form.mdfitem_set[itemIndex];
                    if (mdfItem.associated_section) {
                        mdfItem.associated_section += '';
                    }
                }
                this.sections.allSections.push({ name: 'Money Not Spent', templateUrl: moneyNotSpentForm, value: 9999, include: false });
                let tmp = sessionStorage.getItem('mdfState');
		        if (tmp) {
		        	let parts = tmp.split('|');
		        	if (parts[1]) {
		        		this.active = Number(parts[1]);
		        		this.sectionTemplateUrl = this.sections.allSections[this.active].templateUrl;
		        	}
		        	if (parts[2]) {
		        		this.reviewProject = Number(parts[2]);
		        	}
		        	if (parts[3] && this.reviewProject) {
		        		let staffId = Number(parts[3]);
		        		for (let staffIndex in this.form.related_staff) {
		        			let staff = this.form.related_staff[staffIndex];
		        				if (staff.id === staffId) {
		        					this.reviewStaff = staff;
		        					break;
		        				}
		        		}
		        	}
		        	if (parts[4]) {
		        		this.currencyType = parts[4];
		        	}
		        }
		        this.updateCurrencyDisplay();
                
                for (let requestIndex in this.form.requests) {
                	let request = this.form.requests[requestIndex];
                	request.editUrl = this.$state.href('reviewProjectRequest', {
    	                id: request.id,
    	                mdf_id: this.form.id,
    	            });
    	            if (request.status === 'Declined-Completed') {
    	            	request.status = 'Declined';
    	            }
    	            if (request.status === 'Approved-Completed') {
    	            	if (!request.monthly) {
    	            		request.status = 'Approved';
    	            	} else {
    	            		if (this.form.month_year < request.completed_date_time) {
    	            			request.status = 'Approved';
    	            		}
    	            	}
    	            }
                }
                this.requestDisplay();
                this.allProjects = [];
                for (let projIndex in this.form.related_projects) {
                	let project = this.form.related_projects[projIndex];
                	if (project.id === this.form.border_station) {
                		this.allProjects.push(project);
                	}
                }
                this.allProjects = this.allProjects.concat(this.form.impact_projects);
                for (let projIndex in this.form.related_projects) {
                	let found = false;
                	for (let allProjIndex in this.allProjects) {
                		if (this.allProjects[allProjIndex].id === this.form.related_projects[projIndex].id) {
                			found = true;
                			break;
                		}
                	}
                	if (!found) {
                		this.allProjects.push(this.form.related_projects[projIndex]);
                	}
                }
                
                this.form.totals = {
                    borderMonitoringStation: {},
                    other: {},
                    safeHouse: {},
                };
    			this.buildData();
    			
		        this.setTotals();
            })
            .then(() => {
            	this.spinner.hide();
            }, ()=>{this.spinner.hide();});
    }
    
    addItem(project, section) {
    	this.form.mdfitem_set.push(
    		{
    			id:null,
    			mdf:this.form.id,
    			category:section,
    			cost:'',
    			description:'',
    			associated_section:null,
   				deduct:null,
    			work_project:project
    		}
    	);
    }
    
    removeItem(theList, index) {
    	if (theList[index].id !== null) {
    		this.deletedItems.push(theList[index]);
    	}
    	theList.splice(index, 1);
    	this.scope.mdfForm.$setDirty();
    	this.setTotals();
    }


    // REGION: PUT Calls
    updateOrCreateAll() {
    	for (let itemIndex in this.form.mdfitem_set) {
    		let item = this.form.mdfitem_set[itemIndex];
    		this.startRequest();
    		if (item.id !== null) {
    			this.service.updateMdfItem(item).then((promise) => {
    				this.form.mdfitem_set[itemIndex] = promise.data;
    				this.completeRequest();
	    		}, (error) => {
		            this.toastr.error(`There was an error updating the mdf form! ${JSON.stringify(error.data.non_field_errors)}`);
		            this.completeRequest(true);
		        });
    		} else {
    			this.service.createMdfItem(item).then((promise) => {
    				this.form.mdfitem_set[itemIndex] = promise.data;
    				this.completeRequest();
    			}, (error) => {
		            this.toastr.error(`There was an error updating the mdf form! ${JSON.stringify(error.data.non_field_errors)}`);
		            this.completeRequest(true);
		        });
    		}
    	}
    	
    	for (let itemIndex in this.deletedItems) {
    		let item = this.deletedItems[itemIndex];
    		this.service.deleteMdfItem(item).then(() => {
				this.completeRequest();
			}, (error) => {
	            this.toastr.error(`There was an error updating the mdf form! ${JSON.stringify(error.data.non_field_errors)}`);
	            this.completeRequest(true);
	        });
    	}
    }
    
    startRequest() {
        this.tracking.startRequest();
    }
    
    completeRequest(isError=false) {
        if (this.tracking) {
        	this.tracking.completeRequest(isError);
            if (this.tracking.allRequestsCompleted()) {
                if (this.tracking.hasErrors()) {
                    this.tracking = null;
                } else {
                    this.toastr.success(`${this.form.station_name} Mdf Form Updated Successfully!`);
                    this.tracking = null;
                    this.$state.go('mdfList'); 
                }
            }
        }
    }
    
    canApproveForm() {
    	let canApprove = false;
    	if (this.form) {
    		if (this.form.status === 'Pending' && this.form.past_month_sent_reviewed && this.form.money_not_spent_reviewed) {
    			if (this.session.checkPermission('MDF','EDIT',this.form.country_id, this.form.project)) {
	    			canApprove = true;
	    		}
    		} else if (this.form.status === 'Submitted') {
	    		if (this.session.checkPermission('MDF','INITIAL_REVIEW',this.form.country_id, this.form.project)) {
	    			canApprove = true;
	    		}
	    	} else {
	    		if (this.form.status === 'Initial Review') {
	    			if (this.session.checkPermission('MDF','FINAL_REVIEW',this.form.country_id, this.form.project)) {
		    			canApprove = true;
		    		}
	    		}
	    	}
    	}
    	return canApprove;
    }
    
    getConfirmText() {
    	let text = '';
    	if (this.form && this.form.status === 'Pending') {
    		text = 'Confim: submit PBS?';
    	}
    	else if (this.openDiscussions > 0) {
    		text = 'Comfirm: close discussions and approve PBS?';
    	} else {
    		text = 'Comfirm: approve PBS?';
    	}
    	return text;
    }
    
    getApprovalText() {
    	let text = 'Unknown';
    	if (this.form) {
    		if (this.form.status === 'Pending') {
    			text = 'Submit for Approval';
    		} else if (this.form.status === 'Submitted') {
	    		text = 'Regional Steward Approve';
	    	} else if (this.form.status === 'Initial Review') {
	    		text = 'AT Director Approve';
	    	}
    	}
    	return text;
    }
    
    getApprovalClass() {
    	let text = '';
    	if (this.confirmApprove) {
    		if (this.openDiscussions > 0) {
    			text='btn btn-lg btn-danger text-wrap';
    		} else {
    			text='btn btn-lg btn-warning text-wrap';
    		}
    	} else {
    		text='btn btn-lg btn-success text-wrap';
    	}
    	return text;
    }	
    
    approveForm() {
    	
        if (this.confirmApprove){
        	this.spinner.show('Approving form...');
            this.service.approveMdf(this.form).then(() => {
            	this.spinner.hide();
            	this.$state.go('mdfList'); 
            }, (error) => {
            	this.spinner.hide();
            	this.toastr.error(`There was an error approving the mdf form! ${JSON.stringify(error.data.non_field_errors)}`);
            	this.confirmApprove = false;
            });
        }
        else {
            if (this.openDiscussions > 0) {
            	this.comfirmText = 'Comfirm: close discussions and approve MDF?';
            	this.confirmApprove = true;
            } else {
            	this.comfirmText = 'Comfirm: approve MDF?';
            	this.confirmApprove = true;
            }
        }
    }

    updateForm(finalize = false) {
        this.tracking = new Tracking(finalize);
        this.startRequest();
        this.service.updateMdf(this.form).then(() => {
            this.completeRequest();
        },
        error => {
            this.toastr.error(`There was an error updating the mdf form! ${JSON.stringify(error.data.non_field_errors)}`);
            this.completeRequest(true);
        });
        this.updateOrCreateAll();
        this.completeRequest();
    }


    getMonthName(theMonth = this.month) {
        return this.months.filter(month => {
            return month.value === theMonth;
        })[0].name;
    }
    
    projectName(projectId) {
        let name = 'Unnown';
        if (projectId === this.borderStationId) {
            name = this.form.station_name;
        } else {
            for (let idx in this.impactMultiplying) {
                if (this.impactMultiplying[idx].id === projectId) {
                    name = this.impactMultiplying[idx].station_name;
                }
            }
        }
        return name;
    }
    
    findProject(projectId) {
        let project = null;
        for (let idx in this.form.related_projects) {
        	if (projectId === this.form.related_projects[idx].id) {
        		project = this.form.related_projects[idx];
        		break;
        	}
        }
        
        return project;
    }
    
    reviewBenefit(project, staff) {
    	this.reviewProject = project;
    	this.reviewStaff = staff;
    	this.updateSessionData();
    	window.scrollTo(0, 0);
    }
    
    filterCategoryTypeName (name) {
        return name.replace('~','');
    }
    
    updateSessionData() {
    	let mdfState = this.mdfId + '|';
    	if (this.active !== null) {
    		mdfState += this.active;
    	}
    	mdfState += '|';
    	if (this.reviewProject) {
    		mdfState += this.reviewProject;
    	}
    	mdfState += '|';
    	if (this.reviewStaff) {
    		mdfState += this.reviewStaff.id;
    	}
    	mdfState += '|';
    	if (this.currencyType) {
    		mdfState += this.currencyType;
    	}
    	sessionStorage.setItem('mdfState', mdfState);
    }
    
    getComment(request) {
    	let comment = '';
    	for (let commentIndex in request.comment_list) {
    		if (request.comment_list[commentIndex].mdf === null || request.comment_list[commentIndex].mdf === this.form.id) {
    			comment = request.comment_list[commentIndex].comment;
    			break;
    		}
    	}
    	return comment;
    }
}