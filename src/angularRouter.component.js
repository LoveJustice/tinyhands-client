import { angular2react } from 'angular2react';
import { lazyInjector } from '../react/lazyInjector';

class AngularRouterController {
  'ngInject';

  constructor() {
  }
}

const template = `
<div class="full-height" id="angular-router" ui-view>
`;

const AngularRouter = {
    template,
    controller: AngularRouterController
};

const AngularRouterReact = angular2react('AngularRouter', AngularRouter, lazyInjector.$injector)

export { AngularRouter, AngularRouterReact }