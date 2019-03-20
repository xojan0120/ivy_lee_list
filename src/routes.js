import ILArchiveList from './components/ILArchiveList';
import ILList        from './components/ILList';
import NotFoundPage  from './components/pages/NotFoundPage';

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
];
