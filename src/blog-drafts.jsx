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
    return (<div className={style['blog-drafts']}>
      {pages.blogsKeys()
        .filter(key => !pages.metas(key).public)
        .map(key => (
        <Link to={`/blog/entry/${key}`}><div className={style['blog-drafts-entry']}>
          <h1>{pages.metas(key).title || key}</h1>
          <span className={style['blog-drafts-entry-date']}>{formatDate(new Date(pages.metas(key).public || pages.metas(key).created || new Date()))}</span>

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
