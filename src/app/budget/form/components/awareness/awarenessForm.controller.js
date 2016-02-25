export default class BudgetAwarenessFormController {
  awarenessTotal(form) {
    var amount = 0;
    if(form.awareness_contact_cards) {
        amount += form.awareness_contact_cards_amount;
    }
    if(form.awareness_awareness_party_boolean) {
        amount += form.awareness_awareness_party;
    }
    if(form.awareness_sign_boards_boolean) {
        amount += form.awareness_sign_boards;
    }
    // this.awarenessTotalValue = amount + this.otherAwarenessTotalValue[0];
    return amount;
  }
}