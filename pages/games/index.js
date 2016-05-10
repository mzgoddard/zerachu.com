import React from 'react';
import ReactDOM from 'react-dom';
import ReactDOMServer from 'react-dom/server';

import {Link} from 'react-router';

function SecondNav() {
  return (<div>
    <Link to="/blog/">Blog</Link>
    <Link to="/games/">Games</Link>
  </div>);
}

module.exports = {
  get content() {
    return require('./content.md');
  },
  // mount(root) {
  //   ReactDOM.render(<SecondNav />, root.querySelector('.second-nav'));
  // },
  // unmount(root) {
  //   ReactDOM.unmountComponentAtNode(root.querySelector('.second-nav'));
  // },
  // mountString(html) {
  //   return html.replace(
  //     '<div class="second-nav"></div>',
  //     ReactDOMServer.renderToString(<SecondNav />)
  //   );
  // },
};
