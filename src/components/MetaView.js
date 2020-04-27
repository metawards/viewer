
import React from 'react';

import MetaViewD3 from './d3/MetaView.d3.js';

import styles from './MetaView.module.css';


class MetaView extends React.Component {
  constructor(props){
    super(props);

    this._view = new MetaViewD3(props);
    this._updateSize = this._updateSize.bind(this);
  }

  componentDidMount(){
    window.addEventListener('resize', this._updateSize);
    this._updateSize();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateSize);
  }

  componentDidUpdate(){
    this._view.update(this.props);
    this._view.draw();
  }

  _updateSize(){
    if (this.container && this._view){
      this._view.update({width: this.container.offsetWidth,
                          height: this.container.offsetHeight});
      this._view.draw();
    }
  }

  render(){
    let s = `${styles.graph} ${this._view.className()}`;

    return <div ref={el => (this.container = el)}
                style={{width:"100%", height:"100%"}}>
             <div id="map" />
           </div>;
  }
}

export default MetaView;
