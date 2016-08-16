var Remarkable = require('remarkable');
var hljs = require('highlight.js');

var remark = new Remarkable({
  html: true,

  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(lang, str).value;
      } catch (err) {}
    }

    try {
      return hljs.highlightAuto(str).value;
    } catch (err) {}

    return ''; // use external default escaping
  },
});

module.exports = function(content) {
  this.cacheable();
  return remark.render(content);
};
