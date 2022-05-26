import React, { Component, useState } from "react";
import { connect } from "react-redux";
import {
  setActionsPath,
  setPopoverVisibility,
  triggerAction,
} from "../../api/Actions";
import {
  refreshSessionRecording,
  subscribeToSessionRecording,
  unsubscribeToSessionRecording,
} from "../../api/Actions";
import {
  sessionStateIdle,
  sessionStatePaused,
  sessionStatePlaying,
  sessionStateRecording,
} from "../../api/keys";
import subStateToProps from "../../utils/subStateToProps";
import InfoBox from "../common/InfoBox/InfoBox";
import Button from "../common/Input/Button/Button";
import Input from "../common/Input/Input/Input";
import Select from "../common/Input/Select/Select";
import MaterialIcon from "../common/MaterialIcon/MaterialIcon";
import Popover from "../common/Popover/Popover";
import Row from "../common/Row/Row";
import styles from "./ClimatePanel.scss";
import Picker from "./Picker";

class ClimatePanel extends Component {

  constructor(props) {

    super(props);
    this.state = { isToggleOn: true };
    this.togglePopover = this.togglePopover.bind(this); //makes it possible to click at climate button
  }

  //same in all jsx files
  togglePopover() {
    this.props.setPopoverVisibility(!this.props.popoverVisible);
  }

  getSurfaceLayerAlaska() {
    this.props.luaApi.time.setTime("2021-06-18T19:00:00");
    this.props.luaApi.setPropertyValueSingle(
      "Scene.Earth.Renderable.Layers.ColorLayers.ESRI_World_Imagery.Enabled", true);

    //I don't know if we want this
    this.props.luaApi.setPropertyValueSingle(
        "Scene.Earth.Renderable.Layers.ColorLayers.VIIRS_SNPP_Temporal.Enabled", false);
    this.props.luaApi.globebrowsing.flyToGeo(
      "Earth",
      61.7810,
      -156.4567,
      2556000.0000,
      7,
      true
    );
  }


  getSurfaceLayerGreenland() {
    this.props.luaApi.time.setTime("1990-06-18T13:00:00");

    //Solve the camera angle to use this! Also, we need a dataset with height map
    //this.props.luaApi.navigation.addLocalRotation(0 , 85)
    //this.props.luaApi.navigation.addTruckMovement(0 , 250) //zoom
    //this.props.luaApi.navigation.addLocalRoll(10 , 30) // rotering, didn't use this
    var surfaceLayers;
    this.setState((prevState) => ({
      isToggleOn: !prevState.isToggleOn,
    }));
    console.log("togle", this.state.isToggleOn);
    /*surfaceLayers = this.props.luaApi.setPropertyValueSingle(
      "Scene.Earth.Renderable.Layers.ColorLayers.MODIS_Terra_Chlorophyll_A_Temporal.Enabled",
      this.state.isToggleOn
    );*/

    //DOES NOT WORK, why not??
    this.props.luaApi.setPropertyValueSingle(
      "Scene.Earth.Renderable.Layers.ColorLayers.noaa-sos-oceans-greenland_melt.Enabled",
      this.state.isToggleOn   //noaa-sos-overlays-currents
    );
  /*  this.props.luaApi.setPropertyValueSingle(
      "Scene.Earth.Renderable.Layers.ColorLayers.noaa-sos-oceans-greenland_melt", true);
    surfaceLayers = this.props.luaApi.setPropertyValueSingle(
      "Scene.Earth.Renderable.Layers.ColorLayers.ESRI_World_Imagery.Enabled", true)*/
    this.props.luaApi.setPropertyValueSingle(
        "Scene.Earth.Renderable.Layers.ColorLayers.VIIRS_SNPP_Temporal.Enabled", false);
    this.props.luaApi.globebrowsing.flyToGeo(
      "Earth",
      71.0472,
      -47.1729,
      3881000.0000,
      7,
      true
    );

    //use this if using movements
  /*  this.props.luaApi.globebrowsing.flyToGeo(
      "Earth",
      59.1818,
      -44.1987,
      3881000.0000, //53000.0000
      7,
      true
    );*/
    return surfaceLayers;
  }

