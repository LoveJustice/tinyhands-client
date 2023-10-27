import React from 'react';
import ReactDOM from 'react-dom/client';
import angular from 'angular';
import './index.scss';

// Library css files
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

import ReactRouter from './ReactRouter';
import { RouterProvider } from 'react-router';
import { lazyInjector } from './lazyInjector';
import angularToReactRouterConfig from './angularToReact.route';

import uiRouter from '@uirouter/angularjs';
import simpleAngularModule from './examples/simpleAngularModule.module';
import { SimpleComponent } from './examples/SimpleComponent';

// import sharedModule from './app/shared/shared.module';
// import accountModule from './app/account/account.module';
// import addressesModule from './app/addresses/addresses.module';
// import borderStationModule from './app/border-station/borderStation.module';
// import budgetModule from './app/budget/budget.module';
// import collectionIndicatorsModule from './app/collectionIndicators/collectionIndicators.module';
// import CIFModule from './app/cif/cif.module';
// import dashboardModule from './app/dashboard/dashboard.module';
// import indicatorsModule from './app/indicators/indicators.module';
// import IRFModule from './app/irf/irf.module';
// import loginModule from './app/login/login.module';
// import MonthlyReportModule from './app/monthlyReport/monthlyReport.module';
// import VDFModule from './app/vdf/vdf.module';
// import VIFModule from './app/vif/vif.module';
// import photoExportModule from './app/components/photo-export/photo-export.module';
// import countriesModule from './app/countries/countries.module';
// import idmanagementModule from './app/idmanagement/idmanagement.module';
// import personManagementModule from './app/personManagement/personManagement.module';
// import traffickermatchModule from './app/traffickermatch/traffickermatch.module';
// import relatedFormsModule from './app/relatedForms/relatedForms.module';
// import helpModule from './app/help/help.module';
// import operationsDashboardModule from './app/operationsDashboard/operationsDashboard.module';
// import stationDataModule from './app/stationData/stationData.module';
// import locationStaffModule from './app/location-staff/locationStaff.module';
// import locationDataModule from './app/location-data/locationData.module';
// import auditModule from './app/audit/audit.module';
// import legalCaseModule from './app/legalCase/legalCase.module';
// import gospelVerificationModule from './app/gospel-verification/gospelVerification.module';
// import empModule from './app/emp/emp.module';
// import gspModule from './app/gsp/gsp.module';
// import pvfModule from './app/pvf/pvf.module';
// import sfModule from './app/sf/sf.module';
// import lfModule from './app/lf/lf.module';
// import incidentModule from './app/incident/incident.module';

// Equivalent to index.module.js
// Not sure if I can put it in a separate file or not because of the order things need to run
angular
  .module('tinyhandsFrontend', [
    uiRouter,
    simpleAngularModule,

    // 'angular.chips', ngAnimate, ngCookies, ngCsv, ngFileUpload, ngSanitize, ngTouch, uiBootstrap, 'ui.dateTimeInput', 'ui.bootstrap', 'ui.bootstrap.datetimepicker',
    // sharedModule,
    // accountModule,
    // addressesModule,
    // borderStationModule,
    // budgetModule,
    // collectionIndicatorsModule,
    // CIFModule,
    // dashboardModule,
    // indicatorsModule,
    // IRFModule,
    // loginModule,
    // MonthlyReportModule,
    // VDFModule,
    // VIFModule,
    // photoExportModule,
    // countriesModule,
    // idmanagementModule,
    // personManagementModule,
    // traffickermatchModule,
    // relatedFormsModule,
    // helpModule,
    // operationsDashboardModule,
    // stationDataModule,
    // locationStaffModule,
    // locationDataModule,
    // auditModule,
    // legalCaseModule,
    // gospelVerificationModule,
    // empModule,
    // gspModule,
    // pvfModule,
    // sfModule,
    // lfModule,
    // incidentModule,
  ])
  .config(angularToReactRouterConfig)
  .component('simpleComponent', SimpleComponent)
  .run(['$injector', function(_$injector) {
    lazyInjector.$injector = _$injector;
    reactBootstrap();
  }]);

// noinspection TypeScriptValidateTypes
angular.bootstrap(document.getElementById('angularRoot'), ['tinyhandsFrontend']);

function reactBootstrap() {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <RouterProvider router={ReactRouter} />
    </React.StrictMode>,
  );
}