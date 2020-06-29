import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import { Router, Route } from 'react-router-dom';
import './index.styl';
// import registerServiceWorker from './registerServiceWorker';

import { Provider as MobxProvider } from 'mobx-react';
import mobxStores from 'mobx-stores/stores';

ReactDOM.render(
  <MobxProvider {...mobxStores}>
    <Router history={mobxStores.routing.history}>
      <Route component={App} />
    </Router>
  </MobxProvider>,
  document.getElementById('root') as HTMLElement
);

// registerServiceWorker();
