module.exports = (string) => {
  const regexp = /^[a-zA-Z0-9-_.@]*$/ig;
  return regexp.test(string);
}