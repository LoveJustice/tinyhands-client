export default class VifSection1Controller {
  constructor(VifBuilder) {
    'ngInject';
    this.vif = VifBuilder.section1;
    window.vif = this.vif;
    console.log(this.vif);
    this.castes = [{name: "Magar", value: this.vif.caste.magar}, {name: "Jaisi", value: this.vif.caste.jaisi},
      {name: "Thakuri", value: this.vif.caste.thakuri}, {name: "Bramin", value: this.vif.caste.bramin},
      {name: "Tamang", value: this.vif.caste.tamang}, {name: "Chhetri", value: this.vif.caste.chhetri},
      {name: "Mongolian", value: this.vif.caste.mongolian}, {name: "Newar", value: this.vif.caste.newar},
      {name: "Muslim", value: this.vif.caste.muslim}];
    this.education = [{name: "None", value: this.vif.educationLevel.none}, {name: "Only informal (adult)", value: this.vif.educationLevel.informal},
      {name: "Primary only", value: this.vif.educationLevel.primary}, {name: "Grade 4-8", value: this.vif.educationLevel.grade4to8},
      {name: "Grade 9-10", value: this.vif.educationLevel.grade9to10}, {name: "SLC", value: this.vif.educationLevel.slc},
      {name: "11-12", value: this.vif.educationLevel.grade11to12}, {name: "Bachelors", value: this.vif.educationLevel.bachelors},
      {name: "Masters", value: this.vif.educationLevel.masters}];
    this.guardians = [{name: "Own Parent(s)", value: this.vif.primaryGuardian.parents}, {name: "Husband", value: this.vif.primaryGuardian.husband},
      {name: "Other Relative", value: this.vif.primaryGuardian.otherRelative}, {name: "Non-relative", value: this.vif.primaryGuardian.nonRelative},
      {name: "No one (I have no guardian)", value: this.vif.primaryGuardian.noOne}];
    this.living = [{name: "Own Parent(s)", value: this.vif.livesWith.parents}, {name: "Husband", value: this.vif.livesWith.husband},
      {name: "Husband's Family", value: this.vif.livesWith.husbandsFamily}, {name: "Friends", value: this.vif.livesWith.friends},
      {name: "Alone", value: this.vif.livesWith.alone}, {name: "Other Relative", value: this.vif.livesWith.otherRelative}];
    this.marital_statuses = [{name: "Single", value: this.vif.maritalStatus.single}, {name: "Married", value: this.vif.maritalStatus.married},
      {name: "Widow", value: this.vif.maritalStatus.widow}, {name: "Divorced", value: this.vif.maritalStatus.divorced},
      {name: "Husband has other wives", value: this.vif.maritalStatus.husbandHasOtherWives},
      {name: "Abandoned by husband", value: this.vif.maritalStatus.abandonedByHusband}];
    this.parents_marital_statuses = [{name: "Single", value: this.vif.parentMaritalStatus.single}, {name: "Married", value: this.vif.parentMaritalStatus.single},
      {name: "Widow", value: this.vif.parentMaritalStatus.widow}, {name: "My father has other wives", value: this.vif.parentMaritalStatus.fatherHasOtherWives},
      {name: "Separated (legally married)", value: this.vif.parentMaritalStatus.separated}, {name: "Divorced", value: this.vif.parentMaritalStatus.divorced}];
    this.occupations = [{name: "Unemployed", value: this.vif.occupation.unemployed}, {name: "Farmer", value: this.vif.occupation.farmer},
      {name: "Wage-laborer", value: this.vif.occupation.wageLaborer}, {name: "Business Owner", value: this.vif.occupation.businessOwner},
      {name: "Migrant Worker", value: this.vif.occupation.migrantWorker}, {name: "Tailoring", value: this.vif.occupation.tailoring},
      {name: "Housewife", value: this.vif.occupation.housewife}, {name: "Animal Husbandry", value: this.vif.occupation.animalHusbandry},
      {name: "Domestic Work", value: this.vif.occupation.domesticWork}, {name: "Shopkeeper", value: this.vif.occupation.shopkeeper},
      {name: "Hotel", value: this.vif.occupation.hotel}, {name: "Factory", value: this.vif.occupation.factory}];
    this.literate = [{name: 'No', value: this.vif.literacy.isNotLiterate}, {name: 'Yes', value: this.vif.literacy.isLiterate }]
  }

  foo() {
    let vif = {}
    this.vif.build(vif);
    console.log(vif);
  }

  test() {
    console.log("Running");
    this.vif.literacy.isLiterate = true;
  }
}