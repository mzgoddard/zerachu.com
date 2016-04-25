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
    return (<div className={style['blog-index']}>
      <h1>Recent</h1>
      {pages.blogsKeys()
        .filter(key => pages.metas(key).public)
        .map(key => (
        <div><Link to={`/blog/entry/${key}`}>{key}</Link></div>
      ))}
    </div>);
  }
}

autobind(BlogIndex);
