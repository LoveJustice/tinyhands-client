import uiRouter from 'angular-ui-router';
import sharedModule from '../shared/shared.module';

import addressesRouteConfig from './addresses.route';

import Address1Controller from './address1/list/address1.controller';
import Address1EditModalController from './address1/edit/address1EditModal.controller';
import Address1DeleteModalController from './address1/delete/address1DeleteModal.controller';
import Address2Controller from './address2/list/address2.controller';
import Address2EditModalController from './address2/edit/address2EditModal.controller';
import Address2DeleteModalController from './address2/delete/address2DeleteModal.controller';

import Address1Service from './address1/address1.service';
import Address2Service from './address2/address2.service';

export default angular.module('tinyhands.Addresses', [uiRouter, sharedModule])
    .config(addressesRouteConfig)

    .controller('Address1Controller', Address1Controller)
    .controller('Address1EditModalController', Address1EditModalController)
    .controller('Address1DeleteModalController', Address1DeleteModalController)
    .controller('Address2Controller', Address2Controller)
    .controller('Address2DeleteModalController', Address2DeleteModalController)
    .controller('Address2EditModalController', Address2EditModalController)

    .service('address1Service', Address1Service)
    .service('address2Service', Address2Service)
    .name;