  getSurfaceLayerAntarctica() {
    console.log("Antarctica")
    this.props.luaApi.time.setTime("2021-12-18T09:00:00");
    this.setState((prevState) => ({
      isToggleOn: !prevState.isToggleOn,
    }));
    console.log("togle", this.state.isToggleOn);
    /*this.props.luaApi.setPropertyValueSingle(
      "Scene.Earth.Satellites..Enabled",
      this.state.isToggleOn   //noaa-sos-overlays-currents
    );*/

    /*const list = this.props.luaApi.getProperty('{earth_satellites}.Renderable.Enabled');
    console.log(list.length)

    for (v in list){
    console.log("v")
      this.props.luaApi.setPropertyValueSingle(this.props.luaApi.getPropertyValue(v))
    }*/

    /*surfaceLayers = this.props.luaApi.setPropertyValueSingle(
      "Scene.Earth.Renderable.Layers.ColorLayers.Terra_Modis_Temporal.Enabled",
      this.state.isToggleOn
    );*/
    /*
    this.props.luaApi.setPropertyValueSingle(
      "Scene.Earth.Renderable.Layers.ColorLayers.ESRI_World_Imagery.Enabled", true)*/
    this.props.luaApi.setPropertyValueSingle(
      "Scene.Earth.Renderable.Layers.ColorLayers.ESRI_World_Imagery.Enabled", true)

    this.props.luaApi.setPropertyValueSingle(
      "{earth_satellites}.Renderable.Enabled", false) // DOES NOT WORK!!

    this.props.luaApi.setPropertyValueSingle(
          "Scene.Earth.Renderable.Layers.ColorLayers.VIIRS_SNPP_Temporal.Enabled", false);
    this.props.luaApi.globebrowsing.flyToGeo(
      "Earth",
      -84.6081,
      94.7813,
      6990000.0000,
      7,
      true
    );
  }

