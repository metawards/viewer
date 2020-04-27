
import * as d3 from 'd3';

import lodash from 'lodash';

import { v4 as uuidv4 } from 'uuid';

import styles from '../MetaView.module.css';

function _null_function(params)
{}

/** The main class that renders the graph */
class MetaViewD3 {
  constructor(props){
    // generate a UID for this graph so that we don't clash
    // with any other graphs on the same page
    let uid = uuidv4();

    this.state = {width: null,
                  height: null,
                  signalClicked: _null_function,
                  signalMouseOut: _null_function,
                  signalMouseOver: _null_function,
                  colors: {color: d3.scaleOrdinal(d3.schemeCategory10),
                           last_color: -1,
                           group_to_color: {}},
                  uid: uid.slice(uid.length-8)
                 };

    this._size_changed = true;
    this._graph_changed = true;

    this.update(props);
  }

  updateGraph(params){
    let w = this.state.width;
    let h = this.state.height;

    if (!w || !h){
      return;
    }
  }

  update(props){
    let size_changed = false;

    console.log("UPDATE");
    console.log(props);

    if (props.hasOwnProperty("width")){
      if (this.state.width !== props.width){
        this.state.width = props.width;
        size_changed = true;
      }
    }

    if (props.hasOwnProperty("height")){
      if (this.state.height !== props.height){
        this.state.height = props.height;
        size_changed = true;
      }
    }

    if (size_changed){
      this._size_changed = true;
    }

    if (props.hasOwnProperty("signalClicked")){
      if (props.signalClicked){
        this.state.signalClicked = props.signalClicked;
      }
      else{
        this.state.signalClicked = _null_function;
      }
    }

    if (props.hasOwnProperty("signalMouseOut")){
      if (props.signalMouseOut){
        this.state.signalMouseOut = props.signalMouseOut;
      }
      else{
        this.state.signalMouseOut = _null_function;
      }
    }

    if (props.hasOwnProperty("signalMouseOver")){
      if (props.signalMouseOver){
        this.state.signalMouseOver = props.signalMouseOver;
      }
      else{
        this.state.signalMouseOver = _null_function;
      }
    }
  }

  className(){
    return `MetaViewD3-${this.state.uid}`;
  }

  drawFromScratch(){
    console.log("DRAW FROM SCRATCH");

    d3.select(`.${this.className()} > *`).remove();

    let container = d3.select(`.${this.className()}`);

    if (!container){
      console.log(`Cannot find container element class ${this.className()}`);
      return;
    }

    const width = this.state.width;
    const height = this.state.height;

    console.log(`REDRAW ${width}x${height}`);

    if (!width || !height){
      console.log(`Invalid width or height? ${width} x ${height}`);
      return;
    }

    let svg = container.append('svg')
      .attr('height', height)
      .attr('width', width)
      .attr('id', 'svg-viz')
      .on("click", ()=>{this.state.signalClicked(null)});

    let mainGroup = svg;
    this._mainGroup = mainGroup;

    mainGroup.append("g").attr("class", "link-group");
    mainGroup.append("g").attr("class", "node-group");
    mainGroup.append("g").attr("class", "node_text-group");

    this._is_drawn = true;
  }

  draw(){
    if (!this._is_drawn){
      this.drawFromScratch();
      this._size_changed = false;
      this._graph_changed = false;
      return;
    }

    let update_simulation = false;

    if (this._size_changed){
      let container = d3.select(`.${this.className()}`);
      container.selectAll("svg")
               .attr("width", this.state.width)
               .attr("height", this.state.height);
      this._size_changed = false;
      update_simulation = true;
    }

    if (this._graph_changed){
      this._node = this._updateNode(this._graph.nodes);
      this._label = this._updateNodeText(this._graph.nodes);
      this._link = this._updateLink(this._graph.edges);
      this._graph_changed = false;
      update_simulation = true;
    }

    if (update_simulation){
      this._updateSimulation();
    }
  }
};

export default MetaViewD3;
