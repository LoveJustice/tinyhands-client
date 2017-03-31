//The browser.sleeps are needed because you need to give the .sendkeys functions time to type the text or to give the page time to load.
//The first few lines are just to log into the website so we can test the borderStation.
describe('borderStation view', () => {

  browser.get('#/login');
  var loginName = element(by.id('exampleInputEmail1')).sendKeys('test_sup@example.com');
  browser.sleep(100);
  var loginPass = element(by.id('exampleInputPassword1')).sendKeys('pass');
  browser.sleep(100);
  var loginPass = element(by.css('input[type="submit"]')).click();
  browser.sleep(300);
  
  it("should the station name be Bhairahwa", () => {
    browser.get('#/border-station/1');
    browser.sleep(1000);
    var stationName1 = element(by.css('input[ng-model="detailCtrl.details.station_name"]')).getAttribute('value');
    browser.sleep(100);
    expect(stationName1).toEqual('Bhairahwa');
  });

});

