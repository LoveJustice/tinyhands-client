function runBlock ($log, session) {
  'ngInject';
  
  session.checkAuthenticity();
  
  $log.debug('runBlock end');
}

export default runBlock;
