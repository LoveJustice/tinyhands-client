import MdfController from './mdf.controller';
import BudgetListService from '../list/budgetList.service';

describe('MDF Controller',() => {
    let vm;
    let $state;
    let $stateParams = {"id": 1};

    beforeEach(inject(($http, $sce) => {
        let service = new BudgetListService($http);
        vm = new MdfController(service, $stateParams, $state, $sce);
    }));

    describe('function constructor', () => {
        it('expect getBudgetList to be called', () => {
            spyOn(vm, 'retrieveMdf');
            vm.constructor();
            expect(vm.retrieveMdf).toHaveBeenCalled();
        });
    });

    describe('function listofBudgets', () => {
        let response = {'data':{
            "committee_members":
            [
                {"id":169,"email":"benaduggan1@mailinator.com","first_name":"asdf","last_name":"assd","phone":null,"position":null,"receives_money_distribution_form":true,"border_station":25}
            ],
            "staff_members":
            [
                {"id":110,"email":"benaduggan@mailinator.com","first_name":"ben","last_name":"duggan","phone":"","position":null,"receives_money_distribution_form":true,"border_station":25}
            ],
            "pdf_url":"http://localhost/api/mdf/6/pdf/"}
        };


        describe('function createIframe', () => {
            beforeEach(() => {
                vm.service.retrieveMdf = () => {
                    return {
                        then: (f) => {
                            f(response);
                        }
                    };
                };
            });

            it('expect createIframe to create an iframe with the pdf_url', () => {
                var data = vm.service.retrieveMdf();
                data.then( (promise) => {
                    var val = vm.createIframe(promise.data.pdf_url);
                    expect(val.toString()).toContain(promise.data.pdf_url);
                });
            });
        });


        describe('function getIds', () => {
            beforeEach(() => {
                vm.service.retrieveMdf = () => {
                    return {
                        then: (f) => {
                            f(response);
                        }
                    };
                };
            });

            it('expect getIds to contain staff id because it is checked', () => {
                let people = {"staff_ids": [], "committee_ids": []};
                var data = vm.service.retrieveMdf();
                data.then( (promise) => {
                    var val = vm.getIds(promise.data.staff_members, people, 'staff_ids');
                    expect(val.staff_ids).toEqual([110]);
                });
            });

            it('expect getIds to contain committee_member id because it is checked', () => {
                let people = {"staff_ids": [], "committee_ids": []};
                var data = vm.service.retrieveMdf();
                data.then( (promise) => {
                    var val = vm.getIds(promise.data.committee_members, people, 'committee_ids');
                    expect(val.committee_ids).toEqual([169]);
                });
            });

            it('expect getIds to not contain committee_member id because it is unchecked', () => {
                let people = {"staff_ids": [], "committee_ids": []};
                var data = vm.service.retrieveMdf();
                data.then( (promise) => {
                    var data = promise.data.committee_members;
                    data[0].receives_money_distribution_form = false;
                    var val = vm.getIds(data, people, 'committee_ids');
                    expect(val.committee_ids).toEqual([]);
                });
            });

            it('expect getIds to not contain staff member id because it is unchecked', () => {
                let people = {"staff_ids": [], "committee_ids": []};
                var data = vm.service.retrieveMdf();
                data.then( (promise) => {
                    var data = promise.data.staff_members;
                    data[0].receives_money_distribution_form = false;
                    var val = vm.getIds(data, people, 'staff_ids');
                    expect(val.staff_ids).toEqual([]);
                });
            });
        });

    });
});
