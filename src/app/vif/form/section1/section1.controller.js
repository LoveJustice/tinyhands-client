export default class VifSection1Controller {
  constructor(VifBuilder) {
    'ngInject'
    this.vif = VifBuilder;
    this.castes = ["Magar", "Jaisi", "Thakuri", "Bramin", "Tamang", "Chhetri", "Mongolian", "Newar", "Muslim"];
    this.education = ["None", "Only informal (adult)", "Primary only", "Grade 4-8", "Grade 9-10", "SLC", "11-12", "Bachelors", "Masters"];
    this.guardians = ["Own Parent(s)", "Husband", "Other Relative", "Non-relative", "No one (I have no guardian)"];
    this.living = ["Own Parent(s)", "Husband", "Husband's Family", "Friends", "Alone", "Other Relative"];
    this.marital_statuses = ["Single", "Married", "Widow", "Divorced", "Husband has other wives", "Abandoned by husband"];
    this.parents_marital_statuses = ["Single", "Married", "Widow", "My father has other wives", "Separated (legally married)", "Divorced"];
    this.occupations = ["Unemployed", "Farmer", "Wage-laborer", "Business Owner", "Migrant Worker", "Tailoring", "Housewife",
      "Animal Husbandry", "Domestic Work", "Shoekeeper", "Hotel", "Factory"];
  }
}