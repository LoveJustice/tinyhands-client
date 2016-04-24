describe('Border Station View E2E Tests', () => {
    var page;
    
    
});



describe('The main view', () => {
  var page;

  beforeEach(() => {
    browser.get('/index.html');
    page = require('./main.po');
  });

  it('should include jumbotron with correct data', () => {
    expect(page.h1El.getText()).toBe('\'Allo, \'Allo!');
    expect(page.imgEl.getAttribute('src')).toMatch(/assets\/images\/yeoman.png$/);
    expect(page.imgEl.getAttribute('alt')).toBe('I\'m Yeoman');
  });

  it('should list more than 5 awesome things', () => {
    expect(page.thumbnailEls.count()).toBeGreaterThan(5);
  });


});
