import Session from '../utils/session.service';
import BaseService from '../base.service';

export default angular.module('tinyhands.shared', [])
  .service('BaseService', BaseService)
  .service('Session', Session);
  