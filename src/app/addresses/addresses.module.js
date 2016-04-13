import SharedModule from '../shared/shared.module';

import Address1Service from './address1.service';
import Address2Service from './address2.service';

import Address1Controller from './address1.controller';
import Address1EditModalController from './address1EditModal.controller';
import Address2Controller from './address2.controller';
import Address2EditModalController from './address2EditModal.controller';

import addressesRouteConfig from './addresses.route';

export default angular.module('tinyhands.Addresses', ['ui.router', 'tinyhands.Shared'])
    .config(addressesRouteConfig)
    .service('address1Service', Address1Service)
    .service('address2Service', Address2Service)
    .controller('Address1Controller', Address1Controller)
    .controller('Address1EditModalController', Address1EditModalController)
    .controller('Address2Controller', Address2Controller)
    .controller('Address2EditModalController', Address2EditModalController);