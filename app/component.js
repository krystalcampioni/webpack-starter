module.exports = function () {
  var element = document.createElement('header');
  var img = require('./images/logo.svg');
  element.innerHTML = '<img src="' + img + '" />';
  return element;
};
