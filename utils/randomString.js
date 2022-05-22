module.exports = (length) => {
  // Confusing letters in print (1, l, I, o, O, 0) are removed
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';

  let result = '';
  const indexes = [];

  for (let i = 0; i < length; i += 1) {
    const randomIndex = Math.floor(Math.random() * chars.length);

    if (indexes.filter((x) => x === randomIndex).length <= 1) {
      indexes.push(randomIndex);
      result += chars.charAt(randomIndex);
    } else {
      i -= 1;
    }
  }
  return result;
};
