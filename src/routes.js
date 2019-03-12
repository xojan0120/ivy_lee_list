//import HomePage from './components/pages/HomePage';
//import AboutPage from './components/pages/AboutPage';
//import FormPage from './components/pages/FormPage';
//import DynamicRoutePage from './components/pages/DynamicRoutePage';
//import PanelLeftPage from './components/pages/PanelLeftPage';
//import PanelRightPage from './components/pages/PanelRightPage';

import NotFoundPage from './components/pages/NotFoundPage';
import ILList from './components/ILList';
import ILArchiveList from './components/ILArchiveList';
import Vltest from './components/Vltest';

export default [
  {
    path: '/',
    component: ILList,
    //component: Vltest,
  },
  {
    path: '/ILArchive',
    component: ILArchiveList,
  },
  {
    // VirtualList理解用
    path: '/Vltest',
    component: Vltest,
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
