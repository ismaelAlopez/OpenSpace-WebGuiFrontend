import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import React, { Component } from 'react';
import {
  withRouter, HashRouter as Router, Route, Link,
} from 'react-router-dom';


import { formatVersion, isCompatible, RequiredOpenSpaceVersion, RequiredSocketApiVersion } from '../api/Version';

import KeybindingPanel from '../components/BottomBar/KeybindingPanel';

import '../styles/base.scss';
import Error from '../components/common/Error/Error';
import Overlay from '../components/common/Overlay/Overlay';
import BottomBar from '../components/BottomBar/BottomBar';
import Button from '../components/common/Input/Button/Button';
import Stack from '../components/common/Stack/Stack';
import ActionsPanel from '../components/BottomBar/ActionsPanel';
import Sidebar from '../components/Sidebar/Sidebar';
import NodeMetaContainer from '../components/NodeMetaPanel/NodeMetaContainer';
import NodePopOverContainer from '../components/NodePropertiesPanel/NodePopOverContainer';
import TouchBar from '../components/TouchBar/TouchBar';
import ExploreClimate from '../components/climate/exploreClimate'

import {
  setPropertyValue, startConnection, fetchData, addStoryTree, subscribeToProperty,
  unsubscribeToProperty, addStoryInfo, resetStoryInfo,
} from '../api/Actions';


import {
  ValuePlaceholder, DefaultStory, ScaleKey,
  NavigationAnchorKey,InfoIconKey, ZoomInLimitKey, ZoomOutLimitKey,
} from '../api/keys'


import StartJourney from '../components/Climate/startJourney'

import styles from './OnClimateGui.scss';
import { UpdateDeltaTimeNow } from '../utils/timeHelpers';

import {
  toggleShading, toggleHighResolution, toggleShowNode, toggleGalaxies,
  setStoryStart, showDevInfoOnScreen, storyFileParserClimate, infoFileParserClimate, flyTo, DataLoader,
} from '../utils/storyHelpers';
//import  climate_stories from "../../stories/stories.json";
//------------------------------------------------------------------------------//
const KEYCODE_D = 68;


class OnClimateGui extends Component {
  constructor(props) {
    super(props);
    this.checkedVersion = false;
    this.state = {
      developerMode: false,
      currentStory: "default",
      sliderStartStory: DefaultStory,

      startJourney: "default",
    };
    this.changeStory = this.changeStory.bind(this);
    this.addStoryTree = this.addStoryTree.bind(this);
    this.setStory = this.setStory.bind(this);

    this.resetStory = this.resetStory.bind(this);


  }

// where we call api
 componentDidMount() {
    this.setState({ data: [] });
    const { luaApi, FetchData, StartConnection } = this.props;
    StartConnection();
    //FetchData(InfoIconKey);

    //showDevInfoOnScreen(luaApi, false);
  }





 setStory(selectedStory) {
    const {
      changePropertyValue, luaApi, scaleNodes, story, storyIdentifier, currentStory
    } = this.props;
    const previousStory = currentStory;
    this.setState({ currentStory: selectedStory });
    this.setState({json: getJson});
    // Return if the selected story is the same as the OpenSpace property value
    if (previousStory === selectedStory) {
      return;
    }
    getJson = this.addStoryTree(selectedStory);


    // Set all the story specific properties
    //changePropertyValue(anchorNode.description.Identifier, json.start.planet);
    setStoryStart(luaApi, getJson.start.location, getJson.start.date);



    //changePropertyValue(anchorNode.description.Identifier, json.start.planet);
    // Check settings of the previous story and reset values
    this.checkStorySettings(story, true);
    // Check and set the settings of the current story
    this.checkStorySettings(getJson, false);
  }


  checkStorySettings(story, value) {
    const { luaApi } = this.props;

    const oppositeValue = !value;
    if (story.hidenodes) {
      story.hidenodes.forEach(node => toggleShowNode(luaApi, node, value));
    }

  }

  // Read in json-file for new story and add it to redux
  addStoryTree(selectedStory) {
    const { AddStoryTree, AddStoryInfo, ResetStoryInfo } = this.props;
    const storyFile = storyFileParserClimate(selectedStory);

    AddStoryTree(storyFile);


    return storyFile;
  }

  changeStory(e) {
    this.setStory(e.target.id);
  }

  resetStory() {
    const { luaApi } = this.props;
    const { currentStory } = this.state;


    this.setState({startJourney: currentStory});
    UpdateDeltaTimeNow(luaApi, 1);
    this.setStory(DefaultStory);
  }

