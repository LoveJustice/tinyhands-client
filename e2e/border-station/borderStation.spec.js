// var borderStation = require('./borderStation.po.js');
describe('borderStation view', () => {

  browser.get('#/login');
  var loginName = element(by.id('exampleInputEmail1')).sendKeys('test_sup@example.com');
  browser.sleep(100);
  var loginPass = element(by.id('exampleInputPassword1')).sendKeys('pass');
  browser.sleep(100);
  var loginPass = element(by.css('input[type="submit"]')).click();
  browser.sleep(300);
  it("Should log into website", () => {
    browser.get('#/border-station/1');
    browser.sleep(2000);
    var stationName = element(by.css('input[ng-model="detailCtrl.details.station_name"]')).sendKeys('blahblah');
      browser.sleep(1000);
    var stationName1 = element(by.css('input[ng-model="detailCtrl.details.station_name"]')).getAttribute('value');
    // browser.sleep(2000);

    expect(stationName1).toEqual('Bhairahwablahblah');
  });

});

