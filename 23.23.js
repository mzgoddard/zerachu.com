webpackJsonp([23],{347:function(s,e){s.exports="<p>With webpack building one off loaders is something I do a lot to experiment and fulfill specific needs for projects. Loaders most basic interface, transforming some input content into output javascript, can get a lot done. They can also be pretty easy to follow and understand so you don't have to worry about adding opaque complexity to maintaining the build process.</p> <p>I was helping a coworker recently and they were looking at including raw markdown in a small project with webpack. With a library to render that markdown they could build a static site or in this case, a slideshow.</p> <p>Since the target library renders the markdown in the browser we need to get the content off the file system and into the output webpack creates. A useful loader already exists to do that. <code>raw-loader</code> lets a project build in the raw content of a file. To do this it stringifies the file content escaping quotes and other characters as needed.</p> <h2>A raw loader</h2> <p>Based on that description we can write most of the <code>raw-loader</code> source.</p> <pre><code class=language-javascript><span class=hljs-built_in>module</span>.exports = <span class=hljs-function><span class=hljs-keyword>function</span>(<span class=hljs-params>content</span>) </span>{\n  <span class=hljs-keyword>return</span> <span class=hljs-string>'module.exports = '</span> + <span class=hljs-built_in>JSON</span>.stringify(content);\n};\n</code></pre> <p>Thats the simplest loader one could write. It takes in some input, transforms it, and appends a small header and returns that. That returned output evaluated by a browser as part of webpack output lets javascript utilize that original raw content of a file.</p> <p>The one missing detail to be equivalent to <code>raw-loader</code> is a line to let webpack know that the loader doesn't need to be executed again unless the original content passed to it changed.</p> <pre><code class=language-javascript><span class=hljs-built_in>module</span>.exports = <span class=hljs-function><span class=hljs-keyword>function</span>(<span class=hljs-params>content</span>) </span>{\n  <span class=hljs-keyword>this</span>.cacheable &amp;&amp; <span class=hljs-keyword>this</span>.cacheable();\n  <span class=hljs-keyword>return</span> <span class=hljs-string>'module.exports = '</span> + <span class=hljs-built_in>JSON</span>.stringify(content);\n};\n</code></pre> <p>This is a first great step to getting markdown into a webpack'd application. It lets us bring in the raw markdown into the app and the markdown slideshow library can do the next step turning it into something further. But we'll run into the same problem that css-loader, html-loader and others exist to answer.</p> <h2>Building in a thousand words</h2> <p><code>css-loader</code> parses <code>url()</code> references letting webpack'd css refer to images and have them included in the build process. <code>html-loader</code> parses html tag attributes by configuration, with img's src attribute by default, letting webpack'd html refer to image resources for inclusion in the build. We need that same thing for our markdown slideshow library.</p> <p>To do this we will build a loader that works like those other loaders. They take their input and transform them into small javascripts that are evaluated at runtime.</p> <p>If we loading css we may have a line like:</p> <pre><code class=language-css><span class=hljs-selector-class>.portrait</span> {\n  <span class=hljs-attribute>background</span>: <span class=hljs-built_in>url</span>(<span class=hljs-string>'portrait.png'</span>);\n}\n</code></pre> <p>In spirit <code>css-loader</code> takes that and creates output that may look like:</p> <pre><code class=language-javascript><span class=hljs-built_in>module</span>.exports = <span class=hljs-string>\".portrait {\\n  background: url('\"</span> + <span class=hljs-built_in>require</span>(<span class=hljs-string>\"./portrait.png\"</span>) + <span class=hljs-string>\"');\\n}\"</span>;\n</code></pre> <p>For a project specific loader we can take that spirit and apply restrictions to keep our loader simple.</p> <h2>Consuming markdown</h2> <p>To build the references to images like css-loader for untransformed markdown we'll want to tranform:</p> <pre><code class=language-markdown>![<span class=hljs-string>portrait</span>](<span class=hljs-link>portrait.png</span>)\n</code></pre> <p>into</p> <pre><code class=language-javascript><span class=hljs-built_in>module</span>.exports = <span class=hljs-string>\"![portrait](\"</span> + <span class=hljs-built_in>require</span>(<span class=hljs-string>\"./portrait.png\"</span>) + <span class=hljs-string>\")\"</span>;\n</code></pre> <p>To do this lets consider replacing a given markdown image with the js code to create it as a webpack module. We need to identify the url in the markdown syntax and the parts before and after. Then we need to transform those parts. The url part needs to be transformed into a webpack request and passed wrapped in a string to call require when the javascript is evaluated. These parts are then connected by by strings with plus operators to concatenate the pieces of the raw markdown string.</p> <p>We already know how to transform the parts wrapping the url. Those are stringified like <code>raw-loader</code> does.</p> <pre><code class=language-javascript><span class=hljs-built_in>JSON</span>.stringify(parts[<span class=hljs-number>1</span>])\n</code></pre> <h2>Working with URLs</h2> <p>Transforming the url part means we need to bring in some other details of webpack.</p> <p>Webpack distinguishes between urls and requests. Urls are what you seen in css, html and markdown. Requests are what you see in CommonJS and Harmony modules. For users these are two different representations of paths and have different assumptions. A url like <code>'image.png'</code> is a relative path to such a file. A request like <code>'image.png'</code> is a reference to library installed in a folder like <code>node_modules</code>. To have a relative request to image.png it'd need to look like <code>'./image.png'</code>. Urls in webpack can point to modules as well by being prefixed with a tilde, like <code>~image.png</code> would point at a library.</p> <p>Webpack has this idiom since its first a javascript module bundler but wants to support working with other file types. Without projects needing to rewrite their urls into requests, webpack created this idiom so most css and other types could be consumed without further change.</p> <p>To do this transformation without writing it ourselves we can use the npm package <code>loader-utils</code>. It has a function urlToRequest that we can use.</p> <pre><code class=language-javascript>loaderUtils.urlToRequest(parts[<span class=hljs-number>2</span>])\n</code></pre> <p>Next we need to stringify it. For urls we could use JSON.stringify still but lets use another utility in <code>loader-utils</code>.</p> <pre><code class=language-javascript>loaderUtils.stringifyRequest(loaderUtils.urlToRequest(parts[<span class=hljs-number>2</span>]))\n</code></pre> <h2>Pulling the tag apart</h2> <p>Right now this would be a string constant in our output, we want webpack to build in that asset and with the webpack config return us a url through <code>file-loader</code> or other loader. Here we need to wrap our stringified request in a call to require.</p> <pre><code class=language-javascript><span class=hljs-keyword>var</span> request = loaderUtils.stringifyRequest(\n  loaderUtils.urlToRequest(parts[<span class=hljs-number>2</span>])\n);\n<span class=hljs-string>'require('</span> + request + <span class=hljs-string>')'</span>\n</code></pre> <p>So we need to build <code>part</code>. For this simpler loader we don't need a full parser to figure that out. We will use a regular expression and it will matches three parts, everything before the url <code>\\!\\[[^\\]]*\\]\\(</code>, the url <code>[^\\)]+</code>, and everything after <code>\\)</code>. Put together we have an expression that will match the parts of a markdown image tag.</p> <pre><code class=language-javascript><span class=hljs-keyword>var</span> partRE = <span class=hljs-regexp>/(\\!\\[[^\\]]*\\]\\()([^\\)]+)(\\))/g</span>;\n</code></pre> <p>With that we can take apart a given image tag, transform it, and put together the code that'll build it at runtime.</p> <pre><code class=language-javascript><span class=hljs-keyword>var</span> partRE = <span class=hljs-regexp>/(\\!\\[[^\\]]*\\]\\()([^\\)]+)(\\))/g</span>;\n<span class=hljs-keyword>var</span> parts = partRE.exec(markdownItem);\n<span class=hljs-keyword>if</span> (parts) {\n  <span class=hljs-keyword>var</span> request = loaderUtils.stringifyRequest(\n    loaderUtils.urlToRequest(parts[<span class=hljs-number>2</span>])\n  );\n  <span class=hljs-keyword>return</span> [\n    <span class=hljs-built_in>JSON</span>.stringify(parts[<span class=hljs-number>1</span>]),\n    <span class=hljs-string>'require('</span> + request + <span class=hljs-string>')'</span>,\n    <span class=hljs-built_in>JSON</span>.stringify(parts[<span class=hljs-number>3</span>])\n  ].join(<span class=hljs-string>' + '</span>);\n}\n</code></pre> <p>We've written this part to break up the parts but also test that that happened. We can handle if what we were passed isn't an image so this can be called on any split up parts of a markdown file.</p> <p>Handling that case where this snippet isn't handed an image is like anything so far. We will stringify it too.</p> <pre><code class=language-javascript><span class=hljs-keyword>return</span> <span class=hljs-built_in>JSON</span>.stringify(markdownItem);\n</code></pre> <h2>Putting it together</h2> <p>We have arrived at the point where we can build our transformation and so build our loader. The final thing we need to do is find all the image tags in a given markdown file. Like breaking up a markdown image we will use a second regular expression to find our image tags and we will do that by splitting the markdown content with that second expression.</p> <pre><code class=language-javascript><span class=hljs-keyword>var</span> imageRE = <span class=hljs-regexp>/(\\!\\[[^\\]]*\\]\\([^\\)]+\\))/g</span>;\n</code></pre> <p>The expression includes the whole match as a group. When used with javascript's string split method this will retain the matched parts that split normally would not include in the returned array. This way we will get an array with markdown images and everything else. We can then transform those parts so images are transformed like we did in the last section and stringify everything else. Joining the members of that array back together will turn out most of the the code coming out of this loader.</p> <pre><code class=language-javascript>content.split(imageRE).map(requestImage).join(<span class=hljs-string>',\\n'</span>)\n</code></pre> <p>With everyting up to now put together we can arrive at a complete webpack loader.</p> <pre><code class=language-javascript><span class=hljs-keyword>var</span> imageRE = <span class=hljs-regexp>/(\\!\\[[^\\]]*\\]\\([^\\)]+\\))/g</span>;\n<span class=hljs-built_in>module</span>.exports = <span class=hljs-function><span class=hljs-keyword>function</span>(<span class=hljs-params>content</span>) </span>{\n  <span class=hljs-keyword>this</span>.cacheable &amp;&amp; <span class=hljs-keyword>this</span>.cacheable();\n  <span class=hljs-keyword>return</span> (\n    <span class=hljs-string>'module.exports = [\\n'</span> +\n    content.split(imageRE).map(requestImage).join(<span class=hljs-string>',\\n'</span>) +\n    <span class=hljs-string>'\\n].join();'</span>\n  );\n};\n\n<span class=hljs-keyword>var</span> partRE = <span class=hljs-regexp>/(\\!\\[[^\\]]*\\]\\()([^\\)]+)(\\))/g</span>;\n<span class=hljs-function><span class=hljs-keyword>function</span> <span class=hljs-title>requestImage</span>(<span class=hljs-params>markdownItem</span>) </span>{\n  <span class=hljs-keyword>var</span> parts = partRE.exec(markdownItem);\n  <span class=hljs-keyword>if</span> (parts) {\n    <span class=hljs-keyword>var</span> request = loaderUtils.stringifyRequest(\n      loaderUtils.urlToRequest(parts[<span class=hljs-number>2</span>])\n    );\n    <span class=hljs-keyword>return</span> [\n      <span class=hljs-built_in>JSON</span>.stringify(parts[<span class=hljs-number>1</span>]),\n      <span class=hljs-string>'require('</span> + request + <span class=hljs-string>')'</span>,\n      <span class=hljs-built_in>JSON</span>.stringify(parts[<span class=hljs-number>3</span>])\n    ].join(<span class=hljs-string>' + '</span>);\n  }\n  <span class=hljs-keyword>return</span> <span class=hljs-built_in>JSON</span>.stringify(markdownItem);\n}\n</code></pre> <h2>Using the loader</h2> <p>Since this is a project specific loader instead of one we might publish to <code>npm</code>, we'll store it locally in our project. Webpack by default configures some places we can put this loader. The first is a folder called <code>web_loaders</code> that is used like <code>node_modules</code>. We can put our loader in <code>web_loaders</code> as an individual file called <code>markdown-image-loader.js</code> or as an index file like <code>markdown-image-loader/index.js</code>.</p> <p>So storing the loader at say <code>web_loaders/markdown-image-loader/index.js</code> we can then require markdown files in webpacked javascript like:</p> <pre><code class=language-javascript><span class=hljs-keyword>var</span> pageBody = <span class=hljs-built_in>require</span>(<span class=hljs-string>'markdown-image-loader!./body.md'</span>);\n</code></pre> <p>Or set up an auto loader in the webpack config:</p> <pre><code class=language-javascript><span class=hljs-built_in>module</span>.exports = {\n  <span class=hljs-comment>// Other webpack configuration ...</span>\n\n  <span class=hljs-built_in>module</span>: {\n    loaders: [\n      {\n        test: <span class=hljs-regexp>/\\.md$/</span>,\n        loader: <span class=hljs-string>'markdown-image-loader'</span>,\n      },\n    ],\n  },\n};\n</code></pre> <p>And require markdown with the loader automatically.</p> <pre><code class=language-javascript><span class=hljs-keyword>var</span> pageBody = <span class=hljs-built_in>require</span>(<span class=hljs-string>'./body.md'</span>);\n</code></pre> <h2>Thinking about this story</h2> <p>Extending webpack does not need to be a massive task. You can use webpack in a project with custom files or existing types but with some processing on it that isn't available without needing a complicated addition to the build process.</p> <p>Building such a loader you need to:</p> <ul> <li>Transform the content into a javascript value, probably a string</li> <li>Transform parts of the content that are references into requests for other needed files like images</li> <li>Export the built value so parts of your application can use it</li> </ul> <p>Webpack provides a lot of the busy work for you like reading in and writing out content. You can focus just on getting the info you need.</p>"}});