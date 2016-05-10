import React from 'react';

import Component from '../../src/page';
import autobind from '../../src/autobind';

export default class Games extends Component {}

autobind(Games);

Component.premount(Games, 'games');
