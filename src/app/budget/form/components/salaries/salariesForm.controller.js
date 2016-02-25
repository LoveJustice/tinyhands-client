export default class BudgetSalariesController {
  staffTotal(form) {
    var amount = 0;

    form.staff.forEach((staff) => {
      amount += staff.salaryInfo.salary;
    });

    form.otherStaff.forEach((otherStaff) => {
      amount += otherStaff.cost;
    });

    return amount;
  }
}