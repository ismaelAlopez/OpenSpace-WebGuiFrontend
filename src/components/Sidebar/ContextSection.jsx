import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import { NavigationAimKey, NavigationAnchorKey, ScenePrefixKey } from '../../api/keys';
import { getTranslation } from '../../utils/translation';
import PropertyOwner from './Properties/PropertyOwner';

function ContextSection({ expansionIdentifier }) {
  const language = useSelector((state) => state.language.language);
  const aim = useSelector((state) => {
    const aimProp = state.propertyTree.properties[NavigationAimKey];
    return aimProp && aimProp.value !== '' && ScenePrefixKey + aimProp.value;
  });

  const aimName = useSelector((state) => {
    if (aim) {
      const aimNode = state.propertyTree.propertyOwners[aim];
      return aimNode ? aimNode.name : aim;
    }

    return '';
  });

  const anchor = useSelector((state) => {
    const anchorProp = state.propertyTree.properties[NavigationAnchorKey];
    return anchorProp && anchorProp.value !== '' && ScenePrefixKey + anchorProp.value;
  });

  const anchorName = useSelector((state) => {
    if (anchor) {
      const anchorNode = state.propertyTree.propertyOwners[anchor];
      return anchorNode ? anchorNode.name : anchor;
    }

    return '';
  });

  const focusOrAnchor = aim
    ? getTranslation(language, 'Anchor')
    : getTranslation(language, 'Focus');
  return (
    <>
      {anchor && (
        <PropertyOwner
          expansionIdentifier={`${expansionIdentifier}/anchor`}
          name={`${getTranslation(language, 'Current')} ${focusOrAnchor}: ${anchorName}`}
          uri={anchor}
        />
      )}
      {aim && (
        <PropertyOwner
          expansionIdentifier={`${expansionIdentifier}/aim`}
          name={`${getTranslation(language, 'CurrentAim')} ${aimName}`}
          uri={aim}
        />
      )}
    </>
  );
}

ContextSection.propTypes = {
  expansionIdentifier: PropTypes.string.isRequired
};

export default ContextSection;
