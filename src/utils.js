const normalizeAmount = (formattedNumString) => {
  if (typeof formattedNumString === 'number') return formattedNumString;
  const numString = formattedNumString.split(',').join('');
  return Number(numString);
};

const pick = (object) => {
  const { name, email, phone, noOfTrips, totalAmountEarned } = object;
  return { name, email, phone, noOfTrips, totalAmountEarned };
};

roundNumber = (num) => Math.round(num * 100) / 100;

module.exports = { normalizeAmount, pick, roundNumber };
