import React from 'react';
import {
  App,
  View,
} from 'framework7-react';

import routes from '../routes';

export default function (props) {
  // Framework7 parameters here
  const f7params = {
    id: 'io.ivy_lee_list.testapp', // App bundle ID
    name: 'ivy_lee_list', // App name
    theme: 'auto', // Automatic theme detection
    // App routes
    routes,
  };

  return (
    <App params={f7params}>
      <View id="main-view" url="/" main className="safe-areas"/>
    </App>
  );
};
