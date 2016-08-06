export default class VifSection1Controller {
  constructor(VifBuilder) {
    'ngInject';
    this.vif = VifBuilder.section1;
    this.castes = [
        {name: "Magar", value: 'magar'},
        {name: "Jaisi", value: 'jaisi'},
        {name: "Thakuri", value: 'thakuri'},
        {name: "Brahmin", value: 'brahmin'},
        {name: "Tamang", value: 'tamang'},
        {name: "Chhetri", value: 'chhetri'},
        {name: "Mongolian", value: 'mongolian'},
        {name: "Newar", value: 'newar'},
        {name: "Muslim", value: 'muslim'}
    ];
    this.education = [
        {name: "None", value: 'none'}, 
        {name: "Only informal (adult)", value: 'informal'},
        {name: "Primary only", value: 'primary'}, 
        {name: "Grade 4-8", value: 'grade4to8'},
        {name: "Grade 9-10", value: 'grade9to10'}, 
        {name: "SLC", value: 'slc'},
        {name: "11-12", value: 'grade11to12'}, 
        {name: "Bachelors", value: 'bachelors'},
        {name: "Masters", value: 'masters'}
    ];
    this.guardians = [
        {name: "Own Parent(s)", value: 'parents'}, 
        {name: "Husband", value: 'husband'},
        {name: "Other Relative", value: 'otherRelative'},
        {name: "Non-relative", value: 'nonRelative'},
        {name: "No one (I have no guardian)", value: 'noOne'}
    ];
    this.living = [
        {name: "Own Parent(s)", value: 'parents'},
        {name: "Husband", value: 'husband'},
        {name: "Husband's Family", value: 'husbandsFamily'},
        {name: "Friends", value: 'friends'},
        {name: "Alone", value: 'alone'}, 
        {name: "Other Relative", value: 'otherRelative'}
    ];
    this.marital_statuses = [
        {name: "Single", value: 'single'},
        {name: "Married", value: 'married'},
        {name: "Widow", value: 'widow'}, 
        {name: "Divorced", value: 'divorced'},
        {name: "Husband has other wives", value: 'husbandHasOtherWives'},
        {name: "Abandoned by husband", value: 'abandonedByHusband'}
    ];
    this.parents_marital_statuses = [
        {name: "Single", value: 'single'},
        {name: "Married", value: 'married'},
        {name: "Widow", value: 'widow'},
        {name: "My father has other wives", value: 'fatherHasOtherWives'},
        {name: "Separated (legally married)", value: 'separated'},
        {name: "Divorced", value: 'divorced'}
    ];
    this.occupations = [
        {name: "Unemployed", value: 'unemployed'},
        {name: "Farmer", value: 'farmer'},
        {name: "Wage-laborer", value: 'wageLaborer'},
        {name: "Business Owner", value: 'businessOwner'},
        {name: "Migrant Worker", value: 'migrantWorker'},
        {name: "Tailoring", value: 'tailoring'},
        {name: "Housewife", value: 'housewife'},
        {name: "Animal Husbandry", value: 'animalHusbandry'},
        {name: "Domestic Work", value: 'domesticWork'},
        {name: "Shopkeeper", value: 'shopkeeper'},
        {name: "Hotel", value: 'hotel'}, 
        {name: "Factory", value: 'factory'}
    ];
    this.literate = [
        {name: 'No', value: 'isNotLiterate'},
        {name: 'Yes', value: 'isLiterate' }
    ];
  }
}