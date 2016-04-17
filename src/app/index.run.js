function runBlock ($log, SessionService) {
  'ngInject';
  
  SessionService.checkAuthenticity();
  
  $log.debug('runBlock end');
}

export default runBlock;
