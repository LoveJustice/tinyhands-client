import indicatorDetailModalTemplate from './indicatorDetailModal.html';
import './collectionIndicators.less';

class IndicatorDetailModalController {
    constructor($uibModalInstance, $window, BaseService, indicatorDetail) {
        'ngInject';
        this.uibModalInstance = $uibModalInstance;
        this.window = $window;
        this.service = BaseService;
        this.indicatorDetail = indicatorDetail;
    }
    
    dismiss() {
        this.uibModalInstance.dismiss();
    }
}

class IndicatorsController {
    constructor($uibModal, $rootScope, SessionService, collectionIndicatorsService, SpinnerOverlayService, StickyHeader) {
        'ngInject';
        
        this.modal = $uibModal;
        this.session = SessionService;
        this.indicatorsService = collectionIndicatorsService;
        this.spinnerOverlayService = SpinnerOverlayService;
        this.sticky = StickyHeader;
        this.stickyOptions = this.sticky.stickyOptions;
        this.stickyOptions.zIndex = 1;
        this.indicatorsData = null;
        this.indicators = null;
        this.countries = [];
        this.countryRequestCount = 0;
        
        this.sectionWidth = 100;
        this.labelWidth = 180;
        this.dataWidth = 50;
        this.marginWidth = 150;
        
        let remaining = window.innerWidth - (this.sectionWidth + this.labelWidth + this.marginWidth);
        if (remaining > 2 * this.dataWidth) {
            this.displayIndicators = Math.floor(remaining/this.dataWidth);
        } else {
            this.displayIndicators = 2;
        }
        this.tableDivSize = (window.innerWidth - this.marginWidth) + "px";
        
        this.countryDropDown = {};
        this.countryDropDown.options = [];
        this.countryDropDown.selectedOptions = [];
        this.countryDropDown.settings = {
            smartButtonMaxItems:1,
            selectionLimit:1,
            closeOnSelect: true,
            showCheckAll: false,
            showUncheckAll: false,
        };
        this.countryDropDown.eventListener = {
                onItemSelect: this.countryChange,
                ctrl: this,
        };
        
        this.startDate = new Date();
        if (this.startDate.getMonth() === 0) {
            this.startDate.setFullYear(this.startDate.getFullYear() - 1);
            this.startDate.setMonth(11);
            this.startDate.setDate(1);
        } else {
            this.startDate.setDate(1);
            this.startDate.setMonth(this.startDate.getMonth()-1);
        }
        
        this.endDate = new Date();
        this.endDate.setDate(0);
        
        this.loading = true;
        this.getCountries();
    }
    
    countryChange() {
        this.ctrl.calculate();
    }
    
    displayPercent(value) {
        if (typeof value === 'undefined' || value === '') {
            return '';
        } else {
            return value + '%';
        }
    }
    
    mergeCountries() {
        let len = this.countries.length;
        let result_array = [];
        let assoc = {};
        
        while (len--) {
            let item = this.countries[len];
            
            if (!assoc[item.id]) {
                result_array.unshift(item);
                assoc[item.id] = true;
            }
        }
        
        result_array.sort((a,b)=>{
            if (a.name < b.name) {
                return -1;
            }
            if (a.name > b.name) {
                return 1;
            }
            return 0;
        });
        
        for (var idx = 0; idx < result_array.length; idx++) {
            this.countryDropDown.options.push({
                id: result_array[idx].id,
                label: result_array[idx].name,
            });
        }
        
        let selectedCountryName = window.localStorage.getItem('dashboard-country');
        for (var countryIdx=0; countryIdx < this.countryDropDown.options.length; countryIdx++) {
            if (this.countryDropDown.options[countryIdx].label === selectedCountryName) {
                this.countryDropDown.selectedOptions = [this.countryDropDown.options[countryIdx]];
                this.calculate();
                break;
            }
        }
        this.loading = false;
    }
    
    getCountries() {
        this.indicatorsService.getUserCountries(this.session.user.id, 'IRF').then((promise) => {
            this.countries = this.countries.concat(promise.data);
            this.countryRequestCount += 1;
            if (this.countryRequestCount > 2) {
                this.mergeCountries();
            }
        });
        this.indicatorsService.getUserCountries(this.session.user.id, 'CIF').then((promise) => {
            this.countries = this.countries.concat(promise.data);
            this.countryRequestCount += 1;
            if (this.countryRequestCount > 2) {
                this.mergeCountries();
            }
        });
        this.indicatorsService.getUserCountries(this.session.user.id, 'VDF').then((promise) => {
            this.countries = this.countries.concat(promise.data);
            this.countryRequestCount += 1;
            if (this.countryRequestCount > 2) {
                this.mergeCountries();
            }
        });
    }
    
