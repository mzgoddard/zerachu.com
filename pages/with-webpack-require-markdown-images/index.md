With webpack building one off loaders is something I do a lot to experiment and fulfill specific needs for projects. Loaders most basic interface, transforming some input content into output javascript, can get a lot done. They can also be pretty easy to follow and understand so you don't have to worry about adding opaque complexity to maintaining the build process.

I was helping a coworker recently and they were looking at including raw markdown in a small project with webpack. With a library to render that markdown they could build a static site or in this case, a slideshow.

Since the target library renders the markdown in the browser we need to get the content off the file system and into the output webpack creates. A useful loader already exists to do that. `raw-loader` lets a project build in the raw content of a file. To do this it stringifies the file content escaping quotes and other characters as needed.

## A raw loader

Based on that description we can write most of the `raw-loader` source.

```javascript
module.exports = function(content) {
  return 'module.exports = ' + JSON.stringify(content);
};
```

Thats the simplest loader one could write. It takes in some input, transforms it, and appends a small header and returns that. That returned output evaluated by a browser as part of webpack output lets javascript utilize that original raw content of a file.

The one missing detail to be equivalent to `raw-loader` is a line to let webpack know that the loader doesn't need to be executed again unless the original content passed to it changed.

```javascript
module.exports = function(content) {
  this.cacheable && this.cacheable();
  return 'module.exports = ' + JSON.stringify(content);
};
```

This is a first great step to getting markdown into a webpack'd application. It lets us bring in the raw markdown into the app and the markdown slideshow library can do the next step turning it into something further. But we'll run into the same problem that css-loader, html-loader and others exist to answer.

## Building in a thousand words

`css-loader` parses `url()` references letting webpack'd css refer to images and have them included in the build process. `html-loader` parses html tag attributes by configuration, with img's src attribute by default, letting webpack'd html refer to image resources for inclusion in the build. We need that same thing for our markdown slideshow library.

To do this we will build a loader that works like those other loaders. They take their input and transform them into small javascripts that are evaluated at runtime.

If we loading css we may have a line like:

```css
.portrait {
  background: url('portrait.png');
}
```

In spirit `css-loader` takes that and creates output that may look like:

```javascript
module.exports = ".portrait {\n  background: url('" + require("./portrait.png") + "');\n}";
```

For a project specific loader we can take that spirit and apply restrictions to keep our loader simple.

To build the references to images like css-loader for untransformed markdown we'll want to tranform:

```markdown
![portrait](portrait.png)
```

into

```javascript
module.exports = "![portrait](" + require("./portrait.png") + ")";
```

To do this lets consider replacing a given markdown image with the js code to create it as a webpack module. We need to identify the url in the markdown syntax and the parts before and after. Then we need to transform those parts. The url part needs to be transformed into a webpack request and passed wrapped in a string to call require when the javascript is evaluated. These parts are then connected by by strings with plus operators to concatenate the pieces of the raw markdown string.

We already know how to transform the parts wrapping the url. Those are stringified like `raw-loader` does.

```javascript
JSON.stringify(part[1])
```

Transforming the url part means we need to bring in some other details of webpack.

- urlToRequest
- stringifyRequest
- wrap with require
- join parts
- regex to get parts
- what do to if regex doesn't match
- consuming markdown
- regex to find markdown images
- putting it all together

```javascript
var splitRE = /(\!\[[^\]]*\]\([^\)]+\))/g;
var matchRE = /(\!\[[^\]]*\]\()([^\)]+)(\))/g;
module.exports = function(content) {
  this.cacheable && this.cacheable();
  return 'module.exports = ' + content
  .split(splitRE)
  .map(function(piece) {
    var match = matchRE.exec(piece);
    if (match) {
      return (
        JSON.stringify(match[1]) +
        ' + require(' +
        JSON.stringify('./' + match[2]) +
        ') + ' +
        JSON.stringify(match[3])
      );
    }
    return JSON.stringify(piece);
  })
  .join(' +\n') + ';';
};
```
