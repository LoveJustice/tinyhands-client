import NavbarController from './navbar.controller';

class NavbarDirective {
  constructor() {
    'ngInject';

    let directive = {
      restrict: 'E',
      templateUrl: 'app/components/navbar/navbar.html',
      controller: NavbarController,
      controllerAs: 'navbarCtrl'
    };

    return directive;
  }
}

export default NavbarDirective;