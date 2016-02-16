export default class AccountNavController {
    constructor($scope, $http, $location, $window) {
    'ngInject';
    
    let accountOptionsPath = 'app/account/components/';
    this.sections = {allSections: [{ name: 'Accounts List', templateUrl: `${accountOptionsPath}list/account.html` },
                                   { name: 'Acounts Access Control', templateUrl: `${accountOptionsPath}control/accountsControl.html` },
                                   { name: 'Accounts Defaults', templateUrl: `${accountOptionsPath}defaults/accountsDefaults.html` }]}
    
    this.active = 0;
    this.sectionTemplateUrl = this.sections.allSections[0].templateUrl;
    
    }
}