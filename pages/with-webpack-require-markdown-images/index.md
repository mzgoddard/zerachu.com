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

## Consuming markdown

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
JSON.stringify(parts[1])
```

## Working with URLs

Transforming the url part means we need to bring in some other details of webpack.

Webpack distinguishes between urls and requests. Urls are what you seen in css, html and markdown. Requests are what you see in CommonJS and Harmony modules. For users these are two different representations of paths and have different assumptions. A url like `'image.png'` is a relative path to such a file. A request like `'image.png'` is a reference to library installed in a folder like `node_modules`. To have a relative request to image.png it'd need to look like `'./image.png'`. Urls in webpack can point to modules as well by being prefixed with a tilde, like `~image.png` would point at a library.

Webpack has this idiom since its first a javascript module bundler but wants to support working with other file types. Without projects needing to rewrite their urls into requests, webpack created this idiom so most css and other types could be consumed without further change.

To do this transformation without writing it ourselves we can use the npm package `loader-utils`. It has a function urlToRequest that we can use.

```javascript
loaderUtils.urlToRequest(parts[2])
```

Next we need to stringify it. For urls we could use JSON.stringify still but lets use another utility in `loader-utils`.

```javascript
loaderUtils.stringifyRequest(loaderUtils.urlToRequest(parts[2]))
```

## Pulling the tag apart

Right now this would be a string constant in our output, we want webpack to build in that asset and with the webpack config return us a url through `file-loader` or other loader. Here we need to wrap our stringified request in a call to require.

```javascript
var request = loaderUtils.stringifyRequest(
  loaderUtils.urlToRequest(parts[2])
);
'require(' + request + ')'
```

So we need to build `part`. For this simpler loader we don't need a full parser to figure that out. We will use a regular expression and it will matches three parts, everything before the url `\!\[[^\]]*\]\(`, the url `[^\)]+`, and everything after `\)`. Put together we have an expression that will match the parts of a markdown image tag.

```javascript
var partRE = /(\!\[[^\]]*\]\()([^\)]+)(\))/g;
```

With that we can take apart a given image tag, transform it, and put together the code that'll build it at runtime.

```javascript
var partRE = /(\!\[[^\]]*\]\()([^\)]+)(\))/g;
var parts = partRE.exec(markdownItem);
if (parts) {
  var request = loaderUtils.stringifyRequest(
    loaderUtils.urlToRequest(parts[2])
  );
  return [
    JSON.stringify(parts[1]),
    'require(' + request + ')',
    JSON.stringify(parts[3])
  ].join(' + ');
}
```

We've written this part to break up the parts but also test that that happened. We can handle if what we were passed isn't an image so this can be called on any split up parts of a markdown file.

Handling that case where this snippet isn't handed an image is like anything so far. We will stringify it too.

```javascript
return JSON.stringify(markdownItem);
```

## Build that loader

We have arrived at the point where we can build our transformation and so build our loader. The final thing we need to do is find all the image tags in a given markdown file. Like breaking up a markdown image we will use a second regular expression to find our image tags and we will do that by splitting the markdown content with that second expression.

```javascript
var imageRE = /(\!\[[^\]]*\]\([^\)]+\))/g;
```

```javascript
content.split(imageRE)
.map(requestImage)
.join(' +\n')
```

```javascript
var imageRE = /(\!\[[^\]]*\]\([^\)]+\))/g;
module.exports = function(content) {
  this.cacheable && this.cacheable();
  return 'module.exports = ' +
    content.split(imageRE)
    .map(requestImage)
    .join(' +\n') + ';';
};

function requestImage(markdownItem) {
  var partRE = /(\!\[[^\]]*\]\()([^\)]+)(\))/g;
  var parts = partRE.exec(markdownItem);
  if (parts) {
    var request = loaderUtils.stringifyRequest(
      loaderUtils.urlToRequest(parts[2])
    );
    return [
      JSON.stringify(parts[1]),
      'require(' + request + ')',
      JSON.stringify(parts[3])
    ].join(' + ');
  }
  return JSON.stringify(markdownItem);
}
```
