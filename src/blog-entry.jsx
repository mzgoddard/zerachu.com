// import React, {Component} from 'react';
import React from 'react';
import {renderToString} from 'react-dom/server';

import autobind from './autobind';
import Page from './page';

import pages from '../pages';

export default class BlogEntry extends Page {
  render() {
    const key = this.props.params.name;
    return (<div className={style['blog-entry']}>
      <h1>{pages.metas(key).title || key}</h1>
      <span className={style['blog-entry-date']}>{new Date(
        pages.metas(key).public ||
        pages.metas(key).created ||
        Date.now()
      ).toLocaleDateString()} {pages.metas(key).public ? '' : 'DRAFT'}</span>
      <div className={style['blog-entry-content']} dangerouslySetInnerHTML={this.entryHtml}></div>
    </div>);
  }
}

autobind(BlogEntry);

Page.premount(BlogEntry);