  render() {
    //let storyIdentifier = [];
    const { connectionLost, story, storyIdentifier  } = this.props;
    const { currentStory, startJourney} = this.state;


    
    return (

      <div className={styles.app}>

        { connectionLost && (
          <Overlay>
            <Error>
              Connection lost. Trying to reconnect again soon.
            </Error>

          </Overlay>
        )}


        <p className={styles.storyTitle}>
          {this.state.data}
        </p>
        <section className={styles.Grid__Left}>


        {(currentStory === DefaultStory)
          ? <StartJourney startNewJourney = {startJourney} changeStory={this.setStory}  />
          : <ExploreClimate resetStory={this.resetStory} changeStory={this.changeStory} currentStory ={currentStory}  />
        }
        <Sidebar/>
        </section>
        <section className={styles.Grid__Right}>
          <NodePopOverContainer/>
          <NodeMetaContainer/>

          <KeybindingPanel />
        </section>


      </div>
    );
}
}
const mapStateToProps = state => {
  let storyIdentifier = [];
  let anchorNode;
  const scaleNodes = [];
  const story = state.storyTree.story;

  if (state.propertyTree !== undefined) {
    storyIdentifier = story.identifier;
    anchorNode = state.propertyTree.properties[NavigationAnchorKey];

    if (story.scalenodes) {
      story.scalenodes.nodes.forEach((node) => {
        const key = ScaleKey.replace(ValuePlaceholder, `${node}`);
        const foundScaleNode = state.propertyTree.properties[key];

        if (foundScaleNode) {
          scaleNodes.push(foundScaleNode);
        }
      });
    }
  }
  return {
    storyIdentifier,
    connectionLost: state.connection.connectionLost,
    story,
    reset: state.storyTree.reset,
    anchorNode,
    scaleNodes,
    luaApi: state.luaApi,
  };
};

const mapDispatchToProps = dispatch => ({
  changePropertyValue: (uri, value) => {
    dispatch(setPropertyValue(uri, value));
  },
  triggerActionDispatcher: (action) => {
    dispatch(triggerAction(action));
  },
  /*FetchData: (id) => {
    dispatch(fetchData(id));
  },*/
  AddStoryTree: (story) => {
    dispatch(addStoryTree(story));
  },
  AddStoryInfo: (info) => {
    dispatch(addStoryInfo(info));
  },
  ResetStoryInfo: () => {
    dispatch(resetStoryInfo());
  },
  startListening: (uri) => {
    dispatch(subscribeToProperty(uri));
  },
  stopListening: (uri) => {
    dispatch(unsubscribeToProperty(uri));
  },
});
OnClimateGui = withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(OnClimateGui));













// ----------------------------------




class RequireLuaApi extends Component {
  componentDidMount() {
    const { StartConnection } = this.props;
    StartConnection();
  }

  render() {
    const { children, luaApi } = this.props;
    if (!luaApi) {
      return null;
    }
    return <>{children}</>;
  }
}

const mapState = state => ({
  luaApi: state.luaApi,
});

const mapDispatch = dispatch => ({
  StartConnection: () => {
    dispatch(startConnection());
  },
});

RequireLuaApi = connect(mapState, mapDispatch)(RequireLuaApi);

const WrappedOnClimateGui = props => <RequireLuaApi><OnClimateGui {...props} /></RequireLuaApi>;

OnClimateGui.propTypes = {
  StartConnection: PropTypes.func,
  //FetchData: PropTypes.func,
  changePropertyValue: PropTypes.func,
  AddStoryTree: PropTypes.func,
  AddStoryInfo: PropTypes.func,
  ResetStoryInfo: PropTypes.func,
  storyIdentifier: PropTypes.objectOf(PropTypes.shape({})),
  story: PropTypes.objectOf(PropTypes.shape({})),
  scaleNodes: PropTypes.objectOf(PropTypes.shape({})),
  connectionLost: PropTypes.bool,
  setStory: PropTypes.func,

};

OnClimateGui.defaultProps = {
  StartConnection: () => {},
  //FetchData: () => {},
  changePropertyValue: () => {},
  AddStoryTree: () => {},
  AddStoryInfo: () => {},
  ResetStoryInfo: () => {},
  storyIdentifier: {},
  story: {},

  scaleNodes: {},
  connectionLost: null
};

export default WrappedOnClimateGui;
