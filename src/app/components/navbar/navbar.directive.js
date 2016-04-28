import NavbarController from './navbar.controller';

export default function NavbarDirective() {
  'ngInject';

  let directive = {
    restrict: 'E',
    templateUrl: 'app/components/navbar/navbar.html',
    controller: NavbarController,
    controllerAs: 'navbarCtrl'
  };

  return directive;
}
