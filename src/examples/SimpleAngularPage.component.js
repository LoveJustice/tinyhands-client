class SimpleAngularPageController {
  'ngInject';

  constructor($stateParams) {
    this.stateParams = $stateParams

    this.id = this.stateParams.id
  }
}

const template = `
<div>This is an Angular Page! ID: {{$ctrl.id}}</div>
<ul>
  <li><a ng-href="/#!/simple-angular-page?id={{$ctrl.id + 1}}">ng-href to Angular page</a></li>
  <li><a ui-sref="simpleAngularPage({'id': {{$ctrl.id + 1}}})">ui-sref to Angular page</a></li>
  <li><a ng-href="/react-things">ng-href to React page</a></li>
  <li><a ui-sref="reactThings">ui-sref to React page</a></li>
</ul>
`;

export default {
    template,
    controller: SimpleAngularPageController
};