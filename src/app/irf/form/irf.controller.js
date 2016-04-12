export default class IrfController {
  constructor($rootScope, $stateParams, IrfService) {
    'ngInject';

    this.root = $rootScope;
    this.service = IrfService;

    this.form = {};
    this.irfId = $stateParams.id;
    this.sections = [];
    this.selectedSectionIndex = 0;

    this.addSections();
    this.getIrf();
  }

  addSections() {
    this.sections.push('app/irf/form/components/metaData/metaData.html');
    for (var pageNum = 1; pageNum <= 9; pageNum++) {
      this.sections.push(`app/irf/form/components/page${pageNum}/page${pageNum}.html`);
    }
  }

  getFlagText() {
    if (this.root.flags) {
      if (this.root.flags < 50) {
        return this.root.flags;
      } else {
        return '50 or More Flags';
      }
    }
    return '';
  }

  getIrf() {
    this.service.getIrf(this.irfId).then((response) => {
      this.form = response.data;
    });
  }

  nextSection() {
    if (this.selectedSectionIndex < (this.sections.length - 1)) {
      this.selectedSectionIndex += 1;
    }
  }

  previousSection() {
    if (this.selectedSectionIndex > 0) {
      this.selectedSectionIndex -= 1;
    }
  }
}