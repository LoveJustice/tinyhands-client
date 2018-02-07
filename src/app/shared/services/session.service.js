export default class SessionService {
    constructor($rootScope, $state, $timeout, $q, BaseService) {
        'ngInject';

        this.service = BaseService;
        this.root = $rootScope;
        this.routeState = $state;
        this.timeout = $timeout;
        this.$q = $q;

        this.user = {};
        this.userPermissions = [];
        this.permissions = [];
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
            
            if (this.permissions.length < 1) {
                this.getPermissions();
            }
            if (typeof this.user !== 'undefined') {
                this.getUserPermissions();
            }       
            return this.user;
        });
    }
    
    getPermissions() {
        return this.service.get(`api/permission/`).then((result) => {
            this.permissions = result.data.results;
        });
    }
    
    getUserPermissions() {
        return this.service.get(`api/user_permission/${this.user.id}/`).then((result) => {
            this.userPermissions = result.data;
            this.root.$broadcast('GetNavBarBorderStations');
        });
    }
    
    findPermissionId(group, action) {
        var permId = null;
        for (var idx=0; idx < this.permissions.length; idx++) {
            if (this.permissions[idx].permission_group === group && this.permissions[idx].action === action) {
                permId = this.permissions[idx].id;
                break;
            }
        }
        
        return permId;
    }
    
    checkPermission(group, action, countryId, stationId) {
        var found = false;
        var permId = this.findPermissionId(group, action);
        
        
        for (var idx1=0; idx1 < this.userPermissions.length; idx1++) {
            if (this.userPermissions[idx1].permission === permId) {
                if ((this.userPermissions[idx1].station === null && this.userPermissions[idx1].country === null) ||
                        (countryId === null && stationId === null) ||
                        (this.userPermissions[idx1].station === null && this.userPermissions[idx1].country === countryId) ||
                        (stationId !== null && this.userPermissions[idx1].station === stationId)) {
                    found = true;
                    break;
                }
            }
        }
        
        return found;
    }
    
    getUserPermissionList(group, action) {
        var permId = this.findPermissionId(group, action);
        var perms = [];
        
        for (var idx1=0; idx1 < this.userPermissions.length; idx1++) {
            if (this.userPermissions[idx1].permission === permId) {
                perms.push(this.userPermissions[idx1]);
            }
        }
        
        return perms;
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
