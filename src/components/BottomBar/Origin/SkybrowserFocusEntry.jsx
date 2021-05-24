import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './SkybrowserFocusEntry.scss';
import Picker from '../Picker';
import Button from '../../common/Input/Button/Button';
import MaterialIcon from '../../common/MaterialIcon/MaterialIcon';
import InfoBoxSkybrowser from '../../common/InfoBox/InfoBoxSkybrowser';
import TooltipSkybrowser from '../../common/Tooltip/TooltipSkybrowser';
import { jsonToLuaString } from '../../../utils/propertyTreeHelpers';
import SkybrowserTabs from '../../common/Tabs/SkybrowserTabs';

//import { clamp } from 'lodash/number';


class SkybrowserFocusEntry extends Component {
  constructor(props) {
    super(props);
    this.state = {selectedImageBorderColor: ''}
    this.select = this.select.bind(this);
    this.setBorderColor = this.setBorderColor.bind(this);
  }

  setBorderColor() {
    const color = this.props.currentTargetColor();
    this.setState({ selectedImageBorderColor: color == "" ? 'red' : 'rgb(' + color + ')' });
  }

  select(evt) {
    const { identifier } = this.props;
    if (this.props.onSelect) {
      this.props.onSelect(identifier, evt);
    }

    this.props.currentTargetColor ? this.setBorderColor() : null;

  }


  get isActive() {
    return this.props.identifier === this.props.active;
  }

  render() {
    const { name, identifier, thumbnail, credits, creditsUrl, has3dCoords } = this.props;
    const image3dbutton = has3dCoords ? <MaterialIcon
      icon={'add_circle'}
      style={{fontSize: '15px'}}
      onClick={() => {this.props.add3dImage(identifier)}}>
      </MaterialIcon> : "";
    const imageRemoveButton = this.props.removeImageSelection ? <MaterialIcon
      icon={'highlight_off'}
      style={{fontSize: '15px'}}
      onClick={() => {this.props.removeImageSelection(identifier)}}>
      </MaterialIcon> : "";

    return (

      <li className={`${styles.entry} ${this.isActive && styles.active}`}
          style={{ borderLeftColor: this.state.selectedImageBorderColor }}
          onMouseEnter={() => {this.props.hoverFunc(this.props.identifier)} }
          onMouseLeave={() => {this.props.hoverLeavesImage()}}>
          <div className={styles.image}>
            <img src={thumbnail} alt={name} onClick={this.select}/>
          </div>
          <div className={styles.imageHeader}>
            <span
            className={styles.imageTitle}>
              { name || identifier }
            </span>
            <InfoBoxSkybrowser
              title={(name || identifier)}
              text={credits}
              textUrl={creditsUrl}>
            </InfoBoxSkybrowser>
          </div>
          {image3dbutton}
          {imageRemoveButton}
      </li>
    );
  }
}

SkybrowserFocusEntry.propTypes = {
  identifier: PropTypes.string.isRequired,
  name: PropTypes.string,
  onSelect: PropTypes.func,
  active: PropTypes.string,
};

SkybrowserFocusEntry.defaultProps = {
  onSelect: null,
  active: '',
};

export default SkybrowserFocusEntry;
