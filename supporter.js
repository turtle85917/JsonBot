var support = {};

support.random = (min, max, isInt) => {
  var ran = Math.random() * (max-min+1);
  return isInt ? Math.floor(ran) + min : ran + min;
}

module.exports = support;
