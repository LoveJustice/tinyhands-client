import BaseService from '../base.service';
import SessionService from '../utils/session.service';
import UtilService from '../utils/util.service';

export default angular.module('tinyhands.Shared', [])
  .service('BaseService', BaseService)
  .service('SessionService', SessionService)
  .service('UtilService', UtilService);