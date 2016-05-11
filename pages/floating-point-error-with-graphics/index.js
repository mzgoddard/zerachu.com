import React, {Component as BaseComponent} from 'react';
import {findDOMNode} from 'react-dom';

import MountReact from '../../src/mount-react';

class Component extends BaseComponent {
  constructor() {
    super();
    this.handleResize = this.handleResize.bind(this);
  }

  componentDidMount() {
    if (typeof window === 'object') {
      this.handleResize();
      window.addEventListener('resize', this.handleResize);
    }
  }

  componentDidUpdate() {
    if (typeof window === 'object') {
      this.handleResize();
    }
  }

  componentWillUnmount() {
    if (typeof window === 'object') {
      window.removeEventListener('resize', this.handleResize);
    }
  }

  handleResize() {
    this.refs.root.style.width = '100%';
    // return;
    this.refs.root.offsetWidth;
    const width = findDOMNode(this).getBoundingClientRect().width;
    this.refs.root.style.width =
    // [
    //   281, 284, 287, 290, 292, 296, 299, 302, 305, 308, 311, 314, 317, 320,
    //   323, 326, 329, 332, 335, 338, 341, 344, 347, 350, 353, 356, 359, 362,
    //   365, 368, 371, 374, 385, 388, 391, 394, 397, 400, 403, 406, 409, 412,
    //   415, 418, 421, 424, 427, 430, 433, 436, 439, 442, 445, 448, 451, 454,
    //   457, 460, 463, 466, 469, 472, 475, 478, 481, 484, 487, 490, 493, 496,
    //   499, 502, 505, 508, 511, 514, 517, 520, 523, 526, 529, 532, 535, 538,
    //   541, 544, 547, 550, 553, 556, 559, 562, 565, 568, 571, 574, 577, 580,
    //   583, 586, 589, 592, 595, 598, 601, 604, 607, 610, 613, 616, 619, 622,
    //   625, 628, 631, 634, 637, 640, 643, 646, 649, 652, 655, 658, 661, 664,
    //   667, 670, 673, 676, 679, 682, 685, 688, 691, 694, 697, 700, 703, 706,
    //   709, 712, 715, 718, 721, 724, 727, 730, 733, 736, 739, 742, 745, 748
    // ]
    [
      250, 292, 332, 344, 376, 391, 419, 440, 456, 520, 536,
      584, 632, 680, 728, 748,
    ]
    .reduce((carry, widthBug) => {
      if (width >= widthBug) {
        return widthBug + 'px';
      }
      return carry;
    }, '292px');
  }
}

class FloatingError extends Component {
  render() {
    return <div ref="root" style={{
      position: 'relative',
      width: 292,
      paddingBottom: `${100 / 12}%`,
      margin: '0 auto',
    }}>
      {[
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,
      ]
      .map((item, index, ary) => (
      <div style={{
        display: 'inline-block',
        position: 'absolute',
        left: `${100 / ary.length * index}%`,
        width: `${100 / ary.length}%`,
        paddingBottom: `${100 / 12}%`,
        background: 'black',
      }}></div>
      ))}
    </div>;
  }
}

class FloatingFix extends Component {
  render() {
    return <div ref="root" style={{
      position: 'relative',
      width: 292,
      paddingBottom: `${100 / 12}%`,
      margin: '0 auto',
    }}>
      {[
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,
      ]
      .map((item, index, ary) => (
      <div style={{
        display: 'inline-block',
        position: 'absolute',
        left: `${100 / ary.length * index}%`,
        width: `${100 / ary.length + Math.pow(2, -7)}%`,
        paddingBottom: `${100 / 12}%`,
        background: 'black',
      }}></div>
      ))}
    </div>;
  }
}

module.exports = Object.assign(Object.create(MountReact), {
  components: [
    [<FloatingError />, 'floating-point-error'],
    [<FloatingFix />, 'floating-point-fix'],
  ],

  get content() {
    return require('./content');
  },
});
