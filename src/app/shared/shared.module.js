import BaseService from '../base.service';
import SessionService from '../utils/session.service';

export default angular.module('tinyhands.Shared', [])
    .service('BaseService', BaseService)
    .service('SessionService', SessionService)
    .service('session', SessionService)
  