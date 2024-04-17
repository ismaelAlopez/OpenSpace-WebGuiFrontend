import {
  initializeUserPanels
} from '../Actions';
import actionTypes from '../Actions/actionTypes';
import api from '../api';

const getUserPanels = async (luaApi, callback) => {
  let slash = (navigator.platform.indexOf('Win') > -1) ? "\\" : "/";
  const panelPath = await luaApi.absPath("${USER}/webpanels")
  const panelList = await luaApi.walkDirectoryFolders(panelPath[1]);
  let newList = {}
  if (panelList[1]) {
    newList = Object.values(panelList[1]).map((panel) => ({
      name: panel.substr(panel.lastIndexOf(slash) + 1), path: panel
    }));
  }
    
  callback(newList);
};

const userPanels = (store) => (next) => (action) => {
  const result = next(action);
  switch (action.type) {
    case actionTypes.loadUserPanelData:
      getUserPanels(action.payload, (data) => {
        store.dispatch(initializeUserPanels(data));
      });
      break;
    default:
      break;
  }
  return result;
};
export default userPanels;
