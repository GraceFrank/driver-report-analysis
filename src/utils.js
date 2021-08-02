const normalizeAmount = (formattedNumString) => {
  if (typeof formattedNumString === 'number') return formattedNumString;
  const numString = formattedNumString.split(',').join('');
  return Number(numString);
};

const pick = (object, properties) => {
  const pickedProps = {};
  for (const property of properties) {
    pickedProps[property] = object[property];
  }
  return pickedProps;
};

roundNumber = (num) => Math.round(num * 100) / 100;

module.exports = { normalizeAmount, pick, roundNumber };
