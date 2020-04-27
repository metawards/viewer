
// package imports
import React from 'react';

// MetaView components
import MetaView from "./components/MetaView";

// MetaView model
import ModelRun from "./model/ModelRun";

// Styling for the app
import styles from './MetaApp.module.css'

// Data for import
import wards_data from './coords.json';

class MetaApp extends React.Component {
  constructor(props){
    super(props);

    let modelrun = new ModelRun({wards: wards_data});

    this.state = {modelrun: modelrun};
  }

  render(){
    return (
      <div>
        <div className={styles.backgroundImage} />
        <div className={styles.graphContainer}>
          <MetaView modelrun={this.state.modelrun} />
        </div>
      </div>
    );
  }
};

export default MetaApp;
