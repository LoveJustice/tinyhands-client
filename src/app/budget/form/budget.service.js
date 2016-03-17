import BaseService from '../../base.service';

/**
 * Service to manage dataflow of budget form information between the client and
 * the backend.
 *
 * @export
 * @class BudgetService
 * @extends {BaseService}
 */
export default class BudgetService extends BaseService {
  /**
   * Creates an instance of BudgetService.
   *
   * @param $http Angular http service
   */
  constructor($http, utils) {
    'ngInject';
    super();

    this.$http = $http;
    this.utils = utils;
  }

  /**
   * Function that sends the data to be created for a new budget form.
   *
   * @param {Object} form The data to be created.
   * @returns Promise that provides the status and data of the request.
   */
  createForm(form) {
    return this.post('api/budget/', form);
  }

  /**
   * Function to create other items for a budget form.
   *
   * @param {number} budgetId The id of the target budget.
   * @param {Object} otherItem The data to create.
   * @returns Promise that provides the status and data of the request.
   */
  createOtherItem(budgetId, otherItem) {
    return this.post(`api/budget/${budgetId}/item/`, otherItem);
  }

  /**
   * Function to create salary information for a staff member.
   *
   * @param {Object} salaryData Object containing salary information
   * @returns Promise that provides the status and data of the request.
   */
  createSalary(salaryData) {
    return this.post('api/budget/staff_salary/', salaryData);
  }

  /**
   * Function to delete an other item.
   *
   * @param {number} budgetId The id of the target budget.
   * @param {Object} otherItem The data to delete.
   * @returns Promise that provides the status and data of the request.
   */
  deleteOtherItem(budgetId, otherItem) {
    return this.delete(`api/budget/${budgetId}/item/${otherItem.id}/`, otherItem);
  }

  /**
   * Function to get borderstation information.
   *
   * @param {number} id The id of a border station to retrieve.
   * @returns Promise that provides the status and data of the request.
   */
  getBorderStation(id) {
    return this.get(`api/border-station/${id}/`);
  }

  /**
   * Function to get the budget form data.
   *
   * @param {number} id The id of a budget form to retrieve.
   * @returns Promise that provides the status and data of the request.
   */
  getBudgetForm(id) {
    return this.get(`api/budget/${id}/`);
  }

  /**
   * Function to get other items for a form section within a budget form.
   *
   * @param {number} budgetId The id for the budget you are looking for.
   * @param {number} formSection The form section you are attempting to access. Travel: 1, Miscellaneous: 2, Awareness: 3, Supplies: 4, Shelter: 5, FoodAndGas: 6, Communication: 7, Salaries: 8
   * @returns Promise that provides the status and data of the request.
   */
  getOtherItems(budgetId, formSection) {
    return this.get(`api/budget/${budgetId}/item/?form_section=${formSection}`);
  }

  /**
   * Function that gets the previous budget form data of a border station.
   *
   * @param {number} borderStationId The id of the border station.
   * @param {number} month The month of the current budget form.
   * @param {number} year The year of the current budget form.
   * @returns Promise that provides the status and data of the request.
   */
  getPreviousData(borderStationId, month, year) {
    return this.get(`api/budget/previous_data/${borderStationId}/${month}/${year}/`);
  }

  /**
   * Function that gets the staff of a border station.
   *
   * @param {number} borderStationId The id of the border station.
   * @returns Promise that provides the status and data of the request.
   */
  getStaff(borderStationId) {
    if (this.utils.validId(borderStationId)) {
      return this.get(`api/staff/?border_station=${borderStationId}`);
    }
  }

  /**
   * Function that gets salary information for staff at a particular border station.
   *
   * @param {number} borderStationId The id of the border station.
   * @returns Promise that provides the status and data of the request.
   */
  getStaffSalaries(budgetId) {
    return this.get(`api/budget/${budgetId}/staff_salary/`);
  }

  /**
   * Function that updates the data for the budget form.
   *
   * @param {number} budgetId The id of the budget form being updated.
   * @param {Object} form The updated data.
   * @returns Promise that provides the status and data of the request.
   */
  updateForm(budgetId, form) {
    return this.put(`api/budget/${budgetId}/`, form);
  }

  /**
   * Function that updates the data for an other item for this budget form.
   *
   * @param {number} budgetId The id of the budget form being updated.
   * @param {Object} otherItem The updated data.
   * @returns Promise that provides the status and data of the request.
   */
  updateOtherItem(budgetId, otherItem) {
    return this.put(`api/budget/${budgetId}/item/${otherItem.id}/`, otherItem);
  }

  /**
   * Function that updates the salary information for a particular salary object that is linked to a staff member.
   *
   * @param {number} budgetId The id of the budget form being updated.
   * @param {Object} salaryData The object that contains the updated salary information.
   * @returns Promise that provides the status and data of the request.
   */
  updateSalary(budgetId, salaryData) {
    return this.put(`api/budget/${budgetId}/staff_salary/${salaryData.id}/`, salaryData);
  }
}