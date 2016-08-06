export default class VifSection2Controller {
  constructor(VifBuilder) {
    'ngInject';
    this.vif = VifBuilder;
    this.gulfLocations = ["Lebanon", "Dubai", "Saudi Arabia", "Kuwait", "Malaysia", "Oman", "Qatar", "Did Not Know"];
    this.indiaLocations = ["Delhi", "Mumbai", "Surat", "Rajastan", "Kolkata", "Pune", "Jaipur", "Bihar", "Did Not Know"];
    this.sect1Options = ["Education", "Travel / Tour", "Shopping", "Eloping", "Arranged Marriage", "Meet your own family", "Visit broker's home", "Medical treatment",
      "Job - Broker did not say what job", "Job - Baby Care", "Job - Factory", "Job - Hotel", "Job - Shop", "Job - Laborer", "Job - Brothel", "Job - Household"];
    this.sect2Options = ["Support myself", "Support family", "Personal debt", "Family debt", "Love / Marriage", "Bad home / marriage", "Get an education",
      "Tour / Travel", "Didn't know I was going abroad"];
  }
}