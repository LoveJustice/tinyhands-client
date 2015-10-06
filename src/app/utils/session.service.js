import BaseService from '../base.service';

class SessionService extends BaseService {
	constructor ($http, $rootScope, $state, $timeout) {
		'ngInject';
		super();
		
		this.root = $rootScope;
		this.routeState = $state;
		this.timeout = $timeout;
	}
	
	attemptLogin (username, password, rememberMe) {
		sessionStorage.currentUser = username + password + rememberMe;
		this.root.authenticated = true;
		
		// Login API call here
		this.routeState.go('dashboard');
	}

	// See if page loading needs to have user logged in
	// See if there is already a user logged in
	checkAuthenticity () {
		this.createStateChangeListener();
	}
	
	checkAuthenticityLogic (requireLogin, currentUser) {
		if (requireLogin && typeof currentUser === 'undefined') { // if not logged in and page requires login
			this.timeout(() => { // State isn't quite ready on load so we need this timeout
				this.routeState.go('login'); // Make user login
			});
		} else if (currentUser) {
			this.root.authenticated = true;
		}
	}
	
	createStateChangeListener () {
		var self = this;
		this.root.$on('$stateChangeStart', function (event, toState) {
			var requireLogin = toState.data.requireLogin; // See if page requires login
			var currentUser = sessionStorage.currentUser; // Get user from storage if already logged in
			
			self.checkAuthenticityLogic(requireLogin, currentUser);
		});
	}
	
	logout () {
		sessionStorage.removeItem('currentUser'); // Remove user from storage
		this.root.authenticated = false; // Set authenticated to false
		
		this.routeState.go('login');
	}
}

export default SessionService;