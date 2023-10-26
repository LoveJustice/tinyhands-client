import React from 'react';
import ReactDOM from 'react-dom/client';
import angular from 'angular';
import './index.scss';

// Library css files
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

import Router from './Router';
import { RouterProvider } from 'react-router';
import { lazyInjector } from './lazyInjector';
import { SimpleComponent } from './SimpleComponent';


angular
  .module('Demo', [])
  .component('simpleComponent', SimpleComponent)
  .run(['$injector', function(_$injector) {
    lazyInjector.$injector = _$injector;
    reactBootstrap();
  }]);

angular.bootstrap(document.createElement('div'), ['Demo']);

function reactBootstrap() {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <RouterProvider router={Router} />
    </React.StrictMode>,
  );
}