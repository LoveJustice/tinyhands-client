export default class AccountNavController {
    constructor($scope, $http, $location, $window) {
    'ngInject';
    
    let accountOptionsPath = 'app/account/components/';
    this.sections = {allSections: [{ name: 'Accounts List', templateUrl: `${accountOptionsPath}list/accountList.html` },
                                   { name: 'Acounts Access Control', templateUrl: `${accountOptionsPath}control/accountControl.html` },
                                   { name: 'Accounts Defaults', templateUrl: `${accountOptionsPath}defaults/accountDefaults.html` }]}
    
    this.active = 0;
    this.sectionTemplateUrl = this.sections.allSections[0].templateUrl;
    
    }
}