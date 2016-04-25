import './index.styl';

import React from 'react';
import {render} from 'react-dom';
import {Router, browserHistory} from 'react-router';

import routes from './routes';

requestAnimationFrame(() => {
  render(
    <Router history={browserHistory} routes={routes} />,
    document.getElementById('root')
  );
});