  getSurfaceLayerCurrentsDetailed() {

    this.setState((prevState) => ({
      isToggleOn: !prevState.isToggleOn,
    }));
    console.log("togle", this.state.isToggleOn);
    this.props.luaApi.setPropertyValueSingle(
      "Scene.Earth.Renderable.Layers.ColorLayers.OSCAR_Sea_Surface_Currents_Zonal.Enabled",
      this.state.isToggleOn
    );
    //this.props.luaApi.setNavigationState([[60, -90, 0],[90, 60, 0],[0, 0, 1]])
     //this.props.luaApi.navigation.addLocalRoll(60,0)
    this.props.luaApi.setPropertyValueSingle(
      "Scene.Earth.Renderable.Layers.ColorLayers.ESRI_World_Imagery.Enabled", true)
    this.props.luaApi.setPropertyValueSingle(
          "Scene.Earth.Renderable.Layers.ColorLayers.VIIRS_SNPP_Temporal.Enabled", false);
}

getSurfaceLayerCurrentsOverview() {
  this.setState((prevState) => ({
    isToggleOn: !prevState.isToggleOn,
  }));
  console.log("togle", this.state.isToggleOn);
  this.props.luaApi.setPropertyValueSingle(
    "Scene.Earth.Renderable.Layers.Overlays.noaa-sos-overlays-currents-currents.Enabled",
    this.state.isToggleOn   //noaa-sos-overlays-currents
  );
  this.props.luaApi.setPropertyValueSingle(
    "Scene.Earth.Renderable.Layers.ColorLayers.ESRI_World_Imagery.Enabled", true)
  this.props.luaApi.setPropertyValueSingle(
        "Scene.Earth.Renderable.Layers.ColorLayers.VIIRS_SNPP_Temporal.Enabled", false);
}

getSurfaceLayerFirstCons(){

  this.props.luaApi.setPropertyValueSingle(
    "Scene.Earth.Renderable.Layers.ColorLayers.noaa-sos-oceans-6m_sea_level_rise-red-4m.Enabled",false);
  this.props.luaApi.setPropertyValueSingle(
    "Scene.Earth.Renderable.Layers.ColorLayers.noaa-sos-oceans-6m_sea_level_rise-red-6m.Enabled",false);

    this.setState((prevState) => ({
      isToggleOn: !prevState.isToggleOn,
    }));
    this.props.luaApi.setPropertyValueSingle(
      "Scene.Earth.Renderable.Layers.ColorLayers.noaa-sos-oceans-6m_sea_level_rise-red-2m.Enabled",
      this.state.isToggleOn
    );
  /*this.props.luaApi.setPropertyValueSingle(
    "Scene.Earth.Renderable.Layers.ColorLayers.ESRI_World_Imagery.Enabled", true);
  this.props.luaApi.setPropertyValueSingle(
        "Scene.Earth.Renderable.Layers.ColorLayers.VIIRS_SNPP_Temporal.Enabled", false);*/
}

getSurfaceLayerSecondCons(){

  this.props.luaApi.setPropertyValueSingle(
    "Scene.Earth.Renderable.Layers.ColorLayers.noaa-sos-oceans-6m_sea_level_rise-red-2m.Enabled",false);
  this.props.luaApi.setPropertyValueSingle(
    "Scene.Earth.Renderable.Layers.ColorLayers.noaa-sos-oceans-6m_sea_level_rise-red-6m.Enabled",false);

    this.setState((prevState) => ({
      isToggleOn: !prevState.isToggleOn,
    }));
    this.props.luaApi.setPropertyValueSingle(
      "Scene.Earth.Renderable.Layers.ColorLayers.noaa-sos-oceans-6m_sea_level_rise-red-4m.Enabled",
      this.state.isToggleOn
    );
  /*this.props.luaApi.setPropertyValueSingle(
    "Scene.Earth.Renderable.Layers.ColorLayers.ESRI_World_Imagery.Enabled", true)
  this.props.luaApi.setPropertyValueSingle(
        "Scene.Earth.Renderable.Layers.ColorLayers.VIIRS_SNPP_Temporal.Enabled", false);*/
}

getSurfaceLayerThirdCons(){

  this.props.luaApi.setPropertyValueSingle(
    "Scene.Earth.Renderable.Layers.ColorLayers.noaa-sos-oceans-6m_sea_level_rise-red-2m.Enabled",false);
  this.props.luaApi.setPropertyValueSingle(
    "Scene.Earth.Renderable.Layers.ColorLayers.noaa-sos-oceans-6m_sea_level_rise-red-4m.Enabled",false);

    this.setState((prevState) => ({
      isToggleOn: !prevState.isToggleOn,
    }));
    this.props.luaApi.setPropertyValueSingle(
      "Scene.Earth.Renderable.Layers.ColorLayers.noaa-sos-oceans-6m_sea_level_rise-red-6m.Enabled",
      this.state.isToggleOn
    );
  /*this.props.luaApi.setPropertyValueSingle(
    "Scene.Earth.Renderable.Layers.ColorLayers.ESRI_World_Imagery.Enabled", true)
  this.props.luaApi.setPropertyValueSingle(
        "Scene.Earth.Renderable.Layers.ColorLayers.VIIRS_SNPP_Temporal.Enabled", false);*/
}

showHideGlaciers() {
  var g = document.getElementById("glacierButton");

  if(g.value=="HIDE"){
    g.style.border = '2px solid #D3D3D3';
    document.getElementById("currentButton").style.border = 'none';
    document.getElementById("consequenceButton").style.border = 'none';

    const glacier1 = document.getElementById('glaciersHide1');
    glacier1.style.position = 'relative';
    glacier1.style.opacity = '1';

    const glacier2 = document.getElementById('glaciersHide2');
    glacier2.style.position = 'relative';
    glacier2.style.opacity = '1';

    const glacier3 = document.getElementById('glaciersHide3');
    glacier3.style.position = 'relative';
    glacier3.style.opacity = '1';

    const current1 = document.getElementById('curentsHide1');
    current1.style.position = 'absolute';
    current1.style.opacity = '0';

    const current2 = document.getElementById('curentsHide2');
    current2.style.position = 'absolute';
    current2.style.opacity = '0';

    const consequence1 = document.getElementById('consequenceHide1');
    consequence1.style.position = 'absolute';
    consequence1.style.opacity = '0';

    const consequence2 = document.getElementById('consequenceHide2');
    consequence2.style.position = 'absolute';
    consequence2.style.opacity = '0';

    const consequence3 = document.getElementById('consequenceHide3');
    consequence3.style.position = 'absolute';
    consequence3.style.opacity = '0';

    g.value="SHOW";
    document.getElementById("currentButton").value = 'HIDE';
    document.getElementById("consequenceButton").value = 'HIDE';
    }
    else if(g.value=="SHOW"){
      g.style.border = 'none';

      const glacier1 = document.getElementById('glaciersHide1');
      glacier1.style.position = 'absolute';
      glacier1.style.opacity = '0';

      const glacier2 = document.getElementById('glaciersHide2');
      glacier2.style.position = 'absolute';
      glacier2.style.opacity = '0';

      const glacier3 = document.getElementById('glaciersHide3');
      glacier3.style.position = 'absolute';
      glacier3.style.opacity = '0';

      g.value="HIDE";
      document.getElementById("currentButton").value = 'SHOW';
      document.getElementById("consequenceButton").value = 'SHOW';
    }
}

showHideCurrents() {
  var c = document.getElementById("currentButton");

    if(c.value=="HIDE"){
      c.style.border = '2px solid #D3D3D3';
      document.getElementById("glacierButton").style.border = 'none';
      document.getElementById("consequenceButton").style.border = 'none';

      const current1 = document.getElementById('curentsHide1');
      current1.style.position = 'relative';
      current1.style.opacity = '1';

      const current2 = document.getElementById('curentsHide2');
      current2.style.position = 'relative';
      current2.style.opacity = '1';

      const glacier1 = document.getElementById('glaciersHide1');
      glacier1.style.position = 'absolute';
      glacier1.style.opacity = '0';

      const glacier2 = document.getElementById('glaciersHide2');
      glacier2.style.position = 'absolute';
      glacier2.style.opacity = '0';

      const glacier3 = document.getElementById('glaciersHide3');
      glacier3.style.position = 'absolute';
      glacier3.style.opacity = '0';

      const consequence1 = document.getElementById('consequenceHide1');
      consequence1.style.position = 'absolute';
      consequence1.style.opacity = '0';

      const consequence2 = document.getElementById('consequenceHide2');
      consequence2.style.position = 'absolute';
      consequence2.style.opacity = '0';

      const consequence3 = document.getElementById('consequenceHide3');
      consequence3.style.position = 'absolute';
      consequence3.style.opacity = '0';

      c.value="SHOW";
      document.getElementById("glacierButton").value = 'HIDE';
      document.getElementById("consequenceButton").value = 'HIDE';
      }
      else if(c.value=="SHOW"){
        c.style.border = 'none';

        const current1 = document.getElementById('curentsHide1');
        current1.style.position = 'absolute';
        current1.style.opacity = '0';

        const current2 = document.getElementById('curentsHide2');
        current2.style.position = 'absolute';
        current2.style.opacity = '0';

        c.value="HIDE";
        document.getElementById("glacierButton").value = 'SHOW';
        document.getElementById("consequenceButton").value = 'SHOW';
      }
}

showHideConsequenses() {
  var c = document.getElementById("consequenceButton");

    if(c.value=="HIDE"){
      c.style.border = '2px solid #D3D3D3';
      document.getElementById("glacierButton").style.border = 'none';
      document.getElementById("currentButton").style.border = 'none';

      const consequence1 = document.getElementById('consequenceHide1');
      consequence1.style.position = 'relative';
      consequence1.style.opacity = '1';

      const consequence2 = document.getElementById('consequenceHide2');
      consequence2.style.position = 'relative';
      consequence2.style.opacity = '1';

      const consequence3 = document.getElementById('consequenceHide3');
      consequence3.style.position = 'relative';
      consequence3.style.opacity = '1';

      const current1 = document.getElementById('curentsHide1');
      current1.style.position = 'absolute';
      current1.style.opacity = '0';

      const current2 = document.getElementById('curentsHide2');
      current2.style.position = 'absolute';
      current2.style.opacity = '0';

      const glacier1 = document.getElementById('glaciersHide1');
      glacier1.style.position = 'absolute';
      glacier1.style.opacity = '0';

      const glacier2 = document.getElementById('glaciersHide2');
      glacier2.style.position = 'absolute';
      glacier2.style.opacity = '0';

      const glacier3 = document.getElementById('glaciersHide3');
      glacier3.style.position = 'absolute';
      glacier3.style.opacity = '0';

      c.value="SHOW";
      document.getElementById("glacierButton").value = 'HIDE';
      document.getElementById("currentButton").value = 'HIDE';
      }
      else if(c.value=="SHOW"){
        c.style.border = 'none';

        const consequence1 = document.getElementById('consequenceHide1');
        consequence1.style.position = 'absolute';
        consequence1.style.opacity = '0';

        const consequence2 = document.getElementById('consequenceHide2');
        consequence2.style.position = 'absolute';
        consequence2.style.opacity = '0';

        const consequence3 = document.getElementById('consequenceHide3');
        consequence3.style.position = 'absolute';
        consequence3.style.opacity = '0';

        c.value="HIDE";
        document.getElementById("glacierButton").value = 'SHOW';
        document.getElementById("currentButton").value = 'SHOW';
      }
}



/*showHideGlaciers() {
  var g = document.getElementById("glacierButton");
  if(g.value=="HIDE"){
    g.style.border = '2px solid #D3D3D3';
    document.getElementById("currentButton").style.border = 'none';
    const glacier1 = document.getElementsByClassName('gClass');
    glacier1.style.position = 'relative';
    glacier1.style.opacity = '1';
    const current1 = document.getElementsByClassName('cClass');
    current1.style.position = 'absolute';
    current1.style.opacity = '0';
    g.value="SHOW";
    document.getElementById("currentButton").value = 'HIDE';
    }
    else if(g.value=="SHOW"){
      g.style.border = 'none';
      const glacier1 = document.getElementsByClassName('gClass');
      glacier1.style.position = 'absolute';
      glacier1.style.opacity = '0';
      g.value="HIDE";
      document.getElementById("currentButton").value = 'SHOW';
    }
}
showHideCurrents() {
  var c = document.getElementById("currentButton");
    if(c.value=="HIDE"){
      c.style.border = '2px solid #D3D3D3';
      document.getElementById("glacierButton").style.border = 'none';
      const current1 = document.getElementsByClassName('cClass');
      current1.style.position = 'relative';
      current1.style.opacity = '1';
      const glacier1 = document.getElementsByClassName('gClass');
      glacier1.style.position = 'absolute';
      glacier1.style.opacity = '0';
      c.value="SHOW";
      document.getElementById("glacierButton").value = 'HIDE';
      }
      else if(c.value=="SHOW"){
        c.style.border = 'none';
        const current1 = document.getElementsByClassName('cClass');
        current1.style.position = 'absolute';
        current1.style.opacity = '0';
        c.value="HIDE";
        document.getElementById("glacierButton").value = 'SHOW';
      }
}*/

