var Remarkable = require('remarkable');

var remark = new Remarkable({
  html: true,
});

module.exports = function(content) {
  return remark.render(content);
};
