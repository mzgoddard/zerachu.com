import {render, unmountComponentAtNode} from 'react-dom';
import {renderToString} from 'react-dom/server';

module.exports = {
  components: [],

  mount(root) {
    for (const [component, classname] of this.components) {
      render(component, root.getElementsByClassName(classname)[0]);
    }
  },

  unmount(root) {
    for (const [component, classname] of this.components) {
      unmountComponentAtNode(root.getElementsByClassName(classname)[0]);
    }
  },

  mountString(html) {
    for (const [component, selector] of this.components) {
      html = html.replace(
        `<div class="${selector}"></div>`,
        renderToString(component)
      );
    }
    return html;
  },
};