  get popover() {
    var glaciers;
    var antarctica;
    var greenland;
    var alaska;
    var currents;
    var overviewCurrents;
    var detailedCurrents;
    var consequences;
    var firstCons;
    var secondCons;
    var thirdCons;

    glaciers = (
      <Button
        block
        smalltext
        id="glacierButton"
        value="HIDE"
        onClick={() => {
          this.showHideGlaciers();
        }}
        className={styles.menuButton}
      >
        <p>
          <MaterialIcon className={styles.buttonIcon} icon="ac_unit" />
        </p>
        Glaciers
      </Button>
    );

    antarctica = (
      <Button
        id = "glaciersHide1"
        class = "gClass"
        block
        smalltext
        onClick={() => {
              this.getSurfaceLayerAntarctica();
        }}
        className={styles.actionButton}
      >
        Antarctica
      </Button>
    );

    greenland = (
      <Button
        id = "glaciersHide2"
        class = "gClass"
        block
        smalltext
        onClick={() => {
          this.getSurfaceLayerGreenland();
      }}
      className={styles.actionButton}
      >
        Greenland
      </Button>

    );

    alaska = (
      <Button
        id = "glaciersHide3"
        class = "gClass"
        block
        smalltext
        className={styles.actionButton}
        onClick={() => {
          this.getSurfaceLayerAlaska();
        }}
      >
        Alaska
      </Button>
    );

    currents = (
      <Button
        block
        smalltext
        id="currentButton"
        value="HIDE"
        onClick={() => {
          this.showHideCurrents();
        }}
        className={styles.menuButton}
      >
        <p>
          <MaterialIcon
            className={styles.buttonIcon}
            //icon="reply_all"
            icon="import_export"
          />
        </p>
        Currents
      </Button>
    );

    overviewCurrents = (
      <Button
        id = "curentsHide1"
        class = "cClass"
        block
        className={styles.actionButton2}
        smalltext
        onClick={() => {
          this.getSurfaceLayerCurrentsOverview();
        }}
      >
        Overview
      </Button>
    );

    detailedCurrents = (
      <Button
        id = "curentsHide2"
        class = "cClass"
        onClick={() => {
          this.getSurfaceLayerCurrentsDetailed();
          //event.target.setAttribute('style', 'position: absolute; opacity: 0;');
        }}
        className={styles.actionButton2}
      >
        Detailed
      </Button>
    );

    consequences = (
      <Button
        block
        smalltext
        id="consequenceButton"
        value="HIDE"
        onClick={() => {
          this.showHideConsequenses();
        }}
        className={styles.menuButton}
      >
        <p>
          <MaterialIcon
            className={styles.buttonIcon}
            //icon="reply_all"
            icon="close"
          />
        </p>
        Consequences
      </Button>
    );

    firstCons = (
      <Button
        id = "consequenceHide1"
        //class = "cClass"
        onClick={() => {
          this.getSurfaceLayerFirstCons();
        }}
        className={styles.actionButton}
      >
        2 meters
      </Button>
    );

    secondCons = (
      <Button
        id = "consequenceHide2"
        //class = "cClass"
        onClick={() => {
          this.getSurfaceLayerSecondCons();
        }}
        className={styles.actionButton}
      >
        4 meters
      </Button>
    );

    thirdCons = (
      <Button
        id = "consequenceHide3"
        //class = "cClass"
        onClick={() => {
          this.getSurfaceLayerThirdCons();
        }}
        className={styles.actionButton}
      >
        6 meters
      </Button>
    );

    return (
      <Popover
        className={`${Picker.Popover} ${styles.climatepanel}`}
        title="What do you want to explore?"
        closeCallback={this.togglePopover}
        detachable
        attached={true}
      >
        <div
          id="actionscroller"
          className={`${Popover.styles.content} ${styles.scroller}`}
        >
          <div className={styles.Grid}>
            {glaciers}
            {currents}
            {consequences}
            {antarctica}
            {greenland}
            {alaska}
            {overviewCurrents}
            {detailedCurrents}
            {firstCons}
            {secondCons}
            {thirdCons}

          </div>
        </div>
      </Popover>
    );
  }

  render() {

    const { popoverVisible } = this.props;

    return (
      <div className={Picker.Wrapper}>
        <Picker onClick={this.togglePopover}>
          <div>
            <MaterialIcon className={styles.bottomBarIcon} icon="ac_unit" />
          </div>
        </Picker>
        {popoverVisible && this.popover}
      </div>
    );
  }
}

const mapSubStateToProps = ({ popoverVisible, luaApi }) => {
  return {
    popoverVisible: popoverVisible,
    luaApi: luaApi,
  };
};

const mapStateToSubState = (state) => ({
  popoverVisible: state.local.popovers.climate.visible,
  luaApi: state.luaApi,
});

const mapDispatchToProps = (dispatch) => ({
  setPopoverVisibility: (visible) => {
    dispatch(
      setPopoverVisibility({
        popover: "climate",
        visible,
      })
    );
  },
});

ClimatePanel = connect(
  subStateToProps(mapSubStateToProps, mapStateToSubState),
  mapDispatchToProps
)(ClimatePanel);
export default ClimatePanel;
