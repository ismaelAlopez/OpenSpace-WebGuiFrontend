import React from 'react';
import { MdExitToApp, MdKeyboard, MdMoreVert } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import { setPopoverVisibility, setShowAbout, setLanguage } from '../../api/Actions';
import api from '../../api/api';
import environment from '../../api/Environment';
import HorizontalDelimiter from '../common/HorizontalDelimiter/HorizontalDelimiter';
import Button from '../common/Input/Button/Button';
import Popover from '../common/Popover/Popover';
import { useContextRefs } from '../GettingStartedTour/GettingStartedContext';
// getTranslation is a function that returns the translation of a given key in a given language
import { getTranslation } from '../../utils/translation';
import styles from './SystemMenu.scss';

function SystemMenu({ showTutorial }) {
  const [showMenu, setShowMenu] = React.useState(false);
  const refs = useContextRefs();
  const luaApi = useSelector((state) => state.luaApi);
  const keybindsIsVisible = useSelector((state) => state.local.popovers.keybinds.visible);
  const language = useSelector((state) => state.language.language);

  const dispatch = useDispatch();

  const openlinkScript = (url) => {
    let startString = 'open';
    if (navigator.platform === 'Win32') {
      startString = 'start';
    }
    const script = `os.execute('${startString} ${url}')`;
    return script;
  };

  function onClick(func, value) {
    setShowMenu(!showMenu);
    func(value);
  }

  function quit() {
    if (!luaApi) {
      return;
    }
    luaApi.toggleShutdown();
  }

  async function showLuaConsole() {
    if (!luaApi) {
      return;
    }
    const data = await luaApi.propertyValue('LuaConsole.IsVisible');
    const visible = data[1] || false;
    luaApi.setPropertyValue('LuaConsole.IsVisible', !visible);
  }

  async function nativeGui() {
    if (!luaApi) {
      return;
    }
    const data = await luaApi.propertyValue('Modules.ImGUI.Enabled');
    const visible = data[1] || false;
    luaApi.setPropertyValue('Modules.ImGUI.Enabled', !visible);
  }

  function openTutorials() {
    const script = openlinkScript('http://wiki.openspaceproject.com/docs/tutorials/users/');
    api.executeLuaScript(script);
  }

  function openFeedback() {
    const script = openlinkScript('http://data.openspaceproject.com/feedback');
    api.executeLuaScript(script);
  }

  async function openGuiInBrowser() {
    if (!luaApi) {
      return;
    }
    const portProperty = await luaApi.propertyValue('Modules.WebGui.Port');
    const port = portProperty[1] || 4680;
    const addressProperty = await luaApi.propertyValue('Modules.WebGui.Address');
    const address = addressProperty[1] || 'localhost';

    // Use the default endpoint
    const script = openlinkScript(`http://${address}:${port}`);
    api.executeLuaScript(script);
  }

  function showAbout() {
    dispatch(setShowAbout(true));
  }

  function setShowKeybinds(visible) {
    dispatch(
      setPopoverVisibility({
        popover: 'keybinds',
        visible
      })
    );
  }

  /* Language */
  function handleLanguageChange(language) {
    dispatch(setLanguage(language));
  }

  // function saveChange() {
  //   if (!luaApi) { return; }
  //   luaApi.saveSettingsToProfile();
  // }

  return (
    <div className={styles.SystemMenu}>
      {showMenu && (
        <Popover className={styles.popover} arrow='arrow bottom leftside' attached>
          <nav className={styles.links}>
            <button
              type='button'
              onClick={() => {
                onClick(showAbout);
              }}
            >
              {getTranslation(language, 'About')}
            </button>
            <button
              type='button'
              onClick={() => {
                onClick(openTutorials);
              }}
            >
              {getTranslation(language, 'Tutorial')}
            </button>
            {showTutorial && (
              <button
                type='button'
                style={{ position: 'relative' }}
                onClick={() => {
                  onClick(showTutorial, true);
                }}
                ref={(el) => {
                  refs.current.Tutorial = el;
                }}
              >
                {getTranslation(language, 'started')}
              </button>
            )}
            <button type='button' onClick={() => onClick(openFeedback)}>
              {getTranslation(language, 'Feedback')}
            </button>

            <HorizontalDelimiter />

            <button
              type='button'
              onClick={() => {
                onClick(setShowKeybinds, !keybindsIsVisible);
              }}
            >
              <MdKeyboard className={styles.linkIcon} />
              {keybindsIsVisible
                ? getTranslation(language, 'Hide')
                : getTranslation(language, 'Show')}{' '}
              {getTranslation(language, 'keybindings')}
            </button>

            {environment.developmentMode && (
              <div>
                <HorizontalDelimiter />
                <div className={styles.devModeNotifier}>
                  {getTranslation(language, 'GUIDevMode')}
                </div>
              </div>
            )}
            <HorizontalDelimiter />
            {/* Language */}
            <label htmlFor='language'>{getTranslation(language, 'Language: ')} </label>
            <button type='button' onClick={() => onClick(handleLanguageChange, 'en')}>
              {getTranslation(language, 'English')}
            </button>
            <button type='button' onClick={() => onClick(handleLanguageChange, 'es')}>
              {getTranslation(language, 'Spanish')}
            </button>
            {/* new languages here*/}
            <HorizontalDelimiter />

            <button type='button' onClick={() => onClick(openGuiInBrowser)}>
              {getTranslation(language, 'open')}
            </button>

            <HorizontalDelimiter />

            <button type='button' onClick={() => onClick(showLuaConsole)}>
              {getTranslation(language, 'console')} <span className={styles.shortcut}>~</span>
            </button>

            <button
              type='button'
              onClick={() => {
                onClick(nativeGui);
              }}
            >
              {getTranslation(language, 'native')} <span className={styles.shortcut}>F1</span>
            </button>
            {/* <button onClick={saveChange}>
              Save settings to profile
            </button> */}

            <HorizontalDelimiter />

            <button
              type='button'
              onClick={() => {
                onClick(quit);
              }}
            >
              <MdExitToApp className={styles.linkIcon} />
              {getTranslation(language, 'quit')} <span className={styles.shortcut}>ESC</span>
            </button>
          </nav>
        </Popover>
      )}
      <Button
        ref={(el) => {
          refs.current.System = el;
        }}
        className={styles.button}
        transparent
        onClick={() => setShowMenu(!showMenu)}
      >
        <MdMoreVert className={styles.icon} />
      </Button>
    </div>
  );
}

SystemMenu.propTypes = {
  showTutorial: PropTypes.func
};

SystemMenu.defaultProps = {
  showTutorial: undefined
};

export default SystemMenu;
