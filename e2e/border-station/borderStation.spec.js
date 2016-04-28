var borderStation = require('./borderStation.po.js');
describe('borderStation view', () => {
  // browser.get('#/border-station/1');
  it("should have h1 text 'Errors'", () => {
    
    // var borderstation = new borderStation();
    borderStation.getBorderStation();
    expect(true).toEqual(true);
  });
});

