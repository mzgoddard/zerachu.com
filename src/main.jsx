import React, {Component} from 'react';
import {IndexLink, Link} from 'react-router';

import autobind from './autobind';

export default class Main extends Component {
  render() {
    return (<div className="main" onClick={() => {}}>
      <div className="main-bar" onClick={() => {}}><div className="main-bar-">
        <div className="main-title">zerachu.com <span className="main-info"> | Z Goddard</span></div>
        <div className="main-nav">
          <IndexLink to="/" activeClassName="active"><span>home</span></IndexLink>
          <Link to="/blog/" activeClassName="active"><span>blog</span></Link>
          <Link to="/games/"><span>games</span></Link>
        </div>
      </div></div>
      <div className="main-content">
        {this.props.children}
      </div>
    </div>);
  }
}

autobind(Main);
