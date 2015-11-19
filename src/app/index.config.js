function config ($logProvider, toastr, $httpProvider) {
  'ngInject';
  // Enable log
  $logProvider.debugEnabled(true);

  // Set options third-party lib
  toastr.options.timeOut = 3000;
  toastr.options.positionClass = 'toast-top-right';
  toastr.options.preventDuplicates = true;
  toastr.options.progressBar = true;

  $httpProvider.interceptors.push(function () {
    return {
      responseError: function (rejection) {
        if ([403, 404, 500].find(x => x === rejection.status)) {
          window.location = '/#/error/' + 403;
        }
        return rejection;
      }
    };
  });
}

export default config;
