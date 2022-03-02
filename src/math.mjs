const calculateTip = (total, tipInPercentage = 20) =>
  (total += total * (tipInPercentage / 100));

export default calculateTip;
