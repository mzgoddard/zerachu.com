import React, {Component} from 'react';

import autobind from './autobind';

export default class BlogRoot extends Component {
  render() {
    return (<div>
      {this.props.children}
    </div>);
  }
}

autobind(BlogRoot);
