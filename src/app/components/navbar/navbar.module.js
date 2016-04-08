import SharedModule from '../../shared/shared.module';
import NavbarDirective from './navbar.directive';

export default angular.module('tinyhands.Navbar', ['ui.router', 'tinyhands.Shared'])
    .directive('navbar', () => new NavbarDirective());