import React, {Component} from 'react';
import {Link} from 'react-router';

import pages from '../pages';

import autobind from './autobind';

export default class BlogIndex extends Component {
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
    let blogs = pages.blogsKeys()
    .filter(key => pages.metas(key).public);
    blogs.sort((a, b) => (
      (pages.metas(b).public ? new Date(pages.metas(b).public) : 0) -
      (pages.metas(a).public ? new Date(pages.metas(a).public) : 0)
    ));
    return (<div className={style['blog-index']}>
      {blogs
        .map(key => (
        <Link to={`/blog/entry/${key}`}><div className={style['blog-index-entry']}>
          <h1>{pages.metas(key).title || key}</h1>
          <span className={style['blog-index-entry-date']}>{formatDate(new Date(pages.metas(key).public || pages.metas(key).created || new Date()))}</span>

          <p>{pages.metas(key).summary}</p>
        </div></Link>
      ))}
    </div>);
  }
}

autobind(BlogIndex);

function formatDate(date) {
  return date.toLocaleDateString();
}
