(function() {
  'use strict';

  var constants = {
    BaseURL: 'http://muller.cse.taylor.edu:80',
  };

  describe('TallyController', function() {
    var vm, httpBackend;

    beforeEach(module('tinyhandsFrontend'));

    beforeEach(inject(function($controller, $httpBackend) {
      vm = $controller('TallyController');
      httpBackend = $httpBackend;
    }));

    describe('function constructor', function() {

      it('days should be []', function() {
        expect(vm.days).toEqual([]);
      });

      it('userId should be null', function() {
        expect(vm.userId).toBeNull();
      });

      it('should have called getTallyData with true', function() {
        spyOn(vm, 'getTallyData');
        vm.constructor();
        expect(vm.getTallyData).toHaveBeenCalledWith(true);
      });

    });

    describe('function changeColor with day', function() {

      it('should return css style if day changed and not seen', function() {
          // REGION: Data Setup
          var day = {};
          day.change = true;
          day.seen = false;
          // ENDREGION: Data Setup
          var style = vm.changeColor(day);
          expect(style).toBeDefined();
      });

      it('should return undefined if day not changed and seen', function() {
          // REGION: Data Setup
          var day = {};
          day.change = false;
          day.seen = true;
          // ENDREGION: Data Setup
          var style = vm.changeColor(day);
          expect(style).toBeUndefined();
      });

    });

    describe('function checkDifferenecs with data', function() {

      it('should have days that have or have not changed', function() {
          // REGION: Data Setup
          vm.days = [];
          var newData = [
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
          for (var i in vm.days) {
              if ($.isEmptyObject(vm.days[i].interceptions)) {
                  expect(vm.days[i].change).toBeFalsy();
              } else {
                  expect(vm.days[i].change).toBeTruthy();
              }
              expect(vm.days[i].seen).toBeFalsy();
          }
      });

    });

    describe('function getDayOfWeek with date', function() {

      it('should return "Today" given current date', function() {
          // REGION: Data Setup

          var today = window.moment().tz("Asia/Kathmandu");
          // ENDREGION: Data Setup
          var result = vm.getDayOfWeek(today);
          expect(result).toEqual('Today');
      });

      it('should return day of the week given date string', function() {
          // REGION: Data Setup
          var daysOfWeek = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
          var dateStrings = [];
          for (var i = 1; i < 7; i++) {
              var newDate = new Date();
              newDate.setDate(newDate.getDate() - i);
              dateStrings.push(newDate);
          }
          // ENDREGION: Data Setup
          for (var i in dateStrings) {
              var newDayOfWeek = vm.getDayOfWeek(dateStrings[i]);
              var result = daysOfWeek.indexOf(newDayOfWeek) >= 0;
              expect(result).toBeTruthy();
          }
      });

    });

    describe('function getTallyData with fistCall', function() {

      it('should have days that have changed', function() {
          // REGION: Data Setup
          httpBackend.whenGET(constants.BaseURL + '/portal/tally/days/').respond(200, {
          // httpBackend.whenGET(constants.BaseURL + '/portal/tally/days/').respond(200, {
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
          httpBackend.expectGET(constants.BaseURL + '/portal/tally/days/');
          // ENDREGION: Data Setup
          expect(vm.days).toEqual([]);

          vm.getTallyData(true);
          httpBackend.flush();

          expect(vm.days).not.toEqual([]);
          for (var i in vm.days) {
              expect(vm.days[i].change).toBeTruthy();
              expect(vm.days[i].seen).toBeFalsy();
          }
      });

      it('should have days that have not changed', function() {
          // REGION: Data Setup
          httpBackend.whenGET(constants.BaseURL + '/portal/tally/days/').respond(200, {
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
          httpBackend.expectGET(constants.BaseURL + '/portal/tally/days/');
          // ENDREGION: Data Setup
          expect(vm.days).toEqual([]);

          vm.getTallyData(true);
          httpBackend.flush();

          expect(vm.days).not.toEqual([]);
          for (var i in vm.days) {
              expect(vm.days[i].change).toBeFalsy();
              expect(vm.days[i].seen).toBeFalsy();
          }
      });

    });

    describe('function getTallyLocalStorage', function() {
      it('should get tally data from local storage', function() {
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

    describe('function onMouseLeave with day', function() {
      it('should change day to seen', function() {
          // REGION: Data Setup
          var day = {};
          day.seen = false;
          // ENDREGION: Data Setup
          vm.onMouseLeave(day);
          expect(day.seen).toBeTruthy();
      });
    });

    describe('function saveTallyLocalStorage', function() {
      it('should save tally data in local storage', function() {
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

    describe('function sumNumIntercepts with day', function() {
      it('should sum up interceptions', function() {
          // REGION: Data Setup
          var day = {};
          day.interceptions = {'ABC':1,'BAC':2,'CAB':3};
          // ENDREGION: Data Setup
          var sum = vm.sumNumIntercepts(day);
          expect(sum).toBe(6);
      });
    });

  });
})();
