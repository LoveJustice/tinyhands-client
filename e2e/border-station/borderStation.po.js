/**
 * This file uses the Page Object pattern to define the main page for tests
 * https://docs.google.com/presentation/d/1B6manhG0zEXkC-H-tPo2vwU06JhL8w9-XCF9oehXzAQ
 */

// We never fully implemented Page Object files with e2e testing but left the file here for reference
'use strict';

module.exports = {
  getBorderStation: () => {
    var StationName = by.model('detailCtrl.details.station_name');
    // browser.get('#/border-station/1');
    browser.get('src/app/border-station/person/borderStation.html');
  },
};