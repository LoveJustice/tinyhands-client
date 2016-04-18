import TinyHandsShared from '../shared/shared.module';

import VIFRoutes from './vif.route'

import VifBuilder from './form/vifBuilder/vifBuilder.service';

import VifService from './form/vif.service';
import VifListService from './list/vifList.service';

import VifController from './form/vif.controller';
import VifInfoController from './form/info/info.controller';
import VifSection1Controller from './form/section1/section1.controller';
import VifSection2Controller from './form/section2/section2.controller';
import VifSection3Controller from './form/section3/section3.controller';
import VifSection4Controller from './form/section4/section4.controller';
import VifSection5Controller from './form/section5/section5.controller';
import VifSection6Controller from './form/section6/section6.controller';
import VifSection7Controller from './form/section7/section7.controller';
import VifSection8Controller from './form/section8/section8.controller';
import VifPeopleController from './form/people/people.controller';
import VifLocationsController from './form/locations/locations.controller';
import VifListController from './list/vifList.controller';

export default angular.module('tinyhands.VIF', ['ui.router', 'tinyhands.Shared'])
    .config(VIFRoutes)

    .controller('VifController', VifController)
    .controller('VifInfoController', VifInfoController)
    .controller('VifSection1Controller', VifSection1Controller)
    .controller('VifSection2Controller', VifSection2Controller)
    .controller('VifSection3Controller', VifSection3Controller)
    .controller('VifSection4Controller', VifSection4Controller)
    .controller('VifSection5Controller', VifSection5Controller)
    .controller('VifSection6Controller', VifSection6Controller)
    .controller('VifSection7Controller', VifSection7Controller)
    .controller('VifSection8Controller', VifSection8Controller)
    .controller('VifPeopleController', VifPeopleController)
    .controller('VifLocationsController', VifLocationsController)
    .controller('VifListController', VifListController)

    .service('VifBuilder', VifBuilder)
    .service('VifListService', VifListService)
    .service('VifService', VifService);