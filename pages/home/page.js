import React from 'react';

import Component from '../../src/page';
import autobind from '../../src/autobind';

export default class Home extends Component {}

autobind(Home);

Component.premount(Home, 'home');
