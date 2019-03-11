//import HomePage from './components/pages/HomePage';
//import AboutPage from './components/pages/AboutPage';
//import FormPage from './components/pages/FormPage';
//import DynamicRoutePage from './components/pages/DynamicRoutePage';
//import PanelLeftPage from './components/pages/PanelLeftPage';
//import PanelRightPage from './components/pages/PanelRightPage';

import NotFoundPage from './components/pages/NotFoundPage';
import ILList from './components/ILList';
import ILArchiveList from './components/ILArchiveList';

export default [
  {
    path: '/',
    component: ILList,
  },
  {
    path: '/ILArchive',
    component: ILArchiveList,
  },
  {
    path: '(.*)',
    component: NotFoundPage,
  }

  //{
  //  path: '/panel-left/',
  //  component: PanelLeftPage,
  //},
  //{
  //  path: '/panel-right/',
  //  component: PanelRightPage,
  //},
  //{
  //  path: '/about/',
  //  component: AboutPage,
  //},
  //{
  //  path: '/form/',
  //  component: FormPage,
  //},
  //{
  //  path: '/dynamic-route/blog/:blogId/post/:postId/',
  //  component: DynamicRoutePage,
  //},
];
