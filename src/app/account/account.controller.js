export default class AccountController {
    constructor($scope, $http, $location, $window) {
    'ngInject';
    
    console.log("accounts controller initialized")
    
    let accountOptionsPath = 'app/account/';
    this.sections = {allSections: [{ name: 'Accounts List', templateUrl: `${accountOptionsPath}list/accountsList.html` },
                                   { name: 'Acounts Access Control', templateUrl: `${accountOptionsPath}control/accountsControl.html` },
                                   { name: 'Accounts Defaults', templateUrl: `${accountOptionsPath}defaults/accountsDefaults.html` }]}
    
    this.active = 0;
    this.sectionTemplateUrl = this.sections.allSections[0].templateUrl;
    
    }
}