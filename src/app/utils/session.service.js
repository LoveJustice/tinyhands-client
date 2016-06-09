export default class SessionService {
  constructor($rootScope, $state, $timeout, BaseService) {
    'ngInject';

    this.service = BaseService;
    this.root = $rootScope;
    this.routeState = $state;
    this.timeout = $timeout;

    this.user = {};
  }

  attemptLogin(username, password) {
    return this.service.post('api/login/', { "username": username, "password": password })
      .then(
      (promise) => {
        sessionStorage.token = "Token " + promise.data.token;
        this.root.authenticated = true;
        this.routeState.go('dashboard');
      },
      () => {
        window.toastr.error("Invalid Login");
      }
      );
  }

  me() {
    return this.service.get('api/me/').then((result) => {
      this.user = result.data;
      this.root.$broadcast('GetNavBarBorderStations');
    });
  }
  // See if page loading needs to have user logged in
  // See if there is already a user logged in
  checkAuthenticity() {
    this.createStateChangeListener();
  }

  checkAuthenticityLogic(requireLogin, token) {
    if (requireLogin && typeof token === 'undefined') { // if not logged in and page requires login
      this.timeout(() => { // State isn't quite ready on load so we need this timeout
        this.routeState.go('login'); // Make user login
      });
    } else if (token) {
      this.root.authenticated = true;
      this.me();
    }
  }

    checkPermissions(stateData, toState) {
        if (angular.isDefined(stateData.permissions_required)) {
            this.service.get('api/me/').then((result) => {
                for(var x = 0; x < stateData.permissions_required.length; x++) {
                    if (! result.data[stateData.permissions_required[x]]){

                        this.routeState.go('dashboard');
                        window.toastr.error(`You are not authorized to view the ${toState.name} page!`);

                    }
                }
            });
        }

    }

  createStateChangeListener() {
    this.root.$on('$stateChangeStart', (event, toState) => {
      var requireLogin = toState.data.requireLogin; // See if page requires login
      var token = sessionStorage.token; // Get user token from storage if already logged in
      
      this.checkAuthenticityLogic(requireLogin, token);
      this.checkPermissions(toState.data, toState);
    });
  }

  logout() {
    sessionStorage.clear();
    this.user = {};
    this.root.authenticated = false; // Set authenticated to false
    this.routeState.go('login');
  }
}
