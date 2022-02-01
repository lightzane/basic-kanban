import { ShortenBytes } from './shorten-bytes.pipe';

describe('ShortenBytesPipe', () => {
  it('create an instance', () => {
    const pipe = new ShortenBytes();
    expect(pipe).toBeTruthy();
  });
});
