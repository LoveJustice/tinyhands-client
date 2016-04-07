function config ($httpProvider, $logProvider, toastr) {
  'ngInject';
  // Enable log
  $logProvider.debugEnabled(true);

  // Set options third-party lib
  toastr.options.timeOut = 3000;
  toastr.options.positionClass = 'toast-top-center';
  toastr.options.preventDuplicates = true;
  toastr.options.progressBar = true;
  toastr.options.showMethod = "slideDown";
  toastr.options.hideMethod = "slideUp";
}

export default config;
