import React from 'react';
import { shallowEqual, useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { Resizable } from 're-resizable';
import Button from '../../common/Input/Button/Button';
import MaterialIcon from '../../common/MaterialIcon/MaterialIcon';
import CenteredLabel from '../../common/CenteredLabel/CenteredLabel';
import SkyBrowserTooltip from './SkyBrowserTooltip';
import SkyBrowserFocusEntry from './SkyBrowserFocusEntry';
import { Icon } from '@iconify/react';
import styles from './SkyBrowserTabs.scss';
import SkyBrowserSettings from './SkyBrowserSettings.jsx'
import {
  reloadPropertyTree,
} from '../../../api/Actions';

function SkyBrowserTabs({ 
  setCurrentTabHeight,
  passMessageToWwt,
  setWwtRatio,
  activeImage,
  currentBrowserColor,
  selectImage,
  maxHeight,
  minHeight,
  height,
  setBorderRadius,
  imageCollectionIsLoaded
}) {
  const [isShowingInfoButtons, setIsShowingInfoButtons] =
    React.useState([false, false, false, false, false]);
  const [showSettings, setShowSettings] = React.useState(false);
  const [messageCounter, setMessageCounter] = React.useState(0);

  const infoButton = React.useRef(null);
  const tabsDiv = React.useRef(null);

  const browsers = useSelector((state) => {
    return state.skybrowser.browsers
  }, shallowEqual);

  const luaApi = useSelector((state) => {
    return state.luaApi
  }, shallowEqual);

  const selectedBrowserId = useSelector((state) => {
    return state.skybrowser.selectedBrowserId
  }, shallowEqual);

  const data = useSelector((state) => {
    const browser = browsers[selectedBrowserId];
    if (!state.skybrowser.imageList || !browser) {
      return [];
    }
    const images = browser.selectedImages;
    if (!images) {
      return [];
    }
    const indices = Object.values(images);
    return indices.map(index => state.skybrowser.imageList[index.toString()]);
  }, shallowEqual);

  const dispatch = useDispatch();

  React.useEffect(() => {
    if (tabsDiv.current) {
      const newHeight = tabsDiv.current.clientHeight;
      setCurrentTabHeight(newHeight);  
    }
  }, [tabsDiv.current]);

  React.useEffect(() => {
    if (imageCollectionIsLoaded) {
      addAllSelectedImages(selectedBrowserId, false);
    }
  }, [imageCollectionIsLoaded]);

  function setSelectedBrowser(browserId) {
    if (browsers === undefined || browsers[browserId] === undefined) {
      return "";
    }
    // Don't pass the selection to OpenSpace as we are only changing images in the GUI
    // This is a result of only having one instance of the WWT application, but making
    // it appear as there are many
    const passToOs = false;
    removeAllSelectedImages(selectedBrowserId, passToOs);
    addAllSelectedImages(browserId, passToOs);
    luaApi.skybrowser.setSelectedBrowser(browserId);
    setWwtRatio(browsers[browserId].ratio);
  }

  function setOpacityOfImage(identifier, opacity, passToOs = true) {
    if(passToOs) {
      luaApi.skybrowser.setOpacityOfImageLayer(selectedBrowserId, Number(identifier), opacity);
    }
    passMessageToWwt({
      event: "image_layer_set",
      id: String(identifier),
      setting: "opacity",
      value: opacity
    });
  }

  function removeImageSelection(identifier, passToOs = true) {
    if(passToOs) {
      luaApi.skybrowser.removeSelectedImageInBrowser(selectedBrowserId, Number(identifier));
    }
    passMessageToWwt({
      event: "image_layer_remove",
      id: String(identifier),
    });
    luaApi.skybrowser.disableHoverCircle();
  }

  function addAllSelectedImages(browserId, passToOs = true) {
    if (browsers === undefined || browsers[browserId] === undefined) {
      return "";
    }
    // Make deep copies in order to reverse later
    const reverseImages = [...browsers[browserId].selectedImages];
    const opacities = [...browsers[browserId].opacities];
    reverseImages.reverse().map((image, index) => {
      selectImage(String(image), passToOs);
      setOpacityOfImage(String(image), opacities.reverse()[index], passToOs);
    });
  }

  function removeAllSelectedImages(browserId, passToOs = true) {
    if (browsers === undefined || browsers[browserId] === undefined) {
      return "";
    }
    browsers[browserId].selectedImages.map(image => {
      removeImageSelection(Number(image), passToOs);
    });
  }

  function positionInfo() {
    if (!infoButton) {
      return { top: '0px', left: '0px' };
    }
    const { top, right } = infoButton.current.getBoundingClientRect();
    return { top: `${top}`, left: `${right}` };
  }

  function showTooltip(i) {
    const isShowingInfoButtonsNew = [...isShowingInfoButtons];
    isShowingInfoButtonsNew[i] = true;
    setIsShowingInfoButtons(isShowingInfoButtonsNew);
  }

  function hideTooltip(i) {
    const isShowingInfoButtonsNew = [...isShowingInfoButtons];
    isShowingInfoButtonsNew[i] = false;
    setIsShowingInfoButtons(isShowingInfoButtonsNew);
  }

  function toggleShowSettings() {
    setShowSettings(!showSettings);
  }

  function setImageLayerOrder(browserId, identifier, order) {
    luaApi.skybrowser.setImageLayerOrder(browserId, identifier, order);
    const reverseOrder = data.length - order - 1;
    passMessageToWwt({
      event: "image_layer_order",
      id: String(identifier),
      order: Number(reverseOrder),
      version: messageCounter
    });
    setMessageCounter(messageCounter + 1);
  }

  function createButtons(browser) {
    const browserId = browser.id;
    const toggleSettings = toggleShowSettings;

    const lookButton = {
      selected: false,
      icon: 'visibility',
      text: 'Look at browser',
      function(browserId) {
        luaApi.skybrowser.adjustCamera(browserId);
      },
    };
    const moveButton = {
      selected: false,
      icon: 'filter_center_focus',
      text: 'Move target to center of view',
      function: function(browserId) {
        luaApi.skybrowser.stopAnimations(browserId);
        luaApi.skybrowser.centerTargetOnScreen(browserId);
      },
    };
    var _this = this;
    const trashButton = {
      selected: false,
      icon: 'delete',
      text: 'Remove all images',
      function: function(browserId) {
        removeAllSelectedImages(browserId);
      },
    };
    const scrollInButton = {
      selected: false,
      icon: 'zoom_in',
      text: 'Zoom in',
      function: function(browserId) {
        luaApi.skybrowser.stopAnimations(browserId);
        const newFov = Math.max(browser.fov - 5, 0.01);
        luaApi.skybrowser.setVerticalFov(browserId, Number(newFov));
      },
    };
    const scrollOutButton = {
      selected: false,
      icon: 'zoom_out',
      text: 'Zoom out',
      function: function(browserId) {
        luaApi.skybrowser.stopAnimations(browserId);
        const newFov = Math.min(browser.fov + 5, 70);
        luaApi.skybrowser.setVerticalFov(browserId, Number(newFov));
      },
    };
    const pointSpaceCraftButton = {
      selected: false,
      icon: 'eos-icons:satellite-alt',
      iconify: true,
      text: 'Point spacecraft',
      function: function(browserId) {
        luaApi.skybrowser.pointSpaceCraft(browserId);
      },
    };
    const showSettingsButton = {
      selected: showSettings,
      icon: 'settings',
      text: 'Settings',
      function: function(browserId) {
        toggleSettings();
      },
    };

    const buttonsData = [lookButton, moveButton, scrollInButton, scrollOutButton, pointSpaceCraftButton, trashButton, showSettingsButton];

    const buttons = buttonsData.map((button, index) => (
      <Button
        key={index}
        onClick={() => {
          button.function(browserId);
        }}
        onMouseOut={() => hideTooltip(index)}
        className={button.selected ? styles.tabButtonActive : styles.tabButtonInactive}
        transparent
        small
      >
        {button.iconify ?
          <Icon
            icon={button.icon}
            rotate={2}
            onMouseOver={() => showTooltip(index)}
          />
          :
        <MaterialIcon
          icon={button.icon}
          className="medium"
          onMouseOver={() => showTooltip(index)}
        />}
        {isShowingInfoButtons[index] && (
          <SkyBrowserTooltip placement="bottom-right" style={positionInfo()}>
            {button.text}
          </SkyBrowserTooltip>
        )}
      </Button>
    ));

    return (
      <span
        className={styles.tabButtonContainer}
        ref={(element) => infoButton.current = element}
        >
        {buttons}
      </span>
    );
  }

  function createTargetBrowserPair() {
    luaApi.skybrowser.createTargetBrowserPair();
    setWwtRatio(1);
    // TODO: Once we have a proper way to subscribe to additions and removals
    // of property owners, this 'hard' refresh should be removed.
    setTimeout(() => {
      dispatch(reloadPropertyTree());
    }, 500);
  }

  function removeTargetBrowserPair(browserId) {
    let ids = Object.keys(browsers);
    if(ids.length > 1) {
      const index = ids.indexOf(browserId);
      if (index > -1) {
        ids.splice(index, 1); // 2nd parameter means remove one item only
      }
      setSelectedBrowser(ids[0]);
    }
    luaApi.skybrowser.removeTargetBrowserPair(browserId);
    // TODO: Once we have a proper way to subscribe to additions and removals
    // of property owners, this 'hard' refresh should be removed.
    setTimeout(() => {
      dispatch(reloadPropertyTree());
    }, 2000);
    
  }

  function createTabs() {
    const buttons = browsers[selectedBrowserId] && createButtons(browsers[selectedBrowserId]);

    const allTabs = Object.keys(browsers).map((browser, index) => {
      const browserColor = `rgb(${browsers[browser].color})`;
      return (
        <div
          key={index}
          style={
            selectedBrowserId === browser
              ? { borderTopRightRadius: '4px', borderTop: `3px solid ${browserColor}` }
              : {}
          }
        >
          <div
            className={selectedBrowserId === browser ? styles.tabActive : styles.tabInactive}
            onClick={(e) => {
              if (!e) var e = window.event;
              e.cancelBubble = true;
              if (e.stopPropagation) e.stopPropagation();
              if(selectedBrowserId !== browser) {
                setSelectedBrowser(browser)}
              }
            }
          >
            <span className={styles.tabHeader}>
              <span className={styles.tabTitle}>{browsers[browser].name}</span>
              <Button
                onClick={(e) => {
                  if (!e) var e = window.event;
                  e.cancelBubble = true;
                  if (e.stopPropagation) e.stopPropagation();
                  removeTargetBrowserPair(browser);
                }}
                className={styles.closeTabButton}
                transparent
                small
              >
                <MaterialIcon icon="close" className="small" />
              </Button>
            </span>
            {selectedBrowserId === browser && buttons}
          </div>
        </div>
      );
    });

    return (
      <div className={styles.navTabs}>
        {allTabs}
        <Button
          onClick={() => createTargetBrowserPair()}
          className={styles.addTabButton}
          transparent
        >
          <MaterialIcon icon="add" />
        </Button>
      </div>
    );
  }

  function createImageList() {
    return (
      <ul>
        {data.map((entry, index) => (
          <div key={index}>
            {index == 0 ? (
              <span />
            ) : (
              <Button
                onClick={() => setImageLayerOrder(selectedBrowserId, Number(entry.identifier), index - 1)}
                className={styles.arrowButton}
                transparent
              >
                <MaterialIcon icon="keyboard_arrow_left" />
              </Button>
            )}
            <SkyBrowserFocusEntry
              {...entry}
              luaApi={luaApi}
              key={entry.identifier}
              onSelect={selectImage}
              removeImageSelection={removeImageSelection}
              opacity={browsers[selectedBrowserId].opacities[index]}
              setOpacity={setOpacityOfImage}
              currentBrowserColor={currentBrowserColor}
              isActive={activeImage === entry.identifier}
            />
            {index === data.length - 1 ? (
              <span className={styles.arrowButtonEmpty} />
            ) : (
              <Button
                onClick={() =>  setImageLayerOrder(selectedBrowserId, Number(entry.identifier), index + 1)}
                className={styles.arrowButton}
                transparent
              >
                <MaterialIcon icon="keyboard_arrow_right" />
              </Button>
            )}
          </div>
        ))}
      </ul>
    );
  }
    
  let content = "";
  if (showSettings) {
    content = (
      <SkyBrowserSettings
        browser={browsers[selectedBrowserId]}
        selectedBrowserId={selectedBrowserId}
        luaApi={luaApi}
        setBorderRadius={setBorderRadius}
      />);
  } else if (data.length === 0) {
    content = (
      <CenteredLabel>
        There are no selected images in this sky browser
      </CenteredLabel>
    );
  } else {
    content = createImageList();
  }

  return (
    <section className={styles.tabContainer} ref={(element) => tabsDiv.current = element}>
      <Resizable
        enable={{ top: true, bottom: false }}
        handleClasses={{ top: styles.topHandle }}
        minHeight={minHeight}
        maxHeight={maxHeight}
        onResizeStop={() => {
          setCurrentTabHeight(tabsDiv.current.clientHeight);
        }}
        defaultSize={{width: 'auto', height: height}}
        height={height}
      >
        {createTabs()}
        <div className={`${styles.tabContent} ${styles.tabContainer}`}>
          {content}
        </div>
      </Resizable>
    </section>
  );

}

SkyBrowserTabs.propTypes = {
  children: PropTypes.node,
  viewComponentProps: PropTypes.object,
};

SkyBrowserTabs.defaultProps = {
  children: '',
  viewComponentProps: {},
};

export default SkyBrowserTabs;
