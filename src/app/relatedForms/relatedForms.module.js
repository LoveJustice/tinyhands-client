import relatedFormsRouteConfig from './relatedForms.route';
import RelatedFormsController from './relatedForms.controller';
import RelatedFormsService from './relatedForms.service';

export default angular.module('tinyhands.RelatedForms', ['ui.router', 'tinyhands.Shared'])
                      .config(relatedFormsRouteConfig)
                      .controller('RelatedFormsController', RelatedFormsController)
                      .service('relatedFormsService', RelatedFormsService)
                      .name;