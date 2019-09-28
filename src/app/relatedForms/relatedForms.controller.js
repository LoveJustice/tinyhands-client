export default class RelatedFormsController {
    constructor(relatedFormsService, SessionService, SpinnerOverlayService, $state, $stateParams,  toastr) {
        'ngInject';
        this.service = relatedFormsService;
        this.session = SessionService;
        this.stateParams = $stateParams;
        this.spinnerOverlayService = SpinnerOverlayService;
        this.state = $state;
        this.toastr = toastr;

        this.relatedForms = [];
        this.errors = [];
      
        this.getRelatedForms(this.stateParams.stationId, this.stateParams.formNumber);
    }

    getRelatedForms(stationId, formNumber) {
        this.spinnerOverlayService.show('Searching for related forms...');
        this.service.getRelatedForms(stationId, formNumber).then((response) => {
            this.relatedForms = response.data;
            for (let idx in this.relatedForms) {
                if (this.relatedForms[idx].form_name !== null) {
                    this.relatedForms[idx].viewUrl = this.state.href(this.relatedForms[idx].form_name, {
                        id: this.relatedForms[idx].id,
                        stationId: this.relatedForms[idx].station_id,
                        countryId: this.relatedForms[idx].country_id,
                        isViewing: true,
                        formName: this.relatedForms[idx].form_name,
                    });
                    this.relatedForms[idx].editUrl = this.state.href(this.relatedForms[idx].form_name, {
                        id: this.relatedForms[idx].id,
                        stationId: this.relatedForms[idx].station_id,
                        countryId: this.relatedForms[idx].country_id,
                        isViewing: false,
                        formName: this.relatedForms[idx].form_name,
                    });
                }
            }
            this.spinnerOverlayService.hide();
        }, (error) => {
            this.errors = error.data.errors;
            this.spinnerOverlayService.hide();
        });
    }
    
    deleteForm(related, index) {
        if (related.confirmedDelete) {
            this.service.deleteRelatedForm(related.form_type, related.station_id, related.id).then(
                    () => {
                        this.toastr.success('Successfully Deleted ' + related.form_type);
                        this.relatedForms.splice(index, 1);
                    },
                    () => {
                        this.toastr.error('Unable to Delete ' + related.form_type);
                    }
                );
        } else {
            related.confirmedDelete = true;
        }
    }
}