    getHeadClass(theClass) {
        return this.getCellClass(theClass, theClass, -1);
    }
    
    getCellClass(totalClass, stationClass, idx) {
        let displayClass = '';
        if (idx === 0) {
            displayClass = totalClass + ' heavy-border';
        } else {
            displayClass = stationClass + ' light-border';
        }
        
        if (idx >= 0) {
            if (typeof this.indicators[idx].label === 'undefined') {
                displayClass = '';
            } else {
                displayClass += ' center';
            }
        }
        
        return displayClass;
    }
    
    scroll(increment) {
        this.scrollIndicators(this.scrollPos + increment);
    }
    
    scrollIndicators(to_idx) {
        if (this.indicatorsData.length < this.displayIndicators) {
            this.indicators = this.indicatorsData;
            let inds = [];
            for (let idx=0; idx < this.indicatorsData.length; idx++) {
                inds.push(this.indicatorsData[idx]);
            }
            for (let idx=0; idx < (this.displayIndicators-this.indicatorsData.length); idx++) {
                inds.push({});
            }
            this.indicators = inds;
            this.scrollPos = 0;
            this.scrollLeft = false;
            this.scrollRight = false;
        } else {
            let inds = [];
            inds.push(this.indicatorsData[0]);
            if (to_idx < 1) {
                to_idx = 1;
            }
            for (let idx=to_idx; idx < to_idx+this.displayIndicators-1; idx++) {
                inds.push(this.indicatorsData[idx]);
            }
            this.indicators = inds;
            this.scrollPos = to_idx;
            this.scrollLeft = (to_idx > 1);
            this.scrollRight = (to_idx + this.displayIndicators - 1 < this.indicatorsData.length);
        }
    }
    
    dateAsString(theDate) {
        let dateString = '' + theDate.getUTCFullYear() + '-' + (theDate.getUTCMonth() + 1) + '-' + theDate.getUTCDate();
        return dateString;
    }
    
    calculate() {
        if (this.countryDropDown.selectedOptions.length !== 1) {
            return;
        }
        this.spinnerOverlayService.show('Calculating Indicators...');
        this.indicatorsService.calculate(this.countryDropDown.selectedOptions[0].id, this.dateAsString(this.startDate), this.dateAsString(this.endDate)).then(promise => {
            this.indicatorsData = promise.data;
            this.scrollIndicators(1);
            this.spinnerOverlayService.hide();
        }, () => {
            this.spinnerOverlayService.hide();
        });
    }
    
    openModal(indicatorDetail) {
        this.modal.open({
            animation: true,
            templateUrl: indicatorDetailModalTemplate,
            controller: IndicatorDetailModalController,
            resolve: {
                indicatorDetail: () => indicatorDetail
            },
            controllerAs: "vm",
            size: 'lg'
        });
    }
    
