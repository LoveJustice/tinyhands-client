import TallyController from './tally.controller';
import TallyService from './tally.service';
import constants from '../../constants';

describe('TallyController', () => {
  let vm, httpBackend;

  beforeEach(inject(($rootScope, $httpBackend, $http) => {
    let tallyService = new TallyService($http);
    vm = new TallyController($rootScope, tallyService);
    httpBackend = $httpBackend;
  }));

  describe('function constructor', () => {

    it('days should be []', () => {
      expect(vm.days).toEqual([]);
    });

    it('userId should be null', () => {
      expect(vm.userId).toBeNull();
    });

    it('should have called getTallyData with true', () => {
      spyOn(vm, 'getTallyData');
      vm.constructor();
      expect(vm.getTallyData).toHaveBeenCalledWith(true);
    });

  });

  describe('function changeColor with day', () => {

    it('should return css style if day changed and not seen', () => {
        // REGION: Data Setup
        let day = {};
        day.change = true;
        day.seen = false;
        // ENDREGION: Data Setup
        let style = vm.changeColor(day);
        expect(style).toBeDefined();
    });

    it('should return undefined if day not changed and seen', () => {
        // REGION: Data Setup
        let day = {};
        day.change = false;
        day.seen = true;
        // ENDREGION: Data Setup
        let style = vm.changeColor(day);
        expect(style).toBeUndefined();
    });

  });

  describe('function checkDifferenecs with data', () => {

    it('should have days that have or have not changed', () => {
        // REGION: Data Setup
        vm.days = [];
        let newData = [
            {date:'2015-05-02T02:11:49.556',interceptions: {'BSD':4}},
            {date:'2015-05-01T02:11:49.556',interceptions: {}},
            {date:'2015-04-30T02:11:49.556',interceptions: {}},
            {date:'2015-04-29T02:11:49.556',interceptions: {'ABC':2}},
            {date:'2015-04-28T02:11:49.556',interceptions: {}},
            {date:'2015-04-27T02:11:49.556',interceptions: {'ABC':2}},
            {date:'2015-04-26T02:11:49.556',interceptions: {'BSD':4}}
        ];
        // ENDREGION: Data Setup
        expect(vm.days).toEqual([]);

        vm.checkDifferences(newData);

        expect(vm.days).not.toEqual([]);
        for (let i in vm.days) {
            if ($.isEmptyObject(vm.days[i].interceptions)) {
                expect(vm.days[i].change).toBeFalsy();
            } else {
                expect(vm.days[i].change).toBeTruthy();
            }
            expect(vm.days[i].seen).toBeFalsy();
        }
    });

  });

  describe('function getDayOfWeek with date', () => {

    it('should return "Today" given current date', () => {
        // REGION: Data Setup

        let today = window.moment().tz("Asia/Kathmandu");
        // ENDREGION: Data Setup
        let result = vm.getDayOfWeek(today);
        expect(result).toEqual('Today');
    });

    it('should return day of the week given date string', () => {
        // REGION: Data Setup
        let daysOfWeek = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
        let dateStrings = [];
        for (let i = 1; i < 7; i++) {
            let newDate = new Date();
            newDate.setDate(newDate.getDate() - i);
            dateStrings.push(newDate);
        }
        // ENDREGION: Data Setup
        for (let i in dateStrings) {
            let newDayOfWeek = vm.getDayOfWeek(dateStrings[i]);
            let result = daysOfWeek.indexOf(newDayOfWeek) >= 0;
            expect(result).toBeTruthy();
        }
    });

  });

  describe('function getTallyData with fistCall', () => {

    it('should have days that have changed', () => {
        // REGION: Data Setup
        httpBackend.whenGET(constants.BaseUrl + 'portal/tally/days/').respond(200, {
        id: 0,
        days: [
            {date:'2015-05-02T02:11:49.556',interceptions: {'BSD':4}},
            {date:'2015-05-01T02:11:49.556',interceptions: {'ABC':2}},
            {date:'2015-04-30T02:11:49.556',interceptions: {'BSD':4}},
            {date:'2015-04-29T02:11:49.556',interceptions: {'ABC':2}},
            {date:'2015-04-28T02:11:49.556',interceptions: {'BSD':4}},
            {date:'2015-04-27T02:11:49.556',interceptions: {'ABC':2}},
            {date:'2015-04-26T02:11:49.556',interceptions: {'BSD':4}},
        ]});
        httpBackend.expectGET(constants.BaseUrl + 'portal/tally/days/');
        // ENDREGION: Data Setup
        expect(vm.days).toEqual([]);

        vm.getTallyData(true);
        httpBackend.flush();

        expect(vm.days).not.toEqual([]);
        for (let i in vm.days) {
            expect(vm.days[i].change).toBeTruthy();
            expect(vm.days[i].seen).toBeFalsy();
        }
    });

    it('should have days that have not changed', () => {
        // REGION: Data Setup
        httpBackend.whenGET(constants.BaseUrl + 'portal/tally/days/').respond(200, {
            id: 0,
            days: [
                {date:'2015-05-02T02:11:49.556',interceptions: {}},
                {date:'2015-05-01T02:11:49.556',interceptions: {}},
                {date:'2015-04-30T02:11:49.556',interceptions: {}},
                {date:'2015-04-29T02:11:49.556',interceptions: {}},
                {date:'2015-04-28T02:11:49.556',interceptions: {}},
                {date:'2015-04-27T02:11:49.556',interceptions: {}},
                {date:'2015-04-26T02:11:49.556',interceptions: {}},
            ]});
        httpBackend.expectGET(constants.BaseUrl + 'portal/tally/days/');
        // ENDREGION: Data Setup
        expect(vm.days).toEqual([]);

        vm.getTallyData(true);
        httpBackend.flush();

        expect(vm.days).not.toEqual([]);
        for (let i in vm.days) {
            expect(vm.days[i].change).toBeFalsy();
            expect(vm.days[i].seen).toBeFalsy();
        }
    });

  });

  describe('function getTallyLocalStorage', () => {
    it('should get tally data from local storage', () => {
        // REGION: Data Setup
        vm.days = [
            {date:'2015-05-02T02:11:49.556',interceptions: {'BSD':4}},
            {date:'2015-05-01T02:11:49.556',interceptions: {'ABC':2}},
            {date:'2015-04-30T02:11:49.556',interceptions: {'BSD':4}},
            {date:'2015-04-29T02:11:49.556',interceptions: {'ABC':2}},
            {date:'2015-04-28T02:11:49.556',interceptions: {'BSD':4}},
            {date:'2015-04-27T02:11:49.556',interceptions: {'ABC':2}},
            {date:'2015-04-26T02:11:49.556',interceptions: {'BSD':4}},
        ];
        vm.saveTallyLocalStorage();
        vm.days = [];
        // ENDREGION: Data Setup
        expect(vm.days).toEqual([]);

        vm.getTallyLocalStorage();

        expect(vm.days).not.toEqual([]);
    });
  });

  describe('function onMouseLeave with day', () => {
    it('should change day to seen', () => {
        // REGION: Data Setup
        let day = {};
        day.seen = false;
        // ENDREGION: Data Setup
        vm.onMouseLeave(day);
        expect(day.seen).toBeTruthy();
    });
  });

  describe('function saveTallyLocalStorage', () => {
    it('should save tally data in local storage', () => {
        // REGION: Data Setup
        vm.days = [
            {date:'2015-05-02T02:11:49.556',interceptions: {'BSD':4}},
            {date:'2015-05-01T02:11:49.556',interceptions: {'ABC':2}},
            {date:'2015-04-30T02:11:49.556',interceptions: {'BSD':4}},
            {date:'2015-04-29T02:11:49.556',interceptions: {'ABC':2}},
            {date:'2015-04-28T02:11:49.556',interceptions: {'BSD':4}},
            {date:'2015-04-27T02:11:49.556',interceptions: {'ABC':2}},
            {date:'2015-04-26T02:11:49.556',interceptions: {'BSD':4}},
        ];
        // ENDREGION: Data Setup
        expect(localStorage.getItem('tally-'+vm.userId)).toEqual('[]');

        vm.saveTallyLocalStorage();

        expect(localStorage.getItem('tally-'+vm.userId)).not.toBeNull();
    });
  });

  describe('function sumNumIntercepts with day', () => {
    it('should sum up interceptions', () => {
        // REGION: Data Setup
        let day = {};
        day.interceptions = {'ABC':1,'BAC':2,'CAB':3};
        // ENDREGION: Data Setup
        let sum = vm.sumNumIntercepts(day);
        expect(sum).toBe(6);
    });
  });

});
