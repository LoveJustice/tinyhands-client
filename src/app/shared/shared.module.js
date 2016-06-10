import BaseService from '../base.service';
import SessionService from '../utils/session.service';
import UtilService from '../utils/util.service';

export default angular.module('tinyhands.Shared', [])
    .filter('capitalize', function () {
        return function (input) {
            return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
        };
    })

    .service('BaseService', BaseService)
    .service('SessionService', SessionService)
    .service('UtilService', UtilService);