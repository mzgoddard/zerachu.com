import BlogRoot from './blog-root';
import BlogIndex from './blog-index';
import BlogEntry from './blog-entry';
import Main from './main';

import Home from '../pages/home/page';

export default {
  path: '/',
  component: Main,
  indexRoute: {component: Home},
  childRoutes: [
    {
      path: 'blog',
      component: BlogRoot,
      indexRoute: {component: BlogIndex},
      childRoutes: [
        {path: 'entry/:name', component: BlogEntry},
      ],
    },
  ],
};
