export const getTranslation = (language, key) => {
  const translation = {
    en: {
      //Sidebar.jsx and scenePane.jsx
      Scene: 'Scene',
      Settings: 'Settings',
      //SystemMenu.jsx
      About: 'About OpenSpace',
      Tutorial: 'Open Web Tutorials',
      Hide: 'Hide',
      Show: 'Show',
      keybindings: 'keybindings',
      Feedback: 'Send Feedback',
      started: 'Open Getting Started Tour',
      open: 'Open GUI in browser',
      GUIDevMode: 'GUI running in dev mode',
      console: 'Toggle console',
      native: 'Toggle native GUI',
      quit: 'Quit OpenSpace',
      Language: 'Language: ',
      English: 'English',
      Spanish: 'Spanish',
      //scenePane.jsx
      ShowOnlyVisible: 'Show only visible',
      QuickAccess: 'Quick Access',
      ShowHiddenNodes: 'Show objects with GUI hidden flag',
      //storyButton.jsx
      TapHere: 'Tap here to explore',
      //about.jsx
      OpenSpaceDesc:
        'OpenSpace is open source interactive data visualization software designed to visualize the entire known universe and portray our ongoing efforts to investigate the cosmos.',
      Version: 'OpenSpace Version: ',
      Footer: '© 2014 - 2021 OpenSpace Development Team',
      //tourPopup.jsx
      Prev: 'Previous',
      Next: 'Next',
      Finish: 'Finish',
      MoreInfo: 'for more in-depth tutorials',
      Here: 'here',
      dontShow: 'Do not show the tutorial again',
      Click: 'Click'
    },
    es: {
      //Sidebar.jsx and scenePane.jsx
      Scene: 'Escena',
      Settings: 'Configuración',
      //SystemMenu.jsx
      About: 'Acerca de OpenSpace',
      Tutorial: 'Tutoriales en la web',
      Hide: 'Ocultar',
      Show: 'Mostrar',
      keybindings: 'teclas de acceso rápido',
      Feedback: 'Enviar comentarios',
      started: 'Abrir recorrido de inicio',
      open: 'Abrir GUI en el navegador',
      GUIDevMode: 'GUI en modo de desarrollo',
      console: 'Mostrar/ocultar consola',
      native: 'Mostrar/ocultar GUI nativa',
      quit: 'Cerrar OpenSpace',
      Language: 'Idioma: ',
      English: 'Inglés',
      Spanish: 'Español',
      //scenePane.jsx
      ShowOnlyVisible: 'Mostrar solo visible',
      QuickAccess: 'Acceso rápido',
      ShowHiddenNodes: 'Mostrar objetos con la bandera oculta de la GUI',
      //storyButton.jsx
      TapHere: 'Toque aquí para explorar',
      //about.jsx
      OpenSpaceDesc:
        'OpenSpace es un software de visualización de datos interactivo de código abierto diseñado para visualizar el universo conocido y retratar nuestros esfuerzos continuos para investigar el cosmos.',
      Version: 'Versión de OpenSpace: ',
      Footer: '© 2014 - 2021 Equipo de Desarrollo de OpenSpace',
      //tourPopup.jsx
      Prev: 'Anterior',
      Next: 'Siguiente',
      Finish: 'Finalizar',
      MoreInfo: 'para tutoriales más detallados',
      Here: 'aquí',
      dontShow: 'No mostrar el tutorial de nuevo',
      Click: 'Haga clic'
    }
  };
  return translation[language][key];
};
export const getMonthTranslation = (language) => {
  let Months;
  if (language === 'en') {
    Months = 'Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec';
  } else {
    Months = 'ene feb mar abr may jun jul ago sep oct nov dic';
  }
  return Months.split(' ');
};
export const getDayTranslation = (language) => {
  let DayHeaders;
  if (language === 'en') {
    DayHeaders = 'M T W T F S S';
  } else {
    DayHeaders = 'L M X J V S D';
  }
  return DayHeaders.split(' ');
};

export const getDays = (language) => {
  let Days;
  if (language === 'en') {
    Days = {
      Sunday: 0,
      Monday: 1,
      Tuesday: 2,
      Wednesday: 3,
      Thursday: 4,
      Friday: 5,
      Saturday: 6
    };
  } else {
    Days = {
      Domingo: 0,
      Lunes: 1,
      Martes: 2,
      Miércoles: 3,
      Jueves: 4,
      Viernes: 5,
      Sábado: 6
    };
  }
  return Days;
};
