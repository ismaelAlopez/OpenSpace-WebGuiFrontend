import React from 'react';
import { MdClose } from 'react-icons/md';
import { Rnd as ResizeableDraggable } from 'react-rnd';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useLocalStorageState } from '../../utils/customHooks';
import Button from '../common/Input/Button/Button';
import Checkbox from '../common/Input/Checkbox/Checkbox';
import { getTranslation } from '../../utils/translation';
import contents from './GettingStartedContent.json';
import contentsES from './GettingStartedContentES.json';
import Goal from './Goal';
import MouseDescriptions from './MouseDescriptions';
import openspaceLogo from './openspace-color-transparent.png';

import styles from './TourPopup.scss';

function TourPopup({ setVisibility, isVisible }) {
  const language = useSelector((state) => state.language.language);
  const [currentSlide, setCurrentSlide] = useLocalStorageState('currentSlide', 0);
  const [isFulfilled, setIsFulfilled] = React.useState(false);
  // verifies the language and assigns the correct content
  if (language === 'es') {
    contents = contentsES;
  }
  const content = contents[currentSlide];
  const isLastSlide = currentSlide === contents.length - 1;
  const isFirstSlide = currentSlide === 0;
  const defaultSize = { width: 500, height: 350 };
  const offsetFromGrid = 300;
  const centerX = window.innerWidth * 0.5 - defaultSize.width * 0.5 - offsetFromGrid;
  const centerY = window.innerHeight * 0.5 - defaultSize.height * 0.5;
  const centerOfScreen = { x: centerX, y: centerY };
  return (
    isVisible && (
      <>
        {Boolean(content.position) && !isFulfilled && (
          <div className={`${styles.animatedBorder} ${styles.geoPositionBox}`} />
        )}
        <ResizeableDraggable
          default={{
            ...centerOfScreen,
            ...defaultSize
          }}
          minWidth={defaultSize.width}
          minHeight={defaultSize.height}
          bounds='window'
          className={styles.window}
        >
          <div className={styles.content}>
            <div className={styles.spaceBetweenContent}>
              <h1 className={styles.title}>{content.title}</h1>
              <Button onClick={() => setVisibility(false)} transparent small>
                <MdClose />
              </Button>
            </div>
            {isFirstSlide && (
              <div className={styles.centerContent}>
                <img src={openspaceLogo} className={styles.logo} alt='OpenSpace logo' />
              </div>
            )}
            <p className={styles.text}>{content.firstText}</p>
            <Goal content={content} setIsFulfilled={setIsFulfilled} />
            <p
              className={` ${styles.text} ${styles.infoText}`}
              style={isFulfilled ? { paddingTop: '40px' } : undefined}
            >
              {content.infoText}
            </p>
            {content.showMouse && !isFulfilled && (
              <div className={styles.scroll}>
                {content.showMouse.map((mouseData) => (
                  <MouseDescriptions key={mouseData.info} {...mouseData} />
                ))}
              </div>
            )}
            {content.bulletList &&
              content.bulletList.map((text) => (
                <li key={text} className={styles.text}>
                  {text}
                </li>
              ))}
            {isLastSlide && (
              <>
                <div style={{ display: 'flex' }}>
                  <p className={styles.text}>
                    {getTranslation(language, 'Click')}{' '}
                    <Button
                      style={{ margin: '10px' }}
                      onClick={() =>
                        window.open(
                          'http://wiki.openspaceproject.com/docs/tutorials/users/',
                          'Tutorials'
                        )
                      }
                    >
                      {getTranslation(language, 'Here')}
                    </Button>
                    {getTranslation(language, 'MoreInfo')}
                  </p>
                </div>
                <Checkbox
                  checked
                  setChecked={() => {
                    // TODO: save this setting between runs
                  }}
                  style={{ marginTop: 'auto' }}
                >
                  <p>{getTranslation(language, 'dontShow')}</p>
                </Checkbox>
              </>
            )}
            <div
              className={`${styles.buttonContainer} ${styles.spaceBetweenContent}`}
              style={isFirstSlide ? { justifyContent: 'flex-end' } : {}}
            >
              {!isFirstSlide && (
                <Button onClick={() => setCurrentSlide(currentSlide - 1)}>
                  {getTranslation(language, 'Prev')}
                </Button>
              )}
              <Button
                onClick={() => {
                  if (isLastSlide) {
                    setVisibility(false);
                    setCurrentSlide(0);
                  } else {
                    setCurrentSlide(currentSlide + 1);
                  }
                }}
                className={styles.nextButton}
              >
                {!isLastSlide
                  ? getTranslation(language, 'Next')
                  : getTranslation(language, 'Finish')}
              </Button>
            </div>
          </div>
          <div
            className={styles.progressBarContent}
            style={{
              width: `${(100 * currentSlide) / (contents.length - 1)}%`,
              borderBottomRightRadius: `${isLastSlide ? 3 : 0}px`
            }}
          />
        </ResizeableDraggable>
      </>
    )
  );
}

TourPopup.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  setVisibility: PropTypes.func.isRequired
};

TourPopup.defaultProps = {};

export default TourPopup;
