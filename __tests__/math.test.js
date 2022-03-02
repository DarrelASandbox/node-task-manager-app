import { add, calculateTip } from '../src/math.mjs';

test.skip('Should calculate total + tip', () => {
  const total = calculateTip(10, 30);
  expect(total).toBe(13);
});

test.skip('Should calculate total + default tip', () => {
  const total = calculateTip(10);
  expect(total).toBe(12);
});

// If the expect statement fails, it throws an error and done() is not called.
// If we want to see in the test log why it failed, we have to wrap expect in a try block and pass the error in the catch block to done.
// Otherwise, we end up with an opaque timeout error that doesn't show what value was received by expect(data).
test.skip('async code test', (done) => {
  setTimeout(() => {
    try {
      expect(1).toBe(1);
      done();
    } catch (e) {
      done(e);
    }
  }, 2000);
});

test.skip('Should add 2 numbers, promises', (done) => {
  try {
    add(2, 3).then((sum) => {
      expect(sum).toBe(5);
      done();
    });
  } catch (e) {
    done(e);
  }
});

test.skip('Should add 2 numbers, async/ await', async () => {
  try {
    const sum = await add(2, 3);
    expect(sum).toBe(5);
  } catch (e) {
    expect(e).toMatch('error');
  }
});
