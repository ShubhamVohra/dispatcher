import { DispatcherPage } from './app.po';

describe('dispatcher App', () => {
  let page: DispatcherPage;

  beforeEach(() => {
    page = new DispatcherPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
