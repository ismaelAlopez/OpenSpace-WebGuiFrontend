import React from 'react';
import { connect } from 'react-redux';

import LoadingString from '../../components/common/LoadingString/LoadingString';
import Row from '../../components/common/Row/Row';
import { getTranslation } from '../../utils/translation';
import { useSelector } from 'react-redux';
import logo from './logo.png';

import styles from './About.scss';

const openSpaceVersion = (props) => {
  const language = useSelector((state) => state.language.language);
  const formatVersion = (version) =>
    version.major != 255 && version.minor != 255 && version.patch != 255
      ? `${version.major}.${version.minor}.${version.patch}`
      : 'Custom';

  const currentVersion = (
    <p>
      {getTranslation(language, 'Version')}{' '}
      {props.hasVersion ? formatVersion(props.version.openSpaceVersion) : <LoadingString loading />}
    </p>
  );

  return <>{currentVersion}</>;
};

function About(props) {
  const language = useSelector((state) => state.language.language);
  return (
    <Row className={styles.about}>
      <section>
        <img src={logo} alt='OpenSpace Logo' className={styles.img} />
      </section>
      <section>
        <h1>OpenSpace</h1>
        <p>{getTranslation(language, 'OpenSpaceDesc')}</p>
        {openSpaceVersion(props)}
        <p>
          {getTranslation(language, 'Footer')}
          <br />
          openspaceproject.com
        </p>
      </section>
    </Row>
  );
}

const mapStateToProps = (state) => ({
  hasVersion: state.version.isInitialized,
  version: state.version.data
});

About = connect(mapStateToProps)(About);

export default About;
