import MdfController from './mdf.controller';

describe('MDF Controller', () => {
    let vm,
        $state,
        mockBudgetListService,
        $stateParams,
        $sce;

    beforeEach(inject((_$sce_) => {
        $sce = _$sce_;
        $stateParams = { "id": 1 }

        let response = {
            'data': {
                "committee_members": [],
                "staff_members": [],
                "national_staff_members": [],
                "pdf_url": ""
            }
        };

        mockBudgetListService = jasmine.createSpyObj('BudgetListService', [
            'getMdf',
            'sendMdfEmails'
        ]);

        mockBudgetListService.getMdf.and.callFake(() => {
            return {
                then: (f) => {
                    f(response);
                }
            };
        });

        vm = new MdfController(mockBudgetListService, $stateParams, $state, $sce);
    }));

    describe('function constructor', () => {
        it('expect retrieveMdf to be called', () => {
            spyOn(vm, 'retrieveMdf');
            vm.constructor();

            expect(vm.retrieveMdf).toHaveBeenCalled();
        });
    });

    describe('function createIframe', () => {
        it('expect createIframe to create an iframe with the pdf_url', () => {
            let url = 'http://localhost/'
            var val = vm.createIframe(url);
            expect(val.toString()).toContain(url);
        });
    });

    describe('function getIds', () => {
        it('expect getIds to contain staff id because it is checked', () => {
            let people = { "staff_ids": [], "committee_ids": [] , "national_staff_ids": []};
            let sourceObject = [{ "id": 169, "receives_money_distribution_form": true }];

            var val = vm.getIds(sourceObject, people, 'staff_ids');
            expect(val.staff_ids).toEqual([169]);
        });

        it('expect getIds to contain committee_member id because it is checked', () => {
            let people = { "staff_ids": [], "committee_ids": [], "national_staff_ids": [] };
            let sourceObject = [{ "id": 169, "receives_money_distribution_form": true }];

            var val = vm.getIds(sourceObject, people, 'committee_ids');
            expect(val.committee_ids).toEqual([169]);
        });

        it('expect getIds to contain national staff id because it is checked', () => {
            let people = { "staff_ids": [], "committee_ids": [], "national_staff_ids": [] };
            let sourceObject = [{ "id": 169, "receives_money_distribution_form": true }];

            var val = vm.getIds(sourceObject, people, 'national_staff_ids');
            expect(val.national_staff_ids).toEqual([169]);
        });

        it('expect getIds to contain two committee_member id because they are checked', () => {
            let people = { "staff_ids": [], "committee_ids": [], "national_staff_ids": [] };
            let sourceObject = [
                { "id": 169, "receives_money_distribution_form": true },
                { "id": 170, "receives_money_distribution_form": true }
            ];

            var val = vm.getIds(sourceObject, people, 'committee_ids');
            expect(val.committee_ids).toEqual([169, 170]);
        });

        it('expect getIds to not contain committee_member id because it is unchecked', () => {
            let people = { "staff_ids": [], "committee_ids": [], "national_staff_ids": [] };
            let sourceObject = [{ "id": 169, "receives_money_distribution_form": false }];

            var val = vm.getIds(sourceObject, people, 'committee_ids');
            expect(val.committee_ids).toEqual([]);
        });

        it('expect getIds to not contain staff member id because it is unchecked', () => {
            let people = { "staff_ids": [], "committee_ids": [], "national_staff_ids": [] };
            let sourceObject = [{ "id": 169, "receives_money_distribution_form": false }];

            var val = vm.getIds(sourceObject, people, 'staff_ids');
            expect(val.staff_ids).toEqual([]);
        });

        it('expect getIds to not contain national staff member id because it is unchecked', () => {
            let people = { "staff_ids": [], "committee_ids": [], "national_staff_ids": [] };
            let sourceObject = [{ "id": 169, "receives_money_distribution_form": false }];

            var val = vm.getIds(sourceObject, people, 'national_staff_ids');
            expect(val.national_staff_ids).toEqual([]);
        });
    });
});
