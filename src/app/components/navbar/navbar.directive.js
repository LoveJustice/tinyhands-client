import NavbarController from './navbar.controller';
import navbarTemplate from './navbar.html';
import './navbar.less';

export default function NavbarDirective() {
    'ngInject';

    let directive = {
        restrict: 'E',
        templateUrl: navbarTemplate,
        controller: NavbarController,
        controllerAs: 'navbarCtrl'
    };

    return directive;
}