import React from 'react';
import PropTypes from 'prop-types';
import ActionsPanel from './ActionsPanel';
import styles from './BottomBar.scss';
import ExoplanetsPanel from './ExoplanetsPanel';
import FlightControlPanel from './FlightControlPanel';
import OriginPicker from './Origin/OriginPicker';
import ScreenSpaceRenderablePanel from './ScreenSpaceRenderablePanel';
import SessionRec from './SessionRec';
import TimePicker from './TimePicker';
import SkyBrowserPanel from './SkyBrowserPanel';
import FlightSettings from './FlightSettings';

const BottomBar = (props) => (
  <div className={styles.BottomBar}>
    <OriginPicker />
    <TimePicker />
    <SessionRec />
    <ScreenSpaceRenderablePanel />
    <ExoplanetsPanel />
    <ActionsPanel />
    {props.showFlightController && <FlightControlPanel />}
    <SkyBrowserPanel />
  </div>
);

BottomBar.propTypes = {
  showFlightController: PropTypes.bool,
};

BottomBar.defaultProps = {
  showFlightController: false,
};

export default BottomBar;
