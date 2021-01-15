import { CommaSeparatedListPipe } from './comma-separated-list.pipe';

describe('CommaSeparatedListPipe', () => {
  it('create an instance', () => {
    const pipe = new CommaSeparatedListPipe();
    expect(pipe).toBeTruthy();
  });
});
