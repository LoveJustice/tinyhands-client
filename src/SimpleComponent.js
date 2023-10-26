import { angular2react } from 'angular2react';
import { lazyInjector } from './lazyInjector';

const SimpleComponent = {
  template: '<h2>Hello from Angular!</h2><p>Hello, {{ $ctrl.user.name }} !</p>',
  controller: function() {
    this.user = { name: 'world' };
  },
};


const SimpleComponentReact = angular2react('SimpleComponent', SimpleComponent, lazyInjector.$injector)

export { SimpleComponent, SimpleComponentReact }