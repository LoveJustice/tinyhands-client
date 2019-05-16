import {BaseFormController} from '../baseFormController.js';

export class BaseMsrController extends BaseFormController {
    constructor($scope, constants, $stateParams, $state) {
        'ngInject';
        super($scope, $stateParams);
        
        this.constants = constants;
        this.service = null;
        this.state = $state;

        this.associatedPersons = [];
    }
}

export default {
    BaseMsrController
};