    localDetail (type, indicator) {
        let detailData = {
            header:"",
            text:[],
            tableData: null
        };
        switch (type) {
            case"IRFs in Compliance %":
                detailData.text.push ("# IRFs in Compliance / # IRFs");
                detailData.text.push (indicator.irf_compliance_count + ' / ' + indicator.irf_count + ' = ' + indicator.irf_compliance_percent + '%');
                break;
            case "CIF %":
                detailData.text.push ("# CIFs / # PVs");
                detailData.text.push (indicator.cif_count + ' / ' + indicator.victim_count + ' = ' + indicator.cif_percent + '%');
                break;
            case "CIFs in Compliance %":
                detailData.text.push ("# CIFs in Compliance / # CIFs");
                detailData.text.push (indicator.cif_compliance_count + ' / ' + indicator.cif_count + ' = ' + indicator.cif_compliance_percent + '%');
                break;
            case "VDFs in Compliance %":
                detailData.text.push ("# VDFs Compliance / # VDFs");
                detailData.text.push (indicator.vdf_compliance_count + ' / ' + indicator.vdf_count + ' = ' + indicator.vdf_compliance_percent + '%');
                break;
            case "Evidence of Trafficking %":
                detailData.text.push ("Evidence of Trafficking / Total # Verified Forms");
                detailData.text.push (indicator.evidence_count + " / " + indicator.verified_forms + " = " + indicator.evidence_percent + '%');
                break;
            case "Invalid Intercept %":
                detailData.text.push ("Invalid Intercept / Total #  Verified Forms");
                detailData.text.push (indicator.invalid_intercept_count + " / " + indicator.verified_forms + " = " + indicator.invalid_intercept_percent + '%');
                break;
            case "High Risk of Trafficking %":
                detailData.text.push ("High Risk of Trafficking / Total # Verified Forms");
                detailData.text.push (indicator.high_risk_count + " / " + indicator.verified_forms + " = " + indicator.high_risk_percent + '%');
                break;
            case "VDF %":
                detailData.text.push ("# VDFs / # PVs");
                detailData.text.push (indicator.vdf_count + " / " + indicator.victim_count + " = " + indicator.vdf_percent + '%');
                break;
            case "Compliance %":
                detailData.text.push ("(# IRFs in Compliance + # CIFs in Compliance + # VDFs in Compliance) / (IRFs + CIFs + VDFs)");
                detailData.text.push ('(' + indicator.irf_compliance_count + ' + ' + indicator.cif_compliance_count + ' + ' + 
                        indicator.vdf_compliance_count + ') / (' +
                        indicator.irf_count + ' + ' + indicator.cif_count + ' + ' + indicator.vdf_count + ') = ' + indicator.compliance_percent + '%');
                break;
            case 'Collection Lag Time':
                let lag_formula = '(';
                let lag_values = '(';
                let sep = '';
                let divide_count = 0;
                let notes = [];
                if (indicator.irf_lag_score >= 0) {
                    lag_formula += 'Average IRF Lag Score';
                    sep = ' + ';
                    lag_values += indicator.irf_lag_score;
                    divide_count += 1;
                } else {
                    notes.push('**There are no IRFs to compute average lag time');
                }
                if (indicator.cif_lag_score >= 0) {
                    lag_formula += sep + 'Average CIF Lag Score';
                    lag_values += sep + indicator.cif_lag_score;
                    sep = ' + ';
                    divide_count += 1;
                } else {
                    notes.push('**There are no CIFs to compute average lag time');
                }
                if (indicator.vdf_lag_score >= 0) {
                    lag_formula += sep + 'Average VDF Lag Score';
                    lag_values += sep + indicator.vdf_lag_score;
                    divide_count += 1;
                } else {
                    notes.push('**There are no VDFs to compute average lag time');
                }
                if (divide_count > 0) {
                    lag_formula += ') / ' + divide_count;
                    lag_values += ') / ' + divide_count + ' = ' + indicator.collection_lag_time;
                    detailData.text.push (lag_formula);
                    detailData.text.push (lag_values);
                }
                
                if (notes.length > 0) {
                    detailData.text.push('');
                    for (let idx = 0; idx < notes.length; idx++) {
                        detailData.text.push(notes[idx]);
                    }
                }
                break;
            case "% of Evidence Cases with CIF":
                detailData.text.push ('# CIFs from Evidence IRFs / # PVs from Evidence IRFs');
                detailData.text.push (indicator.cif_with_evidence_count + ' / ' + indicator.victim_evidence_count + ' = ' + indicator.evidence_cif_percent + '%');
                break;
            case "% of Valid Intercepts":
                detailData.text.push ('(Evidence of Trafficking + High Risk of Trafficking) / Total # Verified Forms');
                detailData.text.push ('(' + indicator.evidence_count + ' + ' + indicator.high_risk_count + ') / ' + indicator.verified_forms + ' = ' + indicator.valid_intercept_percent + '%');
                break;
            case "% of Phone Numbers Verified":
                detailData.text.push ('# Phone Numbers Verified / # Phone Numbers');
                detailData.text.push (indicator.phone_verified_count + ' / ' + indicator.phone_count + ' = ' + indicator.phone_verified_percent + '%');
                break;
            case "Total":
                break;
            default:
                return;
        }
        
        detailData.header = "Details of " + type + " for project " + indicator.label;
        this.openModal(detailData);
    }
    
    getRemoteDetail(type, indicator) {
        this.spinnerOverlayService.show('Retrieving details...');
        this.indicatorsService.getDetails(this.dateAsString(this.startDate), this.dateAsString(this.endDate), type, this.countryDropDown.selectedOptions[0].id, indicator.label).then(promise => {
            this.openModal(promise.data);
            this.spinnerOverlayService.hide();
        }, (error) => {
            this.spinnerOverlayService.hide();
            alerrt(error);
        });
    }
    
    getDetail(type, indicator) {
        if (!indicator || !indicator.label) {
            return;
        }
        let localProcessing = ';IRFs in Compliance %;CIF %;CIFs in Compliance %;VDFs in Compliance %;' +
                'Evidence of Trafficking %;Invalid Intercept %;High Risk of Trafficking %;VDF %;' +
                'Compliance %;Collection Lag Time;% of Evidence Cases with CIF;% of Valid Intercepts;% of Phone Numbers Verified;Total;';
        if (localProcessing.indexOf(';' + type + ';') >= 0) {
            this.localDetail(type, indicator);
        } else {
            this.getRemoteDetail(type, indicator);
        }
    }
}

export default IndicatorsController;