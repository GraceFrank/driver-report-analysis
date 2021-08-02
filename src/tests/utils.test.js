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

describe('pick', () => {
  test('test that picks the provided elements', async () => {
    const object = { name: 'name', email: 'email', ram: 'ram' };
    const picked = pick(object, ['name', 'email']);
    expect(picked).toEqual({ name: 'name', email: 'email' });
  });

  test('test other elements not specified are not picked', async () => {
    const object = { name: 'name', email: 'email', ram: 'ram' };
    const picked = pick(object, ['name', 'email']);
    expect(Object.keys(picked).length).toBe(2);
  });
});
