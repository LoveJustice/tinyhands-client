import BaseService from '../../base.service'
import TallyController from './tally.controller';
import TallyService from './tally.service';
import constants from '../../constants';

describe('TallyController', () => {
    let vm, httpBackend,
        $rootScope,
        tallyService;
    beforeEach(inject(($httpBackend, $http, _$rootScope_) => {
        $rootScope = _$rootScope_;
        let baseService = new BaseService($http);
        tallyService = new TallyService(baseService);
        vm = new TallyController($rootScope, tallyService);
        vm.country = {id:1};
        httpBackend = $httpBackend;
    }));

    describe('function constructor', () => {

        it('tally should be null', () => {
            expect(vm.tally).toBeNull();
        });


        it('should have called getTallyData with true', () => {
            spyOn(vm, 'getTallyData');
            vm.constructor($rootScope, tallyService);
            expect(vm.getTallyData).toHaveBeenCalled();
        });

    });

    describe('function getTallyData', () => {
        
        let tallyData = {
                count: 10,
                regions:[
                    {
                        count:10,
                        region:'Asia',
                        countries:[
                            {
                                name:'Nepal',
                                count:'10',
                            }
                        ]
                    }
                    
                ]
        };

        it('should have tally changed', () => {
            // REGION: Data Setup
            httpBackend.whenGET(constants.BaseUrl + 'api/irfNew/six-month-tally/').respond(200, tallyData);
            httpBackend.expectGET(constants.BaseUrl + 'api/irfNew/six-month-tally/');

            vm.getTallyData();
            httpBackend.flush();

            expect(vm.tally).toEqual(tallyData);
        });
    });
});
