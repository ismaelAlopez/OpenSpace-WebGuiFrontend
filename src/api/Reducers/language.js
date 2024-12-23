import actionTypes from '../Actions/actionTypes';

const initialState = {
  language: 'en'
};

const language = (state = initialState, action = {}) => {
  switch (action.type) {
    case actionTypes.setLanguage:
      return {
        ...state,
        language: action.payload
      };
    default:
      return state;
  }
};

export default language;
