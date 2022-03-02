const calculateTip = (total, tipInPercentage = 20) =>
  (total += total * (tipInPercentage / 100));

const add = (a, b) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (a < 0 || b < 0) return reject('Numbers must be positive.');

      resolve(a + b);
    }, 250);
  });
};

export { calculateTip, add };
