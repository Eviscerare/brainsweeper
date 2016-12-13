import { BrainsweeperPage } from './app.po';

describe('brainsweeper App', function() {
  let page: BrainsweeperPage;

  beforeEach(() => {
    page = new BrainsweeperPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
