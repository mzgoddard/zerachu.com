import React, {Component} from 'react';
import {Link} from 'react-router';

import pages from '../pages';

import autobind from './autobind';

export default class BlogDrafts extends Component {
  handleBlogsUpdate() {
    this.setState({});
  }

  componentWillMount() {
    pages.addListener(this.handleBlogsUpdate);
  }

  componentWillUnmount() {
    pages.removeListener(this.handleBlogsUpdate);
  }

  render() {
    let drafts = pages.blogsKeys()
    .filter(key => !pages.metas(key).public);
    drafts.sort((a, b) => (
      (pages.metas(b).created ? new Date(pages.metas(b).created) : 0) -
      (pages.metas(a).created ? new Date(pages.metas(a).created) : 0)
    ));
    return (<div className={style['blog-drafts']}>
      {drafts
        .map(key => (
        <Link to={`/blog/entry/${key}`}><div className={style['blog-drafts-entry']}>
          <h1>{pages.metas(key).title || key}</h1>
          <span className={style['blog-drafts-entry-date']}>{formatDate(new Date(pages.metas(key).public || pages.metas(key).created || new Date()))} DRAFT</span>

          <p>{pages.metas(key).summary}</p>
        </div></Link>
      ))}
    </div>);
  }
}

autobind(BlogDrafts);

function formatDate(date) {
  return date.toLocaleDateString();
}
