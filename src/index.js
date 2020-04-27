
import React, { Suspense, lazy } from 'react';
import ReactDOM from "react-dom";
import Spinner from 'react-spinkit';

import './reset.css';
import './index.css';

const MetaApp = lazy(()=>import('./MetaApp'));

function App(props) {
  return (
    <div>
      <Suspense fallback={
          <div className="metawards-center-container">
            <div>Loading application...</div>
            <div>
              <Spinner
                name="ball-grid-pulse"
                color="blue"
                fadeIn="none"
              />
            </div>
          </div>
        }>
        <MetaApp/>
      </Suspense>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
