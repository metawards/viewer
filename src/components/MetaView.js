
import React from 'react';

import MetaViewD3 from './d3/MetaView.d3.js';

import styles from './MetaView.module.css';

class MetaView extends React.Component {
  constructor(props){
    super(props);

    this._graph = new MetaViewD3(props);
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
    this._graph.update(this.props);
    this._graph.draw();
  }

  _updateSize(){
    if (this.container && this._graph){
      this._graph.update({width: this.container.offsetWidth,
                          height: this.container.offsetHeight});
      this._graph.draw();
    }
  }

  render(){
    let s = `${styles.graph} ${this._graph.className()}`;

    return <div ref={el => (this.container = el)}
                style={{width:"100%", height:"100%"}}>
             <div className={s} />
           </div>;
  }
}

export default MetaView;
