import fs from 'fs';
import path from 'path';

import React from 'react';
import {renderToString} from 'react-dom/server';
import {match, RouterContext} from 'react-router';

import routes from './routes';

function generate(location) {
  return new Promise((resolve, reject) => {
    match({routes, location}, (error, redirectLocation, renderProps) => {
      if (error) {
        reject(error);
      }
      else {
        // console.log(renderProps);
        Promise.all(renderProps.components.map(function(component, index) {
          var promise = Promise.resolve({premountParams: {}, premountScripts: {}});
          if (component.premountParams) {
            promise = Object.keys(component.premountParams).reduce((carry, key) => (
              carry.then(function(obj) {
                return component.premountParams[key]({
                  params: renderProps.params,
                })
                .then(function(prop) {
                  obj.premountParams[key] = prop;
                  return obj;
                });
              })
            ), promise);
          }
          if (component.premountScripts) {
            promise = Object.keys(component.premountScripts).reduce((carry, key) => (
              carry.then(function(obj) {
                return component.premountScripts[key]({
                  params: renderProps.params,
                })
                .then(function(prop) {
                  obj.premountScripts[key] = prop;
                  return obj;
                });
              })
            ), promise);
          }
          return promise;
        }))
        // .then((carry) => {console.log(carry); return carry;})
        // .then({premountParams} => (
        // ))
        .then((premount) => {
          // const {premountParams, premountScripts} = premount;
          Object.assign(renderProps.params, {
            premountParams: premount
            .reduce((carry, {premountParams}) => Object.assign(carry, premountParams), {}),
          });

          return new Promise(resolve => {
            resolve({
              root: renderToString(<RouterContext {...renderProps} />),
              scripts: premount.reduce((carry, {premountScripts}) => (
                carry.concat(Object.keys(premountScripts).reduce((carry, key) => {
                  if (premountScripts[key]) {
                    carry.push(premountScripts[key]);
                  }
                  return carry;
                }, []))
              ), []),
            });
          });
        })
        .then(resolve, reject);
      }
    });
  });
};

export default function bake(location, template) {
  return generate(location)
  // .then((carry) => {console.log(carry); return carry;})
  .then(baked => (
    template
    .replace('<div id=root></div>', '<div id="root"></div>')
    .replace('<div id="root"></div>', `<div id="root">${baked.root}</div>`)
    .replace('</script>', [].concat.apply([], baked.scripts).reduce((carry, script) => {
      return carry +
        (script.src ? `<script src="${script.src}"></script>` :
        script.content ? `<script>${script.content}</script>` :
        '');
    }, '</script>'))
  ));
};

module.exports = ({template, route, write, webpackOptionsNode, webpackOptionsWeb}) => {
  require('!!compile-loader/node-vm').setWebpackOptions(
    typeof webpackOptionsNode === 'string' ?
      eval('require(require("path").resolve(webpackOptionsNode))') : webpackOptionsNode,
    typeof webpackOptionsWeb === 'string' ?
      eval('require(require("path").resolve(webpackOptionsWeb))') : webpackOptionsWeb
  );

  return bake(route, template)
  .then(write)
  .catch(error => {
    console.error(error.stack || error);
  });
};

if (path.basename(process.mainModule.filename) === 'generator.js') {
  module.exports({
    template: fs.readFileSync(
      process.argv[1].substring(0, process.argv[1].lastIndexOf('/')) +
        '/../dist/template.html',
      'utf8'
    ),
    route: process.argv[2],
    write: process.stdout.write.bind(process.stdout),
    webpackOptionsNode: process.argv[3],
    webpackOptionsWeb: process.argv[4],
  });
}
