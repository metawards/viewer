
// package imports
import React from 'react';

// MetaView components
import MetaView from "./components/MetaView";

// Styling for the app
import styles from './MetaApp.module.css'

class MetaApp extends React.Component {
  constructor(props){
    super(props);
  }

  render(){
    return (
      <div>
        <div className={styles.backgroundImage} />
        <div className={styles.graphContainer}>
          <MetaView />
        </div>
      </div>
    );
  }
};

export default MetaApp;
