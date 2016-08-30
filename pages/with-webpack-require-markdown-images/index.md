With webpack building one off loaders is something I do a lot to experiment and fulfill specific needs for projects. Loaders most basic interface, transforming some input content into output javascript, can get a lot done. They can also be pretty easy to follow and understand so you don't have to worry about adding complexity to maintaining the build process.

I was helping a coworker recently and they were looking at including raw markdown in a small project with webpack. With a library to render that markdown they could build a static site or in this case slideshow.

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

This is a first great step to getting markdown into a webpack'd application. It lts us bring in the raw markdown into the app and a markdown library can do the next step turning it into something further. But we'll run into the same problem that css-loader, html-loader and others exist to answer.

## Building in a thousand words

```javascript
module.exports = function(content) {
  this.cacheable && this.cacheable();
  return 'module.exports = ' + content
  .split(/(\!\[[^\]]*\]\([^\)]+\))/g)
  .map(function(piece) {
    var match = /(\!\[[^\]]*\]\()([^\)]+)(\))/g.exec(piece);
    if (match) {
      return JSON.stringify(match[1]) + ' + require(' + JSON.stringify('./' + match[2]) + ') + ' + JSON.stringify(match[3]);
    }
    return JSON.stringify(piece);
  })
  .join(' +\n') + ';';
};
```
