const { roundNumber, normalizeAmount, pick } = require('../utils');

describe('roundNumber', () => {
  test('test that it round to 2 decimal places', async () => {
    expect(roundNumber(155.54321)).toBe(155.54);
    expect(roundNumber(155.12000035)).toBe(155.12);
  });
});

describe('normalizeAmount', () => {
  test('test that it convert to number', async () => {
    expect(normalizeAmount('15,500.54321')).toBe(15500.54321);
  });

  test('test that number returns same number', async () => {
    expect(normalizeAmount(12.4)).toBe(12.4);
  });
});
