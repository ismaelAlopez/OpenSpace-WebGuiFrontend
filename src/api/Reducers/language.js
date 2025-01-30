import actionTypes from '../Actions/actionTypes';
const initialState = {
  language: 'en'
};
let language = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.setLanguage:
      console.info('Dispatched action: ', JSON.stringify(action));
      return {
        ...state,
        language: action.payload
      };
    default:
      return state;
  }
};

export default language;
