import React, {Component} from 'react';
import {findDOMNode} from 'react-dom';
import {renderToString} from 'react-dom/server';

import autobind from './autobind';

import pages from '../pages';

export default class Page extends Component {
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
    const name = props.params.name || this.constructor.premountName;
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
    let html = typeof this.state.entry === 'object' ?
      this.state.entry.content :
      this.state.entry;
    if (
      typeof this.state.entry === 'object' &&
      typeof window === 'undefined' &&
      this.state.entry.mountString
    ) {
      html = this.state.entry.mountString(html);
    }
    return {__html: html};
  }

  handleEntriesUpdate() {
    this.setState({
      entry: this.getEntry(this.props),
    });
  }

  componentWillMount() {
    pages.addListener(this.handleEntriesUpdate);
  }

  componentWillUpdate() {
    if (typeof this.state.entry === 'object' && this.state.entry.unmount) {
      this.state.entry.unmount(findDOMNode(this));
    }
  }

  componentDidMount() {
    if (typeof this.state.entry === 'object' && this.state.entry.unmount) {
      this.state.entry.mount(findDOMNode(this));
    }
  }

  componentDidUpdate() {
    if (typeof this.state.entry === 'object' && this.state.entry.mount) {
      this.state.entry.mount(findDOMNode(this));
    }
  }

  componentWillUnmount() {
    pages.removeListener(this.handleEntriesUpdate);

    if (typeof this.state.entry === 'object' && this.state.entry.mount) {
      this.state.entry.unmount(findDOMNode(this));
    }
  }

  render() {
    return (<div className={style['page']} dangerouslySetInnerHTML={this.entryHtml}></div>);
  }
}

autobind(Page);

Page.premount = function(constructor, name) {
  constructor.premountName = name;

  constructor.premountParams = {
    entry: function(props) {
      return new Promise(resolve => {
        pages(`./${props.params.name || name}/index`)(resolve);
      });
    },
  };

  constructor.premountScripts = {
    entry: function(props) {
      return new Promise(resolve => {
        pages(`./${props.params.name || name}/index`).scripts(resolve);
      });
    },
  };
};

Page.premount(Page);
