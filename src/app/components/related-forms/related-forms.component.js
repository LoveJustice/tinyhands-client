import RelatedFormsTemplate from './related-forms.html?url';

export class RelatedFormController {
    constructor($scope) {
        'ngInject';
        this.$scope = $scope;
        this.tableDivSize = (window.innerWidth - 50) + 'px';
        this.formTypes = [
            'Incident',
            'IRF',
            'VDF',
            'PVF',
            'CIF',
            'SF',
            'LF',
            'LEGAL_CASE',
        ];
    }
    
    shouldDisplay(theType) {
        let minEntries = 0;
        if (this.relatedForms && this.relatedForms.hasOwnProperty(theType)) {
            if (this.currentFormType === theType) {
                for (let idx in this.relatedForms[theType]) {
                    if (this.relatedForms[theType][idx].formNumber === this.excludeFormNumber) {
                        minEntries++;
                    }
                }
            }
            return this.relatedForms[theType].length > minEntries;
        } else {
            return false;
        }
    }
}

export default {
    bindings: {
        relatedForms: '=',
        currentFormType: '@',
        excludeFormNumber: '=',
    },
    controllerAs: '$ctrl',
    controller: RelatedFormController,
    templateUrl: RelatedFormsTemplate,
    transclude: true
};