import { angular2react } from 'angular2react';
import { lazyInjector } from './lazyInjector';

class AngularBasePageController {
  'ngInject';

  constructor() {
  }
}


const template = `
<div class='clear-bootstrap5'>
  <spinner-overlay></spinner-overlay>
  <navbar></navbar>
</div>
`;

const AngularBasePage = {
    template,
    controller: AngularBasePageController
};

const AngularBasePageReact = angular2react('AngularBasePage', AngularBasePage, lazyInjector.$injector)

export { AngularBasePage, AngularBasePageReact }