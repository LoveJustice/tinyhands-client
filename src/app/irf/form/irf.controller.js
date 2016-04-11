export default class IrfController {
  constructor($stateParams, IrfService) {
    'ngInject';

    this.service = IrfService;

    this.flags = 0;
    this.form = {};
    this.irfId = $stateParams.id;
    this.sections = [];
    this.selectedSectionIndex = 0;
    this.selectedFlags = [];

    this.addSections();
    this.getIrf();
  }

  addSections() {
    this.sections.push('app/irf/form/components/metaData/metaData.html');
    for (var pageNum = 1; pageNum <= 9; pageNum++) {
      this.sections.push(`app/irf/form/components/page${pageNum}/page${pageNum}.html`);
    }
  }

  getIrf() {
    this.service.getIrf(this.irfId).then((response) => {
      this.form = response.data;
    });
  }

    loadedSection()
    {
        for (var flagID in this.selectedFlags)
        {
            var checkbox = document.getElementById(flagID);
            console.log(checkbox);
            if (checkbox !== null) {
                checkbox.checked = true;
                console.log(checkbox);
            }
        }
    }

  selectSection(index) {
      this.selectedSectionIndex = index;
      for (var flagID in this.selectedFlags)
        {
            var checkbox = document.getElementById(flagID);
            console.log(checkbox);
            if (checkbox !== null) {
                checkbox.checked = true;
            }
        }
        console.log(this.selectedFlags);
  }

  nextSection() {
    if (this.selectedSectionIndex < (this.sections.length - 1)) {
        this.selectSection(this.selectedSectionIndex + 1);
    }
  }

  previousSection() {
    if (this.selectedSectionIndex > 0) {
        this.selectedSectionIndex -= 1;
        this.selectSection(this.selectedSectionIndex + 1);
    }
  }

  AddorRemoveFlag(id) {
      var indexofFlag = this.selectedFlags.indexOf(id);
      if (indexofFlag !== -1) {
          this.selectedFlags.splice(indexofFlag, 1);
      }
      else {
          this.selectedFlags.push(id);
      }
      this.flags = this.selectedFlags.length;
      console.log(this.selectedFlags);
  }
}