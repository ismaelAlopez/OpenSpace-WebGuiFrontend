import React from 'react';
import { MdInsertPhoto } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';

import { setPopoverVisibility } from '../../api/Actions';
import CenteredLabel from '../common/CenteredLabel/CenteredLabel';
import HorizontalDelimiter from '../common/HorizontalDelimiter/HorizontalDelimiter';
import Button from '../common/Input/Button/Button';
import Input from '../common/Input/Input/Input';
import Popover from '../common/Popover/Popover';
import Row from '../common/Row/Row';
import ScrollOverlay from '../common/ScrollOverlay/ScrollOverlay';
import PropertyOwner from '../Sidebar/Properties/PropertyOwner';
import { getTranslation } from '../../utils/translation';

import Picker from './Picker';

import styles from './ScreenSpaceRenderablePanel.scss';

function ScreenSpaceRenderablePanel() {
  const language = useSelector((state) => state.language.language);
  const [slideName, setSlideName] = React.useState(undefined);
  const [slideURL, setSlideURL] = React.useState(undefined);

  const luaApi = useSelector((state) => state.luaApi);
  const popoverVisible = useSelector(
    (state) => state.local.popovers.screenSpaceRenderables.visible
  );
  // Access the propertyOwners state so that useSelector is triggered by updates
  const propertyOwners = useSelector((state) =>
    state.propertyTree.propertyOwners ? state.propertyTree.propertyOwners : []
  );
  const renderables = propertyOwners?.ScreenSpace?.subowners ?? [];

  const dispatch = useDispatch();

  function togglePopover() {
    dispatch(
      setPopoverVisibility({
        popover: 'screenSpaceRenderables',
        visible: !popoverVisible
      })
    );
  }

  function updateSlideName(evt) {
    setSlideName(evt.target.value);
  }

  function updateSlideURL(evt) {
    setSlideURL(evt.target.value);
  }

  function addSlide() {
    const renderable = {
      Identifier: slideName,
      Name: slideName
    };

    if (slideURL.indexOf('http') !== 0) {
      renderable.Type = 'ScreenSpaceImageLocal';
      renderable.TexturePath = slideURL;
    } else {
      renderable.Type = 'ScreenSpaceImageOnline';
      renderable.URL = slideURL;
    }

    luaApi.addScreenSpaceRenderable(renderable);
  }

  function popover() {
    let slideNameLabel = <span>{getTranslation(language, 'SlideNameLabel')}</span>;
    const slideURLLabel = <span>URL</span>;
    let noSlidesLabel = <CenteredLabel>{getTranslation(language, 'NoSlidesLabel')}</CenteredLabel>;

    let slideContent;
    if (renderables.length === 0) {
      slideContent = noSlidesLabel;
    } else {
      slideContent = renderables.map((prop) => (
        <PropertyOwner key={prop} uri={prop} expansionIdentifier={`P:${prop}`} />
      ));
    }

    return (
      <Popover
        className={Picker.Popover}
        title={getTranslation(language, 'ScreenSpaceRenderables')}
        closeCallback={() => togglePopover()}
        detachable
        attached
      >
        <div className={Popover.styles.content}>
          <Row>
            <Input
              value={slideName}
              label={slideNameLabel}
              placeholder={getTranslation(language, 'SlidePlaceholder')}
              onChange={(evt) => updateSlideName(evt)}
            />
            <div className='urlbox'>
              <Input
                value={slideURL}
                label={slideURLLabel}
                placeholder='URL'
                onChange={(evt) => updateSlideURL(evt)}
              />
            </div>
            <div className={Popover.styles.row}>
              <Button
                onClick={addSlide}
                title={getTranslation(language, 'AddSlide')}
                style={{ width: 90 }}
                disabled={!slideName || !slideURL}
              >
                <MdInsertPhoto alt='insert_photo' />
                <span style={{ marginLeft: 5 }}>{getTranslation(language, 'AddSlide')}</span>
              </Button>
            </div>
          </Row>
        </div>
        <HorizontalDelimiter />
        <div className={Popover.styles.title}>{getTranslation(language, 'Slides')} </div>
        <div className={styles.slideList}>
          <ScrollOverlay>{slideContent}</ScrollOverlay>
        </div>
      </Popover>
    );
  }

  return (
    <div className={Picker.Wrapper}>
      <Picker
        className={`${popoverVisible && Picker.Active}`}
        onClick={togglePopover}
        refKey='ScreenSpaceRenderable'
      >
        <div>
          <MdInsertPhoto className={Picker.Icon} alt='screenspacerenderable' />
        </div>
      </Picker>
      {popoverVisible && popover()}
    </div>
  );
}

export default ScreenSpaceRenderablePanel;
