import BaseService from '../base.service';

class SessionService extends BaseService {
	constructor ($http, $rootScope, $state, $timeout) {
		'ngInject';
		super($http);

		this.root = $rootScope;
		this.routeState = $state;
		this.timeout = $timeout;
	}
	
	attemptLogin (username, password) {
		return super.post('api/login/', {"username": username, "password": password})
			.then(
				(promise) => {
					sessionStorage.token = "Token " + promise.data.token;
					this.root.authenticated = true;
					this.timeout(() => { // State isn't quite ready on load so we need this timeout
						this.routeState.go('dashboard');
					});
				},
				() => {
					window.toastr.error("Invalid Login");
				}
			);
	}

	me () {
		return super.get('api/me/');
	}
	// See if page loading needs to have user logged in
	// See if there is already a user logged in
	checkAuthenticity () {
		this.createStateChangeListener();
	}
	
	checkAuthenticityLogic (requireLogin, token) {
		if (requireLogin && typeof token === 'undefined') { // if not logged in and page requires login
			this.timeout(() => { // State isn't quite ready on load so we need this timeout
				this.routeState.go('login'); // Make user login
			});
		} else if (token) {
			this.root.authenticated = true;
		}
	}
	
	createStateChangeListener () {
		var self = this;
		this.root.$on('$stateChangeStart', function (event, toState) {
			var requireLogin = toState.data.requireLogin; // See if page requires login
			var token = sessionStorage.token; // Get user token from storage if already logged in
			
			self.checkAuthenticityLogic(requireLogin, token);
		});
	}
	
	logout () {
		sessionStorage.clear();
		this.root.authenticated = false; // Set authenticated to false
		this.routeState.go('login');
	}
}

export default SessionService;