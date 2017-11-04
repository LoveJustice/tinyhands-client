export default class SessionService {
    constructor($rootScope, $state, $timeout, $q, BaseService) {
        'ngInject';

        this.service = BaseService;
        this.root = $rootScope;
        this.routeState = $state;
        this.timeout = $timeout;
        this.$q = $q;

        this.user = {};
    }

    attemptLogin(username, password) {
        return this.service.post('api/login/', { "username": username, "password": password })
            .then((promise) => {
                localStorage.token = "Token " + promise.data.token;
                this.root.authenticated = true;
                return true;
            }, (reason) => {
                let error;
                if (reason.status === 400) {
                    error = "Invalid Login";
                } else {
                    error = "Unable to connect to server";
                }
                this.clearSession();
                return this.$q.reject(error);
            });
    }

    me() {
        return this.service.get('api/me/').then((result) => {
            this.user = result.data;
            this.root.$broadcast('GetNavBarBorderStations');
            return this.user;
        });
    }

    checkIfAuthenticated() {
        let defer = this.$q.defer();
        if (typeof localStorage.token === 'undefined') {
            defer.reject('Not Authenticated');
            return defer.promise;
        } else {
            this.root.authenticated = true;
            return this.me();
        }
    }

    logout() {
        this.clearSession();
        this.routeState.go('login');
    }

    clearSession() {
        localStorage.removeItem('token');
        this.user = {};
        this.root.authenticated = false; // Set authenticated to false
    }
}
