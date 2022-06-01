import PropTypes from 'prop-types';
import React, { Component } from 'react';
import CenteredLabel from '../../common/CenteredLabel/CenteredLabel';
import styles from '../../Climate/Button.scss';
import StoryButton from './StoryButtonLocal';

class Pick extends Component {
  constructor(props) {
    super(props);

    this.handleStory = this.handleStory.bind(this);

  }

  handleStory(e) {
    console.log("hej");
    this.props.changeStory(e.target.id);
    this.props.setShowStory(false);

  }



  render() {

    const { climateStorys, next } = this.props;

    return (

            <StoryButton
              pickStory={this.handleStory}
              next = {this.resetLocalStory}
              storyIdentifier= {climateStorys.title}
            />

    );
  }
}



Pick.propTypes = {
  setShowStory: PropTypes.func.isRequired,
  changeStory: PropTypes.func.isRequired,
  climateStorys: PropTypes.shape({
    title: PropTypes.string,
    info: PropTypes.string,
    next: PropTypes.func,
  }).isRequired,
};

export default Pick;
