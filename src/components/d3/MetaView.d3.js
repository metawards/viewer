
import * as d3 from 'd3';

import lodash from 'lodash';

import L from 'leaflet';

import { v4 as uuidv4 } from 'uuid';

import styles from '../MetaView.module.css';

function _null_function(params)
{}

function handleMouseClick(THIS){
    console.log("MOUSE CLICK");
}

function handleMouseOver(THIS){
    console.log("MOUSE OVER");
}

function handleMouseOut(THIS){
    console.log("MOUSE OUT");
}

/** The main class that renders the graph */
class MetaViewD3 {
  constructor(props){
    // generate a UID for this graph so that we don't clash
    // with any other graphs on the same page
    let uid = uuidv4();

    this.state = {width: null,
                  height: null,
                  modelrun: null,
                  signalClicked: _null_function,
                  signalMouseOut: _null_function,
                  signalMouseOver: _null_function,
                  colors: {color: d3.scaleOrdinal(d3.schemeCategory10),
                           last_color: -1,
                           group_to_color: {}},
                  uid: uid.slice(uid.length-8)
                 };

    this._size_changed = true;
    this._wards_changed = true;

    this.update(props);
  }

  update(props){
    let size_changed = false;

    console.log("UPDATE");
    console.log(props);

    if (props.hasOwnProperty("modelrun")){
        this.updateModelRun(props.modelrun);
    }

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

  updateModelRun(modelrun){
    let w = this.state.width;
    let h = this.state.height;

    console.log(`updateModelRun ${w} ${h}`);

    this.state.modelrun = modelrun;

    if (!w || !h){
      return;
    }

    let wards = null;

    if (modelrun){
      wards = modelrun.getWards();
    }

    console.log("WARDS");
    console.log(wards);

    //the social object will cache the 'getGraph' result, meaning
    //that any change in this object signals that the graph needs
    //to be redrawn
    if (wards !== this.state.wards){
        this.state.wards = wards;

        //this view needs to clone its own copy of the wards, as
        //D3 will update the wards object. We need to clone in case
        //two MetaView.d3 views are viewing the same wards
        wards = lodash.cloneDeep(this.state.wards);

        this._wards = wards;
        this._wards_changed = true;
    }
    else{
        console.log("NO CHANGE IN WARDS");
    }

    console.log(`wards changed? ${this._wards_changed}`);
  }

  className(){
    return `MetaViewD3-${this.state.uid}`;
  }

  _updateNode(data){
    let node = this._mainGroup.select(".wards-group").selectAll(".node");

    console.log(node);

    console.log("HERE");
    console.log(data);

    node = node.data(data, d=>d.id)
               .join(
                 enter => enter.append("circle")
                               .attr("class", `node ${styles.node}`),
                 update => update.attr("class",
                                       `node ${styles.node}`)
               )
               .attr("r", 1)
               .attr("id", d=>{return d.id})
               .attr("cx", d=>{return d[0]})
               .attr("cy", d=>{return d[1]})
               .on("click", handleMouseClick(this))
               .on("mouseover", handleMouseOver(this))
               .on("mouseout", handleMouseOut(this));

    return node;
  }

  _updateSimulation(){
    console.log("Update simulation");
  }

  drawFromScratch(){
    console.log("DRAW FROM SCRATCH");

    let wards = this._wards;

    if (!wards){
        console.log(this.state.modelrun);

        if (this.state.modelrun){
          this.updateModelRun(this.state.modelrun);
        }

        wards = this._wards;
        if (!wards){
          console.log("Nothing to draw...");
          return;
        }
    }

    const width = this.state.width;
    const height = this.state.height;
    console.log(`REDRAW ${width}x${height}`);

    d3.select("#map > *").remove();

    const position = [51.505, -0.09]
    const map = L.map("map").setView(position, 13);

    console.log("DRAWING MAP");
    console.log(map);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map)

    L.marker(position)
      .addTo(map)
      .bindPopup('A pretty CSS3 popup. <br> Easily customizable.')

    let svg = d3.select(map.getPanes().overlayPane).append("svg")
                .attr('height', height)
                .attr('width', width)
                .attr('id', 'svg-viz')
                .on("click", ()=>{this.state.signalClicked(null)});

    let g = svg.append("g").attr("class", "leaflet-zoom-hide");

    function projectPoint(x, y) {
        var point = map.latLngToLayerPoint(new L.LatLng(y, x));
        this.stream.point(point.x, point.y);
    }

    let transform = d3.geoTransform({point: projectPoint});
    let path = d3.geoPath().projection(transform);

    if (!width || !height){
      console.log(`Invalid width or height? ${width} x ${height}`);
      return;
    }

    let mainGroup = svg;
    this._mainGroup = mainGroup;

    mainGroup.append("g").attr("class", "wards-group");

    this._node = this._updateNode(wards);

    this._is_drawn = true;
  }

  draw(){
    console.log("draw");
    if (!this._is_drawn){
      this.drawFromScratch();
      this._size_changed = false;
      this._wards_changed = false;
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

    if (this._wards_changed){
      this._node = this._updateNode(this._wards);
      this._wards_changed = false;
      update_simulation = true;
    }

    if (update_simulation){
      this._updateSimulation();
    }
  }
};

export default MetaViewD3;
