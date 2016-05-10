import BlogDrafts from './blog-drafts';
import BlogEntry from './blog-entry';
import BlogIndex from './blog-index';
import BlogRoot from './blog-root';
import Main from './main';

import Home from '../pages/home/page';
import Games from '../pages/games/page';

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
        {path: 'drafts', component: BlogDrafts},
      ],
    },
    {
      path: 'games',
      component: Games,
    },
  ],
};
