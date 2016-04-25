import React, {Component} from 'react';
import {renderToString} from 'react-dom/server';

import autobind from './autobind';

import pages from '../pages';

export default class BlogEntry extends Component {
  constructor(...args) {
    super(...args);
    // this.getEntry(this.props);
    this.state = {
      entry: this.getEntry(this.props),
    };
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      entry: this.getEntry(newProps),
    });
    // this.getEntry(newProps);
  }

  getEntry(props) {
    if (props.params.premountParams && props.params.premountParams.entry) {
      return props.params.premountParams.entry;
    }
    let entry;
    const name = props.params.name;
    try {
      pages(`./${name}/index`)(_entry => {
        entry = _entry;
        // If the data was already fetched it'll be instant and this will cause
        // a rerender. A rerender once when opening a article should be fine.
        requestAnimationFrame(() => {
          this.setState({entry});
        });
      });
      return entry || `Loading ${name}...`;
    }
    catch (error) {
      return `Failed load ${name}`;
    }
    if (typeof entry === 'object') {
      if (Array.isArray(entry)) {

      }
    }
    return entry;
  }

  get entryHtml() {
    return {__html: Array.isArray(this.state.entry) ? this.state.entry[0] : this.state.entry};
  }

  handleEntriesUpdate() {
    this.setState({
      entry: this.getEntry(this.props),
    });
  }

  componentWillMount() {
    pages.addListener(this.handleEntriesUpdate);
  }

  componentDidUpdate() {}

  componentWillUnmount() {
    pages.removeListener(this.handleEntriesUpdate);
  }

  render() {
    return (<div className={style['blog-entry']} dangerouslySetInnerHTML={this.entryHtml}></div>);
  }
}

autobind(BlogEntry);

BlogEntry.premountParams = {
  entry: function(props) {
    return new Promise(resolve => {
      pages(`./${props.params.name}/index`)(resolve);
    });
  },
};

BlogEntry.premountScripts = {
  entry: function(props) {
    return new Promise(resolve => {
      pages(`./${props.params.name}/index`).scripts(resolve);
    });
  },
};
