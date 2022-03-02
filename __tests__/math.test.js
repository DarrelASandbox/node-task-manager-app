import calculateTip from '../src/math.mjs';
test('Should calculate total + tip?', () => {
  const total = calculateTip(10, 30);
  expect(total).toBe(13);
});

test('Should calculate total + default tip?', () => {
  const total = calculateTip(10);
  expect(total).toBe(12);
});
