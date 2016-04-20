export default class VifPeopleController {
  constructor(VifBuilder) {
    'ngInject'
    this.vif = VifBuilder;
    this.sect1aList = ["Boss of...", "Co-worker of...", "Own relative of..."];
    this.sect1bList = ["Broker", "Companion"];
    this.sect1cList = ["India Trafficker", "Contact of Husband", "Known Trafficker", "Manpower", "Passport", "Sex Industry"];
    this.sect3List = ["Kirat", "Sherpa", "Madeshi", "Pahadi", "Newari"];
    this.occupations = ["None", "Agent (taking girls to India)", "Business owner", "Wage labor", "Job in India",
      "Job in Gulf", "Farmer", "Teacher", "Police", "Army", "Guard", "Cook", "Driver"];
    this.party = ["Congress", "Maoist", "UML", "Forum", "Tarai Madesh", "Shadbawona", "Raprapha Nepal Thruhat", "Nepal Janadikarik Forum", "Loktantrak Party", "Don't Know"];
  }
}