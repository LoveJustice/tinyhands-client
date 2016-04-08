import SharedModule from '../../shared/shared.module';

import googleMapsConfig from './map.config';
import MapDirective from './map.directive';

export default angular.module('tinyhands.Map', ['ui.router', 'tinyhands.Shared'])
    .config(googleMapsConfig) // Pass google maps config
    .directive('googlemap', () => new MapDirective());